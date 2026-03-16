import { useDevices } from "../globalContexts/DeviceContext"
import { useEffect, useState } from "react"
import { useSoloSubscribeEventListener } from "../globalContexts/SoloSubscribeEventContext";
import { getExtrinsicData } from "../utilities/getXml";
import { EventType, SubscribeEventResponse } from "../gen/solo/v1/solo_pb";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useMessages } from "../globalContexts/MessagesContext";
import { ApplicationMessageEvent, ApplicationMessageType, soloApiKeys } from "../types/common";
import { useNavigate } from "react-router-dom";

export const useActiveLightCalResult = (props: { navigator?: { message: string, path: string } }) => {
  const { navigator } = props
  const { addMessage } = useMessages()
  const navigate = useNavigate()
  const { devices } = useDevices()
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener()
  const queryClient = useQueryClient();
  const getExtrinsicResults = useQueries({
    queries: devices.map(({ ipv4Addr, transport }) => ({
      queryKey: soloApiKeys.detail('getExtrinsicData', ipv4Addr),
      queryFn: () => getExtrinsicData(transport,ipv4Addr),
    }))
  })

  const [ lFrameResult, setLFrameResult ] = useState(false);
  const [ tWandResult, setTWandResult ] = useState(false);

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    devices.forEach(({ ipv4Addr }) => {
      const listener = (event: SubscribeEventResponse) => {
        switch(event.type) {
          case EventType["CALIB_INTRINSIC_IMAGE_REMOVED"]:
          case EventType["CALIB_INTRINSIC_CALC_SUCCESS"]:
          case EventType["CALIB_INTRINSIC_CALC_FAILURE"]:
          case EventType["CALIB_EXTRINSIC_CALC_FAILURE"]:
            queryClient.invalidateQueries({
              queryKey: soloApiKeys.detail('getExtrinsicData', ipv4Addr)
            })
            break;
          case EventType["CALIB_EXTRINSIC_CALC_SUCCESS"]:
            queryClient.invalidateQueries({
              queryKey: soloApiKeys.detail('getExtrinsicData', ipv4Addr)
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
  }, [subscribeSoloEventListener])

  useEffect(() => {

    const lFrameSucceed = getExtrinsicResults.every(result => result.data && result.data.success && result.data.status === 3);
    const tWandSucceed = getExtrinsicResults.every(result => result.data && result.data.success && !(result.data.data.distortion.every(value => value === 0)))

    setLFrameResult(lFrameSucceed)
    setTWandResult(tWandSucceed)

  },[getExtrinsicResults])

  return {
    lFrameResult,
    tWandResult
  }
}