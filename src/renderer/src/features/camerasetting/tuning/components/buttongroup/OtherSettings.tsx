import { Box, Checkbox } from "@mui/material";
import { FC } from "react";
import SettingsIcon from '@mui/icons-material/Settings';

const OtherSettingInfo: FC<{
  index: number,
  setModal: any,
}> = ({ setModal, index }) => {

  return (
    <Box sx={{ mr: "0.2rem" }}>
      <Checkbox
        title={ "その他の設定" }
        icon={<SettingsIcon sx={{ color:"text.secondary" }}/>}
        checkedIcon={<SettingsIcon sx={{ color:"text.secondary" }}/>}
        size="small"
        sx={{
          opacity: 1,
          color: 'text.secondary',
          padding: '0.2rem',
          mr: "0.2rem",
        }}
        onClick={() => setModal({ index, type: "other" })}
      />
    </Box>
  )
}

export { OtherSettingInfo }