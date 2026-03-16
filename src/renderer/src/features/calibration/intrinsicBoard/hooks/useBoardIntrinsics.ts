import { useCallback, useEffect, useState } from "react";
import { Transport } from "@connectrpc/connect";
import { DeviceInfomation } from "../../../../types/common";
import { CalibrationLocation } from "../../../../gen/solo/v1/solo_pb";
import { soloGetIntrinsicCalibrationSnapshotsCount, soloResetCalibrationSnapshots, soloTakeIntrinsicCalibrationSnapshot } from "../../../../api/soloAPI";
import { BoardIntrinsicsModel, BoardIntrinsicsViewModel, CameraSnapshotsType, changeGridModeFuncType, changeSelectedAreaFuncType, changeSnapshotModeFuncType, changeTargetCameraFuncType, closeMessageFuncType, openMessageFuncType, removeAllCalibrationSnapshotsFuncType, removeCalibrationSnapshotsFuncType, setUpCameraListFuncType, takeCalibrationSnapshotsFuncType } from "../types";

const useBoardIntrinsics = ({ devices }:{ devices: DeviceInfomation[] }): BoardIntrinsicsViewModel => {
  const [ autoMode, setAutoMode ] = useState(false);
  const [ chessboardCalState, setChessboardCalState ] = useState<BoardIntrinsicsModel>({
    shutter: false,
    takingSnap: false,
    targetCamera: 0,
    message: null,
    errorMessageList: [],
    cameraList: [],
    gridMode: true,
    selectedArea: 0,
  })

  useEffect(() => {
    setUpCameraList()
  },[])

  // カメラのスナップショットを取得する
  const setUpCameraList: setUpCameraListFuncType = useCallback(() => {
    try {
      devices.map(async ({ ipv4Addr, transport }) => {
        
        let snapshots: CameraSnapshotsType = {
          TOP_LEFT: null,
          TOP_CENTER: null,
          TOP_RIGHT: null,
          BOTTOM_LEFT: null,
          BOTTOM_CENTER: null,
          BOTTOM_RIGHT: null,
          CENTER: null
        }

        await Promise.all(
          Object.keys(snapshots).map(async (_, index) => {
            const location = index + 2
            const count = await selectPositionSnapshotCount({ location, transport })
            switch (location) {
              case 2: snapshots.TOP_LEFT = count; break;
              case 3: snapshots.TOP_CENTER = count; break;
              case 4: snapshots.TOP_RIGHT = count; break;
              case 5: snapshots.BOTTOM_LEFT = count; break;
              case 6: snapshots.BOTTOM_CENTER = count; break;
              case 7: snapshots.BOTTOM_RIGHT = count; break;
              case 8: snapshots.CENTER = count; break;
            }
          })
        )
        
        setChessboardCalState((prev) => ({
          ...prev,
          cameraList: [...prev.cameraList, { ipv4Addr, snapshots }]
        }))
      })
    } catch {

    }
  },[])

  // メインカメラに表示するカメラを切り替える
  const changeTargetCamera: changeTargetCameraFuncType = useCallback(({ id }) => {
    try {
      setChessboardCalState((prev) => ({
        ...prev,
        targetCamera: id
      }))
    } catch {

    }
  },[])

  // 選択エリアを切り替える
  const changeSelectedArea: changeSelectedAreaFuncType = useCallback(({ index }) => {
    try {
      setChessboardCalState((prev) => ({
        ...prev,
        selectedArea: index
      }))
    } catch {

    }
  },[])

  // 1x1 ↔ 2x3に表示を切替える
  const changeGridMode: changeGridModeFuncType = useCallback(({ gridMode }) => {
    try {
      setChessboardCalState((prev) => ({
        ...prev,
        gridMode: gridMode
      }))

      if(!gridMode) {
        setChessboardCalState((prev) => ({
          ...prev,
          selectedArea: 0,
        }))
      }
    } catch {

    }
  },[])

  const showShutterEffect = useCallback(() => {
    try {
      setChessboardCalState((prev) => ({
        ...prev,
        takingSnap: true,
        shutter: true,
      }))

      setTimeout(() => {
        setChessboardCalState((prev) => ({
          ...prev,
          shutter: false,
        }))
      }, 100)
    } catch {

    }
  },[])

  // メインカメラでスナップショットを撮影する
  const takeCalibrationSnapshots: takeCalibrationSnapshotsFuncType = useCallback(async ({ transport, ipv4Addr, selectedArea, gridMode }) => {
    showShutterEffect()
    try {
      const blocking = true
      const location = gridMode ? selectedArea + 2 : 8 // 1x1モードの場合、CENTERとして定義する
      const res = await soloTakeIntrinsicCalibrationSnapshot({ transport, location, blocking })

      if(res) {
        const count = await selectPositionSnapshotCount({ location, transport })

        const update = (snapshot: CameraSnapshotsType): CameraSnapshotsType => {
          switch(location) {
            case 2: return {...snapshot, TOP_LEFT: count}
            case 3: return {...snapshot, TOP_CENTER: count }
            case 4: return {...snapshot, TOP_RIGHT: count }
            case 5: return {...snapshot, BOTTOM_LEFT: count }
            case 6: return {...snapshot, BOTTOM_CENTER: count }
            case 7: return {...snapshot, BOTTOM_RIGHT: count }
            case 8: return { ...snapshot, CENTER: count }
            default: return { ...snapshot }
          }
        }

        setChessboardCalState((prev) => ({
          ...prev,
          takingSnap: false,
          cameraList: prev.cameraList.map((c) => c.ipv4Addr === ipv4Addr ?
          {
            ...c,
            snapshots: update(c.snapshots)
          } : c)
        }))

        if(count === 7) { 
          if(gridMode) {
            if(selectedArea === 5) {
              changeGridMode({ gridMode: !gridMode })
            } else {
              const index = selectedArea + 1
              changeSelectedArea({ index })
            }
          } else {
            changeGridMode({ gridMode: !gridMode })
          }
        }
      }
    } catch {
      setChessboardCalState((prev) => ({
        ...prev,
        takingSnap: false
      }))
    }
  },[])

  // 選択したカメラのスナップショットを削除する
  const removeCalibrationSnapshots: removeCalibrationSnapshotsFuncType = useCallback(async ({ transport, ipv4Addr, all }) => {
    try {
      const res = await soloResetCalibrationSnapshots({ transport });

      if(res) {
        const snapshots: CameraSnapshotsType = { TOP_LEFT: 0, TOP_CENTER: 0, TOP_RIGHT: 0, BOTTOM_LEFT: 0, BOTTOM_CENTER: 0, BOTTOM_RIGHT: 0, CENTER: 0}
        setChessboardCalState((prev) => ({
          ...prev,
          cameraList: prev.cameraList.map((c) => c.ipv4Addr === ipv4Addr ? //該当するカメラのスナップショットを削除する
            {
              ...c,
              snapshots: snapshots
            } : c
          )
        }))
        if(!all) {
          openMessage({ message: { event: "warning", content: "削除しました", } })
          setTimeout(() => { closeMessage() }, 1000)
        }
      }
    } catch {

    }
  },[])

  // 全てのカメラのスナップショットを削除する
  const removeAllCalibrationSnapshots: removeAllCalibrationSnapshotsFuncType = useCallback(async () => {
    try {
      await Promise.all(
        devices.map(({ transport, ipv4Addr }) => {
          removeCalibrationSnapshots({ transport, ipv4Addr, all: true })
        })
      )

      openMessage({ message: { event: "warning", content: "削除しました", } })
      setTimeout(() => { closeMessage() }, 1000)
    } catch {

    }
  },[])

  // 警告文を表示する
  const openMessage: openMessageFuncType = useCallback(({ message }) => {
    try {
      setChessboardCalState((prev) => ({
        ...prev,
        message: message
      }))
    } catch {

    }
  },[])

  // 警告文を閉じる
  const closeMessage: closeMessageFuncType = useCallback(() => {
    try {
      setChessboardCalState((prev) => ({
        ...prev,
        message: null
      }))
    } catch {

    }
  },[])

  // 撮影方法を切り替える
  const changeSnapshotMode: changeSnapshotModeFuncType = useCallback(({ mode }) => {
    setAutoMode(mode);
  },[])

  async function selectPositionSnapshotCount(props: { location: CalibrationLocation, transport: Transport }) {
    const { location, transport } = props

    const res = await soloGetIntrinsicCalibrationSnapshotsCount({ transport, location })

    if(res) {
      return res.count
    } else {
      return null
    }

  }

  return {
    autoMode,
    chessboardCalState,
    setUpCameraList,
    changeTargetCamera,
    changeSelectedArea,
    changeGridMode,
    removeCalibrationSnapshots,
    removeAllCalibrationSnapshots,
    takeCalibrationSnapshots,
    openMessage,
    closeMessage,
    changeSnapshotMode
  }
}

export { useBoardIntrinsics }