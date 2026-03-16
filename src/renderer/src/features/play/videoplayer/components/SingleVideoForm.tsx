import { Box, IconButton } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import { Circle } from "@mui/icons-material";
import { SingleVideoPanel } from "./SingleVideoPanel";
import { ReactPlayerVideo } from "./ReactPlayerVideo";
import { FullScreenStateType } from "../../../../types/common";
import { ReplayContainerProps } from "../types";

export const SingleVideoForm: FC<
  ReplayContainerProps & { 
    fullScreenProps: FullScreenStateType,
    fullScreenId: string
  }
> = ({ 
  videos, reset, replayFormState, setPlaying, setDuration, setMasterId, setPlayed, setClipRange, fullScreenProps, fullScreenId
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const { openFullScreen, closeFullScreen, changeMode, fullScreenState } = fullScreenProps
  const { opened } = fullScreenState

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi && emblaApi.scrollTo(index)
      setMasterId(index)
    },
    [emblaApi]
  )

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setMasterId(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    
    // 初回実行
    onSelect(emblaApi)
  }, [emblaApi, onSelect])

  return (
    // <Stack sx={{ margin: "0 auto", maxWidth: "1100px", alignItems: "center", flexDirection: { xs: "column", md: "row"}}} onClick={e => e.stopPropagation()}>
      
    //   <ChangePrevVideoButton nowId={masterId} setMasterId={setMasterId} videoLength={videos.length} sx={{ display: { xs: "none", md: "inline" }, }}/>
    //   {
    //       videos.map(({ipv4Addr, nickname, src, hasFrameDrops, hasUnstableSyncFrames}, index) => (
    //         <Grid key={ipv4Addr} size={{ xs: 12 }} sx={{display: masterId===index ? "block":"none", p: { xs: "1rem", md: "2rem" }, maxWidth: "1000px", margin: "0 auto", aspectRatio: 1936/1216}}>
    //           <VideoCard hasFrameDrops={hasFrameDrops} hasUnstableSyncFrames={hasUnstableSyncFrames} cardTitle={nickname} fullScreen={{opened, id: fullScreenId, open: openFullScreen, close: closeFullScreen, change: changeMode}}>
    //             <VideoComponent 
    //               id={index} 
    //               src={src} 
    //               state={replayFormState} 
    //               setPlaying={setPlaying} 
    //               setDuration={setDuration} 
    //               setMasterId={setMasterId} 
    //               setPlayed={setPlayed} 
    //               setClipRange={setClipRange}
    //             />
    //           </VideoCard>
    //         </Grid>
    //       ))
    //   }
    //   <ChangeNextVideoButton nowId={masterId} setMasterId={setMasterId} videoLength={videos.length} sx={{ display: { xs: "none", md: "inline" }, }}/>
      
    //   <Box sx={{ display: { xs: "block", md: "none" } }}>
    //     <ChangePrevVideoButton nowId={masterId} setMasterId={setMasterId} videoLength={videos.length} sx={{ mx: "2rem" }}/>
    //     <ChangeNextVideoButton nowId={masterId} setMasterId={setMasterId} videoLength={videos.length} sx={{ mx: "2rem" }}/>
    //   </Box>

    // </Stack>
    <Box sx={{ width: "100%", flex: 1, display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
      <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          <Box 
            sx={{ 
              overflow: "hidden", 
              flex: 1, // ここで残りの高さをすべて使う
              minHeight: 0 // 子要素が親を突き破るのを防ぐ
            }} 
            ref={emblaRef}
          >
            <Box sx={{ display: "flex", backfaceVisibility: 'hidden', touchAction: 'pan-y', height: "100%"}}>
            {videos.map(({ipv4Addr, nickname, src, hasFrameDrops, hasUnstableSyncFrames}, index) => (
              <Box 
                sx={{
                  // flex: '0 0 100%',
                  // minWidth: 0,
                  // display: 'flex',
                  // height: "100%", // 親の高さに合わせる
                  // alignItems: 'center',
                  // justifyContent: 'center',
                  // flexDirection: 'column', // 縦並びに強制
                  // backgroundColor: "rgba(0, 0, 0, 0)",
                  // fontSize: '2rem',
                  // fontWeight: 'bold',
                  // p: 1, // 少し余白があると見栄えが良い
                  flex: '0 0 100%',
                  minWidth: 0,
                  minHeight: 0,      // これがないと縦に伸び続ける
                  height: "100%",     // 親（Embla Container）の高さに合わせる
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: { xs: "0 2rem", sm: "0 10%" }
                }} 
                key={index}
              >
                <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <SingleVideoPanel 
                    key={ipv4Addr} 
                    hasFrameDrops={hasFrameDrops} 
                    hasUnstableSyncFrames={hasUnstableSyncFrames} 
                    cardTitle={nickname} 
                    fullScreen={{ opened, id: fullScreenId, open: openFullScreen, close: closeFullScreen, change: changeMode}}
                    setMasterId={() => setMasterId(index)}
                  >
                    <ReactPlayerVideo 
                      id={index} 
                      src={src} 
                      state={replayFormState} 
                      setPlaying={setPlaying} 
                      setDuration={setDuration} 
                      setMasterId={setMasterId} 
                      setPlayed={setPlayed} 
                      setClipRange={setClipRange}
                    />
                  </SingleVideoPanel>
                </Box>
              </Box>
            ))}
            </Box>
          </Box>
          <Box 
            sx={{
              display: "block",
              textAlign: "center",
              gap: "8px",
              padding: '8px 16px',
              borderRadius: '12px',
              backgroundColor: 'transparent', // 明示的に透明
              backgroundImage: 'none',
              height: "48px",
              flexShrink: 0,
            }}
          >
            {scrollSnaps.map((_, index) => (
              <IconButton 
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              >
                <Circle 
                  sx={{
                    width: 14, 
                    height: 14, 
                    color: selectedIndex===index ? "rgba(255, 255, 255, 0.9)": "rgba(255, 255, 255, 0.4)"
                  }}
                />
              </IconButton>
            ))}
          </Box>
        </Box>
        {/* {
          videos.map(({ipv4Addr, nickname, preview, hasFrameDrops, hasUnstableSyncFrames}, index) => (
            <SingleVideoPanel key={ipv4Addr} hasFrameDrops={hasFrameDrops} hasUnstableSyncFrames={hasUnstableSyncFrames} cardTitle={nickname} fullScreen={{ opened, id: fullScreenId, open: openFullScreen, close: closeFullScreen, change: changeMode}}>
              <VideoComponent 
                id={index} 
                src={preview} 
                state={replayFormState} 
                setPlaying={setPlaying} 
                setDuration={setDuration} 
                setMasterId={setMasterId} 
                setPlayed={setPlayed} 
                setClipRange={setClipRange}
              />
            </SingleVideoPanel>
          ))
        } */}
      </Box>
    </Box>
  )
}