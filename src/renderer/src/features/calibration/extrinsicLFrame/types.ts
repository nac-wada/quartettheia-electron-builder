import { CalibrationLFrameMarkerSet, Marker } from "../../../gen/solo/v1/solo_pb";
import { changeModeFuncType, closeFullScreenFuncType, LensParameterType, openFullScreenFuncType, DeviceInfomation } from "../../../types/common";
import { MarkerGuideProps } from "../common";
import s1LFrameMarker1 from "../../../assets/guide/s1_lframe_marker_1.png"
import s1LFrameMarker2 from "../../../assets/guide/s1_lframe_marker_2.png"

/**
 * アクティブライトキャリブレーション：カメラ位置と姿勢の計算画面のカメラパネルプロパティ
 */
export interface LFrameCameraPanelProps {
  cameraLength: number,
  videoId: string,
  deviceProps: Pick<DeviceInfomation, 'id'|'nickname'|'ipv4Addr'|'macAddr'|'transport'>,
  fullScreen: {
    id: string,
    open: boolean,
    changeMode: changeModeFuncType,
    openFullScreen: openFullScreenFuncType,
    closeFullScreen: closeFullScreenFuncType,
  },

  markerId: number,
  markerSetLoading: boolean,
  addStableList: (ipv4Addr: string) => void,
  deleteStableList: (ipv4Addr: string) => void,
  addCalibrationLframeMarkerSet: (calibrationLFrameMarkerSet: CalibrationLFrameMarkerSet) => void,
  
  lensParameter: LensParameterType,
  lensConfig: LensParameterType,
  updateFocalLength: (value: string, targetCamera?: string | undefined) => void,
  updateSelectedLens: (value: LensParameterType, targetCamera?: string) => void,
  focalLengthBatchMode: 'multi' | 'single',

  cameraTuningBatchMode: 'multi' | 'single',
}

export type LabelMarkerType =  {
  name: string
} & Marker

export const localStorage_LFrame_Batch_CamExposure = `lFrameBatchCameraExposure`

export const localStorage_LFrame_Batch_CamGain = `lFrameBatchCameraGain`

export const localStorage_LFrame_Batch_CamGamma = `lFrameBatchCameraGamma`

export const lFrameMarkerGuideSlides: MarkerGuideProps[] = [
  { 
    title: "マーカーの側面にある電源スイッチを3回押す",
    sections: [
      {
        media: [{src: s1LFrameMarker1}],
        description: "電源スイッチを押すと【中点灯】⇒【弱点灯】⇒【点滅】⇒ 消灯の順に点灯モードの切り替えができます。\n\n電源スイッチを長押しすると【強点灯】します。\n※どの点灯モードでも電源スイッチを長押しすることで【強点灯】し、次に押すと消灯します。\n",
      },
      {
        sectionTitle: "点灯しない場合",
        media: [{src: s1LFrameMarker2}],
        description: "バッテリー残量が不足しています。付属の充電ケーブルを、マーカーの側面にある差込口に接続して充電を行ってください。\n",
      }
    ]
  }
]