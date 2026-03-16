import { CircularProgressProps, SxProps, Theme } from "@mui/material"
import { changeModeFuncType, closeFullScreenFuncType, openFullScreenFuncType, MessageModalProps, DeviceInfomation } from "../../../types/common"
import { StatusCodeType } from "../common"
import { Transport } from "@connectrpc/connect"

export type CameraSnapshotsType = {
  TOP_LEFT: number | null,
  TOP_CENTER: number | null,
  TOP_RIGHT: number | null,
  BOTTOM_LEFT: number | null,
  BOTTOM_CENTER: number | null,
  BOTTOM_RIGHT: number | null,
  CENTER: number | null,
}

export interface IBoardMainCameraPanelProps {
  videoId: string,
  deviceProps: Pick<DeviceInfomation, 'id'|'nickname'|'ipv4Addr'|'macAddr'|'transport'>,
  fullScreen: {
    id: string,
    open: boolean,
    changeMode: changeModeFuncType,
    openFullScreen: openFullScreenFuncType,
    closeFullScreen: closeFullScreenFuncType,
  },
  shutter: boolean,
  addCalibrationEngineStatus: (ipv4Addr: string) => void,
  removeCalibrationEngineStatus: (ipv4Addr: string) => void,
  snapshots: CameraSnapshotsType,
  gridMode: boolean,
  selectedArea: number,
  changeSelectedArea: any
}

export interface IBoardSubCameraPanelProps {
  videoId: string,
  deviceProps: Pick<DeviceInfomation, 'id'|'nickname'|'ipv4Addr'|'transport'>,
  fullScreen: {
    id: string,
    open: boolean,
    changeMode: changeModeFuncType,
    openFullScreen: openFullScreenFuncType,
    closeFullScreen: closeFullScreenFuncType,
  },
  shutter: boolean,
  addCalibrationEngineStatus: (ipv4Addr: string) => void,
  removeCalibrationEngineStatus: (ipv4Addr: string) => void,
  snapshots: CameraSnapshotsType,
  gridMode: boolean,
  selectedArea: number,
  focused: boolean,
}

export const StatusIntrinsicCode: StatusCodeType[] = [
  {
    code: 'STATUS_IN_CALIBRATION_READY',
    status: 0,
    document: "未計算",    
  },
  {
    code: 'STATUS_IN_CALIBRATION_BUSY',
    status: 1,
    document: "計算中",    
  },
  {
    code: 'STATUS_IN_CALIBRATION_RUN',
    status: 2,
    document: "計算中 -キャリブレーション成功",    
  },
  {
    code: 'STATUS_IN_CALIBRATION_EXIST_FILE',
    status: 3,
    document: "計算済み",    
  },
  {
    code: 'STATUS_IN_CALIBRATION_ERROR_DEVICES_LIST',
    status: -1,
    document: "エラー：カメラ未接続",    
  },
  {
    code: 'STATUS_IN_CALIBRATION_ERROR_RUN',
    status: -2,
    document: "エラー：計算未実行",    
  },
  {
    code: 'STATUS_IN_CALIBRATION_EMPTY_SNAP',
    status: -3,
    document: "エラー：撮影失敗",    
  },
  {
    code: 'STATUS_IN_CALIBRATION_ERROR_LOCK',
    status: -4,
    document: "エラー：他計算中のため中止",    
  },
  {
    code: 'STATUS_IN_CALIBRATION_ERROR_EXIST',
    status: -5,
    document: "エラー：計算失敗",    
  },
  {
    code: 'STATUS_IN_CALIBRATION_ERROR',
    status: -10,
    document: "エラー：",    
  }
]

export interface IBoardResultStatusIconProps {
  nodeRef?: any,
  attributes?: any,
  listeners?: any,
  progressProps?: CircularProgressProps,
  iconSx?: SxProps<Theme>,
  ipv4Addr: string,
  nickname: string,
  transport: Transport,
  add: (ipv4Addr: string) => void,
  remove: (ipv4Addr: string) => void,
  send?: boolean,
}

export interface BoardIntrinsicsModel {
  shutter: boolean,
  takingSnap: boolean,
  targetCamera: number,
  message: MessageModalProps | null,
  errorMessageList: MessageModalProps[],
  cameraList: { ipv4Addr: string, snapshots: CameraSnapshotsType }[],
  gridMode: boolean,
  selectedArea: number,
}

export type setUpCameraListFuncType = () => void;

export type changeTargetCameraFuncType = ({ id }:{ id: number }) => void;

export type changeSelectedAreaFuncType = ({ index }:{ index: number }) => void;

export type changeGridModeFuncType = ({ gridMode }:{ gridMode: boolean }) => void;

export type takeCalibrationSnapshotsFuncType = ({ transport, ipv4Addr, selectedArea, gridMode }:{ transport: Transport, ipv4Addr: string, selectedArea: number, gridMode: boolean }) => void;

export type removeCalibrationSnapshotsFuncType = ({ transport, ipv4Addr, all }:{ transport: Transport, ipv4Addr: string, all?: boolean }) => void;

export type removeAllCalibrationSnapshotsFuncType = () => void;

export type openMessageFuncType = ({ message }:{ message: MessageModalProps }) => void; 

export type closeMessageFuncType = () => void;

export type changeSnapshotModeFuncType = ({ mode }:{ mode: boolean }) => void;

export interface BoardIntrinsicsViewModel {
  chessboardCalState: BoardIntrinsicsModel,
  autoMode: boolean,
  setUpCameraList: () => void,
  changeTargetCamera: changeTargetCameraFuncType,
  changeSelectedArea: changeSelectedAreaFuncType,
  changeGridMode: changeGridModeFuncType,
  takeCalibrationSnapshots: takeCalibrationSnapshotsFuncType,
  removeCalibrationSnapshots: removeCalibrationSnapshotsFuncType,
  removeAllCalibrationSnapshots: removeAllCalibrationSnapshotsFuncType,
  openMessage: openMessageFuncType,
  closeMessage: closeMessageFuncType,
  changeSnapshotMode: changeSnapshotModeFuncType,
}