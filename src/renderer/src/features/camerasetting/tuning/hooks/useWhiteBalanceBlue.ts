import { Transport } from "@connectrpc/connect"
import { useCallback, useEffect, useState } from "react"
import { soloGetCameraWhiteBalanceBlue, soloSetCameraWhiteBalanceBlue } from "../../../../api/soloAPI"
import { EventType, SubscribeEventResponse } from "../../../../gen/solo/v1/solo_pb"
import { CameraParameterType } from "../../../../types/common"
import { CameraWhiteBalanceBlueViewModel } from "../types"

export const useWhiteBalanceBlue = (transport: Transport): CameraWhiteBalanceBlueViewModel => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [config, setConfig] = useState<CameraParameterType | null>(null)
  const [value, setValue] = useState<number|null>(null)
  
  useEffect(() => {
    getData()
  },[])

  const getData = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      await getCameraWhiteBalanceBlue()
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  },[])

  const recievedEventCallback = useCallback((event: SubscribeEventResponse) => {
    switch(event.type) {
      case EventType["IMAGE_WB_BLUE_CHANGED"]:
        getCameraWhiteBalanceBlue(true)
        break;
    }
  },[])

  // 青のホワイトバランスのパラメータを取得
  const getCameraWhiteBalanceBlue = useCallback(async (isRecieved?: boolean) => {
    try {
      const res = await soloGetCameraWhiteBalanceBlue({ transport })
      
      if(!res) {
        setError(new Error('青のホワイトバランスを取得できませんでした.'))
        return; 
      }

      let value = Number(res.value) * 0.001

      if(!isRecieved) {
        const min = Math.ceil(Number(res.minimum) * 0.001)
        const max = Math.floor(Number(res.maximum) * 0.001)
        const step = Number(res.step) * 0.001
        const defaultValue = Number(res.defaultValue) * 0.001

        setConfig(prev => ({ ...prev, min, max, step, defaultValue}))

        setValue(value)

        return;
      }

      setValue(value)
    } catch (e) {
      setError(e as Error)
    }
  },[])

  // 青のホワイトバランスのパラメータを変更
  const setWhiteBalanceBlueValue = useCallback(async (newValue: number) => {
    try {
      setConfig(prev => {
        if(prev) {
          let params = newValue
          if(params < prev.min) {
            params = prev.min * 1000
          }
          else if(prev.max < params) {
            params = prev.max * 1000
          }
          else {
            params = params * 1000
          }

          setValue(newValue)
          soloSetCameraWhiteBalanceBlue({ transport, value: BigInt(Math.trunc(params)) });
        }          
        return prev
      })

    } catch (e) {
      console.error(e);
    }
  },[])
  
  return {
    isLoading,
    error,
    config,
    value,
    recievedEventCallback,
    getData,
    setWhiteBalanceBlueValue
  }
}