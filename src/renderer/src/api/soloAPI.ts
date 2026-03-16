import { Transport } from "@connectrpc/connect";
import { CalibrationLFrameMarkerSet, CalibrationLocation, CalibrationTWandMarkerSet, CalibrationType, CalibratorDetectionMode, CameraFrameSizeType, CameraUnit, DeviceSyncCf, DeviceSyncTxPower, EventType, FileMetadataType, ImageFlipMode, SoloService } from "../gen/solo/v1/solo_pb";
import { createClientFunc } from "../utilities/client";
import { Duration, Timestamp } from "@bufbuild/protobuf/wkt";

export async function soloGetDeviceAutoBootOnPowerSupply(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getDeviceAutoBootModeOnPowerSupply({});

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetDeviceAutoBootOnPowerSupply")
    return false
  }
}

export async function soloSetDeviceAutoBootOnPowerSupply(props: { transport: Transport, enable: boolean }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setDeviceAutoBootModeOnPowerSupply({ enable: props.enable });

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: SetDeviceAutoBootOnPowerSupply")
    return false
  }
}

export async function soloGetRecordingAutoRemoveEnabled(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getRecordingAutoRemoveEnabled({})

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetRecordingAutoRemoveEnabled")
    return false
  }
}

export async function soloSetRecordingAutoRemoveEnabled(props: { transport: Transport, enable: boolean }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setRecordingAutoRemoveEnabled({ enable: props.enable })

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: SetRecordingAutoRemoveEnabled")
    return false
  }
}

export async function soloExecuteFactoryReset(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).executeFactoryReset({});

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: ExecuteFactoryReset")
    return false
  }
}

export async function soloGetCurrentTime(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCurrentTime({});

    if(res.timestamp !== undefined) {
      return { timestamp: res.timestamp, frameTimestamp: res.frameTimestamp }
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetCurrentTime")
    return false
  }
}

export async function soloGetDeviceSyncStatus(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getDeviceSyncStatus({});

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetDeviceSyncStatus")
    return false
  }
}

export async function soloGetDeviceSyncTxPower(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getDeviceSyncTxPower({});

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetDeviceSyncTxPower")
    return false
  }
}

export async function soloSetDeviceSyncTxPower(props: { transport: Transport, txPower: DeviceSyncTxPower }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setDeviceSyncTxPower({ txPower: props.txPower });

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: SetDeviceSyncTxPower")
    return false
  }
}

export async function soloGetDeviceSyncCf(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getDeviceSyncCf({});

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetDeviceSyncCf")
    return false
  }
}

export async function soloSetDeviceSyncCf(props: { transport: Transport, cf: DeviceSyncCf }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setDeviceSyncCf({ cf: props.cf });

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: SetDeviceSyncCf")
    return false
  }
}

export async function soloIsDeviceSyncEstablished(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).isDeviceSyncEstablished({});

    if(res.success) {
      return res
    } else {
      return null
    }
  } catch (e) {
    console.error("api request failed: IsDeviceSyncEstablished")
    return null
  }
}

export async function soloGetRecordedFileMetadata(props: { transport: Transport, fileName: string, type: FileMetadataType }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getRecordedFileMetadata({ fileName: props.fileName, type: props.type });

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetRecordedFileMetadata")
    return false
  }
}

export async function soloSetRecordedFileMetadata(props: { transport: Transport, fileName: string, metadata: { type: FileMetadataType, data: string } }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setRecordedFileMetadata({ fileName: props.fileName, metadata: props.metadata });

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: SetRecordedFileMetadata")
    return false
  }
}

export async function soloGetProductVersion(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getProductVersion({})

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetProductVersion")
    return false
  }
}

export async function soloGetBuildInfoAll(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getBuildInfoAll({})

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetBuildInfoAll")
    return false
  }
}

export async function soloGetProductSerialNumber(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getProductSerialNumber({})

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetProductSerialNumber")
    return false
  }
}

export async function soloGetCameraNickname(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCameraNickname({})

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetCameraNickname")
    return false
  }
}

export async function soloSetCameraNickname(props: { transport: Transport, newValue: string }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCameraNickname({ nickname: props.newValue })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: soloSetCameraNickname")
    return false
  }
}

