import { Box, Button, CircularProgress, InputAdornment, MenuItem, Select, SelectChangeEvent, Typography, } from "@mui/material"
import { FC, memo, useEffect, useState } from "react"
import { DeviceSyncTxPowerList, } from "../types";

const DeviceSyncTxPowerButton: FC<{
  deviceSyncTxPower: string | null,
  openDialog: any,
  closeDialog: any,
  setDeviceSyncTxPower: any,
  canApply: boolean, 
  isRecording: boolean,
}> = memo(
  ({
    deviceSyncTxPower,
    openDialog,
    closeDialog,
    setDeviceSyncTxPower,
    canApply,
    isRecording
  }) => {
  const [ value, setValue ] = useState(deviceSyncTxPower)
  const list = DeviceSyncTxPowerList.filter((e) => e.txPower !== '');

  useEffect(() => {
    setValue(deviceSyncTxPower)
  },[ deviceSyncTxPower ])

  const onChange = (event:SelectChangeEvent) => {
    let newValue = event.target.value;
    setValue(newValue)
  }

  const onClick = () => {
    if(value) {
      openDialog({
        dialog: {
          event: 'warning',
          content : `
                  送信出力を${value}[dBm]に変更しますか？
                `,
          onConfirm: () => {
            closeDialog()
            setDeviceSyncTxPower({ value: value })
          },
          onCancel: () => {
            closeDialog()
          },
          onClose: () => {
            closeDialog()
          },
        }
      })
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: { xs: "50%", sm: "40%" }, display: "flex", alignItems: "start" }}>
        <Typography 
          sx={{ 
            color: "text.secondary", 
            fontWeight:"bold", 
            display: "inline-block", 
            fontSize: "0.9rem",
          }}
        >
          無線同期信号の送信出力
        </Typography>
      </Box>
      <Box sx={{ width: { xs: "50%", sm: "60%" }, justifyItems: "end", alignItems: "start", display: "grid", gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }, gap: { xs: "5px", sm: "0px" } }}>
        <Select
          disabled={value === null}
          autoComplete="off"
          value={value !== null ? value : ''}
          MenuProps={{
            style: {
              maxHeight: 300
            }
          }}
          endAdornment={<InputAdornment position="end">dBm</InputAdornment>}
          sx={{
            textAlign:'start',
            borderRadius: 0,
            height: 35,
            width: 130,
          }}
          IconComponent={() => <></>}
          onChange={onChange}
        >
          {
            list.map(({ txPower }) => (
              <MenuItem key={txPower} value={txPower}>{txPower}</MenuItem>
            ))
          }
        </Select>
        <Button 
          disabled={!canApply || !deviceSyncTxPower || isRecording}
          color={"primary"}
          variant="contained" 
          sx={{width:130,fontWeight:"bold",borderRadius:1.5,height:35}}
          onClick={onClick}
        >
          {
            (canApply)
            ? <>設定</> 
            : <CircularProgress sx={{color:"white"}} size={20}/>
          }
        </Button>
      </Box>
    </Box>
    // <Grid container>
    //   <Grid size={{ xs: 6, sm: 4 }}>
    //     <Typography
    //       sx={{ 
    //         color: "text.secondary",
    //         fontWeight: "bold",
    //         display: "inline-block",
    //         width: "100%",
    //         fontSize: "0.9rem"
    //       }}
    //     >
    //       無線同期信号の送信出力
    //     </Typography>
    //   </Grid>
    //   <Grid size={{ xs: 6, sm: 8 }}>
    //     <Grid container>
    //       <Grid size={{ xs: 12, sm: 7 }} sx={{ textAlign: "right" }}>
    //         <Select
    //           disabled={value === null}
    //           autoComplete="off"
    //           value={value !== null ? value : ''}
    //           MenuProps={{
    //             style: {
    //               maxHeight: 300
    //             }
    //           }}
    //           endAdornment={<InputAdornment position="end">dBm</InputAdornment>}
    //           sx={{
    //             textAlign:'start',
    //             borderRadius: 0,
    //             height: 35,
    //             width: 130,
    //             m: { xs: "0 0 0.5rem", sm: "0 0.5rem 0 0" }
    //           }}
    //           IconComponent={() => <></>}
    //           onChange={onChange}
    //         >
    //           {
    //             list.map(({ txPower }) => (
    //               <MenuItem key={txPower} value={txPower}>{txPower}</MenuItem>
    //             ))
    //           }
    //         </Select>
    //       </Grid>
    //       <Grid size={{ xs: 12, sm: 5 }} sx={{ textAlign: "right" }}>
    //         <Button 
    //           disabled={!canApply || !deviceSyncTxPower || isRecording}
    //           color={"primary"}
    //           variant="contained" 
    //           sx={{width:130,fontWeight:"bold",borderRadius:1.5,height:35}}
    //           onClick={onClick}
    //         >
    //           {
    //             (canApply)
    //             ? <>設定</> 
    //             : <CircularProgress sx={{color:"white"}} size={20}/>
    //           }
    //         </Button>
    //       </Grid>
    //     </Grid>
    //   </Grid>
    // </Grid>
  )
})

export { DeviceSyncTxPowerButton }