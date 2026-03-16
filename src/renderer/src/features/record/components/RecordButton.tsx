import { FC, memo, useMemo } from "react";
import { RadioButtonChecked, StopCircleOutlined } from "@mui/icons-material";
import { IconButton, IconButtonProps, keyframes, SxProps, Theme } from "@mui/material";
import { useDevices } from "../../../globalContexts/DeviceContext";
import { RecordingKeyStatus } from "../../../gen/quartet/v1/quartet_pb";
import { grey } from "@mui/material/colors";

const RecordButton: FC< {isCalibBusy: boolean, iconSx?: SxProps<Theme>} & IconButtonProps> = memo(({isCalibBusy, iconSx, ...props}) => {
  const { airealTouchRecording } = useDevices();
  const disabled = useMemo(() => {
    if(isCalibBusy || airealTouchRecording === RecordingKeyStatus.RECORDED) 
    { return true; } else { return false; } 
  },[ airealTouchRecording, isCalibBusy ])

  const flash = keyframes`
    100% { opacity: 1; }
    50% { opacity: 0.3 }
  `
  const icon = () => {
    switch(airealTouchRecording) {
      case RecordingKeyStatus.RECORDING: return (<StopCircleOutlined sx={{ animation: `${flash} 1.5s linear infinite` }}/>);
      case RecordingKeyStatus.RESERVED: return (<StopCircleOutlined sx={{ animation: `${flash} 1.5s linear infinite` }}/>);
      case RecordingKeyStatus.RECORDED: return (<StopCircleOutlined sx={{ animation: `${flash} 1.5s linear infinite` }}/>);
      default: return (<RadioButtonChecked sx={{ color: "red" }}/>)
    }
  }

  const title = useMemo(() => {
    switch(airealTouchRecording) {
      case RecordingKeyStatus.RESERVED:
        return `撮影停止`;
      case RecordingKeyStatus.RECORDING:
        return `撮影停止`;
      default:
        return `撮影開始`;
    }
  },[airealTouchRecording])

  return (
    <IconButton title={title} disabled={disabled} 
      {...props} 
    >
    {
      isCalibBusy ? <RadioButtonChecked sx={{ color: grey[400], ...iconSx }}/> : <>{icon()}</>
    } 
    </IconButton>
  )
})

export { RecordButton }