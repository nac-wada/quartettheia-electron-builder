import { useCallback, useEffect, useState } from "react";
import { MessageModalProps } from "../../../../types/common";
import { soloExecuteFactoryReset, soloGetDeviceAutoBootOnPowerSupply, soloGetRecordingAutoRemoveEnabled, soloSetDeviceAutoBootOnPowerSupply, soloSetRecordingAutoRemoveEnabled } from "../../../../api/soloAPI";
import { Transport } from "@connectrpc/connect";
import { changeDeviceAutoBootModeAPIStatusFuncType, changeRecordingAutoRemoveEnabledAPIStatusFuncType, closeWarningDialogFuncType, executeFactoryResetFuncType, getDeviceAutoBootModeOnPowerSupplyFuncType, getRecordingAutoRemoveEnabledFuncType, openWarningDialogFuncType, OtherSettingModel, OtherSettingViewModel, setDeviceAutoBootModeOnPowerSupplyFuncType, setRecordingAutoRemoveEnabledFuncType } from "../types";

const useOtherSetting = ({ transport, open }:{ transport: Transport, open: boolean }): OtherSettingViewModel => {
  const [ otherSettingState, setOtherSettingState ] = useState<OtherSettingModel>({
    deviceAutoBootModeOnPowerSupply: null,
    deviceAutoBootModeAPIStatus: 'free',
    recordingAutoRemoveEnabled: null,
    recordingAutoRemoveEnabledAPIStatus: 'free',
    dialogProps: null
  })

  const getDeviceAutoBootModeOnPowerSupplyError: MessageModalProps = {
    event: 'error',
    title: 'エラー',
    content: `
            自動給電モードの情報取得に失敗しました。<br>
            アプリを再読み込みしてください。
          `,
    onClose: () => {
      closeWarningDialogFunc()
    },
  }

  const getRecordingAutoRemoveEnabledError: MessageModalProps = {
    event: 'error',
    title: 'エラー',
    content: `
               ファイル自動削除モードの情報取得に失敗しました。<br>
               アプリを再読み込みしてください。
             `,
    onClose: () => {
      closeWarningDialogFunc()
    },
  }
  
  const settingError: MessageModalProps = {
    event: 'error',
    title: 'エラー',
    content: `
            設定できませんでした。<br>
            アプリを再読み込みしてください。
          `,
    onClose: () => {
      closeWarningDialogFunc()
    },
  }
  
  const factoryResetError: MessageModalProps = {
    event: 'error',
    title: 'エラー',
    content: `
            エラーが発生したため、<br>
            工場出荷時リセットをキャンセルしました。
          `,
    onClose: () => {
      closeWarningDialogFunc()
    },
  }

  useEffect(() => {

    if(open) {
      Promise.all([
        getDeviceAutoBootModeOnPowerSupplyFunc({ event: 'init' }),
        getRecordingAutoRemoveEnabledFunc({ event: 'init' })
      ])
    }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[open])

  // 電源連動モードが有効かどうか取得
  const getDeviceAutoBootModeOnPowerSupplyFunc: getDeviceAutoBootModeOnPowerSupplyFuncType = useCallback(async ({ event }) => {
    try {
      if(event === 'init') {
        changeDeviceAutoBootModeAPIStatusFunc({ status: 'busy' })
      }

      const res = await soloGetDeviceAutoBootOnPowerSupply({ transport: transport })

      if(res) {
        setOtherSettingState((prev) => ({
          ...prev,
          deviceAutoBootModeOnPowerSupply: res.enable
        }))
        changeDeviceAutoBootModeAPIStatusFunc({ status: 'free' })
      } else {
        
        openWarningDialogFunc({
          dialog: getDeviceAutoBootModeOnPowerSupplyError
        })
        
        changeDeviceAutoBootModeAPIStatusFunc({ status: 'free' })
      }

    } catch (e) {
      
      openWarningDialogFunc({
        dialog: getDeviceAutoBootModeOnPowerSupplyError
      })
      
      changeDeviceAutoBootModeAPIStatusFunc({ status: 'free' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // 電源連動モードの設定値を変更
  const setDeviceAutoBootModeOnPowerSupplyFunc: setDeviceAutoBootModeOnPowerSupplyFuncType = useCallback(async ({ enable }) => {
    try {
      changeDeviceAutoBootModeAPIStatusFunc({ status: 'busy' })
      const res = await soloSetDeviceAutoBootOnPowerSupply({ transport: transport, enable: enable })

      if(res) {
        // getDeviceAutoBootModeOnPowerSupplyFunc({ event: 'updated' })
        setOtherSettingState((prev) => ({
          ...prev,
          deviceAutoBootModeOnPowerSupply: enable
        }))

        changeDeviceAutoBootModeAPIStatusFunc({ status: 'free' })
      } else {

        openWarningDialogFunc({
          dialog: settingError
        })

        changeDeviceAutoBootModeAPIStatusFunc({ status: 'free' })
      }
      
    } catch (e) {
      
      openWarningDialogFunc({
        dialog: settingError
      })

      changeDeviceAutoBootModeAPIStatusFunc({ status: 'free' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const changeDeviceAutoBootModeAPIStatusFunc: changeDeviceAutoBootModeAPIStatusFuncType = useCallback(({ status }) => {
    setOtherSettingState((prev) => ({
      ...prev,
      deviceAutoBootModeAPIStatus: status
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const getRecordingAutoRemoveEnabledFunc: getRecordingAutoRemoveEnabledFuncType = useCallback(async ({ event }) => {
    try {
      if(event === 'init') {
        changeRecordingAutoRemoveEnabledAPIStatusFunc({ status: 'busy' })
      }

      const res = await soloGetRecordingAutoRemoveEnabled({ transport })

      if(res) {
        setOtherSettingState((prev) => ({
          ...prev,
          recordingAutoRemoveEnabled: res.enable
        }))
        changeRecordingAutoRemoveEnabledAPIStatusFunc({ status: 'free' })
      } else {

        setOtherSettingState((prev) => ({
          ...prev,
          recordingAutoRemoveEnabled: "failed"
        }))
        changeRecordingAutoRemoveEnabledAPIStatusFunc({ status: 'free' })
      }
    } catch (e) {
      setOtherSettingState((prev) => ({
        ...prev,
        recordingAutoRemoveEnabled: "failed"
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const setRecordingAutoRemoveEnabledFunc: setRecordingAutoRemoveEnabledFuncType = useCallback(async ({ enable }) => {
    try {
      changeRecordingAutoRemoveEnabledAPIStatusFunc({ status: 'busy' })
      const res = await soloSetRecordingAutoRemoveEnabled({ transport, enable })

      if(res) {
        setOtherSettingState((prev) => ({
          ...prev,
          recordingAutoRemoveEnabled: enable
        }))

        changeRecordingAutoRemoveEnabledAPIStatusFunc({ status: 'free' })
      } else {
        openWarningDialogFunc({ dialog: settingError })

        changeRecordingAutoRemoveEnabledAPIStatusFunc({ status: 'free' })
      }
    } catch (e) {

      openWarningDialogFunc({ 
        dialog: settingError
      })

      changeRecordingAutoRemoveEnabledAPIStatusFunc({ status: 'free' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const changeRecordingAutoRemoveEnabledAPIStatusFunc: changeRecordingAutoRemoveEnabledAPIStatusFuncType = useCallback(({ status }) => {
    setOtherSettingState((prev) => ({
      ...prev,
      recordingAutoRemoveEnabledAPIStatus: status
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // ファクトリリセットを実行　←未実装
  const executeFactoryResetFunc: executeFactoryResetFuncType = useCallback(async () => {
    try {
      const res = await soloExecuteFactoryReset({ transport: transport })

      if(res) {
        openWarningDialogFunc({
          dialog: {
            event: 'warning',
            content: `
                    工場出荷時リセットをしています。しばらくお待ちください。<br>
                    リセット中は、絶対にカメラの電源を切らないでください。<br>
                    リセットが完了するとカメラはシャットダウンし、<br>
                    カメラ本体前面のステータスLEDが消灯します。<br>
                    電源が切れたら、カメラの電源をONにしてください。<br>
                    <br>
                    次回のカメラ起動時に、初期セットアップが約10分間実行されます。<br>
                    カメラステータスLEDが赤・緑の交互点滅状態になるため、この状態が終わるまで、カメラの電源を切らずにお待ちください。<br>
                  `,
            onConfirmTitle: '閉じる',
            onConfirm: () => { closeWarningDialogFunc() },
            onClose: () => { closeWarningDialogFunc() }
          }
        })
      } else {
        openWarningDialogFunc({
          dialog: factoryResetError
        })
      }
    } catch (e) {
      openWarningDialogFunc({
        dialog: factoryResetError
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const openWarningDialogFunc: openWarningDialogFuncType = useCallback(({ dialog }) => {
    setOtherSettingState((prev) => ({
      ...prev,
      dialogProps: dialog
    }))
  },[])

  const closeWarningDialogFunc: closeWarningDialogFuncType = useCallback(() => {
    setOtherSettingState((prev) => ({
      ...prev,
      dialogProps: null
    }))
  },[])

  return {
    otherSettingState,
    getDeviceAutoBootModeOnPowerSupplyFunc,
    setDeviceAutoBootModeOnPowerSupplyFunc,
    getRecordingAutoRemoveEnabledFunc,
    setRecordingAutoRemoveEnabledFunc,
    executeFactoryResetFunc,
    openWarningDialogFunc,
    closeWarningDialogFunc,
  }
}

export { useOtherSetting }