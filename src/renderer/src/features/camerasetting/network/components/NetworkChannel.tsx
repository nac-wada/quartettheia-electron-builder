import { Typography } from "@mui/material";
import { deepOrange, lightBlue } from "@mui/material/colors";
import { FC, memo } from "react";

export const NetworkChannel: FC<{ channel: number }> = memo(({ channel }) => {
  const style = {
    mr: "0.5rem", 
    maxHeight:24, 
    display: "inline", 
    fontSize:14,
    fontWeight:"bold",
    color:"text.secondary",
    borderRadius:1,
    px:0.5,
    py:0.25,
  }

  if(channel === 0) {
    return (<></>)
  } 
  else if(channel >=1 && channel <= 14) {
    return (
      <Typography sx={{...style, bgcolor:lightBlue[200]}}>
        2.4GHz
      </Typography>
    )
  } 
  else if(channel >=36 && channel <= 48) {
    return (
      <Typography sx={{...style, bgcolor:deepOrange[200]}}>
        5.2GHz
      </Typography>
    )
  } 
  else if(channel >=52 && channel <= 64) {
    return (
      <Typography sx={{...style, bgcolor:deepOrange[200]}}>
        5.3GHz
      </Typography>
    )
  } 
  else if(channel >=100 && channel <= 144) {
    return (
      <Typography sx={{...style, bgcolor:deepOrange[200]}}>
        5.6GHz
      </Typography>
    )
  } 
  else if(channel >=191 && channel <= 283) {
    return (
      <Typography sx={{...style, bgcolor:deepOrange[200]}}>
        6GHz
      </Typography>
    )
  } 
})