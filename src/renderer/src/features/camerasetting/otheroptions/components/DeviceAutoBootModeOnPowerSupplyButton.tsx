import { Box, Switch, Typography } from "@mui/material"
import { FC, memo, useEffect, useState } from "react"

const DeviceAutoBootModeOnPowerSupplyButton: FC<{
  onPowerSupply: boolean| "failed"| null,
  openDialog: any,
  closeDialog: any,
  setDeviceAutoBootModeOnPowerSupply: any,
  deviceAutoBootModeAPIStatus: 'free' | 'busy'
}> = memo(
  ({
    onPowerSupply,
    openDialog,
    closeDialog,
    setDeviceAutoBootModeOnPowerSupply,
    deviceAutoBootModeAPIStatus
  }) => {
  const [ value, setValue ] = useState(onPowerSupply)
  
  useEffect(() => {
    setValue(onPowerSupply)
  },[ onPowerSupply ])

  const handleChange = () => {

    openDialog({
      dialog: {
        event: 'warning',
        content: `
                設定を変更しますか？<br>
              `,
        onConfirm: () => { 
          closeDialog() 
          setDeviceAutoBootModeOnPowerSupply({ enable: !value })
        },
        onCancel: () => { closeDialog() },
        onClose: () => { closeDialog() },
      }
    })
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Box
        sx={{
          display: "inline-block",
          mr: "1rem",
          width: "100%"
        }}
      >
        <Typography
          color={'text.secondary'} 
          sx={{ fontWeight:"bold", fontSize: "0.9rem" }}
        >
          給電時にカメラを起動する
        </Typography>
        <Typography color={'error'} sx={{ fontSize: 11, fontWeight: "bold", ...(value!=="failed" && { display: "none" }) }}>
          エラーが発生しました。
        </Typography>
        <Typography color={'error'} sx={{ fontSize: 11, fontWeight: "bold", ...(value!=="failed" && { display: "none" }) }}>
          アプリを再読み込みしてください。
        </Typography>
      </Box>
      <Switch
        disabled={
          value === null || value === "failed" || 
          deviceAutoBootModeAPIStatus === 'busy'
        } 
        checked={value === null || value === "failed" ? false : value}
        onChange={handleChange}
      />
    </Box>
  )
})

export { DeviceAutoBootModeOnPowerSupplyButton }