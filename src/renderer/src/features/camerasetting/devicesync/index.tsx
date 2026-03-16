import { Box, Card, Divider, IconButton, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { FC, memo, useMemo, useState, } from "react";
import { DeviceSyncTxPowerButton } from "./components/DeviceSyncTxPowerButton";
import { CurrentTimerPanel } from "./components/CameraTimestamp";
import { DeviceSyncCfButton } from "./components/DeviceSyncCfButton";
import { MessageModal } from "../../../components/MessageModal";
import { useAppTheme } from "../../../globalContexts/AppThemeContext";
import { Close } from "@mui/icons-material";
import { CameraBootTimePanel } from "./components/CameraBootTime";
import { useDevices } from "../../../globalContexts/DeviceContext";
import Error from "@mui/icons-material/Error";
import { RecordingKeyStatus } from "../../../gen/quartet/v1/quartet_pb";
import { CustomCarouselModal2 } from "../../../components/CustomCarousel";
import { useCameraSync } from "./hooks/useCameraSync";
import { CameraSyncModalProps, CameraSyncProps } from "./types";
import { MessageModalProps } from "../../../types/common";

const CameraSync: FC<CameraSyncModalProps> = memo((props) => {
  const { appTheme } = useAppTheme()
  const { cameraSync, onClose, open } = props;
  const { nickname, primary, ipv4Addr, transport } = cameraSync
  const pairingViewModel = useCameraSync({ primary, open, transport, ipv4Addr })
  const { cameraSyncState, isEstablished, canApply, dialog, setSystemTimeFunc, getCurrentTimeFunc, setDeviceSyncCfFunc, openWarningDialogFunc, closeWarningDialogFunc, setDeviceSyncTxPowerFunc } = pairingViewModel
  const { currentTime, deviceSyncCf, deviceSyncTxPower, deviceBootTime } = cameraSyncState
  let borderColor = appTheme==='dark' ? grey[600] : grey[300]
  const [ helpDialog, setDialog ] = useState<MessageModalProps|null>(null)
  const { airealTouchRecording } = useDevices()
  const unEstablishedError: MessageModalProps = {
    event: 'warning',
    title: 'カメラ同期に失敗',
    content: `
              カメラ「${nickname}」が同期していません。<br>
              無線同期信号の周波数を変更するか、<br>
              親機カメラの配置や同期アンテナの向きを調整して、<br>
              カメラを同期させてください。
              `,
    onConfirmTitle: '閉じる',
    onConfirm: () => {
      setDialog(null)
    },
    onClose: () => {
      setDialog(null)
    }
  }

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
    <>
      <Card sx={{ border: 2, borderColor: borderColor, p: "0.5rem", width: { xs: "340px", sm: "520px" }, height: { xs: "400px", sm: "300px" }}}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography color="text.secondary" sx={{ fontWeight: "bold", display: "inline" }}>同期設定　{nickname}</Typography>
            <Box sx={{ display: { xs: "flex" }, alignItems: "center"}} >
              <Typography 
                variant="subtitle2" 
                fontWeight={"bold"} 
                color={isEstablished?"success":"error"} 
                sx={{
                  fontSize: "0.9rem", 
                  ml: "0rem",
                  display: isEstablished===null ? "none" : "inline",
                }}
              >
                { isEstablished ? `カメラは同期しています`:`カメラは同期していません`}
              </Typography>
              {
                (isEstablished==false) && 
                  <IconButton onClick={() => setDialog(unEstablishedError)} sx={{ p:0 }}>
                    <Error sx={{ color:"error.main", fontSize: 20}}/>
                  </IconButton>
              }
            </Box>
            {
              (isRecording && primary) &&
              <Typography 
                variant="subtitle2" 
                fontWeight={"bold"}  
                sx={{
                  fontSize: "0.9rem", 
                  ml: "0rem",
                  color: "grey",
                }}
              >
                録画中のため、設定できません
              </Typography>
            }
          </Box>

          <IconButton onClick={() => onClose(false)} title="閉じる">
            <Close/>
          </IconButton>
        </Box>

        <Divider sx={{my: 0.5}}/>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <CurrentTimerPanel
            isRecording={isRecording}
            canApply={canApply}
            primary={primary}
            setSystemTime={setSystemTimeFunc} 
            current={currentTime} 
            getCurrentTime={getCurrentTimeFunc} 
            openDialog={openWarningDialogFunc}
            closeDialog={closeWarningDialogFunc}
          />

          <CameraBootTimePanel bootTime={deviceBootTime}/>

          {
            primary &&
            <>
              <Box style={{ margin: "10px 0" }}>
                <DeviceSyncTxPowerButton
                  isRecording={isRecording}
                  deviceSyncTxPower={deviceSyncTxPower}
                  canApply={canApply}
                  openDialog={openWarningDialogFunc}
                  closeDialog={closeWarningDialogFunc}
                  setDeviceSyncTxPower={setDeviceSyncTxPowerFunc}
                />
              </Box>

              <Box style={{ margin: "10px 0" }}>
                <DeviceSyncCfButton 
                  isRecording={isRecording}
                  deviceSyncCf={deviceSyncCf} 
                  canApply={canApply}
                  openDialog={openWarningDialogFunc}
                  closeDialog={closeWarningDialogFunc}
                  setDeviceSyncCf={setDeviceSyncCfFunc}
                />
              </Box>
            </>
          }
        </Box>
        {/* <Box sx={{ display: "flex", justifyContent: "space-between", alignItems:"center" }}>
          <Box>
            <Typography color="text.secondary" sx={{ fontWeight: "bold", display: "inline" }}>同期設定</Typography>
            <Typography color="text.secondary" sx={{ fontWeight: "bold", ml: 0.5, display: "inline" }}>{nickname}</Typography>
            <Box sx={{ display: { xs: "flex" }, alignItems: "center"}} >
              <Typography 
                variant="subtitle2" 
                fontWeight={"bold"} 
                color={isEstablished?"success":"error"} 
                sx={{
                  fontSize: "0.9rem", 
                  ml: "0rem",
                  display: isEstablished===null ? "none" : "inline",
                }}
              >
                { isEstablished ? `カメラは同期しています`:`カメラは同期していません`}
              </Typography>
              {
                (isEstablished==false) && 
                  <IconButton onClick={() => setDialog(unEstablishedError)} sx={{ p:0 }}>
                    <Error sx={{ color:"error.main", fontSize: 20}}/>
                  </IconButton>
              }
            </Box>
            {
              (isRecording && primary) &&
              <Typography 
                variant="subtitle2" 
                fontWeight={"bold"}  
                sx={{
                  fontSize: "0.9rem", 
                  ml: "0rem",
                  color: "grey",
                }}
              >
                録画中のため、設定できません
              </Typography>
            }
          </Box>
          <IconButton onClick={() => onClose(false)} title="閉じる" sx={{ mx: 0.5 }}>
            <Close/>
          </IconButton>
        </Box>

        <Divider sx={{my:0.5}}/>

        <Box style={{ margin: "10px 0" }}>
            <CurrentTimerPanel
              isRecording={isRecording}
              canApply={canApply}
              primary={primary}
              setSystemTime={setSystemTimeFunc} 
              current={currentTime} 
              getCurrentTime={getCurrentTimeFunc} 
              openDialog={openWarningDialogFunc}
              closeDialog={closeWarningDialogFunc}
            />
        </Box>

        <Box style={{ margin: "10px 0 20px" }}>
          <CameraBootTimePanel bootTime={deviceBootTime}/>
        </Box>

        {
          primary &&
          <>
            <Box style={{ margin: "10px 0" }}>
              <DeviceSyncTxPowerButton
                isRecording={isRecording}
                deviceSyncTxPower={deviceSyncTxPower}
                canApply={canApply}
                openDialog={openWarningDialogFunc}
                closeDialog={closeWarningDialogFunc}
                setDeviceSyncTxPower={setDeviceSyncTxPowerFunc}
              />
            </Box>

            <Box style={{ margin: "10px 0" }}>
              <DeviceSyncCfButton 
                isRecording={isRecording}
                deviceSyncCf={deviceSyncCf} 
                canApply={canApply}
                openDialog={openWarningDialogFunc}
                closeDialog={closeWarningDialogFunc}
                setDeviceSyncCf={setDeviceSyncCfFunc}
              />
            </Box>
          </>
        } */}

      </Card>

      { dialog && <MessageModal message={dialog}/>}

      { helpDialog && <MessageModal message={helpDialog}/> }
    
    </>
  )
})

const CameraSyncModal: FC<{ 
  open: boolean, startIndex: number, onClose: any, cameraSyncs: CameraSyncProps[] 
}> = memo(({ open, startIndex, onClose, cameraSyncs }) => {

  return (
    <CustomCarouselModal2 
      options={{ startIndex: startIndex }} 
      slideWidth="100%" 
      open={open} 
      onClose={onClose}
      slides={
        cameraSyncs.map((cameraSync, index) => (
          <CameraSync key={index} cameraSync={cameraSync} onClose={onClose} open={open}/>
        ))
      }
    />
  )
})

export { CameraSyncModal }