import { Transport } from "@connectrpc/connect"
import { useCallback, useEffect, useState } from "react"
import { soloGetCameraGamma, soloSetCameraGamma } from "../api/soloAPI"
import { EventType, SubscribeEventResponse } from "../gen/solo/v1/solo_pb"
import { CameraParameterType } from "../types/common"

export interface CameraGammaViewModel {
  isLoading: boolean,
  error: Error | null,
  config: CameraParameterType | null,
  value: number | null,
  recievedEventCallback: (event: SubscribeEventResponse) => void 
  getData: () => void
  setGammaValue: (newValue: number) => void
}

export const useGamma = (transport: Transport): CameraGammaViewModel => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [config, setConfig] = useState<CameraParameterType | null>(null)
  const [value, setValue] = useState<number|null>(null);
  
  useEffect(() => {
    getData()
  },[])

  const getData = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      await getCameraGamma()
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  },[])

  const recievedEventCallback = useCallback((event: SubscribeEventResponse) => {
    switch(event.type) {
      case EventType["IMAGE_GAMMA_CHANGED"]:
        getCameraGamma(true)
        break;
    }
  },[])

  // ガンマのパラメータを取得
  const getCameraGamma = useCallback(async (isRecieved?: boolean) => {
    try {
      const res = await soloGetCameraGamma({ transport })
      
      if(!res) {
        setError(new Error('ガンマを取得できませんでした.'))
        return; 
      }

      let value = Number(res.value) * 0.01

      if(!isRecieved) {
        const min = Math.ceil(Number(res.minimum)) * 0.01
        const max = Math.floor(Number(res.maximum)) * 0.01
        const step = Number(res.step) * 0.01
        const defaultValue = Number(res.defaultValue) * 0.01

        setConfig(prev => ({ ...prev, min, max, step, defaultValue}))
        setValue(value)

        return;
      }

      setValue(value)
    } catch (e) {
      setError(e as Error)
    }
  },[])

  // ガンマのパラメータを変更
  const setGammaValue = useCallback(async (newValue: number) => {
    try {
      setConfig(prev => {
        if(prev) {
          let params = newValue
          if(params < prev.min) {
            params = prev.min * 100
          }
          else if(prev.max < params) {
            params = prev.max * 100
          }
          else {
            params = params * 100
          }

          setValue(newValue)
          soloSetCameraGamma({ transport, value: BigInt(Math.round(params)) });
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
    setGammaValue,
  }
}