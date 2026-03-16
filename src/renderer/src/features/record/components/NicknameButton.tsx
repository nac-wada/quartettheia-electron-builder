import { Theme } from "@emotion/react";
import { PriorityHighOutlined } from "@mui/icons-material";
import { IconButton, IconButtonProps, SxProps } from "@mui/material";
import { FC, memo } from "react";

const NicknameDisplayButton: FC<{ iconSx?: SxProps<Theme>} & IconButtonProps> = memo(
  ({iconSx, ...props}) => {
  return (
    <IconButton title="カメラ名表示" {...props}>
      <PriorityHighOutlined sx={{transform: `scale(1, -1)`, ...iconSx}}/>
    </IconButton>
  )
})

export { NicknameDisplayButton }