import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react"
import { useDevices } from "../globalContexts/DeviceContext";
import { getExtrinsicData, getIntrinsicData } from "../utilities/getXml";
import { useSoloSubscribeEventListener } from "../globalContexts/SoloSubscribeEventContext";
import { EventType, SubscribeEventResponse } from "../gen/solo/v1/solo_pb";
import { useCalibrationMode } from "../globalContexts/CalibrationTypeContext";
import { useMessages } from "../globalContexts/MessagesContext";
import { ApplicationMessageEvent, ApplicationMessageType } from "../types/common";
import { useNavigate } from "react-router-dom";

export const useCalibrationResults = (props: { navigator?: { message: string, path: string } }) => {
  const { navigator } = props
  const [intrinsicResult, setIntrinsicResult] = useState(false);
  const [extrinsicResult, setExtrinsicResult] = useState(false);
  const navigate = useNavigate()
  const { devices, isLoading, error } = useDevices();
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener();
  const { addMessage } = useMessages();
  const { calibrationConfig } = useCalibrationMode();
  const queryKey = `getCalibrationResultAll_${calibrationConfig.calType}`;
  
  const getCalibrationResults = useCallback(async () => {
    if(calibrationConfig.calType==="wand") {
      const res = await Promise.all(devices.map(({transport, ipv4Addr}) => getExtrinsicData(transport, ipv4Addr)))
      const extrinsicSucceed = res.every(result => result.success && result.status===3);
      const intrinsicSucceed = res.every(result => result.success && !(result.data.distortion.every(value => value === 0)));
      return { calType: "wand", extrinsic: extrinsicSucceed, intrinsic: intrinsicSucceed }
    } else {
      const res = await Promise.all(
        devices.map(async ({ transport, ipv4Addr }) => {
          const extrinsic = await getExtrinsicData(transport, ipv4Addr)
          const intrinsic = await getIntrinsicData(transport, ipv4Addr)
          return { extrinsic, intrinsic }
        })
      )

      const extrinsicSucceed = res.every(result => result.extrinsic.success && result.extrinsic.status===3);
      const intrinsicSucceed = res.every(result => result.intrinsic.success && result.intrinsic.status===3);
      return { calType: "chessboard", extrinsic: extrinsicSucceed, intrinsic: intrinsicSucceed }
    }
  },[calibrationConfig.calType, devices])
  
  const queryClient = useQueryClient();
  const results = useQuery({ 
    queryKey: [queryKey], 
    queryFn: getCalibrationResults, 
    staleTime: 1000,
    enabled: !isLoading && !error
  })

  useEffect(() => {
    if(isLoading || error) return;
    const unsubscribes: (() => void)[] = [];

    devices.forEach(({ ipv4Addr }) => {
      const listener = (event: SubscribeEventResponse) => {
        switch(event.type) {
          case EventType["CALIB_INTRINSIC_IMAGE_REMOVED"]:
          case EventType["CALIB_INTRINSIC_CALC_SUCCESS"]:
          case EventType["CALIB_INTRINSIC_CALC_FAILURE"]:
          case EventType["CALIB_EXTRINSIC_CALC_FAILURE"]:  
            queryClient.invalidateQueries({
              queryKey: [queryKey]
            })
            break;
          case EventType["CALIB_EXTRINSIC_CALC_SUCCESS"]:
            queryClient.invalidateQueries({
              queryKey: [queryKey]
            })

            if(navigator) {
              const succeedMessage: Omit<ApplicationMessageType, 'messageId'> = {
                type: ApplicationMessageEvent["SUCCESS_CALIBRATED_RESULT"],
                title: '成功🎉',
                content:  navigator.message,
                onConfirmTitle: 'はい',
                onConfirm: () => navigate(navigator.path)
              }

              addMessage(
                succeedMessage,
                ApplicationMessageEvent["SUCCESS_CALIBRATED_RESULT"]
              ) 
            }
            break;
        }
      }

      unsubscribes.push(subscribeSoloEventListener(ipv4Addr, listener))
    })

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe())
    }
}, [subscribeSoloEventListener, isLoading, error])

  useEffect(() => {
    if (results.data) {
      setExtrinsicResult(results.data.extrinsic)
      setIntrinsicResult(results.data.intrinsic)
    }
  },[results, calibrationConfig.calType])

  return { intrinsicResult, extrinsicResult }
}