import { Box, Collapse, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material"
import { useDevices } from "../../../globalContexts/DeviceContext"
import { AppBarHeight, FooterHeight, FULLSCREEN_ID, getLocalStorageFocalLengthValue, lensMenuList, localStorage_Batch_FocalLength, localStorage_FocalLength_BatchMode_Enabled, MainAreaPaddingSpace, MessageModalProps } from "../../../types/common"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { soloGetCameraWhiteBalanceBlue, soloGetCameraWhiteBalanceRed, soloSetCalibrationLFrameMarkerSet, soloSetCalibratorDetectionMode, soloSetCameraWhiteBalanceAuto, soloSetCameraWhiteBalanceBlue, soloSetCameraWhiteBalanceRed } from "../../../api/soloAPI"
import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from "../../../utilities/localStorage"
import { useBlocker } from "react-router-dom"
import {HelpOutline, PlayArrowOutlined } from "@mui/icons-material"
import { MessageModal } from "../../../components/MessageModal"
import { LensParameterForm2 } from "./components/LensParameterForm"
import { ActiveLightCalSettingPanel, CalPageFormat2, CustomButton } from "../common/CalPageFormat"
import { BatchCameraTuningForm } from "../common/BatchCameraTuningForm"
import { useFullScreenState } from "../../../hooks/useFullScreenState"
import { FullScreenContainer } from "../../../components/FullScreenContainer"
import { CalibrationLFrameMarkerSet, CalibratorDetectionMode, CameraUnit } from "../../../gen/solo/v1/solo_pb"
import { runExtrinsicLFrame } from "../utils/calibration"
import { CustomToolbar } from "../../../components/ToolBar"
import { NavigateButton } from "../common/NavigateButton"
import { useCalibrationEngine } from "../../../hooks/useCalibrationEngine"
import { LensParameterType, QuartetBroadCastCustomEventFlag } from "../../../types/common"
import { quartetBroadcastEvent } from "../../../api/quartetAPI"
import { EventType } from "../../../gen/quartet/v1/quartet_pb"
import { StepperContent } from "../common/StepperContent"
import { LFrameCameraPanel } from "./components/LframeCameraPanel"
import { localStorage_CameraTuning_BatchMode_Enabled, StepperContentProps } from "../common"
import { lFrameMarkerGuideSlides, localStorage_LFrame_Batch_CamExposure, localStorage_LFrame_Batch_CamGain, localStorage_LFrame_Batch_CamGamma } from "./types"
import { useCalibrationResults } from "../../../hooks/useCalibrationResults"
import { CustomCarouselModal2 } from "../../../components/CustomCarousel"
import { MarkerGuide } from "../common/MarkerGuide"

export const ExtrinsicLFrame = () => {
  const succeedNextLocation = "/twand"
  const succeedMessage =  `キャリブレーションに成功しました!!<br>レンズひずみの計算に移りますか?`
  const { extrinsicResult } = useCalibrationResults({ navigator: { message: succeedMessage, path: succeedNextLocation } })
  const { devices, setDevices } = useDevices()
  const isCalibrating = useCalibrationEngine()
  const [cameraTuningBatchMode, setCameraTuningBatchMode] = useState<'single'|'multi'>(loadSettingsFromLocalStorage(localStorage_CameraTuning_BatchMode_Enabled, 'multi'))
  const [focalLengthBatchMode, setFocalLengthBatchMode] = useState<'single'|'multi'>(loadSettingsFromLocalStorage(localStorage_FocalLength_BatchMode_Enabled, 'multi'))
  const selectedLensRef = useRef<LensParameterType|null>(null)
  const [calibrationWarning, setCalibrationWarning] = useState<MessageModalProps | null>(null);
  const [lFrameMarkerStableList, setLFrameMarkerStableList] = useState<string[]>([]);
  const [nextLocationWarning, setNextLocationWarning] = useState<MessageModalProps | null>(null);
  const { fullScreenState, openFullScreen, closeFullScreen, changeMode } = useFullScreenState()
  const calibrationLFrameMarkerSetsRef = useRef<CalibrationLFrameMarkerSet[]>([]);
  const primaryCameraTranasport = devices.filter(d => d.primary)[0].transport;
  const [openMarkerHelp, setOpenMarkerHelp] = useState(false);
  const [ selectedLens, setSelectedLens ] = useState<LensParameterType>(loadSettingsFromLocalStorage(localStorage_Batch_FocalLength, lensMenuList[0]))
  const [ markerSetLoading, setMarkerSetLoading ] = useState(false)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => nextLocation.pathname !== succeedNextLocation && currentLocation.pathname !== nextLocation.pathname
  )

  useEffect(() => {
    const setCalibrator = async () => {
      const res = await setCalibratorLFrameMode()
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

  const setCalibratorLFrameMode = useCallback(async () => {
    const results = await Promise.all(
      devices.map(({transport}) => soloSetCalibratorDetectionMode({ transport, calibratorDetectMode: CalibratorDetectionMode["LFRAME_COPLANAR_4PT"] }))
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
    selectedLensRef.current = selectedLens;
    if(selectedLens.name==='カスタマイズ'){
      selectedLensRef.current = { name: selectedLens.name, focalLength: 0 }
    }
  },[selectedLens.name])

  useEffect(() => {
    const handleUnLoad = () => {
      saveSettingsToLocalStorage(localStorage_Batch_FocalLength, selectedLensRef.current)
      saveSettingsToLocalStorage(localStorage_FocalLength_BatchMode_Enabled, focalLengthBatchMode)
      saveSettingsToLocalStorage(localStorage_CameraTuning_BatchMode_Enabled, cameraTuningBatchMode)
    }

    window.addEventListener('beforeunload', handleUnLoad);
    return () => {
      window.removeEventListener('beforeunload', handleUnLoad)
      handleUnLoad()
    }
  },[selectedLensRef.current, focalLengthBatchMode, cameraTuningBatchMode])

  useEffect(() => {
    if(blocker.state==="blocked") {
      setNextLocationWarning({
        event: 'warning',
        content: `
                   他の画面に遷移しますか？<br>
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

  const runCalibration = () => {
    const cameras: CameraUnit[] = devices.map(({ ipv4Addr }, i) => { return { $typeName: "solo.v1.CameraUnit", id: i, ipAddress: ipv4Addr.replace(/http:\/\/|https:\/\//, '') } })
    runExtrinsicLFrame({ transport: primaryCameraTranasport, cameras: cameras })
  }

  const openCalibrationWarning = () => {
    setCalibrationWarning({
      event: 'warning',
      content: `
                 計算を開始しますか？
               `,
      onConfirm: () => {
        setMarkerSetLoading(true)
        setCalibrationWarning(null);
      },
      onCancel: () => setCalibrationWarning(null),
      onClose: () => setCalibrationWarning(null)
    })
  }

  const updateFocalLength = (value: string, targetCamera?: string) => {
    if(!targetCamera) {
      setSelectedLens(item => ({...item, focalLength: Number(value)}))
      setDevices((device) => {
        const newDevice = device.map((item) => {
          const newLensConfig: LensParameterType = { ...item.lensConfig, focalLength: Number(value) }
          const key = getLocalStorageFocalLengthValue(item.id)
          saveSettingsToLocalStorage(key, newLensConfig)
          return { ...item, lensConfig: newLensConfig }
        })
        return newDevice
      })
      return;
    }
    setDevices(device => {
      const newDevice = device.map(item => {
        if(item.id===targetCamera) {
          const newLensConfig = { ...item.lensConfig, focalLength: Number(value) }
          const key = getLocalStorageFocalLengthValue(item.id)
          saveSettingsToLocalStorage(key, newLensConfig)
          
          return {
            ...item,
            lensConfig: newLensConfig
          }
        }
        return item;
      });

      return newDevice
    })
  }

  const updateSelectedLens = (value: LensParameterType, targetCamera?: string) => {
    if(!targetCamera) {
      setSelectedLens(value)
      setDevices((device) => {
        const newDevice = device.map((item) => {
          const key = getLocalStorageFocalLengthValue(item.id)
          saveSettingsToLocalStorage(key, value)
          return { ...item, lensConfig: value  }
        })
        return newDevice
      })
      return;
    }
    setDevices(device => {
      const newDevice = device.map(item => {
        if(item.id===targetCamera) {
          const newLensConfig = { name: value.name, focalLength: value.focalLength }
          const key = getLocalStorageFocalLengthValue(item.id)
          saveSettingsToLocalStorage(key, newLensConfig)
          return {
            ...item,
            lensConfig: newLensConfig
          }
        }
        return item
      })

      return newDevice
    })
  }


  const addCalibrationLframeMarkerSet = async (calibrationLFrameMarkerSet: CalibrationLFrameMarkerSet) => {
    calibrationLFrameMarkerSetsRef.current.push(calibrationLFrameMarkerSet)
    if(calibrationLFrameMarkerSetsRef.current.length===devices.length) {
      console.log(`ready run calibration`,calibrationLFrameMarkerSetsRef.current)
      setMarkerSetLoading(false);
      const setCompleted = await setMarkerSets()
      if(setCompleted) {
        runCalibration()
      }
    }
  }

  const addStableList = (ipv4Addr: string) => {
    setLFrameMarkerStableList(prev => {
      const isExist = prev.some(item => item === ipv4Addr);

      if(isExist) {
        return prev
      }

      return [...prev, ipv4Addr]
    });
  }

  const deleteStableList = (ipv4Addr: string) => {
    setLFrameMarkerStableList(prev => prev.filter(item => item !== ipv4Addr))
  }

  const setMarkerSets = async () => {
    try {
      const response = await soloSetCalibrationLFrameMarkerSet({ transport: primaryCameraTranasport, markersets: calibrationLFrameMarkerSetsRef.current })

      if(response) {

        return true
      } else {

        return false
      }
    } catch (e) {
      return false
    }
  }

  const handleEnableFocalLenghtBatchMode = useCallback((value: 'single' | 'multi') => {
    setFocalLengthBatchMode(value)
    if(value==="multi") {
      setDevices((device) => {
        const newDevice = device.map((item) => {
          const key = getLocalStorageFocalLengthValue(item.id)
          saveSettingsToLocalStorage(key, selectedLens)
          return { ...item, lensConfig: selectedLens  }
        })
        return newDevice
      })
    }
  },[selectedLens])

  const SelectForm = () => {
    return (
      <>
        <FormControl>
          <RadioGroup
            value={focalLengthBatchMode}
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={focalLengthBatchMode}
            name="radio-buttons-group"
            onChange={(_, value) => {
              handleEnableFocalLenghtBatchMode(value as 'single'|'multi');
            }}
          >
            <FormControlLabel 
              value="single" 
              control={<Radio size="small"/>} 
              label="個別で設定する" 
              slotProps={{
                typography: { sx: { fontSize: '14px', fontWeight: 400 } }
              }}
              // 右側の余白を個別に調整（デフォルトは16px相当）
              sx={{ 
                marginRight: '8px',
                '& .MuiFormControlLabel-root': { p: 0 } 
              }} 
            />
            <FormControlLabel 
              value="multi" 
              control={<Radio size="small"/>} 
              label="すべてのカメラを設定する" 
              slotProps={{
                typography: { sx: { fontSize: '14px', fontWeight: 400 } }
              }}
              sx={{ 
                marginRight: '8px',
                '& .MuiFormControlLabel-root': { p: 0 } 
              }} 
            />
          </RadioGroup>

        </FormControl>
        <Collapse in={focalLengthBatchMode==='multi'}>
          <div>
            <LensParameterForm2
              configFocalLength={selectedLens}
              disabled={focalLengthBatchMode==='single'} 
              updateFocalLength={updateFocalLength} 
              updateSelectedLens={updateSelectedLens}
            />
          </div>
        </Collapse>
      </>
    )
  }

  const stepperList: StepperContentProps[] = [
    { 
      title: "STEP 1. Lフレームの配置", 
      description: "全カメラからLフレームが見えるように配置し、4つのマーカーを点灯させてください",
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
      title: "STEP 2. レンズ選択", 
      description: "接続中のレンズの焦点距離を選択してください", 
      children: SelectForm() 
    },
    { 
      title: "STEP 3. パラメータ調整", 
      description: "映像上のステータスが「検出中」になるように、カメラのパラメータを調整してください", 
      children: <BatchCameraTuningForm
                  value={cameraTuningBatchMode}
                  localStorageKey={{
                    exposure: localStorage_LFrame_Batch_CamExposure,
                    gain: localStorage_LFrame_Batch_CamGain,
                    gamma: localStorage_LFrame_Batch_CamGamma
                  }}
                  onChange={(value) => setCameraTuningBatchMode(value as 'single' | 'multi')}
                /> 
    },
    { 
      title: "STEP 4. 計算実行", 
      description: "全カメラのステータスが「検出中」になっていれば、下にある[計算開始]ボタンを押して計算を開始してください" 
    },
    {
      title: "STEP 5. 計算完了後",
      description: "計算が完了したらLフレームのマーカーを消し、下の「→」ボタンを押して次の計算画面に移動してください"
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
            resultExist: extrinsicResult,
            success: {
              title: "計算成功🎉",
              message: `計算に成功しました。下の[→]ボタンを押して次の計算画面に移動してください。`
            },
            warning: {
              title: "計算結果なし",
              message: `出力結果がありません。STEP 1~5の手順に従って、計算を行ってください。`
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
                gap: "10px",
                display: "grid",
                width: "100%",
                height: "100%",
                gridTemplateColumns: gridTemplateColumns,
                overflowY: "auto",
                minHeight: 0,
                p: {xs: "5px", md: "1rem"},
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }
              }}
            >
              {
                devices.map(({id, nickname, macAddr, ipv4Addr, transport, lensConfig}, i) => {

                  let lensParameter = focalLengthBatchMode==="multi" ? selectedLens : lensConfig
                  return (
                    <Box key={id} sx={{ width: "100%" }}>
                      <LFrameCameraPanel
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
                        markerId={i}
                        markerSetLoading={markerSetLoading}
                        addStableList={addStableList}
                        deleteStableList={deleteStableList}
                        addCalibrationLframeMarkerSet={addCalibrationLframeMarkerSet}
                        
                        lensParameter={lensParameter}
                        lensConfig={lensConfig}
                        updateFocalLength={updateFocalLength}
                        updateSelectedLens={updateSelectedLens}
                        focalLengthBatchMode={focalLengthBatchMode}
                        
                        cameraTuningBatchMode={cameraTuningBatchMode}
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
              </ActiveLightCalSettingPanel>
            </Box>
          </Box>
        </CalPageFormat2>
      </FullScreenContainer>

      <CustomToolbar>
        <CustomButton
          loading={isCalibrating}
          disabled={lFrameMarkerStableList.length!==devices.length}
          startIcon={<PlayArrowOutlined/>}
          sx={{
            background: "#1bb710ff", 
            ":hover": { 
              background: "#1bb710b7", 
              boxShadow: "none" 
            },
          }}
          onClick={openCalibrationWarning}
          buttonTitle={isCalibrating ? `計算中...` : `計算開始`}
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
        open={openMarkerHelp}
        onClose={() => setOpenMarkerHelp(false)}
        slides={
          lFrameMarkerGuideSlides.map((guide, index) => {
            return(<MarkerGuide key={index} {...guide} sx={{ height: "550px", maxWidth: "420px" }}/>)
          })
        }
      />

      { calibrationWarning && <MessageModal message={calibrationWarning}/> }
      { nextLocationWarning && <MessageModal message={nextLocationWarning}/> }
    </>
  )
}