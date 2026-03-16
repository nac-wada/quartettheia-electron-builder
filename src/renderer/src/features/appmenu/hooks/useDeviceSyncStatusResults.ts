import { useEffect } from "react"
import { useDevices } from "../../../globalContexts/DeviceContext"
import { useQueriesIsDeviceSyncEstablished } from "../../../hooks/useCustomQuery"
import { ApplicationMessageEvent } from "../../../types/common"
import { useMessages } from "../../../globalContexts/MessagesContext"

export const useDeviceSyncStatusResults = () => {
  const { devices } = useDevices()
  const { addMessage } = useMessages()

  const cameras = devices.map(({ipv4Addr, transport}) => { return { ipv4Addr, transport }})
  const syncStatusResults = useQueriesIsDeviceSyncEstablished({  devices: cameras })
  
  const areSyncStatusesLoading = syncStatusResults.some(result => result.isLoading)

  useEffect(() => {
    if(!areSyncStatusesLoading) {
      const unstableCameras: string[] = [];

      syncStatusResults.forEach((result, index) => {
        const device = devices[index];

        if(result.isError) {
          unstableCameras.push(device.nickname);
        } else if(result.data && !result.data.established) {
          unstableCameras.push(device.nickname)
        }
      })

      if(unstableCameras.length) {
        addMessage({
          type: ApplicationMessageEvent['CAMERA_SYNCHRONIZATION_ERROR'],
          title: 'カメラ同期に失敗',
          content:  `
            カメラ${unstableCameras.map(name => { return `「${name}」` })}<br>
            が同期していません。<br>
            無線同期信号の周波数を変更するか、<br>
            親機カメラの配置や同期アンテナの向きを調整して、<br>
            カメラを同期させてください。
          `,
          onConfirmTitle: '閉じる',
          onConfirm: () => {},
        })
      }
    }
  },[areSyncStatusesLoading, syncStatusResults.length])
}
