import { FC, useEffect, useMemo } from "react"
import { grey } from "@mui/material/colors";
import { useDevices } from "../../globalContexts/DeviceContext";
import { useAppTheme } from "../../globalContexts/AppThemeContext";
import { Box, Grow } from "@mui/material";
import { RecordController } from "./components/RecordController";
import { RecStatusLabel } from "./components/RecStatuslabel";
import { NicknameDisplayButton } from "./components/NicknameButton";
import { useRecordViwerState } from "./hooks/useRecordViewState";
import { useFullScreenState } from "../../hooks/useFullScreenState";
import { useCalibrationEngine } from "../../hooks/useCalibrationEngine";
import { AppBarHeight, FooterHeight, FULLSCREEN_ID, MainAreaPaddingSpace } from "../../types/common";
import { useCalibratorDetectionMode } from "../../hooks/useCalibratorDetectionMode";
import { useSetCalibratorWarning } from "../../hooks/useCalibratorWarning";
import { FullScreenContainer } from "../../components/FullScreenContainer";
import { FullScreenButton } from "../../components/FullScreenWindow";
import { DndContainer } from "../../components/DndContainer";
import { CustomToolbar } from "../../components/ToolBar";
import { MessageModal } from "../../components/MessageModal";
import { RecordCameraPanel } from "./components/RecordCameraPanel";
import { RecordControllerProps } from "./types";

const RecordView: FC = () => {
  const calibratorDetectionMode = useCalibratorDetectionMode()
  const calibratorWarning = useSetCalibratorWarning({ calibratorDetectionMode　})
  const { devices, airealTouchRecording } = useDevices();
  const { recordViewerState, getRecordingStatus, recControl, updateMetaDatas, updateSelectRecordMode, changeShowNickName, openMessage, closeMessage } = useRecordViwerState()
  const { setTime, recordTime, sceneName, subjectID, showNickname, message } = recordViewerState;
  const { fullScreenState, openFullScreen, closeFullScreen, changeMode } = useFullScreenState()
  const { appTheme } = useAppTheme();
  const isCalibration = useCalibrationEngine()

  const defaultSx = {
    button: {
      border: 2,
      borderColor: appTheme==='dark' ? grey[600] : grey[300],
    },
    textField: {
      '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: 1,
        border: 2,
        borderColor: appTheme==='dark' ? grey[600] : grey[300]
      },
    },
    counter: {
      border: 2,
      borderColor: appTheme==='dark' ? grey[600] : grey[300],
      mx: 0.25,
    }
  }

  const fullScreenSx = {
    button: {
      border: 2,
      borderColor: grey[600],
      mx: 0.25,
      backgroundColor: "black",
      ":hover": {
        backgroundColor: "rgba(0,0,0,0.5)"
      }
    },
    textField: {
      backgroundColor: "black",
      '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: 1,
        border: 2,
        borderColor: grey[600]
      },
    },
    counter: {
      border: 2,
      borderColor: grey[600],
      mx: 0.25,
      backgroundColor: "black",
    }
  }

  useEffect(() => {

    getRecordingStatus({ settingTime: setTime, status: airealTouchRecording })
  
  },[ airealTouchRecording ])

  const controllerProps: RecordControllerProps = {
    isCalibBusy: isCalibration,
    recControl: () => recControl({ settingTime:setTime, sceneName, subjectID, devices }),
    setTime,
    recordTime,
    sceneName,
    subjectID,
    updateMetaDatas,
    updateSelectRecordMode,
    fullScreenID: FULLSCREEN_ID
  }

  let gridTemplateColumns = useMemo(() => {
    if(devices.length===1) return `repeat(1, 1fr)`
    if(devices.length > 6) { 
      return { xs: `repeat(2, 1fr)`, lg: `repeat(4, 2fr)` }
    } 
    else if(devices.length > 4) {
      return { xs: `repeat(2, 1fr)`, lg: `repeat(3, 2fr)` }
    }
    else if(devices.length > 2) {
      return `repeat(2, 1fr)`
    }
    else if(devices.length > 1) {
      return `repeat(2, 1fr)`
    }
  },[devices.length])

  return (
    <>
      <FullScreenContainer 
        fullScreenProps={{
          id: FULLSCREEN_ID,
          fullScreen: { fullScreenState, openFullScreen, closeFullScreen, changeMode },
          header: <RecStatusLabel sx={{position: "absolute", top: 20, right: 20}}/>,
          visible: showNickname,
          footer: 
            <RecordController
              {...controllerProps}
              option={
                <>
                  <NicknameDisplayButton 
                    sx={fullScreenSx.button} 
                    iconSx={{ color: showNickname ? "primary.main": null }} 
                    onClick={() => { changeShowNickName({ isShow: !showNickname }) }}
                  />
                  
                  {/* {(!sm) && <MoreItemsButton id={FULLSCREEN_ID} sceneName={sceneName} subjectID={subjectID} updateMetaDatas={updateMetaDatas} iconButtonSx={fullScreenSx.button}/>} */}
                  
                  <FullScreenButton 
                    opened={fullScreenState.opened} 
                    id={FULLSCREEN_ID} 
                    openFullScreen={openFullScreen} 
                    closeFullScreen={closeFullScreen} 
                    changeMode={() => {changeMode(true)}}
                    sx={fullScreenSx.button}
                    size="medium"
                  /> 
                </>
              }
              buttonSx={fullScreenSx.button}
              textFieldSx={fullScreenSx.textField}
              counterSx={fullScreenSx.counter}
            />
        }}
      >
        <>
          <Grow 
            in={true} 
            style={{ transformOrigin: '50% 0 0'}}
            timeout={1000}
          >

            <Box
              sx={{ 
                width: "100%", 
                minHeight: 0,
                overflowY: "auto",
                height: `calc(100vh - ${(AppBarHeight + FooterHeight + MainAreaPaddingSpace + MainAreaPaddingSpace)}px)`, 
                display: "flex", 
                flexDirection: "column", 
                p: "5px",
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }
              }}
            >
              <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
                <Box 
                  sx={{ 
                    width: "100%", 
                    height: "100%",
                    display: "flex", 
                    justifyContent: "center", 
                  }}
                >
                  <Box 
                    sx={{ 
                      display: "grid", 
                      gap: "10px",
                      gridTemplateColumns: gridTemplateColumns,
                      height: "100%", 
                    }}
                  >
                    <DndContainer items={devices}>
                    {
                      devices.map(({ id, ipv4Addr, nickname, transport, macAddr }, i) => (
                        <RecordCameraPanel
                          key={id}
                          videoId={`record_${ipv4Addr}`}
                          deviceProps={{ id, nickname, ipv4Addr, transport, macAddr }}
                          fullScreen={{
                            id: FULLSCREEN_ID,
                            open: fullScreenState.opened,
                            openFullScreen: openFullScreen,
                            closeFullScreen: closeFullScreen,
                            changeMode: () => {changeMode(false, ipv4Addr)}
                          }}
                        />
                      ))
                    } 
                    </DndContainer>
                  </Box>
                </Box>
              </div>
            </Box>
          </Grow>

          <CustomToolbar>
            
            <RecordController
              {...controllerProps}
              buttonSx={defaultSx.button}
              textFieldSx={defaultSx.textField}
              counterSx={defaultSx.counter}
            />

          </CustomToolbar>

        </>
      </FullScreenContainer>
      { message && <MessageModal message={message} id={FULLSCREEN_ID}/> }

      { calibratorWarning && <MessageModal message={calibratorWarning}/>}
    </>
  )
}

export { RecordView }