import { Transport } from "@connectrpc/connect";
import { SubscribeEventResponse as SoloSubscribeEventResponse } from "../gen/solo/v1/solo_pb";
import { Timestamp } from "@bufbuild/protobuf/wkt";
import { SubscribeEventResponse as QuartetSubscribeEventResponse, RecordingKeyStatus, SubscribeMessageResponse } from "../gen/quartet/v1/quartet_pb";
import { createConnectTransport } from "@connectrpc/connect-web";
import { ButtonProps } from "@mui/material";

/**
 * 開発終わって保存するときは, false(上)側を有効化. true(下)はコメントアウト
 */
// export const DEBUG = false;  // for 本番
export const DEBUG = true;  // for debug

/**
 * アプリケーションのドメイン
 * - default in jetson camera (window.location.hostname)
 * - ipアドレスを指定することで、外からでもカメラを受信できる ('aireal.local')
 */
export const Hostname = DEBUG ? 'aireal.local' : window.location.hostname;

/**
 * applicationから録画する時の録画ID
 * 録画ページから録画する時はこのIDを使用する
 */
export const AIREAL_TOUCH_RECORDINGKEY = "aireal-touch"

/**
 * デフォルトののリダイレクト先が'/recordview'
 */
export const DEFAULT_PAGE = '/recordview';

/**
 * カメラの録画ファイルサーバーのポート番号
 */
export const PortFiles = '9090';

/**
 * quartetサービスのポート番号
 */
export const PortQuartet = '30300';

/**
 * soloサービスのポート番号
 */
export const PortSolo = '30200';

/**
 * quartetサービスのurl
 */
export const QuartetBaseUrl = `http://${Hostname}:${PortQuartet}`;

/**
 * apiリクエストのタイムアウト時間
 */
export const defaultTimeoutMs = 30000;

/**
 * quartetサービス用のtransportインスタンス
 * @param {string} baseUrl - quartetサービスのurl
 * @param {number} defaultTimeoutMs - リクエストのタイムアウト時間 
 */
export const quartetTransport = createConnectTransport({ baseUrl: QuartetBaseUrl, defaultTimeoutMs: defaultTimeoutMs })

/**
 * quartet stream系サービスのtransportインスタンス
 * @param {string} baseUrl - quartetサービスのurl
 * ※stream系のため、リクエストのタイムアウト時間を無制限にする
 */
export const quartetStreamingTransport = createConnectTransport({ baseUrl: QuartetBaseUrl })

/**
 * シャットダウン実行後の待ち時間(1000ms = 1sec)
 */
export const PROGRESS_DURATION_SHUTDOWN = 1000*60

/**
 * 再起動実行後の待ち時間(1000ms = 1sec)
 */
export const PROGRESS_DURATION_RESTART = 1000*300

/**
 * アプリケーションフッターの高さ(px)
 */
export const FooterHeight = 100

/**
 * アプリケーションアップバーの高さ(px)
 */
export const AppBarHeight = 64

/**
 * ページの余白
 */
export const MainAreaPaddingSpace = 16

/**
 * サイドメニューの横幅　初期値
 */
export const DrawerWidth: number = 280;

/**
 * カメラ設定画面の最大幅　カメラ1台のとき
 */
export const CAMERA_SETTING_MAX_WIDTH = '800px'

/**
 * 全画面表示するときのelementID
 */
export const FULLSCREEN_ID = 'fullscreen_live'

/**
 * カメラレンズのリスト、アクティブライトCALで使用
 */
export const lensMenuList: LensParameterType[] = [
  { name: "3.5mm", focalLength: 3.5 },
  { name: "6mm", focalLength: 6 },
  { name: "8mm", focalLength: 8 },
  { name: "カスタマイズ", focalLength: 0}
]

/**
 * Solo API 関連のクエリキーを管理するオブジェクト
 */
