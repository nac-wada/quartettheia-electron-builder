import { Card, Switch, Typography } from "@mui/material";
import { FC, memo } from "react";
import { useAppTheme } from "../../../../globalContexts/AppThemeContext";
import { grey } from "@mui/material/colors";

export const NetworkSwitch: FC<{ enabled: boolean, onChange: any, disabled: boolean }> = memo(({ enabled, onChange, disabled }) => {
  const { appTheme } = useAppTheme()
  let borderColor = appTheme==='dark' ? grey[600] : grey[300]

  return (
    <Card sx={{boxShadow: "none", p: "0.25rem", borderRadius: 10, border: 1, borderColor: borderColor, display: "flex", justifyContent: "space-between", alignItems:"center"}}>
      <Typography color="text.secondary" sx={{ fontWeight: "bold", mx: "1rem", display: "inline" }}>Wi-Fi</Typography>
      <Switch checked={enabled} disabled={disabled} onChange={() => onChange(enabled)}/>
    </Card>
  )
})