/* キャリブレーション */
export async function soloGetCalibrationSnapshotsCountAll(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCalibrationSnapshotsCountAll({ type: CalibrationType.INTRINSIC_BOARD });

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetCalibrationSnapshotsCountAll")
    return false
  }
}

export async function soloGetCalibrationCameraSideAgainstBoard(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCalibrationCameraSideAgainstBoard({});

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetCalibrationCameraSideAgainstBoard")
    return false
  }
}

export async function soloSetCalibrationCameraSideAgainstBoard(props: { transport: Transport, side?: number }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCalibrationCameraSideAgainstBoard({ side: props.side })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: SetCalibrationCameraSideAgainstBoard")
    return false
  }
}

export async function soloCheckCalibrationResultExists(props: { transport: Transport, type: CalibrationType }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).checkCalibrationResultExists({ type: props.type })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: CheckCalibrationResultExists")
    return false
  }
}

export async function soloGetCalibrationResult(props: { transport: Transport, type: CalibrationType }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCalibrationResult({ type: props.type })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetCalibrationResult")
    return false
  }
}

export async function soloGetExtrinsicCalibrationSnapshotsCount(props: { transport: Transport, location?: CalibrationLocation}) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCalibrationSnapshotsCount({ type: CalibrationType.EXTRINSIC_BOARD })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetExtrinsicCalibrationSnapshotsCount")
    return false
  }
}

export async function soloGetIntrinsicCalibrationSnapshotsCount(props: { transport: Transport, location?: CalibrationLocation }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCalibrationSnapshotsCount({ type: CalibrationType.INTRINSIC_BOARD, location: props.location })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetIntrinsicCalibrationSnapshotsCount")
    return false
  }
}

export async function soloTakeExtrinsicCalibrationSnapshot(props: { transport: Transport, location?: CalibrationLocation, timestamp?: Timestamp, blocking?: boolean}) {
  try {
    const res = await createClientFunc(SoloService, props.transport)
                      .takeCalibrationSnapshot({ type: CalibrationType.EXTRINSIC_BOARD, location: props.location, timestamp: props.timestamp, blocking: props.blocking })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: TakeExtrinsicCalibrationSnapshot")
    return false
  }
}

export async function soloTakeIntrinsicCalibrationSnapshot(props: { transport: Transport, location?: CalibrationLocation, blocking?: boolean }) {
  try {
    const res = await createClientFunc(SoloService, props.transport)
                      .takeCalibrationSnapshot({ type: CalibrationType.INTRINSIC_BOARD, location: props.location, blocking: props.blocking })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: TakeIntrinsicCalibrationSnapshot")
    return false
  }
}

export async function soloRunCalibration(props: { transport: Transport, types: CalibrationType[], cameras: CameraUnit[] }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).runCalibration({ types: props.types, cameras: props.cameras })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: RunCalibration")
    return false
  } 
}

export async function soloGetCalibrationEngineStatus(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCalibrationEngineStatus({});

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetCalibrationEngineStatus")
    return false
  }
}

export async function soloResetCalibrationSnapshots(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).resetCalibrationSnapshots({});

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: ResetCalibrationSnapshots")
    return false
  }
}

/* ライブ映像 */
export async function soloConnectToLiveStream(props: { transport: Transport, sdp: string | undefined, ices: string[] }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).connectToLiveStream({ client: { sdp: props.sdp, ices: props.ices } })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: ConnectToLiveStream")
    return false
  }
}

export async function soloGetCameraActualFrameSize(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCameraActualFrameSize({ type: CameraFrameSizeType.RECORD })

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetCameraActualFrameSize")
    return false
  }
}

/* 露光時間 */
export async function soloGetCameraExposure(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCameraExposure({})

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: soloGetCameraExposure")
    return false
  }
}

export async function soloGetCameraExposureAuto(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCameraExposureAuto({})

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: soloGetCameraExposureAuto")
    return false
  }
}

export async function soloSetCameraExposure(props: { transport: Transport, value?: bigint }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCameraExposure({ value: props.value })

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: SetCameraExposure")
    return false
  }
}

export async function soloSetCameraExposureAuto(props: { transport: Transport, enable?: boolean }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCameraExposureAuto({ enable: props.enable })

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: SetCameraExposureAuto")
    return false
  }
}

/* ゲイン */
export async function soloGetCameraGain(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCameraGain({})

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetCameraGain")
    return false
  }
}

