import { useQueries, useQuery } from "@tanstack/react-query"
import { soloCheckInternetConnection, soloGetCalibrationEngineStatus, soloGetCalibratorDetectionMode, soloGetCameraExposure, soloIsDeviceSyncEstablished } from "../api/soloAPI"
import { Transport } from "@connectrpc/connect"
import { getExtrinsicData, getIntrinsicData } from "../utilities/getXml"
import { soloApiKeys } from "../types/common"

export const useQueryIsDeviceSyncEstablished = ({ ipv4Addr, transport }:{ ipv4Addr: string, transport: Transport }) => {
  const data = useQuery({
    queryKey: soloApiKeys.detail('IsDeviceSyncEstablished', ipv4Addr),
    queryFn: () => soloIsDeviceSyncEstablished({ transport }),
    staleTime: 1000
  })

  return data
}

export const useQueriesIsDeviceSyncEstablished = ({ devices }:{ devices: {ipv4Addr: string, transport: Transport}[] }) => {
  const queries = devices.map(({ipv4Addr, transport}) => ({
    queryKey: soloApiKeys.detail('IsDeviceSyncEstablished', ipv4Addr),
    queryFn: () => soloIsDeviceSyncEstablished({ transport }),
    staleTime: 1000
  }))

  const data = useQueries({ queries: queries })

  return data
}

export const useQueriesGetCalibrationEngineStatus = ({ devices }: { devices: {ipv4Addr: string, transport: Transport}[] }) => {
  const queries = devices.map(({ipv4Addr, transport}) => ({
    queryKey: soloApiKeys.detail('GetCalibrationEngineStatus', ipv4Addr),
    queryFn: () => soloGetCalibrationEngineStatus({ transport }),
    staleTime: 1000
  }))

  const data = useQueries({ queries: queries })

  return data
}

export const useQueryGetCalibrationEngineStatus = ({ ipv4Addr, transport }: { ipv4Addr: string, transport: Transport }) => {
  const data = useQuery({
    queryKey: soloApiKeys.detail('GetCalibrationEngineStatus', ipv4Addr),
    queryFn: () => soloGetCalibrationEngineStatus({ transport }),
    staleTime: 1000
  })

  return data
}

export const useQueryGetIntrinsicData = ({ ipv4Addr, transport }:{ ipv4Addr: string, transport: Transport }) => {
  const data = useQuery({
    queryKey: soloApiKeys.detail('getIntrinsicData', ipv4Addr),
    queryFn: () => getIntrinsicData(transport, ipv4Addr),
    staleTime: 500
  })

  return data
}

export const useQueryGetExtrinsicData = ({ ipv4Addr, transport }:{ ipv4Addr: string, transport: Transport }) => {
  const data = useQuery({
    queryKey: soloApiKeys.detail('getExtrinsicData', ipv4Addr),
    queryFn: () => getExtrinsicData(transport, ipv4Addr),
    staleTime: 500
  })

  return data
}

export const useQueryCheckInternetConnection = ({ ipv4Addr, transport }:{ ipv4Addr: string, transport: Transport }) => {
  const TEST_ADDRESS = 'google.com';
  const data = useQuery({
    queryKey: soloApiKeys.detail('CheckInternetConnection', ipv4Addr),
    queryFn: () => soloCheckInternetConnection({ transport, address: TEST_ADDRESS }),
    staleTime: 1000
  })

  return data
}

export const useQueryGetExposure = ({ ipAddr, transport }:{ ipAddr: string, transport: Transport }) => {
  const data = useQuery({
    queryKey: soloApiKeys.detail('GetCameraExposure', ipAddr),
    queryFn: () => soloGetCameraExposure({ transport }),
    staleTime: 1000
  })

  return data
}

export const useQueryGetCalibratorDetectionMode = ({ ipv4Addr, transport }:{ ipv4Addr: string, transport: Transport }) => {
  const data = useQuery({
    queryKey: soloApiKeys.detail('GetCalibratorDetectionMode', ipv4Addr),
    queryFn: () => soloGetCalibratorDetectionMode({ transport }),
    staleTime: 500
  })

  return data
}