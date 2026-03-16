import { SignalWifi1Bar, SignalWifi1BarLock, SignalWifi2Bar, SignalWifi2BarLock, SignalWifi3Bar, SignalWifi3BarLock, SignalWifi4Bar, SignalWifi4BarLock } from "@mui/icons-material";
import { SvgIconProps } from "@mui/material";
import { FC, memo } from "react";

export const NetworkSignal: FC<{signal: number, securities: string[]} & SvgIconProps> = memo(({ signal, securities, ...props }) => {
    if(signal < 41) {
      if(securities.length !== 0) {
        return <SignalWifi1BarLock fontSize="large" sx={{color: 'text.secondary', ...props.sx }}/>
      } else {
        return <SignalWifi1Bar fontSize="large" sx={{color: 'text.secondary', ...props.sx }}/>
      }
    } else if(signal > 40 && signal < 61 ) {
      if(securities.length !== 0) {
        return <SignalWifi2BarLock fontSize="large" sx={{color: 'text.secondary', ...props.sx }}/>
      } else {
        return <SignalWifi2Bar fontSize="large" sx={{color: 'text.secondary', ...props.sx }}/>
      }
    } else if(signal > 60 && signal < 81 ) {
      if(securities.length !== 0) {
        return <SignalWifi3BarLock fontSize="large" sx={{color: 'text.secondary', ...props.sx }}/>
      } else {
        return <SignalWifi3Bar fontSize="large" sx={{color: 'text.secondary', ...props.sx }}/>
      }
    } else if(signal > 80 && signal <= 100 ) {
      if(securities.length !== 0) {
        return <SignalWifi4BarLock fontSize="large" sx={{color: 'text.secondary', ...props.sx }}/>
      } else {
        return <SignalWifi4Bar fontSize="large" sx={{color: 'text.secondary', ...props.sx }}/>
      }
    }
  }
)