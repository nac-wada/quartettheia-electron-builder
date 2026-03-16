import { FC, memo, useCallback } from "react";
import { IconButton } from "@mui/material";
import { Repeat } from "@mui/icons-material";

export const LoopButton: FC<{ loop: boolean, setLoop: any }> = memo(({ loop, setLoop }) => {
  const onClick = useCallback((loop: boolean) => { setLoop(!loop) },[])
  
  return (
    <>
      <IconButton title={"ループ再生"} onClick={() => { onClick(loop) }}>
        <Repeat sx={{ color: loop ? "primary.main": null }}/>
      </IconButton>
    </>
  )
})