export async function soloGetCameraGainAuto(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCameraGainAuto({})

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetCameraGainAuto")
    return false
  }
}

export async function soloSetCameraGain(props: { transport: Transport, value?: bigint }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCameraGain({ value: props.value })

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: SetCameraGain")
    return false
  }
}

export async function soloSetCameraGainAuto(props: { transport: Transport, enable?: boolean }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCameraGainAuto({ enable: props.enable })

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: SetCameraGainAuto")
    return false
  }
}

/* ガンマ */
export async function soloGetCameraGamma(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCameraGamma({})

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetCameraGamma")
    return false
  }
}

export async function soloSetCameraGamma(props: { transport: Transport, value?: bigint }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCameraGamma({ value: props.value })

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: SetCameraGamma")
    return false
  }
}

/* ホワイトバランス */
export async function soloGetCameraWhiteBalanceAuto(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCameraWhiteBalanceAuto({})

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetCameraWhiteBalanceAuto")
    return false
  }
}

export async function soloSetCameraWhiteBalanceAuto(props: { transport: Transport, enable?: boolean }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCameraWhiteBalanceAuto({ enable: props.enable })

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: SetCameraWhiteBalanceAuto")
    return false
  }
}

export async function soloGetCameraWhiteBalanceRed(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCameraWhiteBalanceRed({})

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: soloGetCameraWhiteBalanceRed")
    return false
  }
}

export async function soloSetCameraWhiteBalanceRed(props: { transport: Transport, value?: bigint }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCameraWhiteBalanceRed({ value: props.value })

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: soloSetCameraWhiteBalanceRed")
    return false
  }
}

export async function soloGetCameraWhiteBalanceBlue(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCameraWhiteBalanceBlue({})

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: soloGetCameraWhiteBalanceBlue")
    return false
  }
}

export async function soloSetCameraWhiteBalanceBlue(props: { transport: Transport, value?: bigint }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCameraWhiteBalanceBlue({ value: props.value })

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: soloSetCameraWhiteBalanceBlue")
    return false
  }
}

/* カメラ画像反転 */
export async function soloGetCameraImageFlipping(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCameraImageFlipping({})

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetCameraImageFlipping")
    return false
  }
}

export async function soloSetCameraImageFlipping(props: { transport: Transport, mode: ImageFlipMode }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCameraImageFlipping({ mode: props.mode })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: SetCameraImageFlipping")
    return false
  }
}

export async function soloGetRecordingStorageUsage(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getRecordingStorageUsage({});

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetRecordingStorageUsage")
    return false
  }
}

export async function soloCheckInternetConnection(props: { transport: Transport, address: string }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).checkInternetConnection({ address: props.address })

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: soloCheckInternetConnection")
    return false
  }
}

export async function soloTrimMP4File(props: { transport: Transport, mode?: number, fileName?: string, start?: Duration, length?: Duration}) {
  try {
    const res = await createClientFunc(SoloService, props.transport)
                      .trimMP4File({ mode: props.mode, fileName: props.fileName, start: props.start, length: props.length })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: TrimMP4File")
    return false
  }
}

export async function soloCheckWiFiEnabled(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).checkWiFiEnabled({});

    if(res) {

      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: CheckWiFiEnabled")
    return false
  }
}

export async function soloGetWiFiFunctionsAvailable(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getWiFiFunctionsAvailable({});

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetWiFiFunctionsAvailable")
    return false
  }
}

export async function soloGetDeviceActiveNetworkInterfaces(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getDeviceActiveNetworkInterfaces({});

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetDeviceActiveNetworkInterfaces")
    return false
  }
}

export async function soloGetWiFiNetworks(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getWiFiNetworks({});

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetWiFiNetworks")
    return false
  }
}

export async function soloEnableWiFi(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).enableWiFi({});

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: EnableWiFi")
    return false
  }
}

export async function soloDisableWiFi(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).disableWiFi({});

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: DisableWiFi")
    return false
  }
}

export async function soloGetWiFiAPIPublicKey(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport)
                      .getWiFiAPIPublicKey({})

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetWiFiAPIPublicKey")
    return false
  }
}

