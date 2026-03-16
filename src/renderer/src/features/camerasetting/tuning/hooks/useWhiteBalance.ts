import { Transport } from "@connectrpc/connect"
import { useCallback, useEffect, useState } from "react"
import { EventType, SubscribeEventResponse } from "../../../../gen/solo/v1/solo_pb"
import { soloGetCameraWhiteBalanceAuto, soloSetCameraWhiteBalanceAuto } from "../../../../api/soloAPI"
import { CameraWhiteBalanceViewModel } from "../types"

export const useWhiteBalance = (transport: Transport): CameraWhiteBalanceViewModel => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [autoMode, setAutoMode] = useState<boolean|null>(null);
  
  useEffect(() => {
    getData()
  },[])

  const getData = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      await getCameraWhiteBalanceAuto()
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  },[])

  const recievedEventCallback = useCallback((event: SubscribeEventResponse) => {
    switch(event.type) {
      case EventType["IMAGE_WB_AUTO_CHANGED"]:
        getCameraWhiteBalanceAuto()
        break;
    }
  },[])

  // ホワイトバランスのモード設定を取得
  const getCameraWhiteBalanceAuto = useCallback(async () => {
    try {
      const res = await soloGetCameraWhiteBalanceAuto({ transport })

      if(!res) {
        setError(new Error('ホワイトバランスを取得できませんでした'))
        return;
      }

      setAutoMode(res.enable)
    } catch (e) {
      setError(e as Error)
    }
  },[])

  // ホワイトバランスのモード設定を変更
  const setWhiteBalanceAuto = useCallback(async (autoMode: boolean) => {
    try {
      soloSetCameraWhiteBalanceAuto({ transport, enable: autoMode })
      setAutoMode(autoMode)
    } catch (e) {
      console.error(e);
    }
  },[])
  
  return {
    isLoading,
    error,
    autoMode,
    recievedEventCallback,
    getData,
    setWhiteBalanceAuto,
  }
}