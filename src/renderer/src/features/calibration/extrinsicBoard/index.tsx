import { useCallback, useMemo, useState } from "react"
import { useChessboardExtrinsicCalState } from "./hooks/useBoardExtrinsics"
import { useFullScreenState } from "../../../hooks/useFullScreenState"
import { useDevices } from "../../../globalContexts/DeviceContext"
import { soloGetCurrentTime, soloTakeExtrinsicCalibrationSnapshot } from "../../../api/soloAPI"
import { runExtrinsicBoard } from "../utils/calibration"
import { CalPageFormat2, CustomButton } from "../common/CalPageFormat"
import { Box, Theme, useMediaQuery } from "@mui/material"
import { PlayArrowOutlined } from "@mui/icons-material"
import { MessageModal } from "../../../components/MessageModal"
import { DndContainer } from "../../../components/DndContainer"
import { FullScreenContainer } from "../../../components/FullScreenContainer"
import { AppBarHeight, FooterHeight, FULLSCREEN_ID, MainAreaPaddingSpace } from "../../../types/common"
import { CustomToolbar } from "../../../components/ToolBar"
import { NavigateButton } from "../common/NavigateButton"
import { EBoardCameraPanel } from "./components/EBoardCameraPanel"
import { useCalibrationResults } from "../../../hooks/useCalibrationResults"

export const ExtrinsicBoard = () => {
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const succeedNextLocation = "/calibrationViewer"
  const prevLocation = "/iboard"
  const { devices, setDevices } = useDevices()
  const { fullScreenState, openFullScreen, closeFullScreen, changeMode } = useFullScreenState()
  const { chessboardCalExState, openMessage, closeMessage, showShutterEffect } = useChessboardExtrinsicCalState();
  const { shutter, message } = chessboardCalExState
  const [ calibrationCameras, setCalibrationCameras ] = useState<string[]>([]);  
  const { extrinsicResult } = useCalibrationResults({})
  
  const runCalibration = useCallback(() => {
    openMessage({
      event: "warning",
      title: "カメラ位置と姿勢の計算",
      content: `撮影と計算を開始します。実行しますか？`,
      onCancel: () => closeMessage(),
      onClose: () => closeMessage(),
      onConfirm: () => { 
        calibration(); 
        closeMessage() 
      }
    })
  },[])

  const calibration = async () => {
    try {
      const curr = await soloGetCurrentTime({ transport: devices[0].transport })

      if(curr) {
        const { timestamp } = curr
        const result = await Promise.all(
          devices.map(async ({ transport, }) => {
            const takeSnapshot = await soloTakeExtrinsicCalibrationSnapshot({ transport, timestamp, blocking: true })
            if(takeSnapshot) {
              return true
            }
            else {
              return false
            }
          })
        )
        showShutterEffect()

        if (result.filter((s) => s === true).length === devices.length) {
          runExtrinsicBoard({ devices, setDevices })
        }
      }
    }
    catch (error) {
      console.error("[error]: ---")
    }
  }

  const addCalibrationEngineStatus = (ipv4Addr:string) => {
    setCalibrationCameras(prev => {
      if(prev.includes(ipv4Addr)) {
        return prev
      }
      return [...prev, ipv4Addr]
    }) 
  }

  const removeCalibrationEngineStatus = (ipv4Addr:string) => {
    setCalibrationCameras(prev => {
      if(prev.length) {
        if(prev.includes(ipv4Addr)) {
          const newValue = prev.filter(value => value != ipv4Addr)
          return newValue
        }
        return prev
      }
      return prev
    })
  }

  let isCalibrationing = useMemo(() => {
    return calibrationCameras.length!==0
  },[calibrationCameras])

  let gridTemplateColumns = useMemo(() => {
    if(devices.length===1) return `repeat(1, 1fr)`
    if(devices.length > 6) { 
      return { xs: `repeat(2, 1fr)`, lg: `repeat(4, 2fr)` }
    } 
    else if(devices.length > 4) {
      return { xs: `repeat(2, 1fr)`, lg: `repeat(3, 2fr)` }
    }
    else if(devices.length > 2) {
      return `repeat(2, 1fr)`
    }
    else if(devices.length > 1) {
      return `repeat(2, 1fr)`
    }
  },[devices.length])
  
  return (
    <>
      <FullScreenContainer 
        fullScreenProps={{
          id: FULLSCREEN_ID,
          fullScreen: { fullScreenState, openFullScreen, closeFullScreen, changeMode }
        }}
      >
        <CalPageFormat2 
          alert={{
            resultExist: extrinsicResult,
            success: {
              title: "計算成功🎉",
              message: `計算に成功しました。下の[${sm ? "次の画面へ" : "→"}]ボタンを押して計算結果を確認してください。`
            },
            warning: {
              title: "計算結果なし",
              message: `出力結果がありません。`
            }
          }}
          sx={{
            height: `calc(100vh - ${(AppBarHeight + FooterHeight + MainAreaPaddingSpace + MainAreaPaddingSpace)}px)`
          }}
        >
          <Box sx={{ width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
            <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
              <Box 
                sx={{ 
                  display: "grid", 
                  gap: "10px",  
                  height: "100%", 
                  gridTemplateColumns: gridTemplateColumns
                }}
              >
                <DndContainer items={devices}>
                {
                  devices.map(({ id, ipv4Addr, nickname, transport, macAddr }) => (
                    <EBoardCameraPanel
                      key={id}
                      shutter={shutter}
                      videoId={`eboard_${ipv4Addr}`}
                      deviceProps={{ id, nickname, ipv4Addr, transport, macAddr }}
                      fullScreen={{
                        id: FULLSCREEN_ID,
                        open: fullScreenState.opened,
                        openFullScreen: openFullScreen,
                        closeFullScreen: closeFullScreen,
                        changeMode: () => {changeMode(false, ipv4Addr)}
                      }}
                      addCalibrationEngineStatus={addCalibrationEngineStatus}
                      removeCalibrationEngineStatus={removeCalibrationEngineStatus}
                    />
                  ))
                }
                </DndContainer>
              </Box>
            </Box>
          </Box>
        </CalPageFormat2>
      </FullScreenContainer>

      <CustomToolbar sx={{ justifyContent: "center", overflowX: "hidden" }}>
        <NavigateButton
          prev={true}
          title="レンズひずみへ"
          navLocation={prevLocation}
        />

        <CustomButton 
          buttonTitle="計算開始" 
          disabled={isCalibrationing}
          loading={isCalibrationing}
          startIcon={<PlayArrowOutlined/>}
          sx={{
            background: "#1bb710ff", 
            ":hover": { 
              background: "#1bb710b7", 
              boxShadow: "none" 
            },
          }}
          onClick={runCalibration}
        />

        <NavigateButton
          title="次の画面へ"
          navLocation={succeedNextLocation}
        />
      </CustomToolbar>
      {
        message && <MessageModal message={message}/>
      }    
    </>
  )
}