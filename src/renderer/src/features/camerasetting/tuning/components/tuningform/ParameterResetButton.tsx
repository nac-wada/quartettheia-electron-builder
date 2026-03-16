import { Refresh } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { FC, memo } from "react";

export const ParameterResetButton: FC<{
  title: string,
  defaultValue: number,
  setParameterValue: (newValue: number) => void,
  disabled?: boolean,
}> = memo(({
  title, setParameterValue, defaultValue, disabled
}) => {

  const onClick = () => {
    setParameterValue(defaultValue)
  }

  return (
    <IconButton title={title} aria-label="reset-values" onClick={onClick} disabled={disabled}>
      <Refresh />
    </IconButton>
  )
})