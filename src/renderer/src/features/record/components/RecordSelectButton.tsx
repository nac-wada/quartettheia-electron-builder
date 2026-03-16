import { Badge, ButtonGroup, ClickAwayListener, Grow, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper, SxProps, Theme } from "@mui/material";
import { CSSProperties, FC, memo, useMemo, useRef, useState } from "react";
import { useDevices } from "../../../globalContexts/DeviceContext";
import { RecordingKeyStatus } from "../../../gen/quartet/v1/quartet_pb";
import { AlarmOffOutlined, AlarmOutlined } from "@mui/icons-material";
import { useAppTheme } from "../../../globalContexts/AppThemeContext";
import { saveSettingsToLocalStorage } from "../../../utilities/localStorage";
import { localStorage_autoRecord_time, recordModeMenuItems } from "../types";

const RecordSelectButton: FC<
{ id?: string,
  buttonGroupSx?: SxProps<Theme>, 
  iconButtonSx?: SxProps<Theme>, 
  badgeSx?: SxProps<Theme>,
  growStyle?: CSSProperties,
  menuListSx?: SxProps<Theme>,
  listItemIconSx?: SxProps<Theme>,
  settingTime: number,
  updateSelectRecordMode: any,
}> = memo(({ id, buttonGroupSx, iconButtonSx, badgeSx, growStyle, menuListSx, listItemIconSx, settingTime, updateSelectRecordMode }) => {
  const { airealTouchRecording } = useDevices();
  const { appTheme } = useAppTheme();
  const [ open, setOpen ] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);


  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleMenuItemClick = (
    setTime: number,
  ) => {
    updateSelectRecordMode(setTime)
    saveSettingsToLocalStorage(localStorage_autoRecord_time, setTime)
    setOpen(false);
  }

  const handleClose = (event: Event) => {
    if(
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false)
  }

  const disabled = useMemo(() => {
    if(
      airealTouchRecording === RecordingKeyStatus.RECORDING ||
      airealTouchRecording === RecordingKeyStatus.RESERVED ||
      airealTouchRecording === RecordingKeyStatus.RECORDED
    ) {
      return true;
    } else { return false; }
  },[ airealTouchRecording ])

  const muiBadgeSx = {
    "& .MuiBadge-badge": {
      position:"absolute",
      fontWeight:"bold",
      bottom: 5,
      right: 0,
      width: 8, height: 8, borderRadius: 10,
      fontSize: 10,
    },
  }

  return (
    <>
      <ButtonGroup title={"計測時間変更"} variant="contained" ref={anchorRef}
        sx={{
          boxShadow:"none",
          ".MuiButtonGroup-grouped:not(:last-of-type)": {
            borderColor: appTheme==='dark' ? "black" : "#FFFFFF",
          }, 
          ...buttonGroupSx 
        }}
      >
        <IconButton size="medium" disabled={disabled} 
          sx={{
            // border: 0.5,
            // mx: 0.25,
            // width: 50,
            // height: 50,
            // borderColor: isDarkMode ? grey[700] : '#E1E1E1',
            position:"relative",
            ...iconButtonSx 
          }} 
          onClick={handleToggle}
        >
        {
          settingTime === 300
          ? <AlarmOffOutlined/>
          : <Badge badgeContent={settingTime} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} 
              sx={{ ...muiBadgeSx, ...badgeSx }}
            >
              <AlarmOutlined/>
            </Badge>
        }
        </IconButton>
      </ButtonGroup>
      <Popper container={id ? document.getElementById(id) : null} sx={{ zIndex: 2, }} open={open} anchorEl={anchorRef.current} transition placement="top-start">
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{...growStyle}}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem sx={{ ...menuListSx }}>
                {
                  recordModeMenuItems.map(({ label, time }) => (
                    <MenuItem key={time} selected={time === settingTime} sx={{ fontSize: 14 }}
                      onClick={() => {handleMenuItemClick(time)}}
                    >
                    {
                      time === 300 
                      ? <ListItemIcon><AlarmOffOutlined sx={{...listItemIconSx}}/></ListItemIcon>
                      : <ListItemIcon>
                          <Badge badgeContent={time} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} 
                            sx={{ ...muiBadgeSx, ...listItemIconSx }}
                          >
                            <AlarmOutlined/>
                          </Badge>
                        </ListItemIcon>
                    }
                    <ListItemText ><div style={{ fontSize: 14 }}>{label}</div></ListItemText>
                    </MenuItem>
                  ))
                }
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
})

export { RecordSelectButton }