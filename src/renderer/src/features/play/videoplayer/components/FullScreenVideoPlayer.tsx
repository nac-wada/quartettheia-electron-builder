import { FC, useEffect, useMemo, useState } from "react";
import { Box, Card, createTheme, ThemeProvider } from "@mui/material";
import { ReplayController } from "./ReplayController";
import { FullScreenButton } from "../../../../components/FullScreenWindow";
import { FullscreenExit } from "@mui/icons-material";
import { VideoType } from "../../../../types/common";
import { ReactPlayerVideo } from "./ReactPlayerVideo";
import EmblaCarousel from "../../../../components/EmblaCarousel";
import { FullScreenVideoProps, ReplayFormViewModel } from "../types";

export const FullScreenVideoPlayer: FC<{
  id: string,
  opened: boolean,
  videos: VideoType[]
  viewModel: ReplayFormViewModel,
  download: any,
  stopdownload: any,
  downloading: boolean,
  openFullScreen: any,
  closeFullScreen: any,
  changeMode: any,
}> = (
  {
    id, 
    opened, 
    videos,
    viewModel,
    download,
    stopdownload,
    downloading,
    openFullScreen,
    closeFullScreen,
    changeMode
  }) => {
  const { replayFormState, setClipRange, reset, setMasterId, setDuration, setPlayed, setPlaying } = viewModel
  const theme = createTheme({ palette: { mode: 'dark' } })
  const [resize, setResize] = useState(false);
  const [display, setDisplay] = useState(false)
  
  let width = useMemo(() => {
    if(resize) {
      return (1936/1216) * window.innerHeight
    } else {
      return "100%"
    }
  },[resize])

  useEffect(() => {
    const getWindowSize = () => {
      const { innerHeight, innerWidth } = window
      if(innerHeight < innerWidth) {
        if(innerWidth/innerHeight > 1936/1216) {
          setResize(true)
        }
        else {
          setResize(false)
        }
      }
      else if(innerHeight > innerWidth) {
        setResize(false)
      }
    }

    window.addEventListener('resize', getWindowSize)
    document.addEventListener('fullscreenchange', getWindowSize)

    return () => {
      window.removeEventListener('resize', getWindowSize)
      document.removeEventListener('fullscreenchange', getWindowSize)
    }
  },[])

  return (
    <ThemeProvider theme={theme}>
      <Box id={id} sx={{ color: "white", zIndex: 1, display: "grid", placeItems: "center" }} onClick={e => e.stopPropagation()}>
      { opened &&
        <>
          {/* 映像部分 */}
          <Box sx={{ width: width }}>
            { replayFormState.options.singleMode ? 
              <SingleVideoMode 
                containerProps={{ videos, replayFormState, reset, setMasterId, setClipRange, setDuration, setPlayed, setPlaying }} 
                onClick={() => setDisplay(!display)}
                startIndex={replayFormState.masterId}
              /> : 
              
              <MultiVideoMode
                containerProps={{ videos, replayFormState, reset, setMasterId, setClipRange, setDuration, setPlayed, setPlaying }} 
                onClick={() => setDisplay(!display)}
                resize={resize}
              />
            }
          </Box>

          {/* コントローラー */}
          <Box sx={{ position: "absolute", bottom: `calc(0% + 16px)`, justifyItems: "center", width: "100%" }}>
            <Card
              sx={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                display: display ? "flex" : "none",
                borderRadius: "100px",
                mx: "5px"
              }}
            >
              <ReplayController
                id={id} 
                videos={videos} 
                viewModel={viewModel} 
                download={download} 
                stopdownload={stopdownload} 
                downloading={downloading}
                option={
                  <FullScreenButton 
                    opened={opened}
                    id={id} 
                    openFullScreen={openFullScreen} 
                    closeFullScreen={closeFullScreen} 
                    changeMode={() => {changeMode(true)}} 
                    icon={<FullscreenExit/>}
                    sx={{
                      color: "text.primary"
                    }} 
                    size="medium"
                  />
                }
              />
            </Card>
          </Box>   
        </>
      }
      </Box>
    </ThemeProvider>
  )
}

/* シングル再生モード */
const SingleVideoMode: FC<FullScreenVideoProps & { startIndex: number }> = ({ containerProps, onClick, startIndex }) => {
  const { videos, replayFormState, setPlaying, setDuration, setMasterId, setPlayed, setClipRange, reset } = containerProps

  return (
    <EmblaCarousel
      options={{
        startIndex: startIndex
      }}
      handleScrollNext={(index: number) => setMasterId(index)}
      handleScrollPrev={(index: number) => setMasterId(index)}
      handleSelect={(index: number) => setMasterId(index)}
      slides={
        [
          ...videos.map(({ ipv4Addr, src }, index) => (
            <Box key={ipv4Addr} sx={{ height: "100vh", position: "relative", alignContent: "center" }} onClick={onClick}>
              <ReactPlayerVideo
                src={src}
                id={index}
                state={replayFormState}
                setPlaying={setPlaying}
                setDuration={setDuration}
                setMasterId={setMasterId}
                setPlayed={setPlayed}
                setClipRange={setClipRange}
                style={{ position: "static" }}
              />
            </Box>
          ))
        ] 
      }
    >
    </EmblaCarousel>
  )
}

const MultiVideoMode: FC<FullScreenVideoProps & { resize: boolean }> = ({ containerProps, onClick, resize }) => {
  const { videos, replayFormState, setPlaying, setDuration, setMasterId, setPlayed, setClipRange, reset } = containerProps

  // const dummy = videos.slice(2)

  let gridTemplateColumns = useMemo(() => {
    if(videos.length > 8) {
      if(!resize) {
        return `repeat(2, 5fr)`
      } 
      return `repeat(5, 2fr)`
    }
    else if(videos.length > 6) {
      if(!resize) {
        return `repeat(2, 4fr)`
      } 
      return `repeat(4, 2fr)`
    } 
    else if(videos.length > 4) {
      if(!resize) {
        return `repeat(2, 3fr)`
      } 
      return `repeat(3, 2fr)`
    }
    else if(videos.length > 2) {
      return `repeat(2, 2fr)`
    }
    else if(videos.length > 1) {
      if(!resize) {
        return `repeat(1, 2fr)`
      } 
      return `repeat(2, 1fr)`
    }
    else {
      return `repeat(1, 1fr)`
    }
  },[videos, resize])

  return (
    <Box 
      sx={{ 
        width: "100%", 
        height: "100%",
        display: "grid",
        gridTemplateColumns: gridTemplateColumns,
      }}
      onClick={onClick}
    >
    {
      videos.map(({ipv4Addr, preview}, index) => (
        <Box key={ipv4Addr} sx={{ lineHeight: 0, position: "relative" }}>
          <ReactPlayerVideo
            src={preview}
            id={index}
            state={replayFormState}
            setPlaying={setPlaying}
            setDuration={setDuration}
            setMasterId={setMasterId}
            setPlayed={setPlayed}
            setClipRange={setClipRange}
            style={{ position: "static" }}
          />
        </Box>
      ))
    }
    </Box>
  )
}