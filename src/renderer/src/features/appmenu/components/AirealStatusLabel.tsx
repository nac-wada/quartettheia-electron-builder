import { Box, CircularProgress, Typography } from "@mui/material"
import { useDevices } from "../../../globalContexts/DeviceContext"
import { MessageType, RecordingKeyStatus } from "../../../gen/quartet/v1/quartet_pb";
import { useEffect, useMemo } from "react";
import { RadioButtonChecked } from "@mui/icons-material";
import { useSoloSubscribeEventListener } from "../../../globalContexts/SoloSubscribeEventContext";
import { AIREAL_TOUCH_RECORDINGKEY, ApplicationMessageType } from "../../../types/common";
import { CalibratorDetectionMode, EventType, SubscribeEventResponse } from "../../../gen/solo/v1/solo_pb";
import { useNotifications } from "../../../globalContexts/NotificationContext";
import { useMessages } from "../../../globalContexts/MessagesContext";
import { ApplicationMessageEvent } from "../../../types/common";
import { quartetGetRecordingKeyStatus } from "../../../api/quartetAPI";
import { useDeviceSyncStatusResults } from "../hooks/useDeviceSyncStatusResults";
import { soloGetIntrinsicCalibrationSnapshotsCount } from "../../../api/soloAPI";
import { useCalibrationEngine } from "../../../hooks/useCalibrationEngine";
import { useCalibratorDetectionMode } from "../../../hooks/useCalibratorDetectionMode";

