import { useEffect, useState } from "react";
import { CalibratorDetectionMode } from "../gen/solo/v1/solo_pb";
import { useQueryGetCalibratorDetectionMode } from "./useCustomQuery";
import { useDevices } from "../globalContexts/DeviceContext";
import { useQuartetSubscribeEventListener } from "../globalContexts/QuartetSubscribeEventContext";
import { EventType, SubscribeEventResponse } from "../gen/quartet/v1/quartet_pb";
import { QuartetBroadCastCustomEventFlag, soloApiKeys } from "../types/common";
import { useQueryClient } from "@tanstack/react-query";

export const useCalibratorDetectionMode = (): false | CalibratorDetectionMode => {
  const { devices } = useDevices();
  const primaryCamera = devices.find(({ primary }) => primary);
  const queryClient = useQueryClient();
  const { subscribeQuartetEventListener } = useQuartetSubscribeEventListener()
  
  // 初期値は false
  const [mode, setMode] = useState<false | CalibratorDetectionMode>(false);

  const result = useQueryGetCalibratorDetectionMode({ 
    ipv4Addr: primaryCamera!.ipv4Addr, 
    transport: primaryCamera!.transport 
  });

  useEffect(() => {
    // 1. primaryCamera がいない場合は、強制的に false に戻す
    if (!primaryCamera) {
      setMode(false);
      return;
    }

    // 2. データが取得できたら state を更新
    if (result.data) {
      setMode(result.data.mode);
    }
  }, [result.data, primaryCamera]); // result.data と primaryCamera の変化を監視

  useEffect(() => {
    if(primaryCamera) {
      const listener = (event: SubscribeEventResponse) => {
        switch(event.type) {
          case EventType["CUSTOM_EVENT"]:
            const flags = BigInt(QuartetBroadCastCustomEventFlag["SET_CALIBRATOR_DETECTION_MODE"])
            if(event.flags===flags) {
              queryClient.invalidateQueries({
                queryKey: soloApiKeys.detail('GetCalibratorDetectionMode', primaryCamera.ipv4Addr)
              })
              break;
            }
        }
      }

      const unsubscribe = subscribeQuartetEventListener(listener)
      return () => unsubscribe()
    } 
  },[subscribeQuartetEventListener, primaryCamera])

  return mode;
};