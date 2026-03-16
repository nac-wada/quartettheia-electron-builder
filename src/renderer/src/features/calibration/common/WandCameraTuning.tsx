import { Transport } from "@connectrpc/connect";
import { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { soloGetCameraExposure, soloGetCameraGain, soloGetCameraGamma, soloSetCameraExposure, soloSetCameraGain, soloSetCameraGamma } from "../../../api/soloAPI";
import { CameraParameterType } from "../../../types/common";
import { ParameterSlider } from "../../../components/ParameterSlider";
import { ParameterTextField } from "../../../components/ParameterTextField";
import { useDevices } from "../../../globalContexts/DeviceContext";
import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from "../../../utilities/localStorage";
import { useExposure } from "../../../hooks/useExposure";
import { useSoloSubscribeEventListener } from "../../../globalContexts/SoloSubscribeEventContext";
import { SubscribeEventResponse } from "../../../gen/solo/v1/solo_pb";
import { useGain } from "../../../hooks/useGain";
import { useGamma } from "../../../hooks/useGamma";

interface ParameterProps {
  transport: Transport,
  ipv4Addr: string,
}

export const WandExposure: FC<ParameterProps> = memo(({ transport, ipv4Addr }) => {
  const {value, config, setExposureValue, recievedEventCallback} = useExposure(transport)
  const buttonRef = useRef<boolean>(false);
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener();

  useEffect(() => {
    const listener = (event: SubscribeEventResponse) => {
      if(!buttonRef.current) {
        recievedEventCallback(event)
      }
    }

    const unsubsribe = subscribeSoloEventListener(ipv4Addr, listener)

    return () => unsubsribe()
  },[subscribeSoloEventListener])

  return (
    <>
      {
        (value !== null && config !== null)&&
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '1fr 7rem',
          }}
        >
          <ParameterSlider 
            parameterName={"露光時間"}
            value={value}
            config={config}
            buttonRef={buttonRef}
            setParameterValue={setExposureValue}
          />

          <ParameterTextField
            value={value}
            config={{ min: config.min, max: config.max }}
            unite={"μs"}
            setParameterValue={setExposureValue}
          />
        </div>  
      }
    </>
  )
})

export const WandGain: FC<ParameterProps> = memo(({ transport, ipv4Addr }) => {
  const {value, config, setGainValue, recievedEventCallback} = useGain(transport)
  const buttonRef = useRef<boolean>(false);
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener();

  useEffect(() => {
    const listener = (event: SubscribeEventResponse) => {
      if(!buttonRef.current) {
        recievedEventCallback(event)
      }
    }

    const unsubsribe = subscribeSoloEventListener(ipv4Addr, listener)

    return () => unsubsribe()
  },[subscribeSoloEventListener])

  return (
    <>
      {
        (value !== null && config !== null)&&
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '1fr 7rem',
          }}
        >
          <ParameterSlider 
            parameterName={"ゲイン"}
            value={value}
            config={config}
            buttonRef={buttonRef}
            setParameterValue={setGainValue}
          />

          <ParameterTextField
            value={value}
            config={{ min: config.min, max: config.max }}
            unite={"dB"}
            setParameterValue={setGainValue}
            decimalPlaces={2}
          />
        </div>  
      }
    </>
  )
})

export const WandGamma: FC<ParameterProps> = memo(({ transport, ipv4Addr }) => {
  const {value, config, setGammaValue, recievedEventCallback} = useGamma(transport)
  const buttonRef = useRef<boolean>(false);
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener()

  useEffect(() => {
    const listener = (event: SubscribeEventResponse) => {
      if(!buttonRef.current) {
        recievedEventCallback(event)
      }
    }

    const unsubsribe = subscribeSoloEventListener(ipv4Addr, listener)

    return () => unsubsribe()
  },[subscribeSoloEventListener])

  return (
    <>
      {
        (value !== null && config !== null)&&
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '1fr 7rem',
          }}
        >
          <ParameterSlider 
            parameterName={"ガンマ"}
            value={value}
            config={config}
            buttonRef={buttonRef}
            setParameterValue={setGammaValue}
          />

          <ParameterTextField
            value={value}
            config={{ min: config.min, max: config.max }}
            unite={""}
            setParameterValue={setGammaValue}
            decimalPlaces={2}
          />
        </div>  
      }
    </>
  )
})

