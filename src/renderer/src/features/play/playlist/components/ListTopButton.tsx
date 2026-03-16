import { FC, memo } from "react";
import { IconButton } from "@mui/material";
import { KeyboardArrowUpOutlined } from "@mui/icons-material";

export const ListTopButton: FC<{ scrollTop: () => void}> = memo((props) => {
  const { scrollTop } = props;
  
  return (
    <IconButton
      title={"一番上に移動"}
      sx={{
        width: 50,
        height: 50,
        position: "fixed",
        bottom: "20px",
        right: "20px",
        bgcolor: "skyblue",
        ":hover": {
          bgcolor: "skyblue"
        }
      }}
      onClick={() => scrollTop()}
    >
      <KeyboardArrowUpOutlined/>
    </IconButton>
  )
})
