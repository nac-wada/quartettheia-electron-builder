import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { FC, memo, useEffect, useMemo, useState } from "react";

const CurrentTimerPanel: FC<{
  primary: boolean,
  current: Date|null, 
  getCurrentTime: any,
  setSystemTime: any,
  canApply: boolean,
  openDialog: any,
  closeDialog: any,
  isRecording: boolean
}> = memo((props) => {
  const { primary, current, getCurrentTime, setSystemTime, openDialog, closeDialog, canApply, isRecording } = props;
  const [ value, setValue ] = useState(current)

  useEffect(() => {
    setValue(current)
    let t = 0;
    const interval = setInterval(() => {
      if(current !== null) {
        t = t + 1000;
        setValue((prev) => ( prev !== null ? new Date((prev.getTime()) + 1000) : null))
        if(t > 1000 * 10) {
          getCurrentTime();
          t = 0;
        }
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[current])

  let currentTime = useMemo(() => {
    if(value) {
      const y = String(value.getFullYear())
      const m = String(value.getMonth()+1).padStart(2,"0")
      const d = String(value.getDate()).padStart(2,"0")
      const h = String(value.getHours()).padStart(2,"0")
      const M = String(value.getMinutes()).padStart(2,"0")
      const s = String(value.getSeconds()).padStart(2, "0")
      return `${y}/${m}/${d} ${h}:${M}:${s}`
    }
    return `-- / -- / -- : -- : --`
  },[value])

  const onClick = () => {
    openDialog({
      dialog: {
        event: 'warning',
        content:  `
                   全カメラの時刻を現在の時刻に設定しますか？<br>
                   ※設定直後は、カメラ同期が一時的に中断されます
                  `,
        onConfirm: () => {
          closeDialog()
          const time = new Date()
          // ↓実験　
          // const now = new Date()
          // now.setHours(now.getHours() + 1);
          setSystemTime({ time })
        },
        onCancel: () => closeDialog(),
        onClose: () => closeDialog()
      }
    })
  }

  return (
    <Box sx={{ display: "flex", mt: "10px" }}>
      <Box sx={{ width: { xs: "50%", sm: "40%" }, display: "flex", alignItems: "start" }}>
        <Typography 
          sx={{ 
            color: "text.secondary", 
            fontWeight:"bold", 
            display: "inline-block", 
            fontSize: "0.9rem",
          }}
        >
          カメラ同期時刻
        </Typography>
      </Box>
      <Box sx={{ width: { xs: "50%", sm: "60%" }, justifyItems: "end", alignItems: "start", display: "grid", gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }, gap: { xs: "5px", sm: "0px" } }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: "text.secondary", 
            fontWeight:"bold", 
            fontSize: "0.9rem"
          }}
        >
          {currentTime}
        </Typography>
        {
          primary &&
          <Button 
            disabled={!canApply || !current || isRecording}
            color={"primary"} 
            variant="contained" 
            sx={{width:130,fontWeight:"bold",borderRadius:1.5,height:35, p:0}}
            onClick={onClick}
          >
            {
              (canApply)
              ? <>現在時刻を設定</>
              : <CircularProgress sx={{color:"white"}} size={20}/>
            }
          </Button> 
        }
      </Box>
    </Box>
    // <Grid container>
    //   <Grid size={{ xs: 6, sm: 4 }}>
    //     <Typography 
    //       sx={{ 
    //         color: "text.secondary", 
    //         fontWeight:"bold", 
    //         display: "inline-block", 
    //         width: "100%", 
    //         fontSize: "0.9rem" 
    //       }}
    //     >
    //       カメラ同期時刻
    //     </Typography>
    //   </Grid>
    //   <Grid size={{ xs: 6, sm: 8 }}>
    //     <Grid container>
    //       <Grid size={{ xs: 12, sm: 7 }} sx={{ textAlign: "right", mb: { xs: "0.5rem", sm: "0rem" } }}>
    //         <Typography 
    //           variant="subtitle2" 
    //           sx={{ 
    //             color: "text.secondary", 
    //             fontWeight:"bold", 
    //             fontSize: "0.9rem"
    //           }}
    //         >
    //           {currentTime}
    //         </Typography>
    //       </Grid>
    //       <Grid size={{ xs: 12, sm: 5 }} sx={{ textAlign: "right" }}>
    //         {
    //           primary &&
    //           <Button 
    //             disabled={!canApply || !current || isRecording}
    //             color={"primary"} 
    //             variant="contained" 
    //             sx={{width:130,fontWeight:"bold",borderRadius:1.5,height:35, p:0}}
    //             onClick={onClick}
    //           >
    //             {
    //               (canApply)
    //               ? <>現在時刻を設定</>
    //               : <CircularProgress sx={{color:"white"}} size={20}/>
    //             }
    //           </Button> 
    //         }
    //       </Grid>
    //     </Grid>
    //   </Grid>
    // </Grid>
  )
})

export { CurrentTimerPanel }