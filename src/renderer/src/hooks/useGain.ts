import { Transport } from "@connectrpc/connect"
import { useCallback, useEffect, useState } from "react"
import { soloGetCameraGain, soloGetCameraGainAuto, soloSetCameraGain, soloSetCameraGainAuto } from "../api/soloAPI"
import { EventType, SubscribeEventResponse } from "../gen/solo/v1/solo_pb"
import { CameraParameterType } from "../types/common"

export interface CameraGainViewModel {
  isLoading: boolean,
  error: Error | null,
  config: CameraParameterType | null,
  value: number | null,
  autoMode: boolean | null,
  recievedEventCallback: (event: SubscribeEventResponse) => void 
  getData: () => void
  setGainValue: (newValue: number) => void
  setGainAuto: (autoMode: boolean) => void
  getCameraGain: (isRecieved?: boolean) => void
}

export const useGain = (transport: Transport): CameraGainViewModel => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [config, setConfig] = useState<CameraParameterType | null>(null)
  const [autoMode, setAutoMode] = useState<boolean|null>(null)
  const [value, setValue] = useState<number|null>(null);
  
  useEffect(() => {
    getData()
  },[])

  const getData = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      await getCameraGain()
      await getCameraGainAuto()
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  },[])

  const recievedEventCallback = useCallback((event: SubscribeEventResponse) => {
    switch(event.type) {
      case EventType["IMAGE_GAIN_AUTO_CHANGED"]:
        getCameraGainAuto()
        break;
      case EventType["IMAGE_GAIN_CHANGED"]:
        getCameraGain(true)
        break;
    }
  },[])

  // ゲインのパラメータを取得
  const getCameraGain = useCallback(async (isRecieved?: boolean) => {
    try {
      const res = await soloGetCameraGain({ transport })
      
      if(!res) {
        setError(new Error('ゲインを取得できませんでした.'))
        return; 
      }

      let value = parseFloat((Number(res.value) * 0.01).toFixed(2))

      if(!isRecieved) {
        const min = Math.ceil(Number(res.minimum) * 0.01)
        const max = Math.floor(Number(res.maximum) * 0.01)
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

  // ゲインのモード設定を取得
  const getCameraGainAuto = useCallback(async () => {
    try {
      const res = await soloGetCameraGainAuto({ transport })

      if(!res) {
        setError(new Error('ゲインを取得できませんでした'))
        return;
      }

      setAutoMode(res.enable)
    } catch (e) {
      setError(e as Error)
    }
  },[])

  // ゲインのパラメータを変更
  const setGainValue = useCallback(async (newValue: number) => {
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
          soloSetCameraGain({ transport, value: BigInt(Math.round(params)) });
        }          
        return prev
      })

    } catch (e) {
      console.error(e);
    }
  },[])

  // ゲインのモード設定を変更
  const setGainAuto = useCallback(async (autoMode: boolean) => {
    try {
      soloSetCameraGainAuto({ transport, enable: autoMode })
      setAutoMode(autoMode)
    } catch (e) {
      console.error(e);
    }
  },[])
  
  return {
    isLoading,
    error,
    config,
    value,
    autoMode,
    recievedEventCallback,
    getData,
    setGainValue,
    setGainAuto,
    getCameraGain
  }
}