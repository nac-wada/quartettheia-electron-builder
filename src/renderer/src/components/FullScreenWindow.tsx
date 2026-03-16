import { Box, createTheme, IconButton, IconButtonProps, SxProps, Theme, ThemeProvider, Typography } from "@mui/material"
import React, { FC, memo, useEffect, useMemo, useState } from "react"
import { useDevices } from "../globalContexts/DeviceContext"
import { Fullscreen, FullscreenExit } from "@mui/icons-material"
import { MessageModal } from "./MessageModal"
import { CameraLive2 } from "./Live"
import EmblaCarousel from "./EmblaCarousel"
import { NicknameDisplayButton } from "../features/record/components/NicknameButton"
import { FULLSCREEN_ID, MessageModalProps } from "../types/common"
import { grey } from "@mui/material/colors"
import { CustomToolbar } from "./ToolBar"
import { closeFullScreenFuncType, FullScreenStateType, openFullScreenFuncType } from "../types/common"

const FullScreenButton: 
  FC<{ 
    opened: boolean, 
    id: string, 
    changeMode: any, 
    openFullScreen: openFullScreenFuncType, 
    closeFullScreen: closeFullScreenFuncType, 
    icon?: React.ReactNode, 
    sx?: SxProps<Theme>,
    handleClick?: () => void,
  } & IconButtonProps> = memo(
  ({ id, openFullScreen, closeFullScreen,  changeMode, icon, sx, opened, handleClick, ...props }) => {
  const element = document.getElementById(id);
  const [ message, setMessage ] = useState<MessageModalProps | null>();

  const unableScreenFullWarning: MessageModalProps = {
    event: 'warning',
    content: 'このブラウザは対応していません。',
    onConfirmTitle: '閉じる',
    onClose: () => {
      setMessage(null)
    },
    onConfirm: () => {
      setMessage(null)
    }
  }

  const error: MessageModalProps = {
    event: 'error',
    content:  `
               エラーが発生しました。<br>
               アプリを再読み込みしてください。
              `,
    onConfirmTitle: '閉じる',
    onClose: () => {
      setMessage(null)
    },
    onConfirm: () => {
      setMessage(null)
    }
  }

  useEffect(() => {
    document.addEventListener("fullscreenchange", () => {
      try{
        if(!document.fullscreenElement) {
          closeFullScreen()
        } else {
          openFullScreen()
        }
      } catch (e){
        setMessage(error)
      }
    })
  },[])

  const toggleFullScreen = () => {
    try {
      if(!document.fullscreenElement) {
        element?.requestFullscreen();
        changeMode()
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (!document.fullscreenEnabled) {
        setMessage(unableScreenFullWarning)
      }
    } catch (e) {
      setMessage(error)
    }
  }

  return (
    <>
      <IconButton title="全画面表示" 
        onClick={() => { 
          handleClick && handleClick()
          toggleFullScreen() 
        }} 
        sx={sx} 
        size="small" 
        {...props}
      >
        {
          opened ? <FullscreenExit color="inherit"/> : <Fullscreen color="inherit"/>
        }
      </IconButton>
      
      {
        message && <MessageModal message={message}/>
      }

    </>
  )
})

export interface FullScreenProps {
  id: string, 
  fullScreen: FullScreenStateType,
  header?: React.ReactNode, 
  body?: React.ReactNode, 
  footer?: React.ReactNode, 
  visible?: boolean
}

const FullScreen: FC<FullScreenProps> = memo(
  ({ id, fullScreen, header, body,  footer, visible=false}) => {
  const { fullScreenState, openFullScreen, closeFullScreen, changeMode } = fullScreen
  const [ isDisplay, setIsDisplay ] = useState(false)
  const [ showNickname, setShowNickname ] = useState(false);
  const [ resize, setResize ] = useState(false); // デバイス向き判定
  const { devices } = useDevices();
  const displayNumber = useMemo(() => { return(devices.map((v) => v.ipv4Addr).indexOf(fullScreenState.index ?? "")) }, [fullScreenState.index])
  const body_style = {
    top: 0, 
    left: 0,
    height: "100vh", zIndex: 2, 
    // backgroundColor: isDisplay ? 'rgba(0, 0, 0, 0.2)': 'rgba(0, 0, 0, 0)',
    width: "100%"
  }

  const width = useMemo(() => { if(resize) { return (1936/1216) * window.innerHeight } else { return "100%" }}, [resize])
  
  let gridTemplateColumns = useMemo(() => {
    if(devices.length > 8) {
      if(!resize) {
        return `repeat(2, 5fr)`
      } 
      return `repeat(5, 2fr)`
    }
    else if(devices.length > 6) {
      if(!resize) {
        return `repeat(2, 4fr)`
      } 
      return `repeat(4, 2fr)`
    } 
    else if(devices.length > 4) {
      if(!resize) {
        return `repeat(2, 3fr)`
      } 
      return `repeat(3, 2fr)`
    }
    else if(devices.length > 2) {
      return `repeat(2, 2fr)`
    }
    else if(devices.length > 1) {
      if(!resize) {
        return `repeat(1, 2fr)`
      } 
      return `repeat(2, 1fr)`
    }
    else {
      return `repeat(1, 1fr)`
    }
  },[devices, resize])

  useEffect(() => {
    const getWindowSize = () => {
      const { innerHeight, innerWidth } = window;
      if(innerHeight < innerWidth) {
        if(innerWidth/innerHeight > 1936/1216) {
          setResize(true);
        } else {
          setResize(false)
        }
      } else if(innerHeight > innerWidth) {
        setResize(false)
      }
    }

    window.addEventListener("resize",getWindowSize)

    document.addEventListener("fullscreenchange",getWindowSize)

    return () => {
      window.removeEventListener('resize', getWindowSize)
      document.removeEventListener('fullscreenchange', getWindowSize)
    }

  },[])

  

  const Screen = () => {
    return (
      <EmblaCarousel
        options={{
          startIndex: displayNumber
        }}
        slides={
          [
            ...devices.map(({ transport, ipv4Addr, nickname }) => (
              <Box 
                key={`default_${id}_${ipv4Addr}`} 
                onMouseMove={() => setIsDisplay(true)} 
                sx={{ 
                  position: "relative",
                  height: "100vh",
                  alignContent: "center"
                }}
              >
                <CameraLive2 
                  videoProps={{ 
                    style: { position: "static" }, 
                    width: "100%", 
                    height: "100%" 
                  }} 
                  transport={transport} 
                  videoId={`${id}_${ipv4Addr}`}
                />
                <Box 
                  sx={{
                    position: "absolute", 
                    ...body_style
                  }}
                >
                  <Typography 
                    sx={{
                      color: "#000000",
                      WebkitTextStrokeWidth: 1,
                      WebkitTextStrokeColor: "white",
                      fontSize: "1.5rem", 
                      display: (visible === true) ? "inline-block" : (showNickname ? "inline-block" : "none"),
                      mx: "0.7rem"
                    }}
                  >
                    {nickname}
                  </Typography>
                  { body }
                </Box>
              </Box>
            )),
            MultiMode()
          ]
        }
      />
    )
  }

  const MultiMode = () => {

    return (
      <Box
        onMouseMove={() => setIsDisplay(true)} 
        sx={{ 
          height: "100vh",
          alignContent: "center",
          display: "grid",
          gridTemplateColumns: gridTemplateColumns
        }}
      >
        {
          devices.map(({ transport, ipv4Addr, nickname }) => (
            <Box 
              key={`multi_${id}_${ipv4Addr}`} 
              sx={{ 
                lineHeight: 0, 
                position: "relative",
              }}
            >
              <CameraLive2 
                videoProps={{ 
                  style: { position: "static" }, 
                  width: "100%", 
                  height: "100%" 
                }} 
                transport={transport} 
                videoId={`${id}_multi_${ipv4Addr}`}
              />
              <Box 
                key={`multi_${id}_${ipv4Addr}_body`} 
                sx={{
                  position: "absolute", 
                  ...body_style
                }}
              >
                <Typography 
                  sx={{
                    color: "#000000",
                    WebkitTextStrokeWidth: 1,
                    WebkitTextStrokeColor: "white",
                    fontSize: "1.5rem", 
                    display: (visible === true) ? "inline-block" : (showNickname ? "inline-block" : "none"),
                    mx:"0.7rem"
                  }}
                >
                  {nickname}
                </Typography>
                { body }
              </Box>
            </Box>
          ))
        }
      </Box>
    )
  }

  const overlay_style = {
    backgroundColor:'rgba(0, 0, 0, 0.2)',
    display: isDisplay ? "flex" : "none", 
    justifyContent: "center", 
    alignItems: "center",
    width: "100%", height: "4rem", 
    zIndex: 2,
  }

  const Overlay = () => {
    return (
      <>
        <div style={{position: "absolute", top: 0, boxShadow: "0px 5px 20px 20px rgba(0, 0, 0, 0.2)",...overlay_style}}>
          { header }
        </div>
        {/* <div style={{position: "absolute", bottom: 0, boxShadow: "0px -5px 20px 20px rgba(0, 0, 0, 0.2)", marginBottom: `calc(env(safe-area-inset-bottom) + 24px)`, ...overlay_style}}> */}
        <CustomToolbar sx={{ backgroundColor:'rgba(0, 0, 0, 0.2)', display: isDisplay ? "flex" : "none", justifyContent: footer ? "flex-start" : "center" }}>
          { footer ?? 
            <>
              <NicknameDisplayButton 
                sx={{
                  border: 2,
                  borderColor: grey[600],
                  backgroundColor: "black",
                  ":hover": {
                    backgroundColor: "rgba(0,0,0,0.5)"
                  }
                }} 
                iconSx={{ color: showNickname ? "primary.main": null }} 
                onClick={() => setShowNickname(!showNickname)}
              />

              <FullScreenButton
                opened={fullScreenState.opened} 
                id={FULLSCREEN_ID} 
                openFullScreen={openFullScreen} 
                closeFullScreen={closeFullScreen}
                changeMode={changeMode}
                sx={{ 
                  border: 2,
                  borderColor: grey[600],
                  backgroundColor: "black",
                  ":hover": {
                    backgroundColor: "rgba(0,0,0,0.5)"
                  }
                }}
                size="medium"
              />
            </>
          }
        </CustomToolbar>
      </>
    )
  }

  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <Box id={id} sx={{ zIndex: 1, display: "grid", placeItems: "center", color: "white"}}>
        { fullScreenState.opened &&  
          <>
            <Box sx={{ width: width, margin: "0 auto" }} onClick={() => { setIsDisplay(!isDisplay) }}>
              {Screen()}
            </Box>
            { Overlay() }
          </>
        }
      </Box>
    </ThemeProvider>
  )
})

export { FullScreen, FullScreenButton }