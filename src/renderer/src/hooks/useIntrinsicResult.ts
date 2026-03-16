import { useEffect, useState } from "react"
import { useDevices } from "../globalContexts/DeviceContext";
import { useSoloSubscribeEventListener } from "../globalContexts/SoloSubscribeEventContext";
import { getIntrinsicData } from "../utilities/getXml";
import { EventType, SubscribeEventResponse } from "../gen/solo/v1/solo_pb";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { soloApiKeys } from "../types/common";
import { useCalibrationMode } from "../globalContexts/CalibrationTypeContext";

export const useIntrinsicResult = () => {
  const { devices } = useDevices()
  const { calibrationConfig } = useCalibrationMode() 
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener()
  const [ intrinsicResult, setIntrinsicResult ] = useState(false)
  const queryClient = useQueryClient();

  const getIntrinsicDataResults = useQueries({
    queries: devices.map(({ ipv4Addr, transport }) => ({
      queryKey: soloApiKeys.detail('getIntrinsicData', ipv4Addr),
      queryFn: () => calibrationConfig.calType === "chessboard" && getIntrinsicData(transport,ipv4Addr),
    }))
  })

  useEffect(() => {
      const unsubscribes: (() => void)[] = [];

      devices.forEach(({ ipv4Addr }) => {
        const listener = (event: SubscribeEventResponse) => {
          switch(event.type) {
            case EventType["CALIB_INTRINSIC_IMAGE_REMOVED"]:
            case EventType["CALIB_INTRINSIC_CALC_SUCCESS"]:
            case EventType["CALIB_INTRINSIC_CALC_FAILURE"]:
              queryClient.invalidateQueries({
                queryKey: soloApiKeys.detail('getIntrinsicData', ipv4Addr)
              })
              break;
            case EventType["CALIB_EXTRINSIC_CALC_SUCCESS"]:
            case EventType["CALIB_EXTRINSIC_CALC_FAILURE"]:
              queryClient.invalidateQueries({
                queryKey: soloApiKeys.detail('getIntrinsicData', ipv4Addr)
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
    const succeed = getIntrinsicDataResults.every(result => result.data && result.data.success && result.data.status === 3);
    
    setIntrinsicResult(succeed);

  }, [getIntrinsicDataResults])

  return {
    intrinsicResult
  }
}