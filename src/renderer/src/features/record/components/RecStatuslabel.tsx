import { FC, memo } from "react";
import { useDevices } from "../../../globalContexts/DeviceContext";
import { RadioButtonChecked } from "@mui/icons-material";
import { Typography, TypographyProps } from "@mui/material";
import { RecordingKeyStatus } from "../../../gen/quartet/v1/quartet_pb";

const RecStatusLabel: FC<TypographyProps> = memo((props) => {
  const { airealTouchRecording } = useDevices();
  
  return (
    <Typography
      style={{ 
        display: airealTouchRecording === RecordingKeyStatus.RECORDING || airealTouchRecording === RecordingKeyStatus.RESERVED ? "flex" : "none", 
        flexDirection: "row", 
        alignItems: "center"
      }} 
      {...props}
    >
      <RadioButtonChecked sx={{ display: "inline", color: 'red', fontSize: "1.5rem"}}/>
      <Typography sx={{ display: "inline", color: 'red', marginLeft: '0.2rem',fontWeight:"bold", fontSize: "1.5rem"}}>REC</Typography>
    </Typography>
  )
})

export { RecStatusLabel }