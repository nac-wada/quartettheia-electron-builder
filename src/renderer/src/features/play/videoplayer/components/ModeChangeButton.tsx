import { FC, memo, useCallback } from "react";
import { IconButton } from "@mui/material";
import { CropSquare, GridView } from "@mui/icons-material";

export const ModeChangeButton: FC<{ singleMode: boolean, setChangeMode: any }> = memo(({ singleMode, setChangeMode }) => {
  
  const onClick = useCallback((singleMode:boolean) => {
    setChangeMode(!singleMode)
  },[])
  
  return (
    <>
      <IconButton title={singleMode ? "マルチ再生画面を開く": "シングル再生画面を開く"} onClick={() => { onClick(singleMode) }}>
      { singleMode ? <GridView/> : <CropSquare/> }
      </IconButton>
    </>
  )
})