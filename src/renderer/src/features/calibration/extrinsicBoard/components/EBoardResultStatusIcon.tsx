import { CircularProgress, CircularProgressProps, SxProps, Theme } from "@mui/material";
import { FC, memo, useEffect, useMemo, useState } from "react";
import { CheckCircle, Error } from "@mui/icons-material";
import { Transport } from "@connectrpc/connect";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useMessages } from "../../../../globalContexts/MessagesContext";
import { useSoloSubscribeEventListener } from "../../../../globalContexts/SoloSubscribeEventContext";
import { useNotifications } from "../../../../globalContexts/NotificationContext";
import { useQueryGetCalibrationEngineStatus, useQueryGetExtrinsicData } from "../../../../hooks/useCustomQuery";
import { EventType, SubscribeEventResponse } from "../../../../gen/solo/v1/solo_pb";
import { ApplicationMessageEvent, ApplicationMessageType, ExtrinsicCalibStatus, GetExtrinsicDataResponse, soloApiKeys } from "../../../../types/common";
import { MessageType } from "../../../../gen/quartet/v1/quartet_pb";
import { StatusExtrinsicCode } from "../types";

export const EBoardResultStatusIcon: FC<{
  nodeRef?: any,
  attributes?: any,
  listeners?: any,
  nickname: string,
  transport: Transport,
  ipv4Addr: string,
  progressProps?: CircularProgressProps,
  iconSx?: SxProps<Theme>,
  add: (ipv4Addr: string) => void,
  remove: (ipv4Addr: string) => void,
  send?: boolean,
  navigator?: { navigateText: string, path: string },
}> = memo(({
  nodeRef, navigator, attributes, listeners, nickname, transport, ipv4Addr, progressProps, iconSx, add, remove, send=true
}) => {
  const { addMessage } = useMessages()
  const navigate = useNavigate()
  const [ open, setOpen ] = useState(false);
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener();
  const [ isCalibration, setIsCalibration ] = useState(false);
  const [ data, setData ] = useState<GetExtrinsicDataResponse | null>(null);
  const { addNotification } = useNotifications()
  const [shouldSendNotification, setShouldSendNotification] = useState(false);
  const getCalibrationEngineStatus = useQueryGetCalibrationEngineStatus({ ipv4Addr, transport })
  const getExtrinsicCalibData = useQueryGetExtrinsicData({ ipv4Addr, transport })
  const queryClient = useQueryClient();

  const status = (data: GetExtrinsicDataResponse | null) => {
    if(!data || !data.success) {
      return <CheckCircle sx={{ color: "grey" , ...iconSx}}/>
    }

    switch(data.status) {
      case 0 : 
        return (<CheckCircle sx={{ color: "grey" , ...iconSx}}/>)
      case 3 : 
        return (<CheckCircle sx={{ color: "success.main" , ...iconSx}}/>)
      case -5: 
        return (<Error sx={{ color: "error.main" , ...iconSx}}/>)
      default:  
        return <CheckCircle sx={{ color: "grey" , ...iconSx}}/>
    }
  }

  const logText = useMemo(() => {
    if(data && data.success) {
      return StatusExtrinsicCode.map(({ status, document }) => { if(status === data.status) { return document } return; })
    } 
  },[data])

  useEffect(() => {
    const listener = async (event: SubscribeEventResponse) => {
      switch(event.type) {
        case EventType["CALIB_INTRINSIC_CALC_STARTED"]:
        case EventType["CALIB_EXTRINSIC_CALC_STARTED"]:
          queryClient.fetchQuery({queryKey: soloApiKeys.detail('GetCalibrationEngineStatus', ipv4Addr)});
          break;
        case EventType["CALIB_INTRINSIC_IMAGE_REMOVED"]:
        case EventType["CALIB_INTRINSIC_CALC_SUCCESS"]:
        case EventType["CALIB_INTRINSIC_CALC_FAILURE"]:
          queryClient.fetchQuery({queryKey: soloApiKeys.detail('GetCalibrationEngineStatus', ipv4Addr)});
          queryClient.fetchQuery({queryKey: soloApiKeys.detail('getExtrinsicData', ipv4Addr)})
          break;
        case EventType["CALIB_EXTRINSIC_CALC_SUCCESS"]:
          queryClient.fetchQuery({queryKey: soloApiKeys.detail('GetCalibrationEngineStatus', ipv4Addr)});
          queryClient.fetchQuery({queryKey: soloApiKeys.detail('getExtrinsicData', ipv4Addr)})
          if(send) {
            setShouldSendNotification(true)
          }
          if(navigator) {
            const succeedMessage: Omit<ApplicationMessageType, 'messageId'> = {
              type: ApplicationMessageEvent["SUCCESS_CALIBRATED_RESULT"],
              title: '成功🎉',
              content:  navigator.navigateText,
              onConfirmTitle: 'はい',
              onConfirm: () => navigate(navigator.path)
            }
  
            addMessage(
              succeedMessage,
              ApplicationMessageEvent["SUCCESS_CALIBRATED_RESULT"]
            ) 
          }
          break;
        case EventType["CALIB_EXTRINSIC_CALC_FAILURE"]:
          queryClient.fetchQuery({queryKey: soloApiKeys.detail('GetCalibrationEngineStatus', ipv4Addr)});
          queryClient.fetchQuery({queryKey: soloApiKeys.detail('getExtrinsicData', ipv4Addr)})
          if(send) {
            setShouldSendNotification(true)
          }
          break;
      }
    }

    const unsubsribe = subscribeSoloEventListener(ipv4Addr,listener)

    return () => unsubsribe()
  },[subscribeSoloEventListener])

  useEffect(() => {
    if(getCalibrationEngineStatus.isFetched) {
      const res = getCalibrationEngineStatus.data
      if(res) {
        if(res.status===2) {
          setIsCalibration(true);
          add(ipv4Addr)
        }
        else {
          setIsCalibration(false)
          remove(ipv4Addr)
        }
      }
    }
  },[getCalibrationEngineStatus.data, getCalibrationEngineStatus.isFetched])

  useEffect(() => {
    if(getExtrinsicCalibData.isFetched) {
      const res = getExtrinsicCalibData.data;
      if(res && res.success) {
        setData(res)
        if(shouldSendNotification) {
          sendNotification({ rms: res.data.rms, result: res.status })
          setShouldSendNotification(false)
        }    
      } else {
        setData(null)
      }
    }
  },[getExtrinsicCalibData.data, getExtrinsicCalibData.isFetched])

  const sendNotification = async (data: { rms: number, result: ExtrinsicCalibStatus }) => {
    const currTime = new Date().toLocaleString()
    const result = data.result === ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_EXIST_FILE'] ? '成功' : '失敗';
    const rmsValue = data.result === ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_EXIST_FILE'] ? data.rms.toFixed(2) : '---';
    let message = "";
    switch(data.result) {
      case ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_ERROR_DEVICES_LIST']:
        message = `<${result}> ${nickname}, カメラ未接続`
        break;
      case ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_ERROR_RUN']:
        message = `<${result}> ${nickname}, 計算未実行`
        break;
      case ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_ERROR_EMPTY_SNAP']:
        message = `<${result}> ${nickname}, 撮影失敗`
        break;
      case ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_ERROR_LOCK']:
        message = `<${result}> ${nickname}, 他計算中のため中止`
        break;
      case ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_ERROR_EXIST']:
        message = `<${result}> ${nickname}, 計算失敗`
        break;
      default:
        message = `<${result}> ${nickname}, RMS:${rmsValue}`
        break;
    }

    addNotification({
      type: result==="成功"? MessageType.SUCCESS : MessageType.ERROR,
      header: '計算結果 | カメラ位置と姿勢',
      data: message,
      time: currTime
    })
  }

  return (
    <div 
      ref={nodeRef} 
      {...listeners} 
      {...attributes} 
      title={logText} 
      onClick={() => { setOpen(!open) }} 
      onMouseOver={() => { setOpen(true) }} 
      onMouseLeave={() => { setOpen(false) }}
    >
      { isCalibration ? <CircularProgress size={20} {...progressProps} sx={{ ...iconSx }}/> : status(data) }
    </div>
  )
})