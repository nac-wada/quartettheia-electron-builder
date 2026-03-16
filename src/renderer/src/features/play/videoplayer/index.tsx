import { FC, memo, useEffect } from "react"
import { Box, Card, Grow, IconButton } from "@mui/material"
import { Close } from "@mui/icons-material"
import { ReplayContainer } from "./components/ReplayContainer"
import { ReplayController } from "./components/ReplayController"
import { grey } from "@mui/material/colors"
import { useFullScreenState } from "../../../hooks/useFullScreenState"
import { FullScreenVideoPlayer } from "./components/FullScreenVideoPlayer"
import { useDrawer } from "../../../globalContexts/DrawerContext"
import { FullScreenStateType, VideoGroupType } from "../../../types/common"
import { useAppTheme } from "../../../globalContexts/AppThemeContext"
import { AppBarHeight, FooterHeight, MainAreaPaddingSpace } from "../../../types/common"
import { useReplayFormState } from "./hooks/useReplayFormState"
import { ReplayContainerProps } from "./types"
import { PlayListViewModel } from "../common"

export const  ReplayForm: FC<{
  count: number,
  viewModel: PlayListViewModel,
  close: () => void
}> = memo((props) => {
  const { viewModel, close } = props
  const { listState, downloadRecordedKeyFileGroupFunc, stopDownloadRecordedKeyFileGroupFunc } = viewModel
  const { items, activeItem } = listState
  const { drawerWidth } = useDrawer();

  let targetRecord = items.find(({ key }) => key === activeItem);

  return (
    <>
      {
        targetRecord &&
          <Box 
            sx={{
              textAlign: "center",
              width: "100%"/*{ xs: "100%", sm: `calc(100% - ${drawerWidth}px)` }*/, height: "100%", overflow: "auto",
              zIndex: 2, background: 'rgba(0, 0, 0, 0.7)', position: "fixed", 
              // top: 64, left: {xs: 0, sm: drawerWidth},
              // pt: 5,pb:25,
              top: 0, left: 0,
              pt: "64px", pl: `${drawerWidth}px`,
              display: "flex",
              flexDirection: "column"
            }}
            onClick={close}
          >
            <Box sx={{ width: "100%", height: "64px", display: "flex", alignItems: "center", justifyContent: "end", px: "1rem" }}>
              <IconButton title={"閉じる"}
                sx={{ 
                  color: "white", 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: 2,
                  borderColor: grey[700],
                  "&:hover": { backgroundColor: 'rgba(0, 0, 0, 0.9)'}
                }}
                onClick={close}
              >
                <Close/>
              </IconButton>
            </Box>
            <Box sx={{ flex: 1 }}>
              <VideoPlayer
                record={targetRecord} 
                download={() => downloadRecordedKeyFileGroupFunc({ item: targetRecord })} 
                stopdownload={() => stopDownloadRecordedKeyFileGroupFunc({ item: targetRecord })}
              />
            </Box>
              {/* <div style={{ display: "block", paddingTop: "60px" }}>
                <VideoPlayer 
                  record={targetRecord} 
                  download={() => {
                    downloadRecordedKeyFileGroupFunc({ item: targetRecord }) 
                  }} 
                  stopdownload={() => {
                    stopDownloadRecordedKeyFileGroupFunc({ item: targetRecord })
                  }}
                />
              </div>
              <IconButton title={"閉じる"}
                sx={{ 
                  color: "white", 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: 2,
                  borderColor: grey[700],
                  position: "absolute", top: 74, right: 10,
                  "&:hover": { backgroundColor: 'rgba(0, 0, 0, 0.9)'}
                }}
                onClick={close}
              >
                <Close/>
              </IconButton> */}
          </Box>
      }
    </>
  )
})

