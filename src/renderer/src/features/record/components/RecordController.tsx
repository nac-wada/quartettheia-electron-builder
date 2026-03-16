import { FC, memo } from "react";
import { RecordButton } from "./RecordButton";
import { RecTimer } from "./RecTimer";
import { SceneNameTextBox } from "./SceneTextBox";
import { SubjectIDTextBox } from "./SubjectIDTextBox";
import { Divider } from "@mui/material";
import { RecordSelectButton } from "./RecordSelectButton";
import { RecordControllerProps } from "../types";

export const RecordController: FC<RecordControllerProps> = memo(({
  isCalibBusy, recControl, setTime, recordTime, sceneName, subjectID, 
  updateMetaDatas, updateSelectRecordMode, 
  fullScreenID,
  buttonSx, textFieldSx, counterSx,
  option,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <RecordButton isCalibBusy={isCalibBusy} sx={buttonSx}
        onMouseUp={recControl}
      />

      <RecTimer setTime={setTime} currTime={recordTime} sx={counterSx}/>

      <SceneNameTextBox sceneName={sceneName} isCalibBusy={isCalibBusy} updateMetaDatas={updateMetaDatas} sx={textFieldSx}/>
  
      <SubjectIDTextBox subjectID={subjectID} isCalibBusy={isCalibBusy} updateMetaDatas={updateMetaDatas} sx={textFieldSx}/>

      <Divider orientation="vertical" flexItem sx={{ m: 0.5}} />

      <RecordSelectButton id={fullScreenID} settingTime={setTime} updateSelectRecordMode={updateSelectRecordMode} iconButtonSx={buttonSx}/>

      { option }  
    </div>
  )
})