const RecordingEventBatch = () => {
  const { airealTouchRecording, devices, updateAirealTouchRecordingStatus } = useDevices()
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener()
  const calibDetectionMode = useCalibratorDetectionMode();
  const isCalibration = useCalibrationEngine()
  const { addNotification } = useNotifications()
  const { addMessage } = useMessages()
  useDeviceSyncStatusResults()
  const recordedFileHasDroppedFrames: Omit<ApplicationMessageType, 'messageId'> = {
    type: ApplicationMessageEvent["RECORDED_FILE_HAS_DROPPED_FRAMES_ERROR"],
    title: "警告",
    content: `
                フレームドロップが発生したカメラがあったため、<br>
                同期録画できなかった可能性があります。<br>
                再度、撮影をやり直すことを推奨します。
              `,
    onConfirmTitle: '閉じる',
    onConfirm: () => {} 
  }

  const recordedFileHasUnstableSyncFrames: Omit<ApplicationMessageType, 'messageId'> = {
    type: ApplicationMessageEvent["RECORDED_FILE_HAS_UNSTABLE_SYNC_FRAMES_ERROR"],
    title: "警告",
    content: `
              同期していないカメラがあったため、<br>
              同期録画できなかった可能性があります。<br>
              再度、撮影をやり直すことを推奨します。
            `,
    onConfirmTitle: '閉じる',
    onConfirm: () => {}
  }

  let value = useMemo(() => {
    if(isCalibration) {
      return "CALIBRATING"
    }
    else if(
      airealTouchRecording===RecordingKeyStatus.RECORDING ||
      airealTouchRecording===RecordingKeyStatus.RESERVED
    ) {
      return "RECORDING"
    }
    else if(
      calibDetectionMode===CalibratorDetectionMode.LFRAME_COPLANAR_4PT ||
      calibDetectionMode===CalibratorDetectionMode.LFRAME_NON_COPLANAR_5PT 
    ) {
      return "LFRAME MODE"
    }
    else if(
      calibDetectionMode===CalibratorDetectionMode.TWAND_I_FORM_1PT ||
      calibDetectionMode===CalibratorDetectionMode.TWAND_T_FORM_2PT
    ) {
      return "TWAND MODE"
    }
    else {
      return "STANDBY"
    }
  },[airealTouchRecording, isCalibration, calibDetectionMode])

  let statusIcon = useMemo(() => {
    if(isCalibration) {
      return <CircularProgress thickness={6} size={16} sx={{ color: "#1bb710ff", mr: "0.2rem" }}/>
    }
    else if(
      airealTouchRecording === RecordingKeyStatus.RECORDING || 
      airealTouchRecording === RecordingKeyStatus.RESERVED ||
      calibDetectionMode===CalibratorDetectionMode.LFRAME_COPLANAR_4PT ||
      calibDetectionMode===CalibratorDetectionMode.LFRAME_NON_COPLANAR_5PT ||
      calibDetectionMode===CalibratorDetectionMode.TWAND_I_FORM_1PT ||
      calibDetectionMode===CalibratorDetectionMode.TWAND_T_FORM_2PT
    ) {
      return <RadioButtonChecked fontSize={"small"} sx={{ color: 'red', mr: "0.2rem" }}/>
    }
    else {
      return <></>
    }
  },[airealTouchRecording, isCalibration, calibDetectionMode])

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    const getAirealTouchRecordKeyStatus = async (status: RecordingKeyStatus) => {
      const res = await quartetGetRecordingKeyStatus({ key: AIREAL_TOUCH_RECORDINGKEY });
      if(res) {
        if(res.status===status) {
          updateAirealTouchRecordingStatus(res.status) 
        }
      }
    }

    devices.forEach(({ ipv4Addr, nickname, transport }) => {
      const listener = async (event: SubscribeEventResponse) => {
        const currTime = new Date().toLocaleString();
        switch(event.type) {
          case EventType["CALIB_EXTRINSIC_IMAGE_SNAPPED"]:
          case EventType["CALIB_INTRINSIC_IMAGE_SNAPPED"]:
            const res = await soloGetIntrinsicCalibrationSnapshotsCount({ transport })
            console.log(res)
            break;
          case EventType["RECORDING_STOPPED"]:
            getAirealTouchRecordKeyStatus(RecordingKeyStatus.RECORDED)
            break;
          case EventType["RECORD_CREATED"]:
            getAirealTouchRecordKeyStatus(RecordingKeyStatus.NOT_EXISTS)
            break;
          case EventType["THERMAL_SHUTDOWN"]:
            addNotification({
              type: MessageType.ALERT,
              header: '高温注意',
              data: `${nickname}を強制シャットダウンします`,
              time: currTime
            })
            break;
          case EventType["STORAGE_NO_SPACE_LEFT"]:
            addNotification({
              type: MessageType.ERROR,
              header: 'エラー',
              data: `${nickname}の録画ストレージに空きがありません`,
              time: currTime
            })
            break;
          case EventType["STORAGE_LOW_FREE_SPACE"]:
            addNotification({
              type: MessageType.ALERT,
              header: '警告',
              data: `${nickname}の録画ストレージの空き容量が残りわずかです`,
              time: currTime
            })
            break;
          case EventType["DEVICE_SYNC_ESTABLISHED"]:
            break;
          case EventType["DEVICE_SYNC_UNSTABLE"]:
            addNotification({
              type: MessageType.ERROR,
              header: 'カメラ同期に失敗',
              data: `
                      カメラ「${nickname}」が同期していません。
                      無線同期信号の周波数を変更するか、
                      親機カメラの配置や同期アンテナの向きを調整して、
                      カメラを同期させてください。
                    `,
              time: currTime
            })
            break;
          case EventType["RECORDED_FILE_HAS_DROPPED_FRAMES"]:
            if(event.tag===AIREAL_TOUCH_RECORDINGKEY) {
              addMessage(
                recordedFileHasDroppedFrames,
                ApplicationMessageEvent["RECORDED_FILE_HAS_DROPPED_FRAMES_ERROR"]
              )
            }
            break;
          case EventType["RECORDED_FILE_HAS_UNSTABLE_SYNC_FRAMES"]:
            if(event.tag===AIREAL_TOUCH_RECORDINGKEY) {
              addMessage(
                recordedFileHasUnstableSyncFrames, 
                ApplicationMessageEvent["RECORDED_FILE_HAS_UNSTABLE_SYNC_FRAMES_ERROR"]
              )
            }
            break;
        }
      }

      unsubscribes.push(subscribeSoloEventListener(ipv4Addr, listener))
    })

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe())
    }
  },[ subscribeSoloEventListener ])

  return (
    <>
      <Box sx={{ whiteSpace: "nowrap", p: "0.4rem 1rem", fontWeight: "bold", color: "white", border: "2px solid white", position: "relative", borderRadius: 20, display: "flex", alignItems:"center", gap: "5px", minWidth: "130px" }}>
        <Typography sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14 }}>{statusIcon}{value}</Typography>
        <Box sx={{ position: "absolute", top: `-9px`, backgroundColor: '#094594', fontSize: 11, display:"inline", p:"0px 4px" }}>STATUS</Box>
      </Box>
    </>
  )
}

export { RecordingEventBatch }