// src\components\License\LicenseCard.tsx
import { FC, useState } from "react";
import { Collapse, IconButton, ListItemButton, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import { license, LicenseDocument } from "..";
import { useAppTheme } from "../../../globalContexts/AppThemeContext";


type LicenseCardType = {
  index: number;
  id: string;
  license: license;
  category: string;
  update: any;
}


const LicenseCard: FC<LicenseCardType> = ({ index, id, license, category, update }) => {
  const [open, setOpen] = useState(false);
  const { appTheme } = useAppTheme();

  const handleClick = () => {
    setOpen(!open)
  }

  // ホームページを新規タブで開く
  const openInNewTab = (url: string|null) => {
    if(url !== null) {
      window.open(url, "_blank", "noreferrer")
    }
  }

  return (
    <>
      <ListItemButton
        id={id}
        sx={{
          borderTop:0.5,
          width:"100%",
          justifyContent:"space-between",
          borderColor: appTheme==='dark' ? grey[700] : '#E1E1E1',
        }}
        onClick={handleClick}
      >
        <Typography
          sx={{
            fontWeight: "bold",
          }}
        >
        {license.name}
        </Typography>
        <IconButton
          title={"ホームページに移動"}
          sx={{
            borderRadius:1,
            color:"primary.main",
            transform:"none",
            py:0.5,
            mx:0.2
          }}
          onClick={() => openInNewTab(license.url)}
        >
          <LaunchOutlinedIcon/>
        </IconButton>
      </ListItemButton>
      <Collapse in={open} timeout={"auto"} unmountOnExit>
        <LicenseDocument
          id={index}
          license={license}
          update={update}
          category={category}
        />
      </Collapse>
    </>
  )
}

export { LicenseCard }