export const soloApiKeys = {
  /**
   * 特定のAPIとIPアドレスに基づいた詳細情報のクエリキーを生成します。
   * @param {string} api - 呼び出すAPIのエンドポイント名や識別子 (例: 'status', 'config')
   * @param {string} ipv4Addr - 識別対象となるIPv4アドレス (例: 'http://192.168.1.1')
   * @returns {readonly [string, string]} React Query で使用する一意のクエリキー配列
   * * @example
   * soloApiKeys.detail('GetCalibrationEngineStatus', 'http://192.168.1.1')
   */
  detail: (api: string, ipv4Addr: string) => [api, ipv4Addr]
}

/**
 * アプリログイン認証を初期化する時のパスワード
 */
export const DEFAULT_PASSWORD = '';

/**
 * ローカルストレージ：ログイン済みかどうか
 */
export const keyLoginAuth = 'keyLoginAuth'; // アプリケーションログイン中かどうか

/**
 * ローカルストレージ：ログインパスワード
 */
export const KeySavedPassword = 'KeySavedPassword';

/**
 * ローカルストレージ：ユーザーID
 */
export const KeySavedCamerId = 'KeySavedCamerId';

/**
 * ローカルストレージ：次回自動ログインするかどうか
 */
export const KeySavedCheckbox = 'KeySavedCheckbox';

/**
 * ローカルストレージ：開発者モード有効状態かどうか
 */
export const localStorage_developerMode = `App_Developermode_key`;

/**
 * ローカルストレージ：RAMの状態を表示するかどうか
 */
export const localStorage_ramPercentDisplayMode = `RamPercent_DisplayMode_key`;

/**
 * ローカルストレージ：アプリが録画を開始した時間(s)
 */
export const localStorage_recording_startTime = `Recording_starttime`;

/**
 * ローカルストレージ：録画を開始したブラウザかどうか
 */
export const localStorage_recording_user = `Recording_browser`

/**
 * ローカルストレージ：キャリブレーション方式：'アクティブライト'か'チェスボード'
 */
export const localStorage_Calibration_Mode = `calibrationMode`

/**
 * ローカルストレージ：カメラのレンズパラメータ（一括選択用）
 */
export const localStorage_Batch_FocalLength = `batchFocalLength`

/**
 * ローカルストレージ：カメラのレンズ選択が一括選択状態かどうか
 */
export const localStorage_FocalLength_BatchMode_Enabled = `focalLegthBatchModeEnabled`

/**
 * ローカルストレージ：カメラごとのレンズパラメータを保存するキーを生成する関数
 * @param {string} id カメラのシリアル番号 device.id
 */
export const getLocalStorageFocalLengthValue = (id: string) => `${id}FocalLength`

/**
 * アプリケーションテーマの状態を管理するグローバルコンテキスト
 */
export type AppThemeContextType = {
  /** 
   * 現在選択されているアプリテーマ
   */
  appTheme: string;

  /** 
   * アプリテーマをダークモードまたはライトモードに切り替える
   */
  changeAppTheme: () => void;
}

/**
 * アプリケーションのログイン状態を管理するグローバルコンテキスト
 * - アプリケーション保護が無効な場合、ログイン認証機能を無効にする
 */
export type AuthContextType = {
  /** 
   * アプリケーション保護機能が現在有効かどうか
   */
  isProtectEnable: boolean | null;
  
  /** 
   * 現在ログイン中かどうか
   */
  isLoggedIn: boolean;

  /** 
   * 現在パスワード設定中かどうか
   */
  notPassword: boolean;

  /** 
   * パスワードを設定する
   */
  setNotPassword: (value: boolean) => void;

  /** 
   * アプリケーションにログインする
   */
  login: () => void;

  /**
   * アプリケーションにログアウトする
   */
  logout: () => void;

  /**
   * アプリケーション保護を有効または無効にする
   */
  setAppProtectEnable: (enable: boolean) => void; 
};

