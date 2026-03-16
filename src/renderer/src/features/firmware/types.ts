import { DeviceInfomation } from "../../types/common";

export interface UploadTask {
  cameraId: string;
  mainFileName: string;
  checksumFileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export interface CameraFirmPanelProps {
  camera: Pick<DeviceInfomation, 'id'|'nickname'|'ipv4Addr'|'primary'>,
  isProcessing: boolean,
  prepareUpload: (ipv4Addr: string, nickname: string, cameraId: string, fileList: FileList) => void,
  tasks: UploadTask[]
}

export interface DropZoneProps {
  onFilesDropped: (files: FileList) => void;
  isProcessing: boolean;
}