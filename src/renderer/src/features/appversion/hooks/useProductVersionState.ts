import { useCallback, useEffect, useState } from "react";
import { soloGetProductVersion } from "../../../api/soloAPI";
import { Transport } from "@connectrpc/connect";
import { MessageModalProps } from "../../../types/common";
import { openWarningDialogFuncType, ProductVersionModel, ProductVersionViewModel } from "../types";

const useProductVersionState = ({ transport }:{ transport: Transport }): ProductVersionViewModel => {
  const [ productVersionState, setProductVersionState ] = useState<ProductVersionModel>({
    success: false,
    version: '',
    releaseDate: '',
    metadata: '',
    dialogProps: null,
  })

  const getProductVersionError: MessageModalProps = {
    event: 'error',
    title: 'エラー',
    content: `
               アプリのバージョン情報を取得できませんでした。<br>
               アプリを再読み込みしてください。
             `,
    onClose: () => {
      closeWarningDialogFunc()
    }
  }

  useEffect(() => {
    getProductVersionFunc()
  },[])
  
  const getProductVersionFunc = useCallback(async () => {
    try {
      const res = await soloGetProductVersion({ transport: transport })

      if(res) {
        setProductVersionState({
          success: res.success,
          version: res.version,
          releaseDate: res.releaseDate,
          metadata: res.metadata,
          dialogProps: null
        })
      } else {
        openWarningDialogFunc({
          dialog: getProductVersionError
        })
      }
    
    } catch (e) {
      openWarningDialogFunc({
        dialog: getProductVersionError
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const openWarningDialogFunc: openWarningDialogFuncType = useCallback(({ dialog }) => {
    setProductVersionState((prev) => ({
      ...prev,
      dialogProps: dialog
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  const closeWarningDialogFunc = useCallback(() => {
    setProductVersionState((prev) => ({
      ...prev,
      dialogProps: null
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return {
    productVersionState,
    getProductVersionFunc,
    openWarningDialogFunc,
    closeWarningDialogFunc
  }
}

export { useProductVersionState }