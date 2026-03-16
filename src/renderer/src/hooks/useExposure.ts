import { Transport } from "@connectrpc/connect"
import { useCallback, useEffect, useState } from "react"
import { soloGetCameraExposure, soloGetCameraExposureAuto, soloSetCameraExposure, soloSetCameraExposureAuto } from "../api/soloAPI"
import { EventType, SubscribeEventResponse } from "../gen/solo/v1/solo_pb"
import { CameraParameterType } from "../types/common"

export interface CameraExposureViewModel {
  isLoading: boolean,
  error: Error | null,
  config: CameraParameterType | null,
  value: number | null,
  autoMode: boolean | null,
  recievedEventCallback: (event: SubscribeEventResponse) => void 
  getData: () => void
  setExposureValue: (newValue: number) => void
  setExposureAuto: (autoMode: boolean) => void,
  getCameraExposure: (isRecieved?: boolean) => void
}

export const useExposure = (transport: Transport): CameraExposureViewModel => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [config, setConfig] = useState<CameraParameterType | null>(null)
  const [autoMode, setAutoMode] = useState<boolean|null>(null)
  const [value, setValue] = useState<number|null>(null)
  
  useEffect(() => {
    getData()
  },[])

  const getData = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
        await getCameraExposure()
        await getCameraExposureAuto()
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  },[])

  const recievedEventCallback = useCallback((event: SubscribeEventResponse) => {
    switch(event.type) {
      case EventType["IMAGE_EXPOSURE_AUTO_CHANGED"]:
        getCameraExposureAuto()
        break;
      case EventType["IMAGE_EXPOSURE_CHANGED"]:
        getCameraExposure(true)
        break;
    }
  },[])

  // 露光時間のパラメータを取得
  const getCameraExposure = useCallback(async (isRecieved?: boolean) => {
    try {
      const res = await soloGetCameraExposure({ transport })
      
      if(!res) {
        setError(new Error('露光時間を取得できませんでした.'))
        return; 
      }

      let value = Math.round(Number(res.value) * 0.0001) * 10

      if(!isRecieved) {

        // 各パラメータをμsに変換
        const min = Math.floor(Number(res.minimum) * 0.001)
        const max = Math.floor(Number(res.maximum) * 0.00001) * 100
        const step = Number(res.step) * 10 //10μsごとに変更できるようにする
        const defaultValue = Math.round(Number(res.defaultValue) * 0.00001) * 100

        setConfig(prev => ({ ...prev, min, max, step, defaultValue}))

        setValue(value)

        return;
      }

      if(value > 9000) { 
        value = 9000 
      } 
      else if(value < 30) { 
        value = 30.384 
      }

      setValue(value)
    } catch (e) {
      setError(e as Error)
    }
  },[])

  // 露光時間のモード設定を取得
  const getCameraExposureAuto = useCallback(async () => {
    try {
      const res = await soloGetCameraExposureAuto({ transport })

      if(!res) {
        setError(new Error('露光時間を取得できませんでした'))
        return;
      }

      setAutoMode(res.enable)
    } catch (e) {
      setError(e as Error)
    }
  },[])

  // 露光時間のパラメータを変更
  const setExposureValue = useCallback(async (newValue: number) => {
    try {
      let params = newValue;
      if(newValue < 30.384) {
        params = 30.384
      }
      const value = BigInt(params * 1000);
      setValue(newValue)
      soloSetCameraExposure({ transport, value })
    } catch (e) {
      console.error(e);
    }
  },[])

  // 露光時間のモード設定を変更
  const setExposureAuto = useCallback(async (autoMode: boolean) => {
    try {
      soloSetCameraExposureAuto({ transport, enable: autoMode })
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
    setExposureValue,
    setExposureAuto,
    getCameraExposure,
  }
}