const VideoPlayer: FC<{
  record: VideoGroupType,
  download: () => void,
  stopdownload: () => void,
}> = memo((props) => {
  const { record, download, stopdownload } = props;
  const viewModel = useReplayFormState()
  const { replayFormState, reset, setMasterId, setClipRange, setDuration, setPlayed, setPlaying, setSeeking } = viewModel
  const { fullScreenState, openFullScreen, closeFullScreen, changeMode } = useFullScreenState()
  const fullScreenId = "replay-video"
  const { appTheme } = useAppTheme()

  const containerProps: ReplayContainerProps = {
    videos: record.video,
    replayFormState,
    reset, setMasterId, setClipRange, setDuration, setPlayed, setPlaying
  }

  const fullScreenProps: FullScreenStateType = { fullScreenState, openFullScreen, closeFullScreen, changeMode }

  useEffect(() => {
    if(replayFormState.control.duration) {
      setClipRange([0, replayFormState.control.duration])
    } 
  },[replayFormState.control.duration])

  useEffect(() => {
    reset()
  },[replayFormState.options.singleMode])

  return (
    <>
      {/* {
        (!fullScreenState.opened) &&
        <Grow in={true} style={{ transformOrigin: '50% 0 0' }} timeout={1000}>
          <Box 
            sx={{ 
              width: "100%", 
              minHeight: 0, 
              overflowY: "auto", 
              height: `calc(100vh - ${(AppBarHeight + FooterHeight + MainAreaPaddingSpace + MainAreaPaddingSpace + 64)}px)`,
              border: "solid 3px green"
            }}
          >
            
          </Box>
        </Grow>
      } */}
      {
        (!fullScreenState.opened) &&
        <Grow in={true} style={{ transformOrigin: '50% 0 0' }} timeout={1000}>
          <Box sx={{ width: "100%", height: "100%",  }}>
            <Box 
              sx={{ 
                width: "100%", 
                minHeight: 0, 
                overflowY: "auto", 
                height: {
                  xs: `calc(100vh - ${(AppBarHeight + FooterHeight + MainAreaPaddingSpace + MainAreaPaddingSpace + 84)}px)`,
                  sm: `calc(100vh - ${(AppBarHeight + FooterHeight + MainAreaPaddingSpace + MainAreaPaddingSpace + 64)}px)`
                },
                display: "flex",
                p: "5px",
              }}
            >
              <ReplayContainer {...containerProps} fullScreenId={fullScreenId} fullScreenProps={fullScreenProps}/>
            </Box>
            <Box sx={{ width: "100%", height: "auto", display: "flex", justifyContent: "center" }}>
              <Card 
                sx={{
                  borderRadius: { xs: "30px", sm: "100px"},
                  backgroundColor: "background.paper",
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
                  p: { xs: "2px",sm: "5px"},
                  mx: "15px",
                  display: "flex", 
                  alignItems: "center",
                  border: 2,
                  borderColor: appTheme==='dark' ? grey[600] : grey[200]
                }}
                onClick={(e) => e.stopPropagation()}
              >
                
                <ReplayController 
                  videos={record.video} 
                  viewModel={viewModel} 
                  download={download} 
                  stopdownload={stopdownload} 
                  downloading={record.downloading}
                />
                
              </Card> 
            </Box> 
          </Box>
        </Grow>
      }
      <FullScreenVideoPlayer 
        id={fullScreenId} 
        opened={fullScreenState.opened} 
        videos={record.video}
        viewModel={viewModel}
        download={download}
        stopdownload={stopdownload}
        downloading={record.downloading}
        openFullScreen={openFullScreen}
        closeFullScreen={closeFullScreen}
        changeMode={changeMode}
      />
    </>
  )
})

{/* <ReplayContainer {...containerProps} fullScreenId={fullScreenId} fullScreenProps={fullScreenProps}/>

          <div style={{ display: "flex", justifyContent: "center"}}>
            <Card 
              sx={{
                borderRadius: "65px",
                position: "fixed",
                bottom: "20px",
                backgroundColor: "background.paper",
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
                p: "5px",
                mx: "15px",
                display: "flex", 
                alignItems: "center",
                border: 2,
                borderColor: appTheme==='dark' ? grey[600] : grey[200]
              }}
              onClick={(e) => e.stopPropagation()}
            >
              
              <ReplayController 
                videos={record.video} 
                viewModel={viewModel} 
                download={download} 
                stopdownload={stopdownload} 
                downloading={record.downloading}
              />
              
            </Card>

          </div> */}