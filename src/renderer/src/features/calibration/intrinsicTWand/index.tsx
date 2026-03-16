import { Box, Theme, useMediaQuery } from "@mui/material"
import { useDevices } from "../../../globalContexts/DeviceContext"
import { AppBarHeight, FooterHeight, FULLSCREEN_ID, MainAreaPaddingSpace, MessageModalProps } from "../../../types/common"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { soloGetCameraWhiteBalanceBlue, soloGetCameraWhiteBalanceRed, soloSetCalibrationTWandMarkerSet, soloSetCalibratorDetectionMode, soloSetCameraWhiteBalanceAuto, soloSetCameraWhiteBalanceBlue, soloSetCameraWhiteBalanceRed } from "../../../api/soloAPI"
import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from "../../../utilities/localStorage"
import { useBlocker } from "react-router-dom"
import { MessageModal } from "../../../components/MessageModal"
import { HelpOutline, PauseOutlined, RadioButtonCheckedOutlined, Refresh } from "@mui/icons-material"
import { quartetBroadcastEvent } from "../../../api/quartetAPI"
import { EventType } from "../../../gen/quartet/v1/quartet_pb"
import { ActiveLightCalSettingPanel, CalPageFormat2, CustomButton } from "../common/CalPageFormat"
import { BatchCameraTuningForm } from "../common/BatchCameraTuningForm"
import { useFullScreenState } from "../../../hooks/useFullScreenState"
import { FullScreenContainer } from "../../../components/FullScreenContainer"
import { CalibrationTWandMarkerSet, CalibratorDetectionMode, CameraUnit } from "../../../gen/solo/v1/solo_pb"
import { runIntrinsicTWand } from "../utils/calibration"
import { CustomToolbar } from "../../../components/ToolBar"
import { NavigateButton } from "../common/NavigateButton"
import { QuartetBroadCastCustomEventFlag } from "../../../types/common"
import { CustomCarouselModal2 } from "../../../components/CustomCarousel"
import { StepperContent } from "../common/StepperContent"
import { TWandCameraPanel } from "./components/TWandCameraPanel"
import { localStorage_TWand_Batch_CamExposure, localStorage_TWand_Batch_CamGain, localStorage_TWand_Batch_CamGamma, tWandMarkerGuideSlides, wandingGuideSlides } from "./types"
import { localStorage_CameraTuning_BatchMode_Enabled, StepperContentProps } from "../common"
import { useCalibrationResults } from "../../../hooks/useCalibrationResults"
import { TWandGuide } from "./components/TWandGuide"
import { MarkerGuide } from "../common/MarkerGuide"