export const WandBatchExposure: FC<{ disabled: boolean, localStorageKey: string }> = memo(({ disabled, localStorageKey }) => {
  const { devices } = useDevices()
  const [value, setValue] =  useState<number | null>(null)
  const [config, setConfig] = useState<CameraParameterType|null>(null)
  const buttonRef = useRef<boolean>(false);
  const paramsRef = useRef<number | null>(null);

  useEffect(() => {
    const data: number | null = loadSettingsFromLocalStorage(localStorageKey, null)
    getCameraExposure(data)
  },[])

  useEffect(() => {
    paramsRef.current = value
  },[value])

  useEffect(() => {
    window.addEventListener('beforeunload', (event) => {
      saveSettingsToLocalStorage(localStorageKey, paramsRef.current)
    });
    return () => {
      saveSettingsToLocalStorage(localStorageKey, paramsRef.current)
    }
  },[])

  const getCameraExposure = useCallback(async (data?: number | null) => {
    try {
      const masterCamera = devices.find(d => d.primary)
      if(masterCamera) {
        const res = await soloGetCameraExposure({ transport: masterCamera.transport })

        if(res) {
          const value = Math.round(Number(res.value) * 0.0001) * 10
          const min = Math.floor(Number(res.minimum) * 0.001)
          const max = Math.floor(Number(res.maximum) * 0.00001) * 100
          const step = Number(res.step) * 10
          const defaultValue = Math.round(Number(res.defaultValue) * 0.00001) * 100

          setConfig(prev => ({...prev, min, max, step, defaultValue}))
          setValue(value)
        }
        if(data && data!==null) {
          setParameterHandler(data)
        }
      }
    } catch (e) {
      console.error(e)
    } 
  },[])
  
  const setParameterHandler = useCallback((newValue: number) => {
    try {
      let params = newValue;
      if(newValue < 30.384) {
        params = 30.384
        newValue = 30.384
      } else if(newValue > 9000) {
        params = 9000
        newValue = 9000
      }
      const value = BigInt(params * 1000);
      setValue(newValue)
      Promise.all(
        devices.map(({ transport }) => {
          soloSetCameraExposure({ transport, value })
        })
      )
    } catch (e) {
      console.error(e);
    }
  },[]) 

  return (
    <>
      {
        (value !== null && config !== null) &&
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '1fr 7rem',
            paddingLeft: "2.5rem"
          }}
        >
          <ParameterSlider 
            parameterName={"露光時間"}
            value={value}
            config={config}
            buttonRef={buttonRef}
            setParameterValue={setParameterHandler}
            disabled={disabled}
          />

          <ParameterTextField
            value={value}
            config={{ min: config.min, max: config.max }}
            unite={"μs"}
            setParameterValue={setParameterHandler}
            disabled={disabled}
          />
        </div>  
      }
    </>
  )
})

