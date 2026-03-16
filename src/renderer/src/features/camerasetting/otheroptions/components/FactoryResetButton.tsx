import { Box, Button, Typography } from "@mui/material"
import { FC, memo } from "react"
// import { FC } from "react"

const FactoryResetButton: FC<{
  openDialog: any,
  closeDialog: any,
  factoryReset: any,
}> = memo(
  ({
    openDialog, closeDialog, factoryReset
  }) => {

  // [リセットする]ボタン押したとき
  const onClick = () => {
    openDialog({
      dialog: {
        event: 'warning',
        content: `
                カメラを工場出荷時リセットしますか？<br> 
              `,
        onConfirm: onConfirm,
        onCancel: onCancel,
        onClose: onClose
      }
    })
  }

  // カメラを工場出荷時リセットしますか？　=>　[はい]を押したとき
  const onConfirm = () => {
    openDialog({
      dialog: {
        event: 'warning',
        content: `
                本当に工場出荷時リセットしますか？<br>
                一度リセットすると、操作を取り消しできません。
              `,
        onConfirm: onExecuteFactoryReset,
        onCancel: onCancel,
        onClose: onClose,
      }
    })
  }

  // カメラを工場出荷時リセットしますか？ or 本当に工場出荷時リセットしますか？　=>　[いいえ]を押したとき
  const onCancel = () => {
    openDialog({
      dialog: {
        event: 'warning',
        content: `
                工場出荷時リセットをキャンセルしました。<br>
              `,
        onClose: onClose
      }
    })
  }

  const onClose = () => {
    closeDialog()
  }
 
  // 本当に工場出荷時リセットしますか？　=>　[はい]を押したとき
  const onExecuteFactoryReset = () => {
    factoryReset()
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography
        color={'text.secondary'} 
        sx={{
          fontWeight:"bold", 
          display:"inline-block", 
          mr: "1rem", 
          width: "100%", 
          fontSize: "0.9rem"
        }}
      >
        工場出荷時リセット
      </Typography>
      <Button 
          color="error" 
          variant="contained" 
          sx={{width: 170,fontWeight:"bold",borderRadius:1.5, fontSize: "0.8rem"}}
          onClick={onClick}
        >
          リセットする
        </Button>
    </Box>
  )
})

export { FactoryResetButton }