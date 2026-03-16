import { Timestamp } from "@bufbuild/protobuf/wkt";
import { RecordingKeyStatus } from "../../gen/quartet/v1/quartet_pb";
import { SxProps, Theme } from "@mui/material";
import { changeModeFuncType, closeFullScreenFuncType, openFullScreenFuncType, DeviceInfomation, MessageModalProps } from "../../types/common";

export const intervalTimer = 33

export const recordModeMenuItems: { label: string, time: number }[] = [
  { label: "マニュアル録画", time: 300 },
  { label: "5秒録画", time: 5 },
  { label: "7秒録画", time: 7},
  { label: "10秒録画", time: 10},
]

export interface RecordViewerModel {
  recordTime: number,
  sceneName: string,
  subjectID: string,
  setTime: number,
  showNickname: boolean,
  message: MessageModalProps | null,
}

export type getRecordingStatusFuncType = ({ settingTime, status }:{ settingTime: number, status: RecordingKeyStatus }) => void;

export type recControlFuncType = ({ settingTime, sceneName, subjectID, devices }:{ settingTime: number, sceneName: string, subjectID: string, devices: DeviceInfomation[] }) => void;

export type recStartFuncType = ({ settingTime, sceneName, subjectID }:{ settingTime: number, sceneName: string, subjectID: string }) => void;

export type recStopFuncType = ({ stopTime }:{ stopTime: Timestamp }) => void;

export type updateRecordingTimeFuncType = ({ settingTime, startTime, isRecordingUser }:{ settingTime: number, startTime: number, isRecordingUser: boolean }) => void;

export type updateMetaDatasFuncType = (value: string, type: 'sceneName' | 'subjectID') => void;

export type updateSelectRecordModeFuncType = (settingTime: number ) => void;

export type changeShowNicknameFuncType = ({ isShow }:{ isShow: boolean }) => void;

export interface RecordViewerViewModel {
  recordViewerState: RecordViewerModel,
  getRecordingStatus: getRecordingStatusFuncType,
  recControl: recControlFuncType,
  recStart: recStartFuncType,
  recStop: recStopFuncType,
  updateRecordingTime: updateRecordingTimeFuncType,
  updateMetaDatas: updateMetaDatasFuncType,
  updateSelectRecordMode: updateSelectRecordModeFuncType,
  changeShowNickName: changeShowNicknameFuncType,
  openMessage: (message: MessageModalProps) => void,
  closeMessage: () => void
}

export interface RecordControllerProps {
  isCalibBusy: boolean,
  recControl: any,
  setTime: any,
  recordTime: number,
  sceneName: string,
  subjectID: string,
  updateMetaDatas: any,
  updateSelectRecordMode: any,
  fullScreenID: string,
  buttonSx?: SxProps<Theme>,
  textFieldSx?: SxProps<Theme>,
  counterSx?: SxProps<Theme>,
  option?: React.ReactNode 
}

export interface RecordCameraPanelProps {
  videoId: string,
  deviceProps: Pick<DeviceInfomation, 'id'|'nickname'|'ipv4Addr'|'macAddr'|'transport'>,
  fullScreen: {
    id: string,
    open: boolean,
    changeMode: changeModeFuncType,
    openFullScreen: openFullScreenFuncType,
    closeFullScreen: closeFullScreenFuncType,
  },
}

export const localStorage_scene = `Scenename_Free-record`;
export const localStorage_subjectID = `SubjectID_Free-subjectID`;
export const localStorage_autoRecord_time = `auto_record_time`;