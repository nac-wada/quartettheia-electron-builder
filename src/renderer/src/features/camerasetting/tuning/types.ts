import { SubscribeEventResponse } from "../../../gen/solo/v1/solo_pb"
import { CameraParameterType, changeModeFuncType, closeFullScreenFuncType, openFullScreenFuncType, DeviceInfomation } from "../../../types/common"

export interface CameraWhiteBalanceViewModel {
  isLoading: boolean,
  error: Error | null,
  autoMode: boolean | null,
  recievedEventCallback: (event: SubscribeEventResponse) => void 
  getData: () => void
  setWhiteBalanceAuto: (autoMode: boolean) => void
}

export interface CameraWhiteBalanceBlueViewModel {
  isLoading: boolean,
  error: Error | null,
  config: CameraParameterType | null,
  value: number | null,
  recievedEventCallback: (event: SubscribeEventResponse) => void 
  getData: () => void
  setWhiteBalanceBlueValue: (newValue: number) => void
}

export interface CameraWhiteBalanceRedViewModel {
  isLoading: boolean,
  error: Error | null,
  config: CameraParameterType | null,
  value: number | null,
  recievedEventCallback: (event: SubscribeEventResponse) => void 
  getData: () => void
  setWhiteBalanceRedValue: (newValue: number) => void
}

export interface CameraSettingPanelProps {
  startIndex: number,
  videoId: string,
  deviceProps: Pick<DeviceInfomation, 'id'|'nickname'|'ipv4Addr'|'macAddr'|'transport'|'primary'|'networkInterface'>,
  fullScreen: {
    id: string,
    open: boolean,
    changeMode: changeModeFuncType,
    openFullScreen: openFullScreenFuncType,
    closeFullScreen: closeFullScreenFuncType,
  },
  setModal: any,
}

// FPSの更新間隔（1秒）
export const updateInterval: number = 1000;

export const VELOCITY_MB_s = 4 // (MB/s)

export const VELOCITY_GB_h = VELOCITY_MB_s * 1E-3 * 3600 // (GB/h)