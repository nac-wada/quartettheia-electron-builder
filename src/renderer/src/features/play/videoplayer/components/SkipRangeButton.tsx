import { FC, memo, useCallback } from "react";
import { IconButton } from "@mui/material";
import { Room } from "@mui/icons-material";
import { SkipRangeButtonProps } from "../types";

export const SkipRangeStartButton: FC<SkipRangeButtonProps & { duration: number | null }> = memo(({
  played, 
  clipRange, 
  duration,
  setClipRange,
  minDistance
}) => {
  
  const onClick = useCallback((played: number, clipRange: number[] | null, duration: number | null) => {
    if(clipRange && duration) {
      if(played > clipRange[1]) { 
        if(duration - played < minDistance) {
          setClipRange([duration - minDistance, duration])
        }
        else {
          setClipRange([played, duration])
        }
      }
      else {
        if(clipRange[1] - played < minDistance) {
          setClipRange([played, played + minDistance])
        }
        else {
          setClipRange([played, clipRange[1]])
        }
      }
    }
  },[])

  return (
    <>
      <IconButton title={"再生位置にクリッピング始点を移動"} disabled={clipRange===null || duration ===null} onClick={() => { onClick(played, clipRange, duration) }}>
        <Room/>
      </IconButton>
    </>
  )
})

export const SkipRangeEndButton: FC<SkipRangeButtonProps> = memo(({
  played, 
  clipRange, 
  setClipRange,
  minDistance
}) => {
  
  const onClick = useCallback((played: number, clipRange: number[] | null) => {
    if(clipRange) {
      if(played < clipRange[0]) {
        if(played < minDistance) {
          setClipRange([0, minDistance])
        }
        else {
          setClipRange([0, played])
        }
      }
      else {
        if(played - clipRange[0] < minDistance) {
          setClipRange([played - minDistance, played])
        }
        else {
          setClipRange([clipRange[0], played])
        }
      }
    }
  },[])

  return (
    <>
      <IconButton title={"再生位置ににクリッピング終点を移動"} disabled={clipRange===null} onClick={() => { onClick(played, clipRange) }}>
        <Room/>
      </IconButton>
    </>
  )
})