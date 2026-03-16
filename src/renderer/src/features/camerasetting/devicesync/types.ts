import { Transport } from "@connectrpc/connect";
import { DeviceSyncCf, DeviceSyncTxPower } from "../../../gen/solo/v1/solo_pb";
import { MessageModalProps } from "../../../types/common";

export interface CameraSyncProps {
  primary: boolean;
  nickname: string;
  ipv4Addr: string;
  transport: Transport;
}

export interface CameraSyncModalProps {
  cameraSync: CameraSyncProps;
  onClose: any;
  open: boolean
}

export type CameraSyncModel = {
  currentTime: Date | null,
  deviceBootTime: Date | null,
  deviceSyncTxPower: string | null,
  deviceSyncCf: string | null,
}

export const DeviceSyncTxPowerList: { mode: DeviceSyncTxPower, txPower: string }[] = [
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_UNSPECIFIED, txPower: '' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_M10, txPower: '-10' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_0, txPower: '0' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_1, txPower: '1' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_2, txPower: '2' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_3, txPower: '3' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_4, txPower: '4' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_5, txPower: '5' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_6, txPower: '6' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_7, txPower: '7' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_8, txPower: '8' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_9, txPower: '9' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_10, txPower: '10' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_11, txPower: '11' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_12, txPower: '12' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_13, txPower: '13' },
  { mode: DeviceSyncTxPower.DEVICE_SYNC_TX_POWER_14, txPower: '14' },
]

export const DeviceSyncCfList: { mode: DeviceSyncCf, cf: string }[] = [
  { mode: DeviceSyncCf.DEVICE_SYNC_CF_UNSPECIFIED, cf: '' },
  { mode: DeviceSyncCf.DEVICE_SYNC_CF_921_0, cf: '921' },
  { mode: DeviceSyncCf.DEVICE_SYNC_CF_921_2, cf: '921.2' },
  { mode: DeviceSyncCf.DEVICE_SYNC_CF_921_4, cf: '921.4' },
  { mode: DeviceSyncCf.DEVICE_SYNC_CF_921_6, cf: '921.6' },
  { mode: DeviceSyncCf.DEVICE_SYNC_CF_921_8, cf: '921.8' },
  { mode: DeviceSyncCf.DEVICE_SYNC_CF_922_0, cf: '922' },
  { mode: DeviceSyncCf.DEVICE_SYNC_CF_922_2, cf: '922.2' },
  { mode: DeviceSyncCf.DEVICE_SYNC_CF_922_4, cf: '922.4' },
  { mode: DeviceSyncCf.DEVICE_SYNC_CF_922_6, cf: '922.6' },
  { mode: DeviceSyncCf.DEVICE_SYNC_CF_922_8, cf: '922.8' },
  { mode: DeviceSyncCf.DEVICE_SYNC_CF_923_0, cf: '923' },
]


export type CameraSyncViewModel = {
  cameraSyncState: CameraSyncModel,
  canApply: boolean,
  isEstablished: boolean | null,
  dialog: MessageModalProps | null,
  getDataFunc: () => void,
  getCurrentTimeFunc: () => void,
  setSystemTimeFunc: ({ time }:{ time: Date }) => void,
  setDeviceSyncTxPowerFunc: ({ value }:{ value: string }) => void,
  getDeviceSyncCfFunc: ({ event }:{ event: 'init' | 'updated' }) => void,
  setDeviceSyncCfFunc: ({ value }:{ value: string }) => void,
  openWarningDialogFunc: ({ dialog }:{ dialog: MessageModalProps }) => void,
  closeWarningDialogFunc: () => void,
}