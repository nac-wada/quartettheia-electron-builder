import { Transport } from "@connectrpc/connect";
import { MessageModalProps } from "../../../types/common";

export interface NetworkSettingInfoProps {
  nickname: string;
  transport: Transport;
  wifiTransport: Transport;
}

export type AccesspointType = {
  ssid: string,
  bssid: string,
  mode: string,
  securities: string[],
  signal: number,
  channel: number
}

export type ActiveNetworkInterfaceType = {
  interfaceName: string,
  ipv4Addr: string,
  macAddr: string,
  wifi?: AccesspointType
}

export interface NetworkSettingModel {
  activeNetworkInterfaces: ActiveNetworkInterfaceType[],
  accesspoints: AccesspointType[],
  openedCard: string,
  wifiEnabled: boolean,
  wifiAvailable: boolean
  isLoading: boolean,
  message: MessageModalProps | null,
}

export interface NetworkSettingViewModel {
  networkSettingState: NetworkSettingModel,
  selectOpenedCard: (openedCard: string) => void,
  switchEnableWiFi: (enabled: boolean) => Promise<boolean>,
  connectToNewWiFiNetwork: (ssid: string, password: string) => Promise<boolean>,
  disconnectFromWiFiNetwork: (ssid: string) => Promise<boolean>,
}