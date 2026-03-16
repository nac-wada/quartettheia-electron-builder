import { Box, Card, Divider, IconButton, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { FC, memo } from "react";
import { FactoryResetButton } from "./components/FactoryResetButton";
import { useOtherSetting } from "./hooks/useOtherSetting";
import { DeviceAutoBootModeOnPowerSupplyButton } from "./components/DeviceAutoBootModeOnPowerSupplyButton";
import { MessageModal } from "../../../components/MessageModal";
import { useAppTheme } from "../../../globalContexts/AppThemeContext";
import { Close } from "@mui/icons-material";
import { RecordingAutoRemoveButton } from "./components/RecordingAutoRemoveButton";
import { CustomCarouselModal2 } from "../../../components/CustomCarousel";
import { OtherSettingType } from "./types";

const OtherSetting: React.FC<{
  otherSetting: OtherSettingType;
  onClose: any;
  open: boolean;
}> = React.memo((props) => {
  const { otherSetting, onClose, open } = props;
  const { nickname } = otherSetting
  const otherSettingViewModel = useOtherSetting({ open: open, transport: otherSetting.transport })
  const { otherSettingState, openWarningDialogFunc, closeWarningDialogFunc, setDeviceAutoBootModeOnPowerSupplyFunc, executeFactoryResetFunc, setRecordingAutoRemoveEnabledFunc } = otherSettingViewModel
  const { deviceAutoBootModeAPIStatus, deviceAutoBootModeOnPowerSupply, recordingAutoRemoveEnabled, recordingAutoRemoveEnabledAPIStatus, dialogProps } = otherSettingState
  const { appTheme } = useAppTheme()
  let borderColor = appTheme==='dark' ? grey[600] : grey[300]

  return (
    <>
      <Card sx={{ border: 2, borderColor: borderColor, p: "0.5rem", pb: "20px", width: { xs: "340px", sm: "520px" }, display: "flex", flexDirection: "column", gap: "10px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems:"center" }}>
          <Typography color="text.secondary" sx={{ fontWeight: "bold", display: "inline" }}>その他の設定　{nickname}</Typography>
          <IconButton onClick={() => onClose(false)} title="閉じる">
            <Close/>
          </IconButton>
        </Box>

        <Divider sx={{my:0.5}}/>

        <Box>
          <DeviceAutoBootModeOnPowerSupplyButton
            onPowerSupply={deviceAutoBootModeOnPowerSupply}
            deviceAutoBootModeAPIStatus={deviceAutoBootModeAPIStatus}
            openDialog={openWarningDialogFunc}
            closeDialog={closeWarningDialogFunc}
            setDeviceAutoBootModeOnPowerSupply={setDeviceAutoBootModeOnPowerSupplyFunc}
          />
        </Box>

        <Box>
          <RecordingAutoRemoveButton
            recordingAutoRemoveEnabled={recordingAutoRemoveEnabled}
            recordingAutoRemoveEnabledAPIStatus={recordingAutoRemoveEnabledAPIStatus}
            openDialog={openWarningDialogFunc}
            closeDialog={closeWarningDialogFunc}
            setRecordingAutoRemoveEnabled={setRecordingAutoRemoveEnabledFunc}
          />
        </Box>

        <Box>
          <FactoryResetButton
            openDialog={openWarningDialogFunc}
            closeDialog={closeWarningDialogFunc}
            factoryReset={executeFactoryResetFunc}
          />
        </Box>

      </Card>

      { dialogProps && <MessageModal message={dialogProps}/>}
    </>
  )
})

const OtherSettingModal: FC<{ open: boolean, startIndex: number, onClose: any, otherSettings: OtherSettingType[] }> = memo(({ open, startIndex, onClose, otherSettings }) => {
  
  return (
    <CustomCarouselModal2 
      options={{ startIndex: startIndex }} 
      slideWidth="100%" 
      open={open} 
      onClose={onClose}
      slides={
        otherSettings.map((otherSetting, index) => (
          <OtherSetting key={index} otherSetting={otherSetting} onClose={onClose} open={open}/>
        ))
      }
    />
  )
})

export { OtherSettingModal }