export const IntrinsicTWand = () => {
  const succeedMessage = `キャリブレーションに成功しました!!<br>計算結果を確認しますか?`
  const succeedNextLocation = "/calibrationViewer"
  const prevLocation = "/lframe"
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const { devices } = useDevices()
  const { extrinsicResult, intrinsicResult } = useCalibrationResults({ navigator: { message: succeedMessage, path: succeedNextLocation } })
  const [cameraTuningBatchMode, setCameraTuningBatchMode] = useState<'single'|'multi'>(loadSettingsFromLocalStorage(localStorage_CameraTuning_BatchMode_Enabled, 'multi'))
  const [calibrationWarning, setCalibrationWarning] = useState<MessageModalProps|null>(null);
  const completedCameras = useRef<number[]>([]);
  const calibrationTWandMarkerSetsRef = useRef<CalibrationTWandMarkerSet[]>([]);
  const [nextLocationWarning, setNextLocationWarning] = useState<MessageModalProps | null>(null);
  const [refreshed, setRefreshed] = useState(false);
  const { fullScreenState, openFullScreen, closeFullScreen, changeMode } = useFullScreenState()
  const [isCollecting, setIsCollecting] = useState<{ collect: boolean, progress: 'completed' | 'stop' | null }>({ collect: false, progress: null })
  const [isWanding, setIsWanding] = useState(false);
  const [openMarkerHelp, setOpenMarkerHelp] = useState(false);
  const [openWandingHelp, setOpenWandingHelp] = useState(false);
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => nextLocation.pathname !== succeedNextLocation && currentLocation.pathname !== nextLocation.pathname
  )

  useEffect(() => {
    const setCalibrator = async () => {
      const res = await setCalibratorTWandMode()
      if(res) {
        broadCast()
      }
    }

    setCalibrator()

    // 仕様：TWand撮影中はホワイトバランスをデフォルト値に戻さないといけない
    const resetBatchWhiteBalance = async () => {
      const masterCamera = devices.find(d => d.primary)
      if(masterCamera) {
        const blue = await soloGetCameraWhiteBalanceBlue({ transport: masterCamera.transport });
        const red = await soloGetCameraWhiteBalanceRed({ transport: masterCamera.transport });
        if(!blue || !red) return;
        Promise.all(
          devices.map(({ transport }) => {
            soloSetCameraWhiteBalanceAuto({ transport, enable: false })
            soloSetCameraWhiteBalanceBlue({ transport, value: blue.defaultValue })
            soloSetCameraWhiteBalanceRed({ transport, value: red.defaultValue })
          })
        )
      }
    }
    resetBatchWhiteBalance()

    return () => resetCalibrationDetectionMode()

  },[])

  const broadCast = () => {
    const flags = BigInt(QuartetBroadCastCustomEventFlag["SET_CALIBRATOR_DETECTION_MODE"])
    quartetBroadcastEvent({ type: EventType["CUSTOM_EVENT"], flags: flags })
  }

  const setCalibratorTWandMode = useCallback(async () => {
    const results = await Promise.all(
      devices.map(({transport}) => soloSetCalibratorDetectionMode({ transport, calibratorDetectMode: CalibratorDetectionMode['TWAND_T_FORM_2PT'] }))
    )
    if(results.length===devices.length) {
      return true
    } else {
      return false
    }
  },[devices])

  const resetCalibrationDetectionMode = useCallback(() => {
    Promise.all(
      devices.map(({ transport }) => soloSetCalibratorDetectionMode({ transport, calibratorDetectMode: CalibratorDetectionMode["NONE"] }))
    )
    broadCast()
  },[devices])

  useEffect(() => {

    const handleUnLoad = () => saveSettingsToLocalStorage(localStorage_CameraTuning_BatchMode_Enabled, cameraTuningBatchMode)

    window.addEventListener('beforeunload', handleUnLoad);
    return () => {
      window.removeEventListener('beforeunload', handleUnLoad)
      saveSettingsToLocalStorage(localStorage_CameraTuning_BatchMode_Enabled, cameraTuningBatchMode)
    }
  },[cameraTuningBatchMode])

  useEffect(() => {
    if(blocker.state==="blocked") {
      setNextLocationWarning({
        event:'warning',
        content:`
                  他の画面に遷移しますか？<br>
                  撮影中に画面遷移をするとデータが保存されない可能性があります
                `,
        onConfirm: () => blocker.proceed(),
        onCancel: () => {
          blocker.reset();
          setNextLocationWarning(null);
        },
        onClose: () => {
          blocker.reset();
          setNextLocationWarning(null);
        }
      })
    } 
  },[blocker.state])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue="取得したマーカー座標が保存されない可能性があります"
    };

    if(isWanding) {
      window.addEventListener("beforeunload", handleBeforeUnload);      
    }

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  },[isWanding])

  const wanding = useCallback(() => {
    setIsWanding(!isWanding);
    if(isWanding) {
      const warning = () => {
        setCalibrationWarning({
          event: 'warning',
          content: `
                      ワンディングを中断しました。<br>
                      このまま計算を開始しますか？
                    `,
          onConfirm: async () => {
            setIsCollecting({ collect: true, progress: 'stop' })
            setCalibrationWarning(null)
          },
          onCancel: () => setCalibrationWarning(null),
          onClose: () => setCalibrationWarning(null)
        })
      }

      warning()
    }

  },[isWanding])

  // ./TWandMarker.tsxからarea変数(各areaのマーカー進捗率)が満たされた時callbackされる。満たされたカメラのidを追加し、カメラ分揃ったら撮影停止。間接的にaddMarkerSets関数が呼ばれる。
  const updateCompletedCameras = useCallback((id: number) => {
    completedCameras.current.push(id)
    if(completedCameras.current.length===devices.length) {
      if(isWanding) {
        completedCameras.current = [];
        setIsWanding(false);
        setIsCollecting({ collect: true, progress: 'completed' })
      } else {
        openCalibrateStartWarning()
      }
    }
  },[devices.length, isWanding])

  // ./TWandMarker.tsxのlistenerにより撮影停止後、callbackされる。各カメラのマーカーセットをrefに追加。カメラ分揃ったら、計算開始
  const addCalibrationTWandMarkerSet = useCallback(async(calibrationTWandMarkerSet: CalibrationTWandMarkerSet, progress: 'completed' | 'stop' | null) => {
    calibrationTWandMarkerSetsRef.current.push(calibrationTWandMarkerSet)
    console.log(calibrationTWandMarkerSetsRef.current)
    if(calibrationTWandMarkerSetsRef.current.length===devices.length) {
      let text = `計算に必要な特徴点を検出できました。<br>`
      // let enough = true
      if (progress && progress==='stop') {
        text = `` 
        // enough = false
      }
      // setEnoughPoints(enough)
      setCalibrationWarning({
        event: 'warning',
        content: `
                    ${text}
                    計算を開始します
                  `,
        onClose: () => setCalibrationWarning(null)
      })
      runCalibration()
    }
  },[devices.length, isWanding])

  // 全カメラのマーカーセットをapiに渡した後、TWandのキャルを開始する。
  const runCalibration = useCallback(async () => {
    const primaryCamera = devices.find(d => d.primary);
    if(primaryCamera) {
      setIsCollecting({ collect: false, progress: null });
      const setMarkerSets = async () => {
        try {
          const response = await soloSetCalibrationTWandMarkerSet({ transport: primaryCamera.transport, markersets: calibrationTWandMarkerSetsRef.current })

          console.log(response, calibrationTWandMarkerSetsRef.current)

          if(response) {

            return true
          } else {

            return false
          }
        } catch (e) {
          return false
        }
      }
      const setCompleted = await setMarkerSets()
      if(setCompleted) {
        let recalculate = extrinsicResult && intrinsicResult
        const cameras: CameraUnit[] = devices.map(({ ipv4Addr }, i) => { return { $typeName: "solo.v1.CameraUnit", id: i, ipAddress: ipv4Addr.replace(/http:\/\/|https:\/\//, '')} })
        runIntrinsicTWand({ transport: primaryCamera.transport, cameras, recalculate })
      }

      calibrationTWandMarkerSetsRef.current = [];
    }
  },[devices, extrinsicResult, intrinsicResult])

  const openCalibrateStartWarning = () => {
    setCalibrationWarning({
      event: 'warning',
      content: `
                  計算を開始しますか？
                `,
      onConfirm: async () => {
        setIsCollecting({ collect: true, progress: "completed" })
        setCalibrationWarning(null)
      },
      onCancel: () => setCalibrationWarning(null),
      onClose: () => setCalibrationWarning(null)
    })
  }

  const stepperList: StepperContentProps[] = [
    { 
      title: "STEP 1. Tワンドの配置", 
      description: "全カメラからTワンドが見えるように配置し、2つのマーカーを点灯させてください",
      children: <div style={{ textAlign: "end" }}>
                  <CustomButton
                    buttonTitle={`マーカーの光らせ方`}
                    startIcon={<HelpOutline/>}
                    variant="text"
                    onClick={()=>setOpenMarkerHelp(true)}
                    sx={{
                      color: "primary.main",
                      fontSize: 12
                    }}
                  />
                </div>
    },
    { 
      title: "STEP 2. パラメータ調整", 
      description: "映像上のステータスが「検出中」になるように、カメラのパラメータを調整してください", 
      children: <BatchCameraTuningForm
                  value={cameraTuningBatchMode}
                  localStorageKey={{
                    exposure: localStorage_TWand_Batch_CamExposure,
                    gain: localStorage_TWand_Batch_CamGain,
                    gamma: localStorage_TWand_Batch_CamGamma
                  }}
                  onChange={(value) => setCameraTuningBatchMode(value as 'single' | 'multi')}
                />
    },
    { 
      title: "STEP 3. ワンド開始", 
      description: "下にある[ワンド開始]ボタンを押してワンディングを開始してください\nTワンドの振り方については[ワンドの振り方]ボタンを押して確認してください",
      children: <div style={{ textAlign: "end" }}>
                  <CustomButton
                    buttonTitle={`ワンドの振り方`}
                    startIcon={<HelpOutline/>}
                    variant="text"
                    onClick={()=>setOpenWandingHelp(true)}
                    sx={{
                      color: "primary.main",
                      fontSize: 12
                    }}
                  />
                </div>
    },
    {
      title: "STEP 4. 計算完了後",
      description: "計算が完了したらTワンドのマーカーを消し、下の「→」ボタンを押して計算結果を確認してください。"
    }
  ]

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
            resultExist: intrinsicResult,
            success: {
              title: "計算成功🎉",
              message: `計算に成功しました。下の[${sm ? "次の画面へ" : "→"}]ボタンを押して計算結果を確認してください。`
            },
            warning: {
              title: "計算結果なし",
              message: `出力結果がありません。STEP 1~4の手順に従って、計算を行ってください。`
            }
          }}
          sx={{ height: {xs: 'auto', md: `calc(100vh - ${(AppBarHeight + FooterHeight + MainAreaPaddingSpace + MainAreaPaddingSpace)}px)`}, }}
        >
          <Box 
            sx={{ 
              width: "100%", 
              height: { xs: "auto", md: "100%"}, 
              display: "flex", 
              flexDirection: { xs: "column", md: "row" }, 
              justifyContent: "center", 
              gap: "10px"
            }}
          >
            <Box 
              sx={{ 
                display: "grid", 
                gap: "10px",
                gridTemplateColumns: gridTemplateColumns,
                height: "100%", 
                width: "100%",
                overflowY: "auto",
                minHeight: 0,
                p: {xs: "5px", md: "1rem"},
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }
              }}
            >
              {
                devices.map(({id, nickname, macAddr, ipv4Addr, transport, lensConfig}, i) => {

                  return (
                    <Box key={id} sx={{ width: "100%" }}>
                      <TWandCameraPanel
                        cameraLength={devices.length}
                        videoId={`wand_camID_${ipv4Addr}`} // どちらも4分割表示になっている
                        deviceProps={{ id, nickname, macAddr, ipv4Addr, transport }}
                        fullScreen={{
                          id: FULLSCREEN_ID,
                          open: fullScreenState.opened,
                          openFullScreen: openFullScreen,
                          closeFullScreen: closeFullScreen,
                          changeMode: () => {changeMode(false, ipv4Addr)}
                        }}
                        isCollecting={isCollecting}
                        markerId={i}
                        isWanding={isWanding}
                        refreshed={refreshed}
                        setRefreshed={() => setRefreshed(false)}
                        updateCompletedCameras={updateCompletedCameras}
                        lensParameter={lensConfig}
                        cameraTuningBatchMode={cameraTuningBatchMode}
                        addCalibrationTWandMarkerSet={addCalibrationTWandMarkerSet}
                      />
                    </Box>
                  )
                })
              }
            </Box>
            <Box 
              sx={{ 
                width: { xs: "100%", md: "400px" }, 
                height: { md: "100%" }, // sm以上の時に親の高さ(100%)を継承
                flexShrink: 0,
                display: "flex",       // 内部のパネルを制御しやすくするため
                flexDirection: "column",
                minHeight: 0,
                p: { md: "1rem 0"},
              }}
            >
              <ActiveLightCalSettingPanel>
              {
                stepperList.map((step) => <StepperContent key={step.title} title={step.title} description={step.description} children={step.children}/>)
              }

              <div style={{ textAlign: "end" }}>
                <CustomButton
                  disabled={isWanding}
                  buttonTitle={`マーカーの軌跡をクリア`}
                  startIcon={<Refresh/>}
                  variant="text"
                  onClick={() => setRefreshed(true)}
                  sx={{
                    color: "primary.main",
                    fontSize: 12
                  }}
                />              
              </div>

              </ActiveLightCalSettingPanel>
            </Box>
          </Box>
        </CalPageFormat2>
      </FullScreenContainer>

      <CustomToolbar>
        <NavigateButton
          prev={true}
          title="カメラ位置と姿勢へ"
          navLocation={prevLocation}
        />

        <CustomButton
          buttonTitle={!isWanding ? `ワンド開始`:`ワンド終了`}
          startIcon={!isWanding ? <RadioButtonCheckedOutlined/> : <PauseOutlined/>}
          sx={{
            background: "#54a6eeff", 
            ":hover": { 
              background: "rgba(84, 166, 238, 0.7)", 
              boxShadow: "none" 
            },
          }}
          onClick={wanding}
        />

        <NavigateButton
          title="次の画面へ"
          navLocation={succeedNextLocation}
        />

      </CustomToolbar>

      <CustomCarouselModal2
        options={{
            startIndex: 0
          }}
        slideWidth="600px"
        open={openWandingHelp}
        onClose={() => setOpenWandingHelp(false)}
        slides={
          wandingGuideSlides.map((guide, index) => {
           return(<TWandGuide key={index} {...guide}/>)
          })
        }
      />

      <CustomCarouselModal2
        options={{
            startIndex: 0
          }}
        slideWidth="600px"
        open={openMarkerHelp}
        onClose={() => setOpenMarkerHelp(false)}
        slides={
          tWandMarkerGuideSlides.map((guide, index) => {
           return(<MarkerGuide key={index} {...guide} sx={{ height: "550px", maxWidth: "420px" }}/>)
          })
        }
      />

      { calibrationWarning && <MessageModal message={calibrationWarning}/> }
      { nextLocationWarning && <MessageModal message={nextLocationWarning}/> }
    </>
  )
}