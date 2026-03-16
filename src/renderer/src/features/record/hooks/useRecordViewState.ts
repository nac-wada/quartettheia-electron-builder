import { useCallback, useRef, useState } from "react";
import { Duration, timestampFromDate } from "@bufbuild/protobuf/wkt";
import { loadSettingsFromLocalStorage, removeSavedLocalStorage, saveSettingsToLocalStorage } from "../../../utilities/localStorage";
import { FileMetadataType, RecordingKeyStatus } from "../../../gen/quartet/v1/quartet_pb";
import { AIREAL_TOUCH_RECORDINGKEY, localStorage_recording_startTime, localStorage_recording_user, MessageModalProps } from "../../../types/common";
import { quartetGetCurrentTime, quartetGetRecordingKeyStatus, quartetGetRecordingStartTime, quartetStartRecorderWithDuration, quartetStopRecorder } from "../../../api/quartetAPI";
import { checkCameraSyncEstablished } from "../utils/checkCameraSync";
import { changeShowNicknameFuncType, getRecordingStatusFuncType, intervalTimer, localStorage_autoRecord_time, localStorage_scene, localStorage_subjectID, recControlFuncType, RecordViewerModel, RecordViewerViewModel, recStartFuncType, recStopFuncType, updateMetaDatasFuncType, updateRecordingTimeFuncType, updateSelectRecordModeFuncType } from "../types";

