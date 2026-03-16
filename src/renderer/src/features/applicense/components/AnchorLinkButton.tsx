import { IconButton } from "@mui/material"
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { FC } from "react";

type AnchorLinkButtonType = {
  link: string;
}

const AnchorLinkButton: FC<AnchorLinkButtonType> = ({
  link
}) => {
  return (
    <IconButton
      title={"一番上に移動"}
      sx={{
        width:50,
        height:50,
        position:"fixed",
        bottom:30,
        right:30,
        bgcolor:"skyblue",
        ":hover": {
          bgcolor: "skyblue"
        }
      }}
      onClick={() => {
        window.location.href = link
      }}
    >
      <KeyboardArrowUpOutlinedIcon />
    </IconButton>
  )
}

export { AnchorLinkButton }