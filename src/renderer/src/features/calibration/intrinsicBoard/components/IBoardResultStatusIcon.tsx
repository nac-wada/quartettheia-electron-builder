import { CircularProgress } from "@mui/material";
import { FC, memo, useEffect, useMemo, useState } from "react";
import { CheckCircle, Error } from "@mui/icons-material";
import { useSoloSubscribeEventListener } from "../../../../globalContexts/SoloSubscribeEventContext";
import { useNotifications } from "../../../../globalContexts/NotificationContext";
import { MessageType } from "../../../../gen/quartet/v1/quartet_pb";
import { EventType, SubscribeEventResponse } from "../../../../gen/solo/v1/solo_pb";
import { GetIntrinsicDataResponse, IntrinsicCalibStatus, soloApiKeys } from "../../../../types/common";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryGetCalibrationEngineStatus, useQueryGetIntrinsicData } from "../../../../hooks/useCustomQuery";
import { IBoardResultStatusIconProps, StatusIntrinsicCode } from "../types";

export const IBoardResultStatusIcon: FC<IBoardResultStatusIconProps> = memo(({
  nodeRef, attributes, listeners, ipv4Addr, transport, nickname, progressProps, iconSx, send=true, add, remove
}) => {
  const [ open, setOpen ] = useState(false);
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener();
  const [ isCalibration, setIsCalibration ] = useState(false);
  const [ data, setData ] = useState<GetIntrinsicDataResponse | null>(null)
  const { addNotification } = useNotifications()
  const [shouldSendNotification, setShouldSendNotification] = useState(false)
  const getCalibrationEngineStatus = useQueryGetCalibrationEngineStatus({ ipv4Addr, transport })
  const getIntrinsicCalibData = useQueryGetIntrinsicData({ ipv4Addr, transport })
  const queryClient = useQueryClient();

  const status = (data: GetIntrinsicDataResponse | null) => {
    if(!data || !data.success) {
      return (<CheckCircle sx={{ color: "grey" ,...iconSx}}/>)
    }

    switch(data.status) {
      case 0 : 
        return (<CheckCircle sx={{ color: "grey" ,...iconSx}}/>)
      case 3 : 
        return (<CheckCircle sx={{ color: "success.main" ,...iconSx}}/>)
      case -5: 
        return (<Error sx={{ color: "error.main" , ...iconSx}}/>)
      default:  
        return <CheckCircle sx={{ color: "grey" , ...iconSx}}/>
    }
  }

  const logText = useMemo(() => {
    if(data && data.success) {
      return StatusIntrinsicCode.map(({ status, document }) => { if(status === data.status) { return document } return; })
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
          queryClient.fetchQuery({queryKey: soloApiKeys.detail('GetCalibrationEngineStatus', ipv4Addr)});
          queryClient.fetchQuery({queryKey: soloApiKeys.detail('getIntrinsicData', ipv4Addr)});
          break;
        case EventType["CALIB_INTRINSIC_CALC_SUCCESS"]:
        case EventType["CALIB_INTRINSIC_CALC_FAILURE"]:
          queryClient.fetchQuery({queryKey: soloApiKeys.detail('GetCalibrationEngineStatus', ipv4Addr)});
          queryClient.fetchQuery({queryKey: soloApiKeys.detail('getIntrinsicData', ipv4Addr)})
          if(send) {
            setShouldSendNotification(true)
          }
          break;
      }
    }

    const unsubsribe = subscribeSoloEventListener(ipv4Addr, listener)

    return () => unsubsribe()
  },[subscribeSoloEventListener, ipv4Addr, send])

  useEffect(() => {
    if(getCalibrationEngineStatus.isFetched) {
      const res = getCalibrationEngineStatus.data;
      if(res) {
        if(res.status===2) {
          setIsCalibration(true);
          add(ipv4Addr)
        } else {
          setIsCalibration(false);
          remove(ipv4Addr)
        }
      }
    }
  },[getCalibrationEngineStatus.data, getCalibrationEngineStatus.isFetched])

  useEffect(() => {
    if(getIntrinsicCalibData.isFetched) {
      const res = getIntrinsicCalibData.data;
      if(res && res.success) {
        setData(res)
        if(shouldSendNotification) {
          sendNotification({ rms: res.data.rms, result: res.status });
          setShouldSendNotification(false)
        }
      } else {
        setData(null)
      }
    }
  },[getIntrinsicCalibData.data, getIntrinsicCalibData.isFetched])

  const sendNotification = async (data: {rms: number, result: IntrinsicCalibStatus} ) => {
    const currTime = new Date().toLocaleString()
    const result = data.result === IntrinsicCalibStatus['STATUS_IN_CALIBRATION_EXIST_FILE'] ? '成功' : '失敗';
    const rmsValue = data.result === IntrinsicCalibStatus['STATUS_IN_CALIBRATION_EXIST_FILE'] ? data.rms.toFixed(2) : '---';
    let message = "";
    switch(data.result) {
      case IntrinsicCalibStatus['STATUS_IN_CALIBRATION_ERROR_DEVICES_LIST']:
        message = `<${result}> ${nickname}, カメラ未接続`
        break;
      case IntrinsicCalibStatus['STATUS_IN_CALIBRATION_ERROR_RUN']:
        message = `<${result}> ${nickname}, 計算未実行`
        break;
      case IntrinsicCalibStatus['STATUS_IN_CALIBRATION_ERROR_EMPTY_SNAP']:
        message = `<${result}> ${nickname}, 撮影失敗`
        break;
      case IntrinsicCalibStatus['STATUS_IN_CALIBRATION_ERROR_LOCK']:
        message = `<${result}> ${nickname}, 他計算中のため中止`
        break;
      case IntrinsicCalibStatus['STATUS_IN_CALIBRATION_ERROR_EXIST']:
        message = `<${result}> ${nickname}, 計算失敗`
        break;
      default:
        message = `<${result}> ${nickname}, RMS:${rmsValue}`
        break;
    }

    addNotification({
      type: result==="成功"? MessageType.SUCCESS : MessageType.ERROR,
      header: '計算結果 | レンズひずみの計算',
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
      { (isCalibration) ? <CircularProgress size={20} {...progressProps} sx={{...iconSx}}/> : status(data) }
    </div>
  )
})