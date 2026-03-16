import { Box, Stack } from "@mui/material";
import { FC, memo, useMemo } from "react";

export const SeekContainer: FC<{played: number, duration: number | null} & {children: React.ReactNode}> = memo(({children, played, duration}) => {
  
  const currentTime = useMemo(() => {
    const current = Math.floor(played*1000)/1000;
    let m = String(Math.floor(current!%3600/60));
    let s = String((current%60).toFixed(3)).padStart(6, "0");
    return `${m}:${s}`
  }, [played])
  
  const remainTime = useMemo(() => {
    let remain = duration! - played
    let rm = String(Math.floor(remain!%3600/60))
    let rs = String((remain!%60).toFixed(3)).padStart(6, "0")
    return `${rm}:${rs}`
  }, [duration, played])
  
  return (
    <Stack direction={"row"} sx={{ display: "flex", alignItems: "center", pt: "0.5rem" }}>
      <Box sx={{fontSize: 12, mx: "1.5rem"}}>{currentTime}</Box>
      <div style={{ display: "inline-flex", width: "100%", flexDirection: "row", alignItems: "center", position: "relative"}}>
        {children}
      </div>
      <Box sx={{fontSize: 12, mx: "1.5rem"}}>{remainTime}</Box>
    </Stack>
  )
})