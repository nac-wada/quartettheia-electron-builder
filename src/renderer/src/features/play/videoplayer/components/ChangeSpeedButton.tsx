import { FC, memo, useCallback, useState } from "react";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { Check, SlowMotionVideo } from "@mui/icons-material";

export const PlaybackButton: FC<{
  id?: string, playbackRate: number, setPlaybackRate: any 
}> = memo(({id,playbackRate, setPlaybackRate}) => {
  const list = [2, 1.5, 1, 0.75, 0.5, 0.25]
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpened = Boolean(anchorEl)

  const openMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  },[])

  const onClose = useCallback(() => { setAnchorEl(null) },[])

  const changePlayback = useCallback((newValue: number) => { setPlaybackRate(newValue) },[])

  return (
    <>
      <IconButton title={"再生速度変更"} onClick={openMenu}>
        <SlowMotionVideo sx={{ color: playbackRate!==1 ? "primary.main":null }}/>
      </IconButton>
      <Menu container={id ? document.getElementById(id):null} anchorEl={anchorEl} open={menuOpened} onClose={onClose}>
      {
        list.map((value) => (
          <MenuItem key={value} sx={{ fontSize: 14 }} onClick={() => { changePlayback(value) }}>
            <ListItemIcon>
              {
                value===playbackRate ? 
                <Check sx={{color:"primary.main", width: 14, height: 14}} />: <></>
              }
            </ListItemIcon>
            x{value}  
          </MenuItem> 
        ))
      }
      </Menu>
    </>
  )
})