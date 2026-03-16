import { Transport } from "@connectrpc/connect";
import { MessageModalProps } from "../../../types/common";

export type OtherSettingType = {
  transport: Transport;
  nickname: string;
}

export type OtherSettingModel = {
  deviceAutoBootModeOnPowerSupply: boolean | "failed" | null,
  deviceAutoBootModeAPIStatus: 'free' | 'busy',
  recordingAutoRemoveEnabled: boolean | "failed" | null,
  recordingAutoRemoveEnabledAPIStatus: 'free' | 'busy',
  dialogProps: MessageModalProps | null,
}

export type getDeviceAutoBootModeOnPowerSupplyFuncType = ({ event }:{ event: 'init' | 'updated' }) => void;

export type setDeviceAutoBootModeOnPowerSupplyFuncType = ({ enable }:{ enable: boolean }) => void;

export type changeDeviceAutoBootModeAPIStatusFuncType = ({ status }:{ status: 'free' | 'busy' }) => void;

export type getRecordingAutoRemoveEnabledFuncType = ({ event }:{ event: 'init' | 'updated' }) => void;

export type setRecordingAutoRemoveEnabledFuncType = ({ enable }:{ enable: boolean }) => void;

export type changeRecordingAutoRemoveEnabledAPIStatusFuncType = ({ status }:{ status: 'free' | 'busy' }) => void;

export type executeFactoryResetFuncType = () => void; 

export type openWarningDialogFuncType = ({ dialog }:{ dialog: MessageModalProps }) => void;

export type closeWarningDialogFuncType = () => void;

export type OtherSettingViewModel = {
  otherSettingState: OtherSettingModel,
  getDeviceAutoBootModeOnPowerSupplyFunc: getDeviceAutoBootModeOnPowerSupplyFuncType,
  setDeviceAutoBootModeOnPowerSupplyFunc: setDeviceAutoBootModeOnPowerSupplyFuncType,
  getRecordingAutoRemoveEnabledFunc: getRecordingAutoRemoveEnabledFuncType,
  setRecordingAutoRemoveEnabledFunc: setRecordingAutoRemoveEnabledFuncType,
  executeFactoryResetFunc: executeFactoryResetFuncType,
  openWarningDialogFunc: openWarningDialogFuncType,
  closeWarningDialogFunc: closeWarningDialogFuncType, 
}