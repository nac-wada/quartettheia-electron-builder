import { Transport } from "@connectrpc/connect";
import { ServiceBuildInfo } from "../../gen/solo/v1/solo_pb";
import { MessageModalProps } from "../../types/common";

export type CameraVersionType = {
  name: string,
  model: string,
  productSerialNumber: string,
  ipv4Addr: string,
  macAddr: string,
  services: ServiceBuildInfo[],
}

export type CameraVersionListType = {
  cameraInfos: CameraVersionType[],
  dialogProps: MessageModalProps | null,
}

export type getProductSerialNumberFuncType = ({ nickname, transport, ipv4Addr }:{ nickname: string, transport: Transport, ipv4Addr: string }) => void;

export type getBuildInfoAllFuncType = ({ nickname, transport, ipv4Addr }:{ nickname: string, transport: Transport, ipv4Addr: string }) => void;

export type openWarningDialogFuncType = ({ dialog }:{ dialog: MessageModalProps }) => void;

export type CameraVersionViewModel = {
  cameraVersionListState: CameraVersionListType,
  getProductSerialNumberFunc: getProductSerialNumberFuncType,
  getBuildInfoAllFunc: getBuildInfoAllFuncType,
  openWarningDialogFunc: openWarningDialogFuncType,
  closeWarningDialogFunc: () => void,
}

export type ProductVersionModel = {
  success: boolean;
  version: string;
  releaseDate: string;
  metadata: string;
  dialogProps: MessageModalProps | null,
}


export type ProductVersionViewModel = {
  productVersionState: ProductVersionModel,
  getProductVersionFunc: () => void,
  openWarningDialogFunc: openWarningDialogFuncType,
  closeWarningDialogFunc: () => void,
}
