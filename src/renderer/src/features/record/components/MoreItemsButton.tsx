import { IconButton, Menu, MenuItem, SxProps, Theme } from "@mui/material";
import { FC, memo, useMemo, useState } from "react";
import { MoreHoriz } from "@mui/icons-material";
import { useDevices } from "../../../globalContexts/DeviceContext";
import { RecordingKeyStatus } from "../../../gen/quartet/v1/quartet_pb";
import { PopperInputForm } from "./PopperInputForm";
import { updateMetaDatasFuncType } from "../types";

const MoreItemsButton: FC<{ id?: string, iconButtonSx?: SxProps<Theme>, menuSx?: SxProps<Theme>, sceneName: string, subjectID: string, updateMetaDatas: updateMetaDatasFuncType }> = memo(
  ({ id, iconButtonSx, menuSx, sceneName, subjectID, updateMetaDatas }) => {
  const [ open, setOpen ] = useState< "sceneName" | "subjectID" | null>(null);
  const { airealTouchRecording } = useDevices();
  const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
  const disabled = useMemo(() => {
    if(
      airealTouchRecording === RecordingKeyStatus.RECORDING ||
      airealTouchRecording === RecordingKeyStatus.RESERVED ||
      airealTouchRecording === RecordingKeyStatus.RECORDED
    ) { return true; } else { return false; }
  },[ airealTouchRecording ])
  const menuItems: { label: string, type: "sceneName" | "subjectID" | null }[] = [
    { label: "シーン変更", type: "sceneName"},
    { label: "被験者変更", type: "subjectID"},
  ]

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const closeMenu = () => {
    setAnchorEl(null);
  }

  const value = useMemo(() => {
    switch(open) {
      case "sceneName": return sceneName;
      case "subjectID": return subjectID;
      default: return "";
    }
  },[ open ])
  
  return (
    <>
      <IconButton onClick={openMenu} disabled={disabled} sx={iconButtonSx}>
        <MoreHoriz/>
      </IconButton>
      <Menu container={id ? document.getElementById(id) : null} id="fade-record-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{ ...menuSx }}
      >
      {
        menuItems.map(({ label, type }, index) => (
          <MenuItem key={index} sx={{ fontSize: 13 }} onClick={() => { setOpen(type) }}>{ label }</MenuItem>
        ))
      }
      </Menu>

      <PopperInputForm id={id} type={open} setOpen={setOpen} value={value} updateMetaDatas={updateMetaDatas}/>
    </>
  )
})

export { MoreItemsButton }