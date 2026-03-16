import { Box, Button, Typography } from "@mui/material"
import { Viewer } from "./components/Viewer"
import { useDevices } from "../../../globalContexts/DeviceContext"
import { useCalibrationMode } from "../../../globalContexts/CalibrationTypeContext"
import { CalPageFormat2 } from "../common/CalPageFormat"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CustomToolbar } from "../../../components/ToolBar"
import { NavigateButton } from "../common/NavigateButton"
import { useCalibrationEngine } from "../../../hooks/useCalibrationEngine"
import { useCalibrationViewerState } from "./hooks/use3dViewerState"
import { grey } from "@mui/material/colors"
import { ViewerCameraPanel } from "./components/ViewerCameraPanel"
import { resetCameraParameter } from "./utils/resetParameter"
import { useCalibrationResults } from "../../../hooks/useCalibrationResults"

export default function CalibrationViwer() {
  const isCalibrating = useCalibrationEngine()
  const { devices } = useDevices()
  const navigate = useNavigate()
  const { extrinsicResult, intrinsicResult } = useCalibrationResults({})
  const { calibrationConfig } = useCalibrationMode()
  const prevLocation = calibrationConfig.calType==="chessboard" ? "/eboard" : "/twand"
  const title = calibrationConfig.calType==="chessboard" ? "カメラ位置と姿勢へ" : "レンズひずみへ"
  const [ focusCamera, setFocusCamera ] = useState("");
  const { calibrationViewerState } = useCalibrationViewerState({ devices, isCalibration: isCalibrating })
  const { cameraObjectList, centerPosition, lengthXYZ, cameraObjectProperty, gridOptions, canvasCamera} = calibrationViewerState  
  // 1. 各カメラパネルの参照を保持するための Ref Map
  const cameraRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // 2. focusCamera が変わった時にスクロールを実行するエフェクト
  useEffect(() => {
    if (focusCamera) {
      const targetElement = cameraRefs.current.get(focusCamera);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest', // または 'center'
        });
      }
    }
  }, [focusCamera]);

  let isCalibratingSucceed = useMemo(() => {
    if(calibrationConfig.calType==='chessboard') {
      if(extrinsicResult && intrinsicResult) {
        return true;
      }
      else {
        return false;
      }
    }
  },[calibrationConfig.calType, intrinsicResult, extrinsicResult])

  useEffect(() => {
    if(calibrationConfig.calType === "wand") devices.map(({ transport }) => resetCameraParameter({ transport }))
  },[])

  const alert = useMemo(() => {
    let warningTitle = "計算結果なし";
    let warningMessage = "出力結果がありません。キャリブレーションステータスを確認し、キャリブレーションを実行してください。";
    let actions = null;
    const errorActions = () => <Button size="small" color="error" onClick={() => navigate('/calibration')}>確認する</Button>;

    let isSuccess = false;

    if (calibrationConfig.calType === "chessboard") {
      isSuccess = !!(intrinsicResult && extrinsicResult);
      
      if (!intrinsicResult && extrinsicResult) {
        warningTitle = "レンズひずみの計算結果なし";
        warningMessage = "レンズひずみの出力結果がありません。キャリブレーションステータスを確認し、キャリブレーションを実行してください。";
        actions = errorActions();
      } else if (intrinsicResult && !extrinsicResult) {
        warningTitle = "カメラ位置と姿勢の計算結果なし";
        warningMessage = "カメラ位置と姿勢の出力結果がありません。キャリブレーションステータスを確認し、キャリブレーションを実行してください。";
        actions = errorActions();
      } else if(!intrinsicResult && !extrinsicResult) {
        actions = errorActions();
      }
    } else {
      isSuccess = !!(extrinsicResult && intrinsicResult);
      
      if (extrinsicResult && !intrinsicResult) {
        warningTitle = "レンズひずみの計算結果なし";
        warningMessage = "レンズひずみの出力結果がありません。キャリブレーションステータスを確認し、キャリブレーションを実行してください。";
        actions = errorActions();
      } else if(!extrinsicResult && !intrinsicResult) {
        actions = errorActions();
      }
    }

    // 共通の return オブジェクト
    return {
      resultExist: isSuccess,
      success: {
        title: "計算成功🎉",
        message: "計算に成功しました!!"
      },
      warning: {
        title: warningTitle,
        message: warningMessage
      },
      actions: actions // ← これを共通で返すように修正
    };
  }, [calibrationConfig.calType, intrinsicResult, extrinsicResult]);
  
  return (
    <>
      <CalPageFormat2
        alert={alert}       
      >
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: { xs: "column", sm: "row" }, border: "1px solid", borderColor: grey[400], borderRadius: 3}}>
          <Box sx={{ width: { xs: `100%`, sm: `50%`, md: `calc(100% - 400px)`}, height: { xs: "350px", sm: "100%" } }}>
            <Viewer 
              isCalibrating={isCalibrating} 
              devices={devices} 
              calibrationMode={calibrationConfig.calType} 
              focusCamera={focusCamera}
              setFocusCamera={setFocusCamera}
              cameraObjectList={cameraObjectList}
              cameraObjectProperty={cameraObjectProperty}
              centerPosition={centerPosition}
              canvasCamera={canvasCamera}
              gridOptions={gridOptions}
              lengthXYZ={lengthXYZ}
            />
          </Box>
          <Box 
            sx={{ 
              width: { xs: `100%`, sm: `50%`, md: `400px` }, 
              height:{ xs: "400px", sm: "100%"}, 
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              borderTop: { xs: "solid 1px #bdbdbd", sm: "solid 0px #bdbdbd" },
              borderLeft: { xs: "solid 0px #bdbdbd", sm: "solid 1px #bdbdbd" },
            }}
          >
            <Box sx={{ p: "0.5rem", borderBottom: 1, borderBottomColor: grey[400], borderTopColor: grey[400] }}>
              <Typography color="textSecondary" sx={{ fontSize: 14, fontWeight: "bold" }}>
                カメラメトリクス
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1, minHeight: 0 }}>
            {
                devices.map(({ id, nickname, ipv4Addr, transport, macAddr }, i) => {
                  const data = cameraObjectList.find(camera => camera.exXml.cameraId === id)
                  const succeed = !!data && (data.exXml.rms > 0 && data.exXml.rms < 1)
                  const isActiveLightData = (calibrationConfig.calType==="chessboard" && (extrinsicResult && !intrinsicResult) && data) ? true : false 
                  return (
                    <Box 
                      key={ipv4Addr} 
                      ref={(el: HTMLDivElement) => {
                        if (el) {
                          cameraRefs.current.set(ipv4Addr, el);
                        } else {
                          cameraRefs.current.delete(ipv4Addr);
                        }
                      }}
                      sx={{ 
                        width: "100%",      // 親(Grid)の幅いっぱいに広がる
                        minWidth: 0,        // Grid内でのはみ出し防止
                        display: "block",   // ラッパー自体はブロックとして振る舞う
                        p: 1
                      }}
                    >
                      <ViewerCameraPanel
                        isActiveLightData={isActiveLightData}
                        chessMode={calibrationConfig.calType==='chessboard'}
                        videoId={`viwer_camID_${ipv4Addr}`}
                        deviceProps={{ id, nickname, ipv4Addr, transport, macAddr }}
                        focused={focusCamera===ipv4Addr}
                        setFocusCamera={setFocusCamera}
                        calibrationData={data}
                        succeedCalibration={succeed}
                      />
                    </Box>
                  )
                })
            }
            </Box>
          </Box>
        </Box>
      </CalPageFormat2>

      <CustomToolbar sx={{ display: "flex", justifyContent: "center", overflowX: "hidden" }}>
        <NavigateButton
          prev={true}
          title={title}
          navLocation={prevLocation}
        />
      </CustomToolbar>

    </>
  )
}