export async function soloConnectToNewWiFiNetwork(props: { transport: Transport, ssid: string, password: string }) {
  try {
    const res = await createClientFunc(SoloService, props.transport)
                      .connectToNewWiFiNetwork({
                        ssid: props.ssid,
                        password: props.password
                      })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: ConnectToNewWiFiNetwork")
    return false
  }
}

export async function soloDisconnectFromWiFiNetwork(props: { transport: Transport, ssid: string }) {
  try {
    const res = await createClientFunc(SoloService, props.transport)
                      .disconnectFromWiFiNetwork({
                        ssid: props.ssid
                      })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: DisconnectFromWiFiNetwork")
    return false
  }
}

export async function soloGetDeviceMemoryUsage(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport)
                      .getDeviceMemoryUsage({})

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetDeviceMemoryUsage")
    return false
  }
}

export async function soloGetDeviceTemperature(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getDeviceTemperature({});

    if(res.success) {

      return res
    } else {
      
      return false
    }
  } catch (e) {
    console.error("api request failed: GetDeviceTemperature")
    return false
  }
}

export async function soloShutDownDevice(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).shutdownDevice({});

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: ShutDownDevice")
    return false
  }
}

export async function soloRestartDevice(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).restartDevice({});

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: RestartDevice")
    return false
  }
}

export async function soloBroadcastEvent(props: { transport: Transport, type?: EventType }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).broadcastEvent({ type: props.type })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: BroadcastEvent")
    return false
  }
}

export async function soloGetDeviceBootTime(props:{ transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getDeviceBootTime({})

    if(res.success) {

      if(res.boottime) {
        return { boottime: res.boottime }
      }
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetDeviceBootTime")
    return false
  }
}

export async function soloGetCalibratorDetectionMode(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getCalibratorDetectionMode({})

    if(res.success) {
      
      return res
    } else {
      
      return false
    }
  } catch (e) {
    // console.error("api request failed:: GetCalibratorDetectionMode")
    return false
  }
}

export async function soloSetCalibratorDetectionMode(props: { transport: Transport, calibratorDetectMode: CalibratorDetectionMode }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCalibratorDetectionMode({ mode: props.calibratorDetectMode })

    if(res.success) {
      
      return res
    } else {
      
      return false
    }
  } catch (e) {
    // console.error("api request failed:: SetCalibratorDetectionMode")
    return false
  }
}

export async function soloGetLatestTWandMarkerLocation(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getLatestTWandMarkerLocation({})

    if(res.success) {
      
      return res
    } else {
      
      return false
    }
  } catch (e) {
    // console.error("api request failed:: GetLatestTWandMarkerLocation")
    return false
  }
}

export async function soloGetLatestLFrameMarkerLocation(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).getLatestLFrameMarkerLocation({})

    if(res.success) {
      
      return res
    } else {
      
      return false
    }
  } catch (e) {
    // console.error("api request failed:: GetLatestLFrameMarkerLocation")
    return false
  }
}

export async function soloSetCalibrationLFrameMarkerSet(props: { transport: Transport, markersets: CalibrationLFrameMarkerSet[] }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCalibrationLFrameMarkerSet({ markersets: props.markersets })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed")
    return false
  }
}

export async function soloSetCalibrationTWandMarkerSet(props: { transport: Transport, markersets: CalibrationTWandMarkerSet[] }) {
  try {
    const res = await createClientFunc(SoloService, props.transport).setCalibrationTWandMarkerSet({ markersets: props.markersets });

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed")
    return false
  }
}

export function soloGetLFrameMarkerLocationStream(props: { streamTransport: Transport, signal?: AbortSignal }) {
  try {
    const res = createClientFunc(SoloService, props.streamTransport).getLFrameMarkerLocationStream({},{signal: props.signal})

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed")
    return false
  }
}

export function soloGetTWandMarkerLocationStream(props: { streamTransport: Transport, signal?: AbortSignal }) {
  try {
    const res = createClientFunc(SoloService, props.streamTransport).getTWandMarkerLocationStream({},{signal: props.signal})

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed")
    return false
  }
}

/* イベントを受信するためのストリームを取得する subsribeEvent用のtransportでAPI実行 */
export function soloSubscribeEvent(props: { subscribeTransport: Transport }) {
  try {
    const res = createClientFunc(SoloService, props.subscribeTransport).subscribeEvent({})

    if(res) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: SoloSubscribeEvent")
    return false
  }
}