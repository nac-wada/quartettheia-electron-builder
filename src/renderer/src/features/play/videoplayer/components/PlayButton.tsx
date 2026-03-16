import { FC, memo, useCallback } from "react";
import { IconButton } from "@mui/material";
import { Pause, PlayArrow } from "@mui/icons-material";

export const PlayButton: FC<{ playing: boolean, setPlaying: any }> = memo(({playing, setPlaying}) => {
  const onClick = useCallback((playing: boolean) => { setPlaying(!playing) }, [])
  
  return (
    <>
      <IconButton title={"再生"} onClick={() => { onClick(playing) }}>
        { playing ? <Pause sx={{color: "primary.main"}}/> : <PlayArrow sx={{color: "primary.main"}}/>}
      </IconButton>
    </>
  )
})