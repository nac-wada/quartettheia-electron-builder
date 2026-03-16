import { Transport } from "@connectrpc/connect"
import { useCallback, useEffect, useState } from "react"
import { soloGetCameraWhiteBalanceRed, soloSetCameraWhiteBalanceRed } from "../../../../api/soloAPI"
import { EventType, SubscribeEventResponse } from "../../../../gen/solo/v1/solo_pb"
import { CameraParameterType } from "../../../../types/common"
import { CameraWhiteBalanceRedViewModel } from "../types"

export const useWhiteBalanceRed = (transport: Transport): CameraWhiteBalanceRedViewModel => {
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
      await getCameraWhiteBalanceRed()
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  },[])

  const recievedEventCallback = useCallback((event: SubscribeEventResponse) => {
    switch(event.type) {
      case EventType["IMAGE_WB_RED_CHANGED"]:
        getCameraWhiteBalanceRed(true)
        break;
    }
  },[])

  // 赤のホワイトバランスのパラメータを取得
  const getCameraWhiteBalanceRed = useCallback(async (isRecieved?: boolean) => {
    try {
      const res = await soloGetCameraWhiteBalanceRed({ transport })
      
      if(!res) {
        setError(new Error('赤のホワイトバランスを取得できませんでした.'))
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

  // 赤のホワイトバランスのパラメータを変更
  const setWhiteBalanceRedValue = useCallback(async (newValue: number) => {
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
          soloSetCameraWhiteBalanceRed({ transport, value: BigInt(Math.trunc(params)) });
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
    setWhiteBalanceRedValue
  }
}