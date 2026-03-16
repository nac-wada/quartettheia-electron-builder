import { soloIsDeviceSyncEstablished } from "../../../api/soloAPI"
import { DeviceInfomation } from "../../../types/common"

export const checkCameraSyncEstablished = async ({ devices }:{ devices: DeviceInfomation[] }) => {
  const results = await Promise.all(
    devices.map(async ({ transport, nickname }) => {
      const syncCamera = await soloIsDeviceSyncEstablished({ transport })
      return { nickname, syncCamera }
    })
  )

  if(results.some(result => result.syncCamera === null || result.syncCamera.established === false)) {
    return { result: false, list: results.filter(result => result.syncCamera?.established !== true) }
  }

  return { result: true, list: [] }
}