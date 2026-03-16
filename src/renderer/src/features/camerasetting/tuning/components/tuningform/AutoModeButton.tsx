import { Button } from "@mui/material";
import { FC, memo, useEffect, useState } from "react";

export const AutoModeButton: FC<{
  btnTitle: string,
  setParameterAuto: (autoMode: boolean) => void,
  autoMode: boolean
  disabled?: boolean
}> = memo(({
  btnTitle,
  setParameterAuto,
  autoMode,
  disabled
}) => {
  const [enable, setEnable] = useState(autoMode)

  useEffect(() => {
    setEnable(autoMode)
  },[autoMode])

  const onClick = (autoMode: boolean) => {
    setParameterAuto(!autoMode)
  }

  return (
    <Button
      disabled={disabled} 
      sx={{ 
        textTransform: 'none', 
        color: "text.primary" 
      }} 
      onClick={() => onClick(enable)}
    >
      {btnTitle}
    </Button>
  )
})