import { useCallback, useEffect, useState } from "react"
import { Transport } from "@connectrpc/connect"
import { soloCheckWiFiEnabled, soloConnectToNewWiFiNetwork, soloDisableWiFi, soloDisconnectFromWiFiNetwork, soloEnableWiFi, soloGetDeviceActiveNetworkInterfaces, soloGetWiFiAPIPublicKey, soloGetWiFiFunctionsAvailable, soloGetWiFiNetworks } from "../../../../api/soloAPI"
import { encryptPlainText } from "../../../../utilities/encryptPassword"
import { AccesspointType, ActiveNetworkInterfaceType, NetworkSettingModel, NetworkSettingViewModel } from "../types"

export const useNetworkSettingState = (transport: Transport, opened: boolean, wifiTransport: Transport): NetworkSettingViewModel => {
  const [ networkSettingState, setNetworkSettingState ] = useState<NetworkSettingModel>({
    activeNetworkInterfaces: [],
    accesspoints: [],
    openedCard: "",
    wifiEnabled: false,
    wifiAvailable: false,
    isLoading: false,
    message: null
  });

  useEffect(() => {
    if (opened) setup()
  },[opened])

  const setup = useCallback(() => {
    setNetworkSettingState((prev) => ({...prev, isLoading: true, openedCard: ""}));
    
    getWifiAvailable()
    .then(result => {
      if(result) {
        return getWifiEnable()
      }
    })
    .then(result => {
      if(result) {
        return getActiveNetworkInterfaces()
                .then(getWifiNetworks)
                .then(() => {setNetworkSettingState((prev) => ({...prev, isLoading: false}))})
      }
      else if(!result) {
        return getActiveNetworkInterfaces()
                 .then(() => {setNetworkSettingState((prev) => ({...prev, isLoading: false}))})
      }
    })
    .catch(() => {setNetworkSettingState((prev) => ({...prev, isLoading: false}))})
  },[])

  // ネットワーク情報を更新する
  const update = useCallback(async (loading: boolean) => {
    if(loading) { setNetworkSettingState((prev) => ({...prev, isLoading: true})) }

      await new Promise(resolve => setTimeout(resolve, 5000))
      const res1 = await getActiveNetworkInterfaces();

      if(res1) {
        const res2 = await getWifiNetworks()

        if(res2) {
          if(loading) { setNetworkSettingState((prev) => ({...prev, isLoading: false})) }
          setNetworkSettingState((prev) => ({...prev, openedCard: ""}))
          return true
        }
        else {
          return false
        }
      }
      else {
        return false
      }
  },[])

  // ネットワークを選択する
  const selectOpenedCard = useCallback((openedCard: string) => {
    setNetworkSettingState((prev) => ({...prev, openedCard}))
  },[])

  // Wifi機能が利用可能かどうか取得する
  const getWifiAvailable = useCallback(async () => {
    try {
      const response = await soloGetWiFiFunctionsAvailable({ transport })

      if(response) {
        setNetworkSettingState((prev) => ({...prev, wifiAvailable: response.available}))
        if(!response.available) {
          setNetworkSettingState((prev) => ({...prev, wifiEnabled: false}))
          return false
        }
        else {
          return true
        }
      }
      else {
        return false
      }
    }
    catch (e) {
      return false
    }
  },[])

  // Wifi機能が有効化どうか取得する
  const getWifiEnable = useCallback(async () => {
    try {
      const response = await soloCheckWiFiEnabled({ transport });

      if(response) {
        setNetworkSettingState((prev) => ({...prev, wifiEnabled: response.enable}))
        return response.enable
      }
      else {
        return null
      }
    }
    catch (e) {
      return null
    }
  },[])

  // 接続中のネットワークインターフェースを取得する
  const getActiveNetworkInterfaces = useCallback(async () => {
    try {
      const response = await soloGetDeviceActiveNetworkInterfaces({ transport })

      if(response) {
        const activeNetworkInterfaces: ActiveNetworkInterfaceType[] = response.interfaces.map(({ name, ipv4Addr, macAddr }) => {
          return {
            interfaceName: name,
            ipv4Addr,
            macAddr
          }
        })

        activeNetworkInterfaces.sort(({interfaceName}) => { return interfaceName === 'eth0' ? -1 : 1 })

        setNetworkSettingState((prev) => ({...prev, activeNetworkInterfaces}))
        return true
      }
      else {
        return false
      }
    }
    catch (e) {
      return false
    }
  },[])

  // 周辺ネットワークを取得する
  const getWifiNetworks = useCallback(async () => {
    try {
      const response = await soloGetWiFiNetworks({ transport })

      if (response) {
        const accesspoints: AccesspointType[] = response.networks.filter(({ ssid, securities, bssid, mode, signal, channel, inUse }) => {
          if(inUse) {
            setNetworkSettingState((prev) => ({
              ...prev,
                activeNetworkInterfaces: prev.activeNetworkInterfaces.map((prevInterface) => 
                prevInterface.interfaceName === "wlan0" ? 
                { ...prevInterface, wifi: { ssid, securities, bssid, mode, signal, channel } } : 
                prevInterface
              )
            }))
          }
          else {
            return {
              ssid,
              bssid,
              mode,
              securities,
              signal,
              channel
            }
          }
        })

        accesspoints.sort((a,b) => { 
          if (a.signal > b.signal) { return -1 }
          else if(a.signal < b.signal) { return 1 }
          return 0;
        })

        setNetworkSettingState((prev) => ({...prev, accesspoints}))
        return true
      }
      else {
        return false
      }
    }
    catch (e) {
      return false
    }
  },[]) 

  // Wifi機能切替
  const switchEnableWiFi = useCallback(async (enabled: boolean) => {
    try {
      if(enabled) {
       const result = await disableWiFi()
       return result
      }
      else {
        const result = await enableWiFi()
        return result
      }
    }
    catch (e) {
      return false
    }
  },[])

  // Wifi有効化
  const enableWiFi = useCallback(async () => {
    try {
      const response = await soloEnableWiFi({ transport })

      if(response) {
        setNetworkSettingState((prev) => ({...prev, wifiEnabled: response.success}))

        update(true)

        return true
      }
      else {
        return false
      }
    }
    catch (e) {
      return false
    }
  },[])

  // Wifi無効化
  const disableWiFi = useCallback(async () => {
    try {
      const response = await soloDisableWiFi({ transport })

      if(response) {
        setNetworkSettingState((prev) => ({...prev, wifiEnabled: false}))
        update(true)

        return true
      }
      else {
        return false
      }
    }
    catch (e) {
      return false
    }
  },[])

  // Wifi接続
  const connectToNewWiFiNetwork = useCallback(async (ssid: string, password: string) => {
    try {
      const res = await soloGetWiFiAPIPublicKey({ transport })
      if (!res) return false

      const encryptSSID = await encryptPlainText({ plainText: ssid, pemPublicKey: res.key });
      const encryptPassword = await encryptPlainText({ plainText: password, pemPublicKey: res.key });

      const response = await soloConnectToNewWiFiNetwork({ transport: wifiTransport, ssid: encryptSSID, password: encryptPassword })
      if(!response) return false
      
      return await update(false)
    }
    catch (e) {
      return false
    }
  },[])

  // Wifi切断
  const disconnectFromWiFiNetwork = useCallback(async (ssid: string) => {
    try {
      const response = await soloDisconnectFromWiFiNetwork({ transport, ssid })
      
      if(response) {

        return await update(false)
      }
      else {
        return false
      }
    }
    catch (e) {
      return false
    }
  },[])

  return {
    networkSettingState,
    selectOpenedCard,
    switchEnableWiFi,
    connectToNewWiFiNetwork,
    disconnectFromWiFiNetwork
  }
}