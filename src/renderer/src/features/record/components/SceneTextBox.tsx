import { FC, memo, useEffect, useMemo, useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { useDevices } from "../../../globalContexts/DeviceContext";
import { RecordingKeyStatus } from "../../../gen/quartet/v1/quartet_pb";
import { saveSettingsToLocalStorage } from "../../../utilities/localStorage";
import { localStorage_scene, updateMetaDatasFuncType } from "../types";

const SceneNameTextBox: FC<{ sceneName: string, isCalibBusy: boolean, updateMetaDatas: updateMetaDatasFuncType} & TextFieldProps> = memo(
  ({sceneName, isCalibBusy, updateMetaDatas, ...props}) => {
  const [value, setValue] = useState(sceneName);
  const { airealTouchRecording } = useDevices()

  useEffect(() => {
    setValue(sceneName)
  },[sceneName])

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>,) => {
    let value = event.target.value;
    updateMetaDatas(value, "sceneName");
    saveSettingsToLocalStorage(localStorage_scene, value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      let e = event as unknown as React.ChangeEvent<HTMLInputElement>;
      let value = e.target.value;
      updateMetaDatas(value, "sceneName");
      saveSettingsToLocalStorage(localStorage_scene, value);
    }
  };

  const onChange = (event: React.FocusEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    setValue(newValue);
  }

  const disabled = useMemo(() => { 
    if(
      airealTouchRecording === RecordingKeyStatus.RECORDING || 
      airealTouchRecording === RecordingKeyStatus.RESERVED || 
      airealTouchRecording === RecordingKeyStatus.RECORDED || 
      isCalibBusy
    ){ 
      return true
    } else {
      return false
    }
  }, [airealTouchRecording, isCalibBusy])
  
  return (
    <TextField 
      autoComplete="off" id="outlined-basic-scene"
      slotProps={{ htmlInput: { maxLength: 32 } }}
      disabled={disabled}
      label="シーン" variant="outlined"
      size="small"
      value={value}
      // defaultValue={sceneName}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onChange={onChange}
      sx={{
        // display: { xs: "none", sm: "inline-block" },
        display: "inline-block",
        mx: 0.25,
        borderRadius: 1,
        height: 40,
        width: 100,
        '&:hover .MuiOutlinedInput-notchedOutline': {
          border: '2px solid', // ホバー時に枠線表示
          borderColor: 'primary.main'
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          border: '2px solid', // フォーカス時に枠線表示
          borderColor: 'primary.main'
        },
        "& .MuiInputBase-input": {
          overflow: "hidden",
          textOverflow: "ellipsis"
        },
        ...props.sx
      }}
    />
  )
})

export {SceneNameTextBox}
