import { useCallback, useEffect, useState } from "react";
import { Transport } from "@connectrpc/connect";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { SubscribeEventResponse as QuartetSubscribeEventResponse, EventType as QuartetEventType } from "../../../../gen/quartet/v1/quartet_pb";
import { EventType as SoloEventType, SubscribeEventResponse as SoloSubscribeEventResponse } from "../../../../gen/solo/v1/solo_pb";
import { useQueryClient } from "@tanstack/react-query";
import { MessageModalProps, soloApiKeys } from "../../../../types/common";
import { useSoloSubscribeEventListener } from "../../../../globalContexts/SoloSubscribeEventContext";
import { useQuartetSubscribeEventListener } from "../../../../globalContexts/QuartetSubscribeEventContext";
import { soloGetCurrentTime, soloGetDeviceBootTime, soloIsDeviceSyncEstablished } from "../../../../api/soloAPI";
import { quartetCanApplyDeviceConfiguration, quartetGetDeviceSyncCf, quartetGetDeviceSyncTxPower, quartetSetDeviceSyncCf, quartetSetDeviceSyncTxPower, quartetSetSystemTime } from "../../../../api/quartetAPI";
import { CameraSyncModel, CameraSyncViewModel, DeviceSyncCfList, DeviceSyncTxPowerList } from "../types";

