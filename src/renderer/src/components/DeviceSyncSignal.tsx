import { Circle } from "@mui/icons-material";
import { keyframes } from "@mui/material";
import { FC, memo, useEffect, useState } from "react";
import { MessageModalProps } from "../types/common"
import { MessageModal } from "./MessageModal";
import { useSoloSubscribeEventListener } from "../globalContexts/SoloSubscribeEventContext";
import { EventType, SubscribeEventResponse } from "../gen/solo/v1/solo_pb";
import { Transport } from "@connectrpc/connect";
import { useQueryIsDeviceSyncEstablished } from "../hooks/useCustomQuery";
import { useDevices } from "../globalContexts/DeviceContext";

export const DeviceSyncSignal: FC<{ nickname: string, ipv4Addr: string, transport: Transport }> = memo(
  ({ nickname, ipv4Addr, transport }) => {
  const [message, setMessage] = useState<MessageModalProps|null>(null);
  const { primaryCameras } = useDevices()
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener()
  const [ isEstablished, setIsEstablished ] = useState(false)
  const isDeviceSyncEstablished = useQueryIsDeviceSyncEstablished({ transport, ipv4Addr })


  const status = (primaryCameras: number, isDeviceSyncEstablished: boolean): {title: string, blink?: any, color: "#4caf50" | "#f44336", message?: MessageModalProps} => {
    if(primaryCameras===0) {
      return {
        title: "親カメラ構成エラー",
        blink: `
          0% { opacity: 0 },
          25% { opacity: 1 },
          50% { opacity: 0 },
          75% { opacity: 1 },
        `,
        color: "#f44336",
        message: {
          event: "warning",
          title: "親カメラ構成エラー",
          content: `
               親カメラが存在しません。<br>
               カメラのリアパネルにあるSYNCスイッチの設定を確認してください。
             `,
          onConfirmTitle: '閉じる',
          onConfirm: () => setMessage(null),
          onClose: () => setMessage(null)
        }
      }
    }
    else if(primaryCameras>1) {
      return {
        title: "親カメラ構成エラー",
        blink: `
          0% { opacity: 0 },
          25% { opacity: 1 },
          50% { opacity: 0 },
          75% { opacity: 1 },
        `,
        color: "#f44336",
        message: {
          event: "warning",
          title: "親カメラ構成エラー",
          content: `
               親カメラが複数存在します。<br>
               カメラのリアパネルにあるSYNCスイッチの設定を確認してください。
             `,
          onConfirmTitle: '閉じる',
          onConfirm: () => setMessage(null),
          onClose: () => setMessage(null)
        }
      }
    }
    else if(!isDeviceSyncEstablished) {
      return {
        title: "同期エラー",
        blink: `
          0% { opacity: 0 },
          50% { opacity: 1 },
        `,
        color: "#f44336",
        message: {
          event: "warning",
          title: "カメラ同期に失敗",
          content: `
                    カメラ「${nickname}」が同期していません。<br>
                    無線同期信号の周波数を変更するか、<br>
                    親機カメラの配置や同期アンテナの向きを調整して、<br>
                    カメラを同期させてください。
                  `,
          onConfirmTitle: '閉じる',
          onConfirm: () => setMessage(null),
          onClose: () => setMessage(null)
        }
      }
    }
    else {
      return {
        title: "動作中",
        color: "#4caf50",
      }
    }
  }

  useEffect(() => {
    const listener = (event: SubscribeEventResponse) => {
      switch(event.type) {
        case EventType["DEVICE_SYNC_ESTABLISHED"]:
          setIsEstablished(true)
          break;
        case EventType["DEVICE_SYNC_UNSTABLE"]:
          setIsEstablished(false)
          break;
      }
    }

    const unsubsribe = subscribeSoloEventListener(ipv4Addr, listener)

    return () => unsubsribe()
  },[subscribeSoloEventListener])

  useEffect(() => {
    const res = isDeviceSyncEstablished.data;
    if(res) {
      if(res===null) {
        setIsEstablished(false)
        return;
      }

      setIsEstablished(res.established)
    }
  },[isDeviceSyncEstablished.data, isDeviceSyncEstablished.isLoading])

  return (
    <>
      <div 
        onClick={() => {
          if(primaryCameras==null) { return; }
          else {
            const message = status(primaryCameras, isEstablished).message
            if(message) { setMessage(message) }
          }
        }}
        title={(primaryCameras!==null) ? 
                status(primaryCameras, isEstablished).title : 
                undefined} 
        style={{ 
          display: primaryCameras===null ? "none" : "inline" 
        }}
      >
        <Circle
          sx={{ 
            fontSize: "1rem", 
            ...(primaryCameras!==null && { 
              color: status(primaryCameras, isEstablished).color,
              animation: 
                status(primaryCameras, isEstablished).blink ?
               `${keyframes`${status(primaryCameras, isEstablished).blink}`} 1s steps(1, jump-end) infinite`:
               "none",
            }),
            cursor: (primaryCameras!==null) && status(primaryCameras, isEstablished).message ? "pointer" : "default"
          }}
        />
      </div>
      { message && <MessageModal message={message}/> }
    </>
  )
})