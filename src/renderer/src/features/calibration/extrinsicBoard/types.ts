import { changeModeFuncType, closeFullScreenFuncType, openFullScreenFuncType, MessageModalProps, DeviceInfomation } from "../../../types/common";
import { StatusCodeType } from "../common";

export const StatusExtrinsicCode: StatusCodeType[] = [
  {
    code: 'STATUS_EX_CALIBRATION_READY',
    status: 0,
    document: "未計算",    
  },
  {
    code: 'STATUS_EX_CALIBRATION_BUSY',
    status: 1,
    document: "計算中",    
  },
  {
    code: 'STATUS_EX_CALIBRATION_RUN',
    status: 2,
    document: "計算中 -キャリブレーション成功",    
  },
  {
    code: 'STATUS_EX_CALIBRATION_EXIST_FILE',
    status: 3,
    document: "計算済み",    
  },
  {
    code: 'STATUS_EX_CALIBRATION_ERROR_DEVICES_LIST',
    status: -1,
    document: "エラー:カメラ未接続",    
  },
  {
    code: 'STATUS_EX_CALIBRATION_ERROR_RUN',
    status: -2,
    document: "エラー：計算未実行",    
  },
  {
    code: 'STATUS_EX_CALIBRATION_EMPTY_SNAP',
    status: -3,
    document: "エラー：撮影失敗",    
  },
  {
    code: 'STATUS_EX_CALIBRATION_ERROR_LOCK',
    status: -4,
    document: "エラー：他計算中のため中止",    
  },
  {
    code: 'STATUS_EX_CALIBRATION_ERROR_EXIST',
    status: -5,
    document: "エラー：計算失敗",    
  },
  {
    code: 'STATUS_EX_CALIBRATION_ERROR',
    status: -10,
    document: "エラー：",    
  }
]

export interface EBoardCameraPanelProps {
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
}

export interface BoardExtrinsicsModel {
  shutter: boolean,
  message: MessageModalProps | null,
}

export interface BoardExtrinsicsViewModel {
  chessboardCalExState: {
    shutter: boolean,
    message: MessageModalProps | null,
  },
  openMessage: (message: MessageModalProps) => void,
  closeMessage: () => void,
  showShutterEffect: () => void,
}