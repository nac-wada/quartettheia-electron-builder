import { Transport } from "@connectrpc/connect";
import { FC, memo, useMemo } from "react";
import { Box, Card, Divider, IconButton, List, Slide, Typography } from "@mui/material";
import { useAppTheme } from "../../../globalContexts/AppThemeContext";
import { grey } from "@mui/material/colors";
import { Close } from "@mui/icons-material";
import { ConnectedNetwork } from "./components/ConnectedNetwork";
import { Accesspoint } from "./components/Accesspoint";
import { Loading } from "./components/Loading";
import { NetworkSwitch } from "./components/NetworkSwitch";
import { useNetworkSettingState } from "./hooks/useNetworkSetting";
import { useDevices } from "../../../globalContexts/DeviceContext";
import { RecordingKeyStatus } from "../../../gen/quartet/v1/quartet_pb";
import { CustomCarouselModal2 } from "../../../components/CustomCarousel";
import { NetworkSettingInfoProps } from "./types";

const WiFiSetting: FC<{
  netWorkSetting: NetworkSettingInfoProps,
  onClose: any,
  open: boolean
}> = memo(
  ({
    netWorkSetting,
    onClose,
    open
  }) => {
  const { nickname, transport, wifiTransport } = netWorkSetting
  const { appTheme } = useAppTheme()
  const { networkSettingState, switchEnableWiFi, selectOpenedCard, connectToNewWiFiNetwork, disconnectFromWiFiNetwork } = useNetworkSettingState(transport, open, wifiTransport)
  const { accesspoints, activeNetworkInterfaces, openedCard, isLoading, wifiEnabled, wifiAvailable } = networkSettingState
  const { airealTouchRecording } = useDevices()
  let borderColor = appTheme==='dark' ? grey[600] : grey[300]

  let disabled = activeNetworkInterfaces.some(({ interfaceName }) => interfaceName ==='eth0')===false || wifiAvailable===false

  let isRecording = useMemo(() => {
    if(
      airealTouchRecording===RecordingKeyStatus.RESERVED || 
      airealTouchRecording===RecordingKeyStatus.RECORDING || 
      airealTouchRecording===RecordingKeyStatus.RECORDED
    ) {
      return true
    } 
    else {
      return false
    }
  },[airealTouchRecording])
  
  return (
    <Card sx={{ border: 2, borderColor: borderColor, p: "0.5rem", minWidth: "340px", minHeight: "580px", position: "relative"}}>
      { isRecording && 
      <Box 
        sx={{ 
          width: "100%", 
          height: "100%", 
          position: "absolute", 
          top: 0, 
          left: 0, 
          backgroundColor: "rgba(0, 0, 0, 0.4)", 
          zIndex: 3,
          color: "white",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 18,
          display: "flex"
        }}
      >
        録画中のため設定できません
      </Box>}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems:"center" }}>
        <Typography color="text.secondary" sx={{ fontWeight: "bold", display: "inline" }}>ネットワーク設定　{nickname}</Typography>
        <IconButton onClick={onClose} title="閉じる" sx={{ zIndex: 4 }}>
          <Close/>
        </IconButton>
      </Box>

      {
        isLoading ?
        <Loading/> :
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Box>
            <NetworkSwitch enabled={wifiEnabled} onChange={switchEnableWiFi} disabled={disabled}/>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontWeight: "bold" }}>接続済みネットワーク</Typography>
            <List>
            {
              activeNetworkInterfaces.map((props, index) => (
                <ConnectedNetwork key={index} {...props} 
                  selectOpenedCard={selectOpenedCard} 
                  openedCard={openedCard} 
                  disconnectFromWiFiNetwork={disconnectFromWiFiNetwork}
                  disabled={disabled}
                />
              ))
            }
            </List>
          </Box>

          <Divider sx={{my: 0.5,}}/>

          <Typography color="text.secondary" sx={{ fontWeight: "bold" }}>周辺ネットワーク</Typography>
          {
            accesspoints.length ?
            <List sx={{ maxHeight: 250, overflowY: "auto", pb: "2rem"}}>
              <Slide in={true} timeout={{enter:1000}} direction="up">
                <Box>
                {
                  accesspoints.map((props, index) => (
                    <Accesspoint 
                      key={index} {...props} 
                      selectOpenedCard={selectOpenedCard} openedCard={openedCard} connectToNetWiFiNetwork={connectToNewWiFiNetwork}
                    />
                  ))
                }
                </Box>
              </Slide>
            </List> :
            <Typography color="text.secondary" sx={{ fontWeight: "bold", fontSize: 14, mt: "4rem", textAlign: "center" }}>なし</Typography>
          }

        </Box>
      }
    </Card>
  )
})

export const WiFiSettingModal: FC<{
  open: boolean, startIndex: number, onClose: any, networkSettings: NetworkSettingInfoProps[];
}> = memo(({ open, startIndex, onClose, networkSettings }) => {
  
  return (
    <CustomCarouselModal2 
      options={{ startIndex: startIndex }} 
      slideWidth="100%" 
      open={open} 
      onClose={onClose}
      slides={
        networkSettings.map((networkSetting, index) => (
          <WiFiSetting key={index} netWorkSetting={networkSetting} onClose={onClose} open={open}/>
        ))
      }
    />
  )
})