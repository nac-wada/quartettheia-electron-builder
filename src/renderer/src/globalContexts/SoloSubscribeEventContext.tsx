import { createContext, FC, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useDevices } from "./DeviceContext";
import { soloSubscribeEvent } from "../api/soloAPI";
import { Transport } from "@connectrpc/connect";
import { CameraListenersType, SoloEventListener, SoloSubscribeEventContextType } from "../types/common";
import { useNotifications } from "./NotificationContext";
import { MessageType } from "../gen/quartet/v1/quartet_pb";

const SoloSubscribeEventContext = createContext<SoloSubscribeEventContextType | null>(null);

export const SoloSubscribeEventProvider: FC<{children: ReactNode}> = ({ children }) => {
  const { addNotification } = useNotifications()
  const {devices, isLoading, error} = useDevices()
  const cameraListenrsList = useRef<CameraListenersType[]>([]);

  const subscribeSoloEventListener = (ipv4Addr: string, listener: SoloEventListener) => {
    const camera = cameraListenrsList.current.find(cam => cam.ipv4Addr === ipv4Addr);
    if(camera) {
      camera.listeners.add(listener)
    }

    return () => camera?.listeners.delete(listener)
  }

  useEffect(() => {
    const listen = async (ipv4Addr:string, nickname:string, subscribeTransport:Transport) => {
      try {
        const res = soloSubscribeEvent({subscribeTransport})
        
        if(res) {
          for await (const event of res) {
            const camera = cameraListenrsList.current.find(cam => cam.ipv4Addr === ipv4Addr);
            
            if(camera) {
              camera.listeners.forEach(listener => listener(event))
            }
          }
        }

      } catch (e) {
        console.error(e)
        const currTime = new Date().toLocaleString();
        addNotification({
          type: MessageType.ERROR,
          header: '警告',
          data: `${nickname}(${ipv4Addr})との接続が切れました。\nネットワーク状態を確認の上、再読み込みしてください。`,
          time: currTime
        })
      }
    }

    if(!isLoading && !error) {
      if(devices.length) {
        const list: CameraListenersType[] = devices.map(({ ipv4Addr, nickname, streamTransport }) => { return { ipv4Addr, nickname, subscribeTransport: streamTransport, listeners: new Set() } })
        cameraListenrsList.current = list
        Promise.all(
          cameraListenrsList.current.map(({ ipv4Addr, subscribeTransport, nickname }) => {
            listen(ipv4Addr, nickname, subscribeTransport)
          })
        )
      }
    }
    
  },[isLoading, error])

  return (
    <SoloSubscribeEventContext.Provider value={{ subscribeSoloEventListener }}>
      {children}
    </SoloSubscribeEventContext.Provider>
  )
}

export const useSoloSubscribeEventListener = () => {
  const context = useContext(SoloSubscribeEventContext)

  // プロバイダが提供されていない場合にエラーをスロー
  if (!context) {
    throw new Error('useSoloSubscribeEventListener must be used within an SoloSubscribeEventProvider');
  }

  return context
}
 