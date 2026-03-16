import { Slider } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { FC, memo, useCallback, useEffect, useState } from "react";

export const CustomSeekbar: FC<{ 
  value:{ played: number, clipRange: number[], duration: number}, 
  control: {setSeeking: any, setPlayed: any, setClipRange: any},
  minDistance: number,
}> = memo(({ value, control, minDistance }) => {
  const { played, clipRange, duration } = value;
  const { setSeeking, setPlayed, setClipRange } = control;

  const onSeekChange = useCallback((event: Event, value: number | number[], activeThumb: number) => {
    setSeeking(true)
    setPlayed(value as number);
  },[])

  const onSeekChangeCommitted = useCallback((event: React.SyntheticEvent | Event, value: number | number[]) => {
    setPlayed(value as number);
    setSeeking(false)
  },[])

  const onRangeSeekChangeCommitted = useCallback((event: React.SyntheticEvent | Event, value: number | number[]) => {
    setSeeking(false)
  },[])

  const onRangeSeekChange = useCallback((event: Event, newValue: number | number[], activeThumb: number) => {
    setSeeking(true)
    const value = newValue as number[];
    if(value[1] - value[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(value[0], 100 - minDistance)
        setPlayed(clamped)
        const range = [clamped, clamped + minDistance]
        setClipRange(range)
      } else {
        const clamped = Math.max(value[1], minDistance);
        const range = [clamped - minDistance, clamped]
        setPlayed(clamped)
        setClipRange(range)
      }
    } else {
      const value = newValue as number[];
      if(value[activeThumb] === 1){
        setPlayed(duration)
      } else {
        setPlayed(value[activeThumb])
      }
      setClipRange(value)
    }
  },[]) 
  
  return (
    <>
      <Slider
        sx={{ 
          height: { xs: 10, md: 15 }, color: "primary.main", flexGrow: 1,
          "& .MuiSlider-rail": { zIndex: 3, color: grey[500] }, 
          "& .MuiSlider-track": { zIndex: 3, transition: "none", color: '#82b1ff' }, 
          "& .MuiSlider-thumb": { 
            zIndex: 5, transition: "none", color: "white", height: { xs: 20, md: 30 }, width: { xs: 20, md: 30 }
          } 
        }}
        value={clipRange}
        min={0.0}
        max={duration}
        step={0.01}
        onChange={onRangeSeekChange}
        onChangeCommitted={onRangeSeekChangeCommitted}
      />
      <Slider
        sx={{
          height: { xs: 10, md: 15 }, position: "absolute", 
          "& .MuiSlider-rail": { opacity: 0, zIndex: 4 }, 
          "& .MuiSlider-track": { opacity: 0, transition: "none", zIndex: 4 },
          "& .MuiSlider-thumb": { transition: "none", color: "primary.main", zIndex: 6, height: { xs: 14, md: 20 }, width: { xs: 14, md: 20 } }
        }}
        value={played}
        min={0.0}
        max={duration}
        step={0.01}
        onChange={onSeekChange}
        onChangeCommitted={onSeekChangeCommitted}
      />
    </>
  )
})