const useCameraSync = ({ ipv4Addr, transport, primary, open }:{ ipv4Addr: string, transport: Transport, primary: boolean, open: boolean }): CameraSyncViewModel => {
  const [ cameraSyncState, setCameraSyncState ] = useState<CameraSyncModel>({
    currentTime: null,
    deviceBootTime: null,
    deviceSyncTxPower: null,
    deviceSyncCf: null,
  })
  const [ dialog, setDialog ] = useState<MessageModalProps | null>(null);
  const [ isEstablished, setIsEstablished ] = useState<boolean | null>(null);
  const [ canApply, setCanApply ] = useState<boolean>(false)
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener()
  const { subscribeQuartetEventListener } = useQuartetSubscribeEventListener()
  const queryClient = useQueryClient()

  const getAPIError = (params: string): MessageModalProps => {
    return {
      event: 'error',
      title: 'エラー',
      content: `
              ${params}を取得できませんでした。<br>
              アプリを再読み込みしてください。
            `,
      onClose: () => {
        closeWarningDialogFunc()
      },
    }
  }

  const setAPIError = (params: string): MessageModalProps => {
    return {
      event: 'error',
      title: 'エラー',
      content: `
              ${params}の設定に失敗しました。<br>
              もう一度設定ボタンを押してください。
            `,
      onClose: () => {
        closeWarningDialogFunc()
      },
    }
  }

  useEffect(() => {
    const listener = (event: SoloSubscribeEventResponse) => {
      switch(event.type) {
        case SoloEventType["DEVICE_SYNC_ESTABLISHED"]:
          setIsEstablished(true)
          break;
        case SoloEventType["DEVICE_SYNC_UNSTABLE"]:
          setIsEstablished(false)
          break;
      }
    }

    const unsubscribe = subscribeSoloEventListener(ipv4Addr, listener)
    return () => unsubscribe()
  },[subscribeSoloEventListener])

  useEffect(() => {
    if(primary) {
      const listener = (event: QuartetSubscribeEventResponse) => {
        switch(event.type) {
          case QuartetEventType["DEVICE_CONFIGURATION_APPLY_STARTED"]:
            setCanApply(false)
            break;
          case QuartetEventType["DEVICE_CONFIGURATION_APPLY_COMPLETED"]:
            setCanApply(true)
            break;
        }
      }

      const unsubscribe = subscribeQuartetEventListener(listener)

      return () => unsubscribe()
    }
  },[subscribeQuartetEventListener, primary])

  useEffect(() => {
    if(open) {

      getDataFunc()

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[open])

  const getDataFunc = useCallback(() => {
    Promise.all([
      fetchQueryIsDevicesEstablished(),
      getCurrentTimeFunc(),
      getDeviceBootTimeFunc(),
      primary && canApplyDeviceConfiguration(),
      primary && getDeviceSyncTxPowerFunc({ event: 'init' }),
      primary && getDeviceSyncCfFunc({ event: 'init' }),
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const fetchQueryIsDevicesEstablished = async () => {
    const res = await queryClient.fetchQuery({
      queryKey: soloApiKeys.detail('IsDeviceSyncEstablished', ipv4Addr),
      queryFn: () => soloIsDeviceSyncEstablished({ transport })
    });

    if(res) {
      if(res===null) {
        setIsEstablished(false)
        return;
      }

      setIsEstablished(res.established)
    }
  }

  const canApplyDeviceConfiguration = useCallback(async () => {
    try {
      const res = await quartetCanApplyDeviceConfiguration()

      if(res) {
        setCanApply(res.canApply)
      }
    } catch (e) {
      openWarningDialogFunc({
        dialog: getAPIError(`デバイス設定変更`)
      })
    }
  },[])

  const getCurrentTimeFunc = useCallback(async () => {
    try {
      const res = await soloGetCurrentTime({ transport: transport });

      if(res) {
        const sec = Number(res.timestamp.seconds)
        const nanos = Number(res.timestamp.nanos/1000000)
        const currentTime = new Date((sec *1000) + nanos)
        setCameraSyncState((prev) => ({
          ...prev,
          currentTime: currentTime
        }))
      }

    } catch (e) {
      
      openWarningDialogFunc({
        dialog: getAPIError(`カメラ同期時刻`)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const getDeviceBootTimeFunc = useCallback(async () => {
    try {
      const res = await soloGetDeviceBootTime({ transport })

      if(res) {
        const sec = Number(res.boottime.seconds);
        const nanos = Number(res.boottime.nanos/1000000);
        const bootTime = new Date((sec*1000) + nanos)
        setCameraSyncState(prev => ({
          ...prev,
          deviceBootTime: bootTime
        }))
      }
    } catch (e) {

      openWarningDialogFunc({
        dialog: getAPIError(`カメラ起動時刻`)
      })
    }
  },[])

  const getDeviceSyncTxPowerFunc = useCallback(async ({ event }:{ event: 'init' | 'updated' }) => {
    try {
      
      if(event === 'init') {
        setCameraSyncState(prev => ({ ...prev, isUpdating: true }))
      }

      const res = await quartetGetDeviceSyncTxPower()

      if(res) {
        const txPower = DeviceSyncTxPowerList[res.txPower].txPower
        setCameraSyncState((prev) => ({
          ...prev,
          deviceSyncTxPower: txPower
        }))
      } else {

        openWarningDialogFunc({
          dialog: getAPIError(`無線同期信号の送信出力`)
        })
        
      }

    } catch (e) {

      openWarningDialogFunc({
        dialog: getAPIError(`無線同期信号の送信出力`)
      })

    } finally {
      setCameraSyncState(prev => ({ ...prev, isUpdating: false }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const getDeviceSyncCfFunc = useCallback(async ({ event }:{ event: 'init' | 'updated' }) => {
    try {
      if(event === 'init') {
        setCameraSyncState(prev => ({...prev, isUpdating: true}))
      }

      const res = await quartetGetDeviceSyncCf()

      if(res) {
        const cf = DeviceSyncCfList[res.cf].cf
        setCameraSyncState((prev) => ({
          ...prev,
          deviceSyncCf: cf
        }))
      } else {
        
        openWarningDialogFunc({
          dialog: getAPIError(`無線同期信号の周波数`)
        })
        
      }
  
    } catch (e) {
      
      openWarningDialogFunc({
        dialog: getAPIError(`無線同期信号の周波数`)
      })

    } finally {
      setCameraSyncState(prev => ({...prev, isUpdating: false}))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const setSystemTimeFunc = useCallback(async ({ time }:{ time: Date }) => {
    try {
      setCameraSyncState(prev => ({ ...prev, isUpdating: true }))
      const utcString = time.toISOString()
      const timestamp = timestampFromDate(new Date(utcString))
      const res = await quartetSetSystemTime({ time: timestamp })

      if(res) {
        // 時刻を再取得
        getCurrentTimeFunc()
      }
    } catch (e) {
      console.error(e)
      openWarningDialogFunc({
        dialog: setAPIError(`カメラ時刻`)
      })
    } finally {
      setCameraSyncState(prev => ({...prev, isUpdating: false})) 
    }
  },[])

  const setDeviceSyncTxPowerFunc = useCallback(async ({ value }:{ value: string }) => {
    try {
      setCameraSyncState(prev => ({ ...prev, isUpdating: true }))
      const txPower = DeviceSyncTxPowerList.find(({ txPower }) => txPower === value)
      if(!!txPower) {
        const res = await quartetSetDeviceSyncTxPower({ txPower: txPower.mode })
        
        if(res) {
          setCameraSyncState((prev) => ({
            ...prev,
            deviceSyncTxPower: txPower.txPower
          }))
          
        } else {

          openWarningDialogFunc({
            dialog: setAPIError(`無線同期信号の送信出力`)
          })

        }
      }

    } catch (e) {
      
      openWarningDialogFunc({
        dialog: setAPIError(`無線同期信号の送信出力`)
      })
      
    } finally {
      setCameraSyncState(prev => ({...prev, isUpdating: false}))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const setDeviceSyncCfFunc = useCallback(async ({ value }:{ value: string }) => {
    try {
      setCameraSyncState(prev => ({ ...prev, isUpdating: true }))
      const cf = DeviceSyncCfList.find(({ cf }) => cf === value)
      if(!!cf) {
        const res = await quartetSetDeviceSyncCf({ cf: cf.mode })

        if(res) {
          setCameraSyncState((prev) => ({
            ...prev,
            deviceSyncCf: cf.cf
          }))

        } else {
          
          openWarningDialogFunc({
            dialog: setAPIError(`無線同期信号の周波数`)
          })
          
        }
      } 

    } catch (e) {
      
      openWarningDialogFunc({
        dialog: setAPIError(`無線同期信号の周波数`)
      })

    } finally {
      setCameraSyncState(prev => ({...prev, isUpdating: false}))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const openWarningDialogFunc = useCallback(({ dialog }:{ dialog: MessageModalProps }) => {
    setDialog(dialog)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const closeWarningDialogFunc = useCallback(() => {
    setDialog(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return {
    cameraSyncState,
    dialog,
    canApply,
    isEstablished,
    getDataFunc,
    getCurrentTimeFunc,
    setSystemTimeFunc,
    setDeviceSyncTxPowerFunc,
    getDeviceSyncCfFunc,
    setDeviceSyncCfFunc,
    openWarningDialogFunc,
    closeWarningDialogFunc,
  }
}

export { useCameraSync }