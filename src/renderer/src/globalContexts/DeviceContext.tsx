import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { RecordingKeyStatus } from "../gen/quartet/v1/quartet_pb";
import { createSoloTransportFunc } from "../utilities/client";
import { createConnectTransport } from "@connectrpc/connect-web";
import { lensMenuList, PortSolo, getLocalStorageFocalLengthValue, DeviceInfomation, DevicesContextType } from "../types/common";
import { useMessages } from "./MessagesContext";
import { ApplicationMessageEvent } from "../types/common";
import { quartetGetDevices } from "../api/quartetAPI";
import { loadSettingsFromLocalStorage } from "../utilities/localStorage";

const DeviceContext = createContext<DevicesContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [devices, setDevices] = useState<DeviceInfomation[]>([]);
  const [airealTouchRecording, setAirealTouchRecording] = useState(RecordingKeyStatus.UNSPECIFIED)
  const [primaryCameras, setPrimaryCameras] = useState<number|null>(null);
  const { addMessage } = useMessages()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await quartetGetDevices();

        const dummy: DeviceInfomation[] = [
          { transport: createSoloTransportFunc({ baseUrl: `http://192.168.10.1` }), streamTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.1` }), wifiTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.1` }), hostname: "0001", networkInterface: 'eth0', ipv4Addr: `http://192.168.10.1`, macAddr: '00:11:22:33', nickname: 'CAM001', primary: true, priority: 0, id: '000000', lensConfig: { name: "3.5", focalLength: 3.5 } },
          { transport: createSoloTransportFunc({ baseUrl: `http://192.168.10.2` }), streamTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.2` }), wifiTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.2` }), hostname: "0002", networkInterface: 'eth0', ipv4Addr: `http://192.168.10.2`, macAddr: '44:55:66:77', nickname: 'CAM002', primary: false, priority: 0, id: '111111', lensConfig: { name: "3.5", focalLength: 3.5 } },
          { transport: createSoloTransportFunc({ baseUrl: `http://192.168.10.3` }), streamTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.3` }), wifiTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.3` }), hostname: "0003", networkInterface: 'eth0', ipv4Addr: `http://192.168.10.3`, macAddr: '88:99:11:22', nickname: 'CAM003', primary: false, priority: 0, id: '222222', lensConfig: { name: "3.5", focalLength: 3.5 } },
          { transport: createSoloTransportFunc({ baseUrl: `http://192.168.10.4` }), streamTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.4` }), wifiTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.4` }), hostname: "0004", networkInterface: 'eth0', ipv4Addr: `http://192.168.10.4`, macAddr: '33:44:55:66', nickname: 'CAM004', primary: false, priority: 0, id: '333333', lensConfig: { name: "3.5", focalLength: 3.5 } },
          // { transport: createSoloTransportFunc({ baseUrl: `http://192.168.10.5` }), streamTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.5` }), wifiTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.5` }), hostname: "0005", networkInterface: 'eth0', ipv4Addr: `http://192.168.10.5`, macAddr: '00:11:22:33', nickname: 'CAM005', primary: false, priority: 0, id: '444444', lensConfig: { name: "3.5", focalLength: 3.5 } },
          // { transport: createSoloTransportFunc({ baseUrl: `http://192.168.10.6` }), streamTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.6` }), wifiTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.6` }), hostname: "0006", networkInterface: 'eth0', ipv4Addr: `http://192.168.10.6`, macAddr: '44:55:66:77', nickname: 'CAM006', primary: false, priority: 0, id: '555555', lensConfig: { name: "3.5", focalLength: 3.5 } },
          // { transport: createSoloTransportFunc({ baseUrl: `http://192.168.10.7` }), streamTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.7` }), wifiTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.7` }), hostname: "0007", networkInterface: 'eth0', ipv4Addr: `http://192.168.10.7`, macAddr: '88:99:11:22', nickname: 'CAM007', primary: false, priority: 0, id: '666666', lensConfig: { name: "3.5", focalLength: 3.5 } },
          // { transport: createSoloTransportFunc({ baseUrl: `http://192.168.10.8` }), streamTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.8` }), wifiTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.8` }), hostname: "0008", networkInterface: 'eth0', ipv4Addr: `http://192.168.10.8`, macAddr: '33:44:55:66', nickname: 'CAM008', primary: false, priority: 0, id: '777777', lensConfig: { name: "3.5", focalLength: 3.5 } },
          // { transport: createSoloTransportFunc({ baseUrl: `http://192.168.10.9` }), streamTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.9` }), wifiTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.9` }), hostname: "0009", networkInterface: 'eth0', ipv4Addr: `http://192.168.10.9`, macAddr: '77:88:99:11', nickname: 'CAM009', primary: false, priority: 0, id: '888888', lensConfig: { name: "3.5", focalLength: 3.5 } },
          // { transport: createSoloTransportFunc({ baseUrl: `http://192.168.10.10` }), streamTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.10` }), wifiTransport: createSoloTransportFunc({ baseUrl: `http://192.168.10.10` }), hostname: "0010", networkInterface: 'eth0', ipv4Addr: `http://192.168.10.10`, macAddr: '33:44:55:66', nickname: 'CAM0010', primary: false, priority: 0, id: '999999', lensConfig: { name: "3.5", focalLength: 3.5 } },
        ]
        
        if(res) {
           const sortedDevices = res.devices.sort((a: { primary: any; serialNumber: string; }, b: { primary:any; serialNumber: any; }) => {
            if(a.primary || b.primary) {
              return a.primary ? -1 : 1;
            } else {
              return a.serialNumber.localeCompare(b.serialNumber);
            }
          })

          const deviceInfoList: DeviceInfomation[] = sortedDevices.map((device, index) => {
            const localStorageKey = getLocalStorageFocalLengthValue(device.serialNumber)
            const focalLength = loadSettingsFromLocalStorage(localStorageKey, {name: lensMenuList[0].name, focalLength: lensMenuList[0].focalLength})
            const soloTransport = createSoloTransportFunc({ baseUrl: `http://${device.ipv4Addr}` })
            const wifiTransport = createConnectTransport({ baseUrl: `http://${device.ipv4Addr}:${PortSolo}`, defaultTimeoutMs: 60000 });
            const soloStreamingTransport = createConnectTransport({ baseUrl: `http://${device.ipv4Addr}:${PortSolo}` })
            const nickname = device.nickname === '' ? `camera #${index + 1}`: device.nickname
            return {
              transport: soloTransport,
              streamTransport: soloStreamingTransport,
              wifiTransport: wifiTransport,
              hostname: device.hostname,
              networkInterface: device.interface,
              ipv4Addr: `http://${device.ipv4Addr}`,
              macAddr: device.macAddr,
              nickname: nickname,
              primary: device.primary,
              priority: device.priority,
              id: device.serialNumber,
              lensConfig: focalLength 
            }
          })

          const results: DeviceInfomation[] = await Promise.all(deviceInfoList)
          // const dummy = results.concat(results).slice(0)
          setDevices(results)

          const primaryCameraLength = deviceInfoList.filter(({ primary }) => primary===true).length
          setPrimaryCameras(primaryCameraLength)

          if(primaryCameraLength > 1) {
            addMessage({
              type: ApplicationMessageEvent["MULTIPLE_MASTERS_ERROR"],
              title: '親カメラ構成エラー',
              content: `
                親カメラが複数存在します。<br>
                カメラのリアパネルにあるSYNCスイッチの設定を確認してください。
              `,
              onConfirmTitle: '閉じる',
              onConfirm: () => {},
            })
          } else if(primaryCameraLength === 0) {
            addMessage({
              type: ApplicationMessageEvent["MULTIPLE_MASTERS_ERROR"],
              title: '親カメラ構成エラー',
              content: `
                親カメラが存在しません。<br>
                カメラのリアパネルにあるSYNCスイッチの設定を確認してください。
              `,
              onConfirmTitle: '閉じる',
              onConfirm: () => {},
            })
          }
        }
        else {
          const error = new Error("カメラ情報を取得できませんでした。ルーターとカメラの接続状況を確認し、アプリを再読み込みしてください。")
          setError(error)
        }
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false)
      }
    }

    fetchData();
  },[])

  const updateAirealTouchRecordingStatus = (status: RecordingKeyStatus) => {
    setAirealTouchRecording(status)
  }

  return (
    <DeviceContext.Provider value={{
      isLoading, error,
      primaryCameras, setPrimaryCameras,
      devices, setDevices,
      airealTouchRecording, updateAirealTouchRecordingStatus,
    }}>
      {children}
    </DeviceContext.Provider>
  )
}

export const useDevices = (): DevicesContextType => {
  const context = useContext(DeviceContext);
  if(context === undefined) {
    throw new Error('useDevice must be used within a ProviderDevices')
  }
  return context
}