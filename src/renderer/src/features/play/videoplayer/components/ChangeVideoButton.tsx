import { Theme } from "@emotion/react";
import { ArrowForwardIosRounded } from "@mui/icons-material";
import { IconButton, SxProps } from "@mui/material";
import { FC, memo, useCallback } from "react";
import { ChangeVideoButonProps } from "../types";

const buttonSx = {
  width: 50, 
  height: 50, 
  color: "white", 
  backgroundColor: "#1976d2", 
  "&:hover":{ opacity: 0.9, backgroundColor: "#1976d2" }
}

export const ChangePrevVideoButton: FC<ChangeVideoButonProps> = memo(({ nowId, setMasterId, videoLength, sx }) => {
  const onClick = useCallback((now: number) => {
    if(now===0) { setMasterId(videoLength-1); return }
    setMasterId(now-1)
  },[])

  return (
    <IconButton
      disabled={videoLength===1}
      onClick={() => onClick(nowId)}
      sx={{
        mr: -2, ml: 1,
        transform: `scale(-1, 1)`,
        ...buttonSx,
        ...sx,
      }}
    >
      <ArrowForwardIosRounded sx={{ width: 15, height: 15 }}/>
    </IconButton>
  )
})

export const ChangeNextVideoButton: FC<ChangeVideoButonProps> = memo(({ nowId, setMasterId, videoLength, sx }) => {
  const onClick = useCallback((now: number) => {
    if(now===videoLength-1) { setMasterId(0); return }
    setMasterId(now+1)
  },[])

  return (
    <IconButton
      disabled={videoLength===1}
      onClick={() => onClick(nowId)}
      sx={{
        ml: -2, mr: 1,
        ...buttonSx,
        ...sx,
      }}
    >
      <ArrowForwardIosRounded sx={{ width: 15, height: 15 }}/>
    </IconButton>
  )
})