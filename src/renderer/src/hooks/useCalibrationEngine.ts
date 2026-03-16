import { useEffect, useState } from "react"
import { useDevices } from "../globalContexts/DeviceContext";
import { useSoloSubscribeEventListener } from "../globalContexts/SoloSubscribeEventContext";
import { EventType, SubscribeEventResponse } from "../gen/solo/v1/solo_pb";
import { useQueryClient } from "@tanstack/react-query";
import { soloApiKeys } from "../types/common";
import { useQueriesGetCalibrationEngineStatus } from "./useCustomQuery";

export const useCalibrationEngine = (): boolean => {
  const { devices } = useDevices()
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener()
  const [ isCalibration, setIsCalibration ] = useState(false);
  const queryClient = useQueryClient();

  const cameras = devices.map(({ipv4Addr, transport}) => { return {ipv4Addr, transport} })
  const getCalibrationEngineStatusResults = useQueriesGetCalibrationEngineStatus({ devices: cameras })

  useEffect(() => {
      const unsubscribes: (() => void)[] = [];

      devices.forEach(({ ipv4Addr }) => {
        const listener = (event: SubscribeEventResponse) => {
          switch(event.type) {
            case EventType["CALIB_INTRINSIC_CALC_STARTED"]:
            case EventType["CALIB_EXTRINSIC_CALC_STARTED"]:
            case EventType["CALIB_INTRINSIC_IMAGE_REMOVED"]:
            case EventType["CALIB_INTRINSIC_CALC_SUCCESS"]:
            case EventType["CALIB_INTRINSIC_CALC_FAILURE"]:
            case EventType["CALIB_EXTRINSIC_CALC_SUCCESS"]:
            case EventType["CALIB_EXTRINSIC_CALC_FAILURE"]:
              queryClient.invalidateQueries({
                queryKey: soloApiKeys.detail('GetCalibrationEngineStatus', ipv4Addr)
              })
              break;
          }
        }

        unsubscribes.push(subscribeSoloEventListener(ipv4Addr, listener))
      })

      return () => {
        unsubscribes.forEach(unsubscribe => unsubscribe())
      }
  }, [subscribeSoloEventListener])

  useEffect(() => {
    const isAnyCalibartionBusy = getCalibrationEngineStatusResults.some(result => result.data && result.data.status === 2);
   
    setIsCalibration(isAnyCalibartionBusy);

  }, [getCalibrationEngineStatusResults])

  return isCalibration
}