const useRecordViwerState = (): RecordViewerViewModel => {
  const key = AIREAL_TOUCH_RECORDINGKEY
  const [ recordViewerState, setRecordViewerState ] = useState<RecordViewerModel>({
    recordTime: 0,
    showNickname: false,
    sceneName: loadSettingsFromLocalStorage(localStorage_scene, "Scene"),
    subjectID: loadSettingsFromLocalStorage(localStorage_subjectID, "Subject"),
    setTime: loadSettingsFromLocalStorage(localStorage_autoRecord_time, 300 ),
    message: null,
  })
  const intervalRef = useRef<any | null>(null);

  // 録画状況の取得
  const getRecordingStatus: getRecordingStatusFuncType = useCallback(async ({ settingTime, status }) => {
    try {
      if(status === RecordingKeyStatus.RECORDING || status === RecordingKeyStatus.RESERVED) {
        const res = await quartetGetRecordingStartTime({ key });
        if(res) {
          const isRecordingUser = await loadSettingsFromLocalStorage(localStorage_recording_user, false);
          if(res.startTime) {
            const time = res.startTime;
            const startTime = await loadSettingsFromLocalStorage(localStorage_recording_startTime, Number(time.seconds)*1000);
            updateRecordingTime({ settingTime, startTime, isRecordingUser })
          }
        } else {
          
        }
      }
      else if(status === RecordingKeyStatus.NOT_EXISTS || status === RecordingKeyStatus.RECORDED) {
        clearInterval(intervalRef.current);
        setRecordViewerState((prev) => ({
          ...prev,
          recordTime: 0,
        }))
      }
    } catch (e) {

    }
  },[])

  // タイマーを更新
  const updateRecordingTime: updateRecordingTimeFuncType = useCallback(({ settingTime, startTime, isRecordingUser }) => {
    clearInterval(intervalRef.current)
    setRecordViewerState((prev) => ({
      ...prev,
      recordTime: 0,
    }))
    intervalRef.current = setInterval(async() => {
      const curr = Date.now();
      const time = curr - startTime;
      const date = new Date(time);
      const recordTime = date.getTime();
      setRecordViewerState((prev) => ({ ...prev, recordTime }))
      if(isRecordingUser && recordTime > settingTime * 1000) { 
        clearInterval(intervalRef.current);
        setRecordViewerState((prev) => ({
          ...prev,
          recordTime: 0
        }))
      }
    }, intervalTimer)
  },[])

  // 録画ボタンの制御
  const recControl: recControlFuncType = useCallback(async ({ settingTime, sceneName, subjectID, devices }) => {
    try {
      const res = await quartetGetRecordingKeyStatus({ key })

      if(res) {
        if(
          res.status === RecordingKeyStatus.RECORDING || 
          res.status === RecordingKeyStatus.RESERVED
        ) {
          const res = await quartetGetCurrentTime();
          if(res) {
            const stopTime = res.timestamp
            recStop({ stopTime })
          }
        }
        else if(res.status === RecordingKeyStatus.RECORDED) {}
        else if(res.status === RecordingKeyStatus.NOT_EXISTS) {
          const unStable = await checkCameraSyncEstablished({ devices })
          if(!unStable.result) {
            openMessage({
              event: 'warning',
              title: "警告",
              content: `
                        カメラ${unStable.list.map(({nickname}) => { return `「${nickname}」` })}が同期していません。<br>
                        同期録画できない可能性があります。このまま録画を続行しますか？
                       `,
              onConfirm: () => {
                recStart({ settingTime, sceneName, subjectID })
                closeMessage()
              },
              onClose: () => closeMessage(),
              onCancel: () => closeMessage()
            })
          }
          else {
            recStart({ settingTime, sceneName, subjectID })
          }
        }
      } else {

      }
    } catch (e) {

    }
  },[])

  const recStart: recStartFuncType = useCallback(async ({ settingTime, sceneName, subjectID }) => {
    try {
      const duration = createDuration(settingTime)
      const fileName = "${key}-${uuid}-${timestamp}${ext}";
      const metadatas = [
        { type: FileMetadataType.SCENE_NAME, data: sceneName },
        { type: FileMetadataType.SUBJECT_ID, data: subjectID }
      ]
      const startRecorderWithDuration = await quartetStartRecorderWithDuration({ key, fileName, duration, metadatas });
      if(startRecorderWithDuration) {
        saveSettingsToLocalStorage(localStorage_recording_user, true)
      } else {

      }
    }
    catch (e) {

    }
  },[])

  // 録画停止
  const recStop: recStopFuncType = useCallback(async ({ stopTime }) => {
    try {
      const blocking = false;
      const res = await quartetStopRecorder({ key, stopTime, blocking })

      if(res) {
        setRecordViewerState((prev) => ({
          ...prev,
          recordTime: 0
        }))
        removeSavedLocalStorage(localStorage_recording_user)
        removeSavedLocalStorage(localStorage_recording_startTime)
        clearInterval(intervalRef.current);
      } else {
        
      }
    } catch (e) {
      removeSavedLocalStorage(localStorage_recording_startTime);
    }
  },[])

  const createDuration = (settingTime: number): Duration => {
    const duration: Duration = {
      $typeName: "google.protobuf.Duration",
      seconds: BigInt(0),
      nanos: 0
    }
    const start = new Date(1000000000000);
    const end = new Date(1000000000000 + settingTime*1000);
    const startTimestamp = timestampFromDate(start);
    const endTimestamp = timestampFromDate(end);
    duration.seconds = endTimestamp.seconds - startTimestamp.seconds;
    duration.nanos = endTimestamp.nanos - startTimestamp.nanos; 
    return duration
  }

  // メタデータの更新
  const updateMetaDatas: updateMetaDatasFuncType = useCallback((value, type) => {
    switch(type) {
      case "sceneName":
        setRecordViewerState((prev) => ({...prev, sceneName: value})); break;
      case "subjectID":
        setRecordViewerState((prev) => ({...prev, subjectID: value})); break;
    }
  },[]);

  const updateSelectRecordMode: updateSelectRecordModeFuncType = useCallback((settingTime) => {
    setRecordViewerState((prev) => ({ ...prev, setTime: settingTime }))
  },[])

  const changeShowNickName: changeShowNicknameFuncType = useCallback(({ isShow }) => {
    setRecordViewerState((prev) => ({ ...prev, showNickname: isShow }))
  },[])

  const openMessage = useCallback((message: MessageModalProps) => {
    setRecordViewerState((prev) => ({ ...prev, message }))
  },[])

  const closeMessage = useCallback(() => {
    setRecordViewerState((prev) => ({ ...prev, message: null }))
  },[])
  
  return {
    recordViewerState,
    getRecordingStatus,
    recControl,
    recStart,
    recStop,
    updateRecordingTime,
    updateMetaDatas,
    updateSelectRecordMode,
    changeShowNickName,
    openMessage,
    closeMessage
  }
}

export { useRecordViwerState }

