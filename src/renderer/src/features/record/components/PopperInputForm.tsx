import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { FC, memo, useEffect, useMemo, useState } from "react"
import { saveSettingsToLocalStorage } from "../../../utilities/localStorage"
import { localStorage_scene, localStorage_subjectID, updateMetaDatasFuncType } from "../types";

const PopperInputForm: FC<{id?: string, type: "sceneName" | "subjectID" | null, setOpen: any, value: string, updateMetaDatas: updateMetaDatasFuncType }> = memo(
  ({id, type, setOpen, value, updateMetaDatas }) => {
  const [ text, setText ] = useState(value);

  useEffect(() => {
    setText(value);
  },[value])

  const onChange = (event: React.FocusEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    setText(newValue);
  }

  const closeInputForm = () => {
    setOpen(null)
  }

  const updateValue = () => {
    const localStorage = type === "sceneName" ? localStorage_scene : localStorage_subjectID
    saveSettingsToLocalStorage(localStorage, text);
    switch(type) {
      case "sceneName": updateMetaDatas(text, type); break;
      case "subjectID": updateMetaDatas(text, type); break; 
    }
    closeInputForm();
  }

  const label = useMemo(() => { 
    switch(type) {
      case "sceneName": return "シーン";
      case "subjectID": return "被験者";
      default: return "";
    }
  }, [ type ])
  
  return (
    <Dialog container={id ? document.getElementById(id) : null} open={ type !== null } onClose={closeInputForm}>
      <DialogTitle>名前変更</DialogTitle>
      <DialogContent>
        <TextField 
          autoComplete="off"
          autoFocus
          color="primary"
          variant="standard"
          margin="normal"
          fullWidth
          label={label}
          type="text"
          sx={{ "& .MuiInputBase-input": {  overflow: "hidden", textOverflow: "ellipsis" } }}
          InputLabelProps={{ shrink: true,}}
          value={text}
          onChange={onChange}
          onKeyDown={(e) => { if(e.key === "Enter") { updateValue() } }}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={updateValue} disabled={value.length === 0}>保存</Button>
        <Button color="inherit" onClick={closeInputForm}>閉じる</Button>
      </DialogActions>
    </Dialog>
  )
})

export { PopperInputForm }