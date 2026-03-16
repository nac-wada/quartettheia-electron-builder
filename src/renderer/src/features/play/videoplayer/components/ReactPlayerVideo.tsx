import { CircularProgress } from "@mui/material";
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { OnProgressProps } from "react-player/base";
import { VideoComponentProps } from "../types";

export const ReactPlayerVideo: FC<VideoComponentProps> = memo(
  ({id, src, state, setDuration, setMasterId, setPlayed, setPlaying, setClipRange, progressInterval=250, style}) => {
  const { masterId, control, options } = state
  const ref = useRef<ReactPlayer>(null);
  const [ isLoading, setIsLoading ] = useState(true);
  const config = {
    file: {
      attributes: {
        preload:"auto",
        onContextMenu: (e: { preventDefault: () => any }) => e.preventDefault(),
        onCanPlayThrough: () => { setIsLoading(false) },
      }
    }
  }

  useEffect(() => {
    if(control.seeking) {
      ref.current?.seekTo(control.played, "seconds")
    }
    else if(!control.seeking && !control.playing) {
      ref.current?.seekTo(control.played, "seconds")
    }
  },[control.played])

  useEffect(() => { return () => { ref.current?.seekTo(0, "seconds") } },[])

  useEffect(() => { 
    if(ref.current) {
      let duration = ref.current?.getDuration()
      duration = Math.floor(duration*1000)/1000
      if(options.singleMode) {
        if(masterId===id) {
          setDuration(duration)
          setClipRange([0, duration])
        }
      }
      else {
        if(control.duration && control.duration < duration) {
          setDuration(duration)
          setMasterId(id)
          setClipRange([0, duration])
        }
      }
    }
  },[options.singleMode, masterId])

  const onReady = useCallback((seeking: boolean, masterId: number, player: ReactPlayer, id: number, duration: number|null, singleMode: boolean, playing: boolean) => {
    let _duration = player.getDuration()
    _duration = Math.floor(_duration*1000)/1000
    if(!singleMode) {
      if(duration === null) { 
        setDuration(_duration);
        setMasterId(id)
      }
      else if(duration < _duration) { 
        setDuration(_duration);
        setMasterId(id)
      }
    }
    else {
      if(masterId===id) {
        setDuration(_duration);
      }
    }
  },[])
  
  const onProgress = useCallback((masterId: number, id: number, state: OnProgressProps, seeking: boolean, loop: boolean) => {
    if(id !== masterId) { return; }
    if(!seeking) {
      setPlayed(state.playedSeconds)
      if(state.played===1 && loop) { 
        setTimeout(() => {setPlaying(true)}, 100)
      }
    }
  },[])
  
  const onEnded = useCallback((masterId: number, id: number, played: number, duration: number | null) => {
    if (id !== masterId) { return; }
    if(duration!==null && played > duration) {
      setPlayed(duration)
    }
    setPlaying(false)
  },[])

  const playing = useMemo(() => {
    if(!options.singleMode) {
      return control.playing
    }
    else {
      if(masterId===id) {
        return control.playing
      }
      else {
        return false
      }
    }
  },[options.singleMode, masterId, id, control.playing,])

  return (
    <>
    {isLoading && <CircularProgress size={100} sx={{ color: "white", position: "absolute", top: `calc(50% - 50px)`, left: `calc(50% - 50px)`}}/>}
    <ReactPlayer 
      playsinline
      progressInterval={progressInterval}
      controls={false} 
      playing={playing}
      playbackRate={options.playbackRate}
      ref={ref} 
      url={src} 
      src={src} 
      config={config}
      onReady={(player: ReactPlayer) => {
        onReady(control.seeking, masterId, player, id, control.duration, options.singleMode, control.playing) 
      }}
      onProgress={(state: OnProgressProps) => {
        onProgress(masterId, id, state, control.seeking, options.loop)
      }}
      onEnded={() => {
        onEnded(masterId, id, control.played, control.duration)
      }}
      onError={(err) => {
        console.log(err)
      }}
      width={"100%"}
      height={"100%"}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "contain",
        ...style
      }}
    />
    </>
  )
})