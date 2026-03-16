import { useCallback, useEffect, useState } from "react"
import { DeviceInfomation, MessageModalProps } from "../../../types/common"
import { soloGetBuildInfoAll, soloGetProductSerialNumber } from "../../../api/soloAPI"
import { CameraVersionListType, CameraVersionType, getBuildInfoAllFuncType, getProductSerialNumberFuncType, openWarningDialogFuncType } from "../types"

const useCameraVersionList = ({ devices }:{ devices : DeviceInfomation[] }) => {
  const [ cameraVersionListState, setCameraVersionList ] = useState<CameraVersionListType>({
    cameraInfos: [],
    dialogProps: null
  })

  useEffect(() => {
    setCreateCameraVersionList()
  },[])

  const setCreateCameraVersionList = useCallback(() => {
    try {
      devices.forEach(({ nickname, ipv4Addr, macAddr, transport }) => {
        const cameraInfo: CameraVersionType = {
          name: nickname,
          model: '',
          productSerialNumber: '',
          ipv4Addr: ipv4Addr,
          macAddr: macAddr,
          services: []
        }

        setCameraVersionList((prev) => ({
          ...prev,
          cameraInfos: [...prev.cameraInfos, cameraInfo]
        }))

        getProductSerialNumberFunc({ nickname: nickname, transport: transport, ipv4Addr: ipv4Addr })
      })
    } catch (e) {

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const getProductSerialNumberFunc: getProductSerialNumberFuncType = useCallback( async({ nickname, transport, ipv4Addr }) => {
    const getProductSerialNumberError: MessageModalProps = {
      event: 'error',
      title: 'エラー',
      content: `
                 カメラ 「${nickname}」のバージョン情報を取得できませんでした。<br>
                 アプリを再読み込みしてください。
               `,
      onClose: () => {
        closeWarningDialogFunc()
      }
    }

    try {
      const res = await soloGetProductSerialNumber({ transport: transport })

      if(res) {

        setCameraVersionList((prev) => ({
          ...prev,
          cameraInfos: prev.cameraInfos.map((prevCameraInfo) => (prevCameraInfo.ipv4Addr === ipv4Addr) ?
                       {
                          ...prevCameraInfo,
                          model: res.modelNumber,
                          productSerialNumber: res.serialNumber,
                       } : prevCameraInfo)
        }))

        getBuildInfoAllFunc({ nickname: nickname, transport: transport, ipv4Addr: ipv4Addr })
      } else {
        openWarningDialogFunc({ dialog: getProductSerialNumberError })
      }
    } catch (e) {
      openWarningDialogFunc({ dialog: getProductSerialNumberError })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const getBuildInfoAllFunc: getBuildInfoAllFuncType = useCallback( async({ nickname, transport, ipv4Addr }) => {
    const getBuildInfoAllError: MessageModalProps = {
      event: 'error',
      title: 'エラー',
      content: `
                 カメラ 「${nickname}」のバージョン情報を取得できませんでした。<br>
                 アプリを再読み込みしてください。
               `,
      onClose: () => {
        closeWarningDialogFunc()
      }
    }

    try {
      const res = await soloGetBuildInfoAll({ transport: transport })

      if(res) {
        setCameraVersionList((prev) => ({
          ...prev,
          cameraInfos: prev.cameraInfos.map((prevCameraInfo) => (prevCameraInfo.ipv4Addr === ipv4Addr) ?
                       {
                        ...prevCameraInfo,
                        services: res.services
                       } : prevCameraInfo)
        }))
      } else {
        openWarningDialogFunc({ dialog: getBuildInfoAllError })
      }
    } catch (e) {
      openWarningDialogFunc({ dialog: getBuildInfoAllError })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const openWarningDialogFunc: openWarningDialogFuncType = useCallback(({ dialog }) => {
    setCameraVersionList((prev) => ({
      ...prev,
      dialogProps: dialog
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
    
    const closeWarningDialogFunc = useCallback(() => {
      setCameraVersionList((prev) => ({
        ...prev,
        dialogProps: null
      }))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
  
  return {
    cameraVersionListState,
    getProductSerialNumberFunc,
    getBuildInfoAllFunc,
  }
}

export { useCameraVersionList }