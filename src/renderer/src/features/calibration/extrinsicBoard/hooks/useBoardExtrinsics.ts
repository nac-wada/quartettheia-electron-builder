import { useCallback, useState } from "react";
import { MessageModalProps } from "../../../../types/common";
import { BoardExtrinsicsModel, BoardExtrinsicsViewModel } from "../types";

export const useChessboardExtrinsicCalState = () : BoardExtrinsicsViewModel => {
  const [ chessboardCalExState, setChessboardCalExState ] = useState<BoardExtrinsicsModel>({ shutter: false, message: null })
  
  const openMessage = useCallback((message: MessageModalProps) => {
    try {
      setChessboardCalExState((prev) => ({ ...prev, message}))
    }
    catch {

    }
  },[])

  const closeMessage = useCallback(() => {
    try {
      setChessboardCalExState((prev) => ({...prev, message: null}))
    }
    catch {

    }
  },[])

  const showShutterEffect = useCallback(() => {
    try {
      setChessboardCalExState((prev) => ({
        ...prev,
        shutter: true
      }))
      setTimeout(() => setChessboardCalExState((prev) => ({...prev, shutter: false})), 100)
    }
    catch {

    }
  },[])

  return {
    chessboardCalExState,
    openMessage,
    closeMessage,
    showShutterEffect
  }
} 