/**
 * カメラのレンズプロパティ
 * - name: レンズの名前
 * - focalLength: レンズの焦点距離
 */
export type LensParameterType = {
  name: string;
  focalLength: number
}

/**
 * キャリブレーション方式
 */
export type CalibrationType = 
| {
    calType: "wand";
    batchMode: { mode: boolean, focalLength: LensParameterType }
  }
| {
    calType: "chessboard" 
  }

/**
 * アプリケーションのキャリブレーション方式の状態を管理するグローバルコンテキスト
 */
export type CalibrationModeContextType = {
  /**
   * 現在選択されているキャリブレーション方式
   */
  calibrationConfig: CalibrationType,

  /**
   * キャリブレーション方式をワンドまたはチェスボード方式に切り替える
   * @param mode 設定するキャリブレーション方式
   */
  changeCalibrationMode: (mode: 'wand' | 'chessboard') => void;
}

/**
 * デバッグ用のコンテキスト
 */
export type DebugContextType = {
  debugDummyCamera: boolean;
  setDebugDummyCamera: (value: boolean) => void;
  hiddenFpsAndSizeMode: boolean;
  setHiddenFpsAndSizeMode: (value: boolean) => void;
  debugNumOfCamera: string;
  setDebugNumOfCamera: (value: string) => void;
}

export type DebugDrawerContextType = {
  debugMode: boolean;
  setDebugMode: (value: boolean) => void;
}

/**
 * カメラ情報
 */
export interface DeviceInfomation {
  /**
   * rest api用transport
   * timeout設定あり(30秒)
   */
  transport: Transport;

  /**
   * streaming api用transport
   */
  streamTransport: Transport;

  /**
   * ネットワーク接続api用transport
   * timeout設定なし(60秒)
   */
  wifiTransport: Transport;

  /**
   * quartetGetDevices:Device.hostname
   */
  hostname: string;

  /**
   * quartetGetDevices:Device.interface
   */
  networkInterface: string;
  
  /**
   * quartetGetDevices:http://${Device.ipv4Addr}
   * 
   */
  ipv4Addr: string;
  
  /**
   * quartetGetDevices:Device.macAddr
   */
  macAddr: string;
  
  /**
   * quartetGetDevices:Device.nickname
   */
  nickname: string;
  
  /**
   * quartetGetDevices:Device.primary
   */
  primary: boolean;
  
  /**
   * quartetGetDevices:Device.priority
   */
  priority: number;
  
  /**
   * quartetGetDevices:Device.serialNumber
   */
  id: string;
  
  /**
   * レンズパラメータ
   */
  lensConfig: LensParameterType,
}

/**
 * 全カメラの情報を管理するグローバルコンテキスト
 */
export type DevicesContextType = {
  /**
   * データ取得中かどうか
   */
  isLoading: boolean;

  /**
   * データ取得に失敗
   */
  error: Error | null;
  
  /**
   * 全カメラの情報
   */
  devices: DeviceInfomation[];

  /**
   * カメラ情報を更新する
   */
  setDevices: React.Dispatch<React.SetStateAction<DeviceInfomation[]>>;

  /**
   * 親カメラの台数
   */
  primaryCameras: number|null;

  /**
   * 親カメラの台数を更新する
   */
  setPrimaryCameras: React.Dispatch<React.SetStateAction<number|null>>;

  /**
   * アプリの録画状態かどうか
   */
  airealTouchRecording: RecordingKeyStatus;

  /**
   * アプリの録画状態を更新する
   */
  updateAirealTouchRecordingStatus: (status: RecordingKeyStatus) => void;
}

/**
 * アプリのサイドメニューの状態を管理するグローバルコンテキスト
 */
