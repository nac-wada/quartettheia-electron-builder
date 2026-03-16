import { HdrAuto, HdrAutoOutlined, Refresh } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { FC, memo, useEffect, useState } from "react";

export const AutoModeIconButton: FC<{
  title: string,
  setParameterAuto: (autoMode: boolean) => void,
  autoMode: boolean
  disabled?: boolean
}> = memo(({
  title, setParameterAuto, autoMode, disabled
}) => {
  const [enable, setEnable] = useState(autoMode);

  useEffect(() => {
    setEnable(autoMode)
  },[autoMode])

  const onClick = (autoMode: boolean) => {
    setParameterAuto(!autoMode)
  }

  return (
    <IconButton disabled={disabled} title={title} aria-label="reset-values" onClick={() => onClick(enable)}>
      {enable ? <HdrAuto color='primary' /> : <HdrAutoOutlined />}
    </IconButton>
  )
})