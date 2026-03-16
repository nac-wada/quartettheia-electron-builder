import * as THREE from 'three';
import { DeviceInfomation } from "../../../types/common";

export type exXml = {
  cameraId: string;
  ip: string;
  nickname: string;
  intrinsic: number[];
  distortion: number[];
  rotation: number[];
  translation: [x: number, y: number, z: number];
  rms: number;
}

export type inXml = {
  cameraId: string;
  ip: string;
  nickname: string;
  intrinsic: number[];
  distortion: number[];
  rms: number;
}

export const IMAGE_RESOLUTION: { x: number; y: number } = { x: 1936.0, y: 1216.0 };

export const SENSOR_SIZE: { x: number; y: number } = { x: 6.7, y: 4.2 };  // Alvium1800 C-240c https://www.alliedvision.com/fileadmin/content/documents/products/cameras/Alvium_CSI-2/techman/Alvium-CSI-2-Cameras_User-Guide.pdf

export const FBX_FILE_LIST: string[] = [
  'fbx/chessboard_frontAndBack_color.fbx',
  // 'fbx/LFrame.fbx',
  'fbx/lframe_object.fbx',
  'fbx/chessboard_frontAndBack_zup2.fbx',
  'fbx/Chessboard_Zup.fbx',
  'fbx/T-pose_Zup.fbx',
  'fbx/Walking_Zup.fbx',
];

export interface ViewerCameraPanelProps {
  isActiveLightData: boolean,
  chessMode: boolean,
  videoId: string,
  deviceProps: Pick<DeviceInfomation, 'id'|'nickname'|'ipv4Addr'|'macAddr'|'transport'>,
  focused: boolean,
  setFocusCamera: any,
  calibrationData: Camera3DObjectModel | undefined,
  succeedCalibration: boolean,
}

export interface FbxModelProps {
  path: string;
  position: number[];
  scales: number[];
  rotation: number[];
}

export type CameraFovlProps = {
  positionX: number;
  intrinsic: any;
  sensorSize: { x: number; y: number };
  length: number;
  color: string;
};

export type GridProps = {
  position?: [number, number, number]
  cellSize?: number;
  cellThickness?: number;
  cellColor?: THREE.ColorRepresentation;
  sectionSize?: number;
  sectionThickness?: number;
  sectionColor?: THREE.ColorRepresentation;
  followCamera?: boolean;
  infiniteGrid?: boolean;
  fadeDistance?: number;
  fadeStrength?: number;
  receiveShadow?: boolean;
  rotationEuler?: [number, number, number] | null;
  args?: ConstructorParameters<typeof THREE.PlaneGeometry>;
};

export interface Camera3DModelProps {
  device: Pick<DeviceInfomation, "nickname"|"ipv4Addr">,
  position: [x: number, y: number, z: number],
  intrinsic: { x: number, y: number},
  sensorSize: { x: number, y: number }, 
  rotation: [x: number, y: number, z: number],
  reversed: boolean,
  color: string,
  length: number,
  scale: number, 
  setFocusCamera: () => void
}

export interface AxesProps {
  axisLength: number;
  sphereDiameter: number;
  labelSize?: string;
  axisColors?: { x: string; y: string; z: string };
  originPosition: [number, number, number];
}

export interface Camera3DObjectSettingProps {
  'Axis': boolean,
  'Name': boolean,
  'Cameras': boolean,
  'Projection': boolean,
  'Length': 0.5,
  'ColorSync': boolean,
  'Color': string,
  'Debug(XML)': boolean,
}

export interface Camera3DObjectModel {
  exXml: exXml,
  inXml: inXml,
  position: [x: number, y: number, z: number],
  rotation: [x: number, y: number, z: number],
  reversed: boolean,
  color: string,
}

export interface CalibrationViewerModel {
  status: "loading" | "unset" | "success" | "failed",
  cameraObjectList: Camera3DObjectModel[],
  focusCamera?: number,
  cameraObjectProperty: Camera3DObjectSettingProps, 
  lengthXYZ: number[],
  centerPosition: [number, number, number],
  canvasCamera: { position: [ number, number, number ], up: [ number, number, number ]  }
  gridOptions: {
    Axis: boolean,
    cellColor: string,
    sectionColor: string,
    infiniteGrid: boolean
  }
  object: string[],
  modelOptions: {
    Model: boolean,
    Select: { options: string[] },
    Scale: number,
    Pos: { x: number, y: number, z: number },
    Rot: { x: number, y: number, z: number },
  } []
}

export interface CalibrationViwerViewModel {
  calibrationViewerState: CalibrationViewerModel, 
}