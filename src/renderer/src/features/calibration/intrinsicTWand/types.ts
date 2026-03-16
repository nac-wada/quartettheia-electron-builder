import { CalibrationTWandMarkerSet } from "../../../gen/solo/v1/solo_pb";
import { changeModeFuncType, closeFullScreenFuncType, LensParameterType, openFullScreenFuncType, DeviceInfomation } from "../../../types/common";
import s1FailedImage from "../../../assets/guide/s1_failed.png"
import s1SuccessImage from "../../../assets/guide/s1_success.png"
import s2TWandGuide from "../../../assets/guide/s2_twand.mp4"
import s3TWandGuide from "../../../assets/guide/s3_twand.mp4"
import s1TWandMarker1 from "../../../assets/guide/s1_twand_marker_1.png"
import s1TWandMarker2 from "../../../assets/guide/s1_twand_marker_2.png"
import s1TWandMarker3 from "../../../assets/guide/s1_twand_marker_3.png"
import s2TWandMarker1 from "../../../assets/guide/s2_twand_marker_1.png"
import s2TWandMarker2 from "../../../assets/guide/s2_twand_marker_2.png"
import { SxProps, Theme, TypographyOwnProps } from "@mui/material";
import { MarkerGuideProps } from "../common";

export interface CuurentMarkerProps {
  centerX: number,
  centerY: number,
  size: number,
  color?: string
}

export type AreaType = number[];

export type SegmentPoints = number[];

export interface TWandCameraPanelProps {
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
  addCalibrationTWandMarkerSet: (calibrationTWandMarkerSet: CalibrationTWandMarkerSet, progress: "completed" | "stop" | null) => void,
  updateCompletedCameras: (id: number) => void

  lensParameter: LensParameterType,
  cameraTuningBatchMode: 'multi' | 'single',

  isCollecting: {
    collect: boolean;
    progress: "stop" | "completed" | null;
  },
  isWanding: boolean,
  refreshed: boolean,
  setRefreshed: () => void,
}

export interface TWandGuideProps {
  title: string, 
  media?: { src: string, mediaTitle?: {text: string, color?: TypographyOwnProps["color"] } }[] | { src: string, mediaTitle?: {text: string, color?: TypographyOwnProps["color"] } },
  description: string, 
  completed?: string, 
  point?: string,
  sx?: SxProps<Theme>
}

export const localStorage_TWand_Batch_CamExposure = `tWandBatchCameraExposure`

export const localStorage_TWand_Batch_CamGain = `tWandBatchCameraGain`

export const localStorage_TWand_Batch_CamGamma = `tWandBatchCameraGamma`

export const COMPLETE_RECORD_POINTS = 3;

export const SEMICOMPLETE_RECORD_POINTS = 1;

export const COLS = 6;

export const ROWS = 4;

export const wandingGuideSlides: TWandGuideProps[] = [
    { 
      title: "1.画面の隅々まで振りましょう",
      media: [{ src: s1SuccessImage, mediaTitle: { text: "良い例", color: "success" }}, { src: s1FailedImage, mediaTitle: { text: "悪い例", color: "error" }}],
      description: "カメラのレンズは中心よりも「端（四隅）」の方が歪みが大きくなります。画面の中央だけでなく、四隅のギリギリまでワンドを持っていくように大きく動かしてください。\n",
      completed: "24マスのうち、20マス以上を緑色にすること。\n",
      point: "画面からワンドがはみ出さないように、モニターを確認しながら丁寧に動かしましょう。\n"
    },
    { 
      title: "2.くるくる回しましょう",
      media: {src: s2TWandGuide},
      description: "ずっと同じ向きで振っていると、カメラは正確なレンズの形を学習できません。くるくると角度を変えながら振ってください。\n",
      completed: "1つのマスの中で「横・斜め・縦」の3方向以上の角度が含まれること。\n",
      point: "マスの上でワンドを「水平→斜め→垂直」と1/4回転させるだけで、すぐに緑色に変わります。\n"
    },
    { 
      title: "3.近づけたり遠ざけたりしましょう",
      media: {src: s3TWandGuide},
      description: "カメラに対してずっと同じ距離で振るのではなく、前後（奥行き）の動きを加えてください。これにより、カメラの焦点距離が正確に計算されます。\n",
      completed: "ワンドの「見かけの大きさ」を変化させること。\n",  
      point: "カメラにグッと近づけてワンドを大きく映したり、少し離れて小さく映したりする動作を数回繰り返してください。\n"
    }
  ]

  export const tWandMarkerGuideSlides: MarkerGuideProps[] = [
    { 
      title: "1.ハンドルのスイッチ(⚡)を押す",
      sections: [
        {
          media: [{src: s1TWandMarker1}, {src: s1TWandMarker2}],
          description: "スイッチを押すと(⚡)の上部が点灯します。正常に点灯することを確認してください。\n",
        },
        {
          sectionTitle: "点灯しない場合",
          media: [{src: s1TWandMarker3}],
          description: "バッテリー残量が不足しています。付属の充電ケーブルを、ハンドル部分の側面にある差込口に接続して充電を行ってください。\n",
        },
      ]
    },
    { 
      title: "2.ケーブルの接続を確認し、電源スイッチをOからIに切り替える",
      sections: [
        {
          media: [{src: s2TWandMarker1},{src: s2TWandMarker2}],
          description: "スイッチをO⇒Iに切り替えると2つのマーカーが点灯します。正常に点灯することを確認してください。\n",
        }
      ]
    }
  ]
