import { FC, memo, useCallback } from "react";
import { IconButton, Typography } from "@mui/material";
import { Replay, SkipNext, SkipPrevious } from "@mui/icons-material";
import { SkipButtonProps } from "../types";

export const Prev3sSkipButton: FC<SkipButtonProps & { played: number }> = memo(({ played, playing, setPlayed, setPlaying }) => {
  const onClick = useCallback((playing: boolean, played: number) => {
    setPlaying(false)
    if(played-3 <= 0) {
      setPlayed(0)
    }
    else {
      setPlayed(played-3)
    }
    setTimeout(() => { setPlaying(playing) }, 200)
  }, [])

  return (
    <>
      <IconButton title={"3秒スキップ"} onClick={() => { onClick(playing, played) }} sx={{ position: "relative" }}>
        <Replay/>
        <Typography sx={{ position: "absolute", bottom: `calc(50%-6px)`, left: `calc(50%-8px)`, fontSize: 8, fontWeight: "bold" }}>3</Typography>
      </IconButton>
    </>
  )
})

export const Next3sSkipButton: FC<SkipButtonProps & {duration: number | null, played: number}> = memo(({ played, playing, setPlayed, setPlaying, duration }) => {
  const onClick = useCallback((playing: boolean, played: number, duration: number | null) => {
    if(duration && played+3 >= duration) {
      setPlaying(false)
      setPlayed(duration)
      setTimeout(() => { setPlaying(playing) }, 200)
    }
    else { 
      setPlaying(false)
      setPlayed(played+3)
      setTimeout(() => { setPlaying(playing) }, 200)
    }
  }, [])

  return (
    <>
      <IconButton title={"3秒スキップ"} disabled={duration===null} onClick={() => { onClick(playing, played, duration) }} sx={{ position: "relative" }}>
        <Replay sx={{transform: `scale(-1, 1)`}}/>
        <Typography sx={{ position: "absolute", bottom: `calc(50%-6px)`, left: `calc(50%-8px)`, fontSize: 8, fontWeight: "bold" }}>3</Typography>
      </IconButton>
    </>
  )
})

export const SkipStartButton: FC<SkipButtonProps> = memo(({ playing, setPlayed, setPlaying }) => {
  const onClick = useCallback((playing: boolean) => {
    setPlaying(false)
    setPlayed(0)
    setTimeout(() => { setPlaying(playing) }, 200)
  }, [])

  return (
    <>
      <IconButton  title={"先頭移動"} onClick={() => { onClick(playing) }}>
        <SkipPrevious/>
      </IconButton>
    </>
  )
})

export const SkipEndButton: FC<SkipButtonProps & {duration: number | null}> = memo(({ playing, setPlayed, setPlaying, duration }) => {
  const onClick = useCallback((playing: boolean, duration: number | null) => {
    if(duration) {
      setPlaying(false)
      setPlayed(duration)
      setTimeout(() => { setPlaying(playing) }, 200)
    }
  }, [])

  return (
    <>
      <IconButton title={"末尾移動"} disabled={duration===null} onClick={() => { onClick(playing, duration) }}>
        <SkipNext/>
      </IconButton>
    </>
  )
})