export type DrawerContextType = {
  /**
   * サイドメニューが開いた状態かどうか
   */
  isDrawerOpen: boolean;

  /**
   * サイドメニューを開閉する
   */
  setIsDrawerOpen: (value: boolean) => void;

  /**
   * サイドメニューの幅
   * 開閉状態で幅が変わる
   */
  drawerWidth: number;

  /**
   * サイドメニューの幅を更新する
   */
  setDrawerWidth: (value: number) => void;
}

export type ApplicationMessageType = {
  messageId: string;
  type: ApplicationMessageEvent;
  title?: string;
  content: string;
  children?: React.ReactNode;
  onConfirmTitle?: string;
  onConfirmButtonProps?: ButtonProps;
  onCancelTitle?: string;
  onCancelButtonProps?: ButtonProps;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export type ApplicationMessagesContextType = {
  messages: ApplicationMessageType[];
  addMessage: (message: Omit<ApplicationMessageType, 'messageId'>, checkSomeMessage?: ApplicationMessageEvent) => void;
  removeMessage: (messageId: string) => void;
  clearMessages: () => void
}

export type SubscribeMessageType = {
  type: number;
  header: string;
  data: string;
  time: string;
}

export type NotificationsContextType = {
  notifications: SubscribeMessageType[],
  unreadCount: number,
  addNotification: (message: SubscribeMessageType) => void,
  removeNotifications: () => void,
  resetUnreadCount: () => void,
}

export type QuartetEventListener = (event: QuartetSubscribeEventResponse) => void;

export type QuartetSubscribeEventContextType = {
  subscribeQuartetEventListener: (listener: QuartetEventListener) => () => void
}

export type QuartetMessageListener = (event: SubscribeMessageResponse) => void;

export type QuartetSubscribeMessageContextType = {
  subscribeQuartetMessageListener: (listener: QuartetMessageListener) => () => void
}

export type SoloEventListener = (event: SoloSubscribeEventResponse) => void;

export type CameraListenersType = {
  nickname: string,
  ipv4Addr: string,
  subscribeTransport: Transport,
  listeners: Set<SoloEventListener>
}

export type SoloSubscribeEventContextType = {
  subscribeSoloEventListener: (ipv4Addr: string, listener: SoloEventListener) => () => void
}

export type RamPercentContextType = {
  ramPercentDisplay: boolean;
  setRamPercentDisplay: (value: boolean) => void;
}

export enum QuartetBroadCastCustomEventFlag {
  SET_CALIBRATOR_DETECTION_MODE                = 1,
}

export enum ApplicationMessageEvent {
  SESSION_TIMEOUT_ERROR                        = 1,
  RECORD_STATUS_ERROR                          = 2,
  CAMERA_CONFIGURATION_CHANGE_ERROR            = 3,
  RECORDED_FILE_HAS_DROPPED_FRAMES_ERROR       = 4,
  RECORDED_FILE_HAS_UNSTABLE_SYNC_FRAMES_ERROR = 5,
  MULTIPLE_MASTERS_ERROR                       = 6,
  NO_MASTER_ERROR                              = 7,
  CAMERA_SYNCHRONIZATION_ERROR                 = 8,
  SYSTEM_TIME_DRIFT                            = 9,
  SUCCESS_CALIBRATED_RESULT                    = 10,
}

export enum QuartetBroadcaseMessageType {
  SET_DEVICE_SYNC_TXPOWER                      = "SET_DEVICE_SYNC_TXPOWER",
  SET_DEVICE_SYNC_TIME                         = "SET_DEVICE_SYNC_TIME",
  SET_DEVICE_SYNC_CF                           = "SET_DEVICE_SYNC_CF",
}

export enum ExtrinsicCalibStatus {
  STATUS_EX_CALIBRATION_READY              = 0,
  STATUS_EX_CALIBRATION_BUSY               = 1,
  STATUS_EX_CALIBRATION_RUN                = 2,
  STATUS_EX_CALIBRATION_EXIST_FILE         = 3,
  STATUS_EX_CALIBRATION_ERROR_DEVICES_LIST = -1,
  STATUS_EX_CALIBRATION_ERROR_RUN          = -2,
  STATUS_EX_CALIBRATION_ERROR_EMPTY_SNAP   = -3,
  STATUS_EX_CALIBRATION_ERROR_LOCK         = -4,
  STATUS_EX_CALIBRATION_ERROR_EXIST        = -5,
  STATUS_EX_CALIBRATION_ERROR              = -10,
}

export enum IntrinsicCalibStatus {
  STATUS_IN_CALIBRATION_READY              = 0,
  STATUS_IN_CALIBRATION_BUSY               = 1,
  STATUS_IN_CALIBRATION_RUN                = 2,
  STATUS_IN_CALIBRATION_EXIST_FILE         = 3,
  STATUS_IN_CALIBRATION_ERROR_DEVICES_LIST = -1,
  STATUS_IN_CALIBRATION_ERROR_RUN          = -2,
  STATUS_IN_CALIBRATION_ERROR_EMPTY_SNAP   = -3,
  STATUS_IN_CALIBRATION_ERROR_LOCK         = -4,
  STATUS_IN_CALIBRATION_ERROR_EXIST        = -5,
  STATUS_IN_CALIBRATION_ERROR              = -10,
}

export interface MessageModalProps {
  event: 'warning' | 'error' ;
  title?: string;
  content: string;
  children?: React.ReactNode;
  onConfirmTitle?: string;
  onConfirmButtonProps?: ButtonProps
  onCancelTitle?: string;
  onCancelButtonProps?: ButtonProps
  onConfirm?: () => void,
  onCancel?: () => void,
  onClose?: () => void,
}

export interface RecordingStatusInfo {
  status: RecordingKeyStatus
}

export type CameraParameterType = {
  min: number,
  max: number,
  step: number,
  defaultValue: number,
}

export type VideoType = {
  cameraid: number;
  nickname: string;
  transport: Transport;
  ipv4Addr: string;
  name: string;
  src: string;
  rawSrc: string;
  createTime?: Timestamp
  size: bigint;
  thumbnail: string;
  preview: string;
  sceneName: string;
  subjectId: string;
  tag: string;
  loaded: number;
  hasFrameDrops: boolean; 
  hasUnstableSyncFrames: boolean,
  downloadMp4: () => Promise<boolean>;
}

export type VideoGroupType = {
  key: string,
  date: Date;
  video: VideoType[],
  bytes: number,
  selected: boolean,
  updatingSceneName: boolean,
  updatingSubjectId: boolean,
  downloading: boolean,
  fetchController: AbortController | null,
  removing: boolean,
}

export interface ExCalibrationStatus {
  status: ExtrinsicCalibStatus;
  rms: number;
}

export interface InCalibartionStatus {
  status: IntrinsicCalibStatus;
  rms: number,
}

export type ExtrinsicXMLType = {
  intrinsic: number[];
  distortion: number[];
  rotation: number[];
  translation: number[];
  rms: number;
}

export type IntrinsicXMLType = {
  intrinsic: number[];
  distortion: number[];
  rms: number;
}

export type fullScreenType = {
  opened: boolean;
  index?: string;
}

export type changeModeFuncType = (multiMode: boolean, index?: string) => void;

export type openFullScreenFuncType = () => void;

export type closeFullScreenFuncType = () => void;

export type FullScreenStateType = {
  fullScreenState: fullScreenType,
  changeMode: changeModeFuncType,
  openFullScreen: openFullScreenFuncType,
  closeFullScreen: closeFullScreenFuncType, 
}

export type GetExtrinsicDataResponse = 
| { success: true, data: ExtrinsicXMLType, status: ExtrinsicCalibStatus }
| { success: false }

export type GetIntrinsicDataResponse = 
| { success: true, data: IntrinsicXMLType, status: IntrinsicCalibStatus }
| { success: false }