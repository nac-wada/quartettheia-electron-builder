import { useCallback, useState } from "react";
import { VideoType, MessageModalProps } from "../../../../types/common";
import { trimMp4 } from "../utils/trimming";
import { ReplayFormModel, ReplayFormViewModel, TrimMp4RequestProps } from "../types";

export const useReplayFormState = (): ReplayFormViewModel => {
  const [ replayFormState, setReplayFromState ] = useState<ReplayFormModel>({
    masterId: 0,
    control: {
      played: 0,
      playing: false,
      seeking: false,
      duration: null,
      clipRange: null,
    },
    options: {
      singleMode: false,
      loop: false,
      playbackRate: 1,
      rangePlayMode: false,
      downloading: false,
      clipping: false
    },
    dialog: null
  })

  const clippingMessage: MessageModalProps = {
    event: 'warning',
    content:  `
                クリップを作成しています。<br>
                しばらくお待ちください。<br>
              `,
    onClose: () => closeDialog(),
  }

  const clipSuccessMessage: MessageModalProps = {
    event: 'warning',
    content: `クリップが完成しました。<br>`,
    onConfirmTitle: "閉じる",
    onClose: () => closeDialog(),
    onConfirm: () => closeDialog()
  }

  const clipErrorMessage: MessageModalProps = {
    event: 'error',
    content:  `
                エラーが発生しました。<br>
                アプリを再読み込みしてください。<br>
              `,
    onConfirmTitle: '閉じる',
    onClose: () => closeDialog(),
    onConfirm: () => closeDialog()
  }

  const reset = useCallback(() => { setReplayFromState((prev) => ({...prev, masterId: 0, control: { ...prev.control, played: 0, playing: false, seeking: false }})) },[])

  const setMasterId = useCallback((masterId: number) => { setReplayFromState((prev) => ({ ...prev, masterId })) },[])

  const setPlayed = useCallback((played: number) => { setReplayFromState((prev) => ({ ...prev, control: { ...prev.control, played } })) }, [])

  const setPlaying = useCallback((playing: boolean) => { setReplayFromState((prev) => ({ ...prev, control: { ...prev.control, playing } })) }, [])

  const setSeeking = useCallback((seeking: boolean) => { setReplayFromState((prev) => ({ ...prev, control: { ...prev.control, seeking } })) }, [])
  
  const setDuration = useCallback((duration: number) => { setReplayFromState((prev) => ({ ...prev, control: { ...prev.control, duration } })) }, [])
  
  const setClipRange = useCallback((clipRange: number[]) => { setReplayFromState((prev) => ({ ...prev, control: { ...prev.control, clipRange } })) }, [])

  const setChangeMode = useCallback((singleMode: boolean) => { setReplayFromState((prev) => ({ ...prev, options: { ...prev.options, singleMode } })) },[])
  
  const setLoop = useCallback((loop: boolean) => { setReplayFromState((prev) => ({ ...prev, options: { ...prev.options, loop } })) },[])
  
  const setPlaybackRate = useCallback((playbackRate: number) => { setReplayFromState((prev) => ({ ...prev, options: { ...prev.options, playbackRate } })) },[])

  const setRangePlayMode = useCallback((rangePlayMode: boolean) => { setReplayFromState((prev) => ({ ...prev, options: { ...prev.options, rangePlayMode } })) },[])

  const setDownload = useCallback((downloading: boolean) => { setReplayFromState((prev) => ({ ...prev, options: { ...prev.options, downloading } })) },[])
  
  const setClipping = useCallback((clipping: boolean) => { setReplayFromState((prev) => ({ ...prev, options: { ...prev.options, clipping } })) },[])

  const openDialog = useCallback((dialog: MessageModalProps) => { setReplayFromState((prev) => ({ ...prev, dialog })) },[])

  const closeDialog = useCallback(() => { setReplayFromState((prev) => ({ ...prev, dialog: null })) },[])

  const downloadMp4 = useCallback(() => {  },[])

  const downloadMp4Group = useCallback(() => {  },[])



  const clipMp4 = useCallback(async (req: TrimMp4RequestProps) => {
    openDialog(clippingMessage)

    const result = await trimMp4(req)

    if (result) {
      openDialog(clipSuccessMessage)
    }
    else {
      openDialog(clipErrorMessage)
    }

  },[])

  const clipMp4Group = useCallback(async (videos: VideoType[], clipRange: number[]) => {
    openDialog(clippingMessage)

    const result = await Promise.all(
      videos.map(async ({ transport, rawSrc }) => {
        const req: TrimMp4RequestProps = { transport, fileName: rawSrc, rangeStart: clipRange[0], rangeEnd: clipRange[1] }
        const res = await trimMp4(req)

        if(res) {
          return { fileName: rawSrc, result: true }
        }
        else {
          return { fileName: rawSrc, result: false }
        }
      })
    )
    
    const errorList = []
    for (const r of result) {
      if(!r.result) {
        errorList.push(r)
      }
    }

    if(errorList.length!==0) {
      openDialog(clipErrorMessage)
    } 
    else {
      openDialog(clipSuccessMessage)
    }
  },[])

  return {
    replayFormState,
    reset,
    setMasterId,
    setPlayed,
    setPlaying,
    setSeeking,
    setDuration,
    setClipRange,
    setChangeMode,
    setLoop,
    setPlaybackRate,
    setRangePlayMode,
    setDownload,
    setClipping,
    openDialog,
    closeDialog,
    downloadMp4,
    downloadMp4Group,
    clipMp4,
    clipMp4Group
  }
}