export const WandBatchGain: FC<{ disabled: boolean, localStorageKey: string }> = memo(({ disabled, localStorageKey }) => {
  const { devices } = useDevices()
  const [value, setValue] = useState<number | null>(null)
  const [config, setConfig] = useState<CameraParameterType|null>(null)
  const buttonRef = useRef<boolean>(false);
  const paramsRef = useRef<number | null>(null);

  useEffect(() => {
    const data: number | null = loadSettingsFromLocalStorage(localStorageKey, null)
    getCameraGain(data)
  },[])

  useEffect(() => {
    paramsRef.current = value
  },[value])

  useEffect(() => {
    window.addEventListener('beforeunload', (event) => {
      saveSettingsToLocalStorage(localStorageKey, paramsRef.current)
    });
    return () => {
      saveSettingsToLocalStorage(localStorageKey, paramsRef.current)
    }
  },[])

  const getCameraGain = useCallback(async (data?: number | null) => {
    try {
      const masterCamera = devices.find(d => d.primary)
      if(masterCamera) {
        const res = await soloGetCameraGain({ transport: masterCamera.transport })

        if(res) {
          const value = Number(res.value) * 0.01
          const min = Math.ceil(Number(res.minimum) * 0.01)
          const max = Math.floor(Number(res.maximum) * 0.01)
          const step = Number(res.step) * 0.01
          const defaultValue = Number(res.defaultValue) * 0.01

          setConfig(prev => ({...prev, min, max, step, defaultValue}))
          setValue(value)
        }

        if(data && data!==null) {
          setParameterHandler(data)
        }
      }
    } catch (e) {
      console.error(e)
    } 
  },[])
  
  const setParameterHandler = useCallback((newValue: number) => {
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

          const value = BigInt(Math.round(params))
          setValue(newValue)
          Promise.all(
            devices.map(({ transport }) => {
              soloSetCameraGain({ transport, value })
            })
          )
        }
        return prev
      })

    } catch (e) {
      console.error(e);
    }
  },[]) 


  return (
    <>
      {
        (value !== null && config !== null) &&
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '1fr 7rem',
            paddingLeft: "2.5rem"
          }}
        >
          <ParameterSlider 
            parameterName={"ゲイン"}
            value={value}
            config={config}
            buttonRef={buttonRef}
            setParameterValue={setParameterHandler}
            disabled={disabled}
          />

          <ParameterTextField
            value={value}
            config={{ min: config.min, max: config.max }}
            unite={"dB"}
            setParameterValue={setParameterHandler}
            disabled={disabled}
            decimalPlaces={2}
          />
        </div>  
      }
    </>
  )
})

export const WandBatchGamma:FC<{ disabled: boolean, localStorageKey: string }> = memo(({ disabled, localStorageKey }) => {
  const { devices } = useDevices()
  const [value, setValue] = useState<number | null>(null);
  const [config, setConfig] = useState<CameraParameterType|null>(null)
  const buttonRef = useRef<boolean>(false);
  const paramsRef = useRef<number | null>(null);

  useEffect(() => {
    const data: number | null = loadSettingsFromLocalStorage(localStorageKey, null)
    getCameraGamma(data)
  },[])

  useEffect(() => {
    paramsRef.current = value
  },[value])

  useEffect(() => {
    window.addEventListener('beforeunload', (event) => {
      saveSettingsToLocalStorage(localStorageKey, paramsRef.current)
    });
    return () => {
      saveSettingsToLocalStorage(localStorageKey, paramsRef.current)
    }
  },[])

  const getCameraGamma = useCallback(async (data?: number | null) => {
    try {
      const masterCamera = devices.find(d => d.primary)
      if(masterCamera) {
        const res = await soloGetCameraGamma({ transport: masterCamera.transport })

        if(res) {
          const value = Number(res.value) * 0.01
          const min = Math.ceil(Number(res.minimum)) * 0.01
          const max = Math.floor(Number(res.maximum)) * 0.01
          const step = Number(res.step) * 0.01
          const defaultValue = Number(res.defaultValue) * 0.01

          setConfig(prev => ({...prev, min, max, step, defaultValue}))
          setValue(value)
        }

        if(data && data!==null) {
          setParameterHandler(data)
        }
      }
    } catch (e) {
      console.error(e)
    } 
  },[])
  
  const setParameterHandler = useCallback((newValue: number) => {
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
          const value = BigInt(Math.round(params))
          setValue(newValue)
          Promise.all(
          devices.map(({ transport }) => {
            soloSetCameraGamma({ transport, value })
          })
        )}          
        return prev
      })
    } catch (e) {
      console.error(e);
    }
  },[]) 

  return (
    <>
      {
        (value !== null && config !== null)&&
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '1fr 7rem',
            paddingLeft: "2.5rem"
          }}
        >
          <ParameterSlider 
            parameterName={"ガンマ"}
            value={value}
            config={config}
            buttonRef={buttonRef}
            setParameterValue={setParameterHandler}
            disabled={disabled}
          />

          <ParameterTextField
            value={value}
            config={{ min: config.min, max: config.max }}
            unite={""}
            setParameterValue={setParameterHandler}
            disabled={disabled}
            decimalPlaces={2}
          />
        </div>  
      }
    </>
  )
})