import { Box, Theme, useMediaQuery } from "@mui/material"
import { CalPageFormat2, CustomButton } from "../common/CalPageFormat"
import { ArrowRight, CropLandscapeOutlined, Delete, DeleteOutlineOutlined, PhotoCamera, PlayArrowOutlined, ViewModuleOutlined } from "@mui/icons-material"
import { useFullScreenState } from "../../../hooks/useFullScreenState"
import { useBoardIntrinsics } from "./hooks/useBoardIntrinsics"
import { useCallback, useMemo, useState } from "react"
import { Transport } from "@connectrpc/connect"
import { runIntrinsicBoard } from "../utils/calibration"
import { useDevices } from "../../../globalContexts/DeviceContext"
import { MessageModal } from "../../../components/MessageModal"
import { FullScreenContainer } from "../../../components/FullScreenContainer"
import { AppBarHeight, FooterHeight, FULLSCREEN_ID, MainAreaPaddingSpace } from "../../../types/common"
import { CustomToolbar } from "../../../components/ToolBar"
import { NavigateButton } from "../common/NavigateButton"
import { IBoardMainCameraPanel } from "./components/IBoardMainCameraPanel"
import { IBoardSubCameraPanel } from "./components/IBoardSubCameraPanel"
import { useCalibrationResults } from "../../../hooks/useCalibrationResults"

export const IntrinsicBoard = () => {
  const succeedNextLocation = "/eboard"
  const { devices } = useDevices()
  const { 
    chessboardCalState, 
    changeTargetCamera, changeSelectedArea, changeGridMode, 
    takeCalibrationSnapshots, removeAllCalibrationSnapshots, 
    removeCalibrationSnapshots, openMessage, closeMessage 
  } = useBoardIntrinsics({ devices });
  const { cameraList, targetCamera, selectedArea, gridMode, message, errorMessageList, shutter, takingSnap } = chessboardCalState;
  const { fullScreenState, openFullScreen, closeFullScreen, changeMode } = useFullScreenState()
  const { opened } = fullScreenState;
  const [ calibrationCameras, setCalibrationCameras ] = useState<string[]>([]);
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const { intrinsicResult } = useCalibrationResults({})

  const snapshots = (ipv4Addr: string): number => {
    if(cameraList.length === devices.length) { 
      let snapshotAll = 0;
      const values: (number|null)[] = Object.values(cameraList.find((c) => c.ipv4Addr === ipv4Addr)!.snapshots); 
      for(let i= 0; i < values.length; i++) { 
        const value = values[i]
        if(value) {
          snapshotAll += value
        } 
      }
      return snapshotAll
    } else {
      return 0
    }
  }

  const allCameraSnapshots = (): number => {
    let count = 0;
    const values = cameraList.map(({ipv4Addr}) => {
      return snapshots(ipv4Addr)
    })

    for(let i= 0; i < values.length; i++) { count += values[i] }
    return count
  }
  
  const runCalibration = useCallback((id: number, ipv4Addr: string, nickname: string, snapshots: number, transport: Transport) => {
    openMessage({ message: {
      event: "warning",
      title: "レンズひずみの計算",
      content: `${nickname}の計算を開始しますか？`,
      onCancel: () => { closeMessage() },
      onClose:() => { closeMessage() },
      onConfirm: () => { 
        runIntrinsicBoard({ 
          snapshots, 
          nickname, 
          transport, 
          cameras: [{ $typeName: "solo.v1.CameraUnit", id: id, ipAddress: ipv4Addr.replace(/http:\/\/|https:\/\//, '') }] 
        }); 
        closeMessage(); 
      }
    } })
  },[])
  
  const removeSnapshots = useCallback((nickname: string, transport: Transport, ipv4Addr: string) => {
    openMessage({ message: {
      event: "warning",
      title: `キャリブレーションデータの削除`,
      content: `
                  カメラ「${nickname}」のキャリブレーションデータを削除します。<br/>
                <br/>
                削除をすると、以下の情報が失われます。<br/>
                ・レンズひずみの計算用の画像情報<br/>
                ・撮影枚数の情報<br/>
                ・カメラ位置と姿勢の情報<br/>
                <br/>
                本当に削除しますか？
                `,
      onCancelTitle: "キャンセル",
      onConfirmTitle: "削除",
      onCancelButtonProps: { color: "primary" },
      onConfirmButtonProps: { color: "error" },
      onCancel: () => { closeMessage() },
      onClose:() => { closeMessage() },
      onConfirm: () => { 
        removeCalibrationSnapshots({ transport, ipv4Addr });
      }
    }})
  },[])

  const removeAllSnapshots = useCallback(() => {
    openMessage({ message: {
      event: "warning",
      title: "すべてのキャリブレーションデータの削除",
      content: `
                  すべてのカメラのキャリブレーションデータを削除します。<br/>
                  <br/>
                  削除をすると、以下の情報が失われます。<br/>
                  ・レンズひずみの計算用の画像情報<br/>
                  ・撮影枚数の情報<br/>
                  ・カメラ位置と姿勢の情報<br/>
                  <br/>
                  本当に削除しますか？
                `,
      onCancelTitle: "キャンセル",
      onConfirmTitle: "全削除",
      onCancelButtonProps: { color: "primary" },
      onConfirmButtonProps: { color: "error" },
      onCancel: () => { closeMessage() },
      onClose:() => { closeMessage() },
      onConfirm: () => {
        removeAllCalibrationSnapshots(); 
        closeMessage();
      }
    } })
  },[])

  const addCalibrationEngineStatus = (ipv4Addr: string) => {
    setCalibrationCameras(prev => {
      if(prev.includes(ipv4Addr)) {
        return prev
      }
      return [...prev, ipv4Addr]
    })
  }

  const removeCalibrationEngineStatus = (ipv4Addr: string) => {
    setCalibrationCameras(prev => {
      if(prev.length) {
        if(prev.includes(ipv4Addr)) {
          const newValue = prev.filter(value => value !== ipv4Addr)
          return newValue
        }
        return prev
      }
      return prev
    }) 
  }

  let mainCamera = useMemo(() => { return cameraList.find(({ ipv4Addr }) => ipv4Addr === devices[targetCamera].ipv4Addr)},[cameraList, targetCamera])

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
              message: `計算に成功しました。下の[${sm ? "次の画面へ" : "→"}]ボタンを押して次の計算画面に移動してください。`
            },
            warning: {
              title: "計算結果なし",
              message: `出力結果がありません。`
            }
          }}
          sx={{ height: {xs: 'auto', md: `calc(100vh - ${(AppBarHeight + FooterHeight + MainAreaPaddingSpace + MainAreaPaddingSpace)}px)`}, }}
        >
          <Box
            sx={{
              width: "100%",
              height: { xs: "auto", md: "100%" },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Box 
              sx={{ 
                height: "100%", 
                width: "100%", 
                display: "grid", 
                gridTemplateColumns: `repeat(1, 1fr)`,
                overflowY: "auto",
                minHeight: 0,
                p: { xs: "5px", md: "1rem" },
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }
              }}
            >
              <Box key={"iboard_main"} sx={{ width: "100%" }}>
              {
                (mainCamera) &&
                <IBoardMainCameraPanel
                  key={`iboard_main_cam${targetCamera+1}`}
                  videoId={`iboard_main`}
                  deviceProps={{
                    id: devices[targetCamera].id,
                    nickname: devices[targetCamera].nickname,
                    ipv4Addr: devices[targetCamera].ipv4Addr,
                    macAddr: devices[targetCamera].macAddr,
                    transport: devices[targetCamera].transport
                  }}
                  fullScreen={{
                    id: FULLSCREEN_ID,
                    open: opened,
                    openFullScreen: openFullScreen,
                    closeFullScreen: closeFullScreen,
                    changeMode: () => {changeMode(false, devices[targetCamera].ipv4Addr)}
                  }}      
                  shutter={shutter}
                  addCalibrationEngineStatus={addCalibrationEngineStatus}
                  removeCalibrationEngineStatus={removeCalibrationEngineStatus}
                  snapshots={mainCamera.snapshots}
                  gridMode={gridMode}
                  selectedArea={selectedArea}
                  changeSelectedArea={changeSelectedArea}
                />
              }
              </Box>
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
              <Box key={"iboard_sub"} sx={{ width: "100%", maxWidth: { xs: "100%", md: 400 }, height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
                <Box 
                  sx={{ 
                    gap: "10px",
                    display: "grid",
                    gridAutoRows: { xs: "auto", md: "calc((100% - 30px) / 4)"},
                    gridTemplateColumns: {xs: `repeat(2, 1fr)`,md: "1fr"},
                    flex: 1, 
                    overflowY: "auto", 
                    minHeight: 0, 
                    p: { xs: "0.5rem", md: 0 }, // スクロールバーと中身が被らないよう少し余白
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '10px' } 
                  }}
                >
                {
                  devices.map(({ id, ipv4Addr, macAddr, transport, nickname }, i) => {
                    let camera = cameraList.find(camera => camera.ipv4Addr === ipv4Addr)
                    let snapshots = camera?.snapshots;

                    return (
                      snapshots ? 
                        <Box 
                          sx={{ 
                            width: "100%", 
                            height: "100%",
                            display: "flex", 
                            flexDirection: "row", 
                            alignItems: "center",
                            cursor: "pointer",
                            opacity: targetCamera===i ? 1 : 0.7,
                            p: { md: "0 2rem"}
                          }}
                          onClick={() => changeTargetCamera({id: i})}
                        >
                          <ArrowRight color={targetCamera===i ? "primary" : "inherit"} fontSize="large" sx={{ display: { xs: "none", md: "inline" } }}/>
                          <Box sx={{ flex: 1, height: "100%" }}>
                            <IBoardSubCameraPanel
                              key={`iboard_sub_cam${i}`}
                              videoId={`iboard_sub_${ipv4Addr}`}
                              deviceProps={{
                                id: id,
                                nickname: nickname,
                                ipv4Addr: ipv4Addr,
                                transport: transport
                              }}
                              fullScreen={{
                                id: FULLSCREEN_ID,
                                open: opened,
                                openFullScreen: openFullScreen,
                                closeFullScreen: closeFullScreen,
                                changeMode: () => {changeMode(false, ipv4Addr)}
                              }}      
                              shutter={shutter}
                              addCalibrationEngineStatus={addCalibrationEngineStatus}
                              removeCalibrationEngineStatus={removeCalibrationEngineStatus}
                              snapshots={snapshots}
                              gridMode={gridMode}
                              selectedArea={selectedArea}
                              focused={targetCamera===i}
                            />
                          </Box>
                        </Box> : <></>
                    )
                  }
                  )
                }
                </Box>
              </Box>
            </Box>
          </Box>
        </CalPageFormat2>
        {/* <CalPageFormat2 
          alert={{
            resultExist: intrinsicResult,
            success: {
              title: "計算成功🎉",
              message: `計算に成功しました。下の[${sm ? "次の画面へ" : "→"}]ボタンを押して次の計算画面に移動してください。`
            },
            warning: {
              title: "計算結果なし",
              message: `出力結果がありません。`
            }
          }}
        >
          <Box ref={ref} sx={{ width: "100%", height: "100%", justifyItems: "center" }}>
            <Grid sx={{ width: width, height: "100%", display: "flex", flexDirection: "column", ...((maxWidth ==="none" || maxHeight === "none" || firstCamera.maxHeight === "none" || isPortrait===null) && { visibility: "hidden" })}}>
              <Grid 
                container 
                sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  flexDirection: "row", 
                  width: width,
                  overflow: "hidden",
                  flex: 1,
                  minHeight: 0,
                }}
              >
                <Grid 
                  key={"maincam"}
                  sx={{ 
                    p: { xs: "0.5rem 0", md: "0.5rem 0.5rem"}, 
                    width: { xs: "100%", lg: `calc(100% - ${cameraListWidth}px)` },
                    overflow: "hidden", 
                    position: "relative",
                    height: { xs: "auto", lg: "100%" }
                  }}>
                    <Box 
                      sx={{ 
                        width: "100%", 
                        height: "100%", 
                        display: { lg: "flex"},
                        p: { xs: "0.25rem", lg: 0 }, 
                        justifyContent: "center", 
                        alignItems: "center",
                        cursor: "pointer"
                      }}
                    >
                      <CameraPanel2
                        index={targetCamera}
                        videoId={`main_chessboardIn_camID`}
                        deviceProps={{
                          id: devices[targetCamera].id,
                          nickname: devices[targetCamera].nickname,
                          ipv4Addr: devices[targetCamera].ipv4Addr,
                          macAddr: devices[targetCamera].macAddr,
                          transport: devices[targetCamera].transport
                        }}
                        styles={{headerSx: { cursor:"default" }, subtitleSx: { cursor: "default" }}}
                        statusIcon={
                          <InCalibrationStatusIcon 
                            progressProps={{ size: 30 }} 
                            iconSx={{ fontSize: 30, }}
                            ipv4Addr={devices[targetCamera].ipv4Addr}
                            transport={devices[targetCamera].transport}
                            add={addCalibrationEngineStatus}
                            remove={removeCalibrationEngineStatus}
                            nickname={devices[targetCamera].nickname}
                            send={false}
                          />
                        }   
                        options={{
                          shutterEffect: shutter,
                        }}  
                        fullScreen={{
                          id: FULLSCREEN_ID,
                          open: opened,
                          openFullScreen: openFullScreen,
                          closeFullScreen: closeFullScreen,
                          changeMode: () => {changeMode(false, devices[targetCamera].ipv4Addr)}
                        }}       
                      >
                        {
                          (cameraList.length === devices.length) && (
                            <Grid container sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, height: "100%" }}>
                            {
                              Object.entries(cameraList.find(({ ipv4Addr }) => ipv4Addr === devices[targetCamera].ipv4Addr)!.snapshots)
                              .filter((snap) => (!gridMode) ? snap[0] === "CENTER" : snap[0] !== "CENTER")
                              .map((pos, index) => (
                                <SnapshotCountPanel
                                  key={`chess_${devices[targetCamera].macAddr}${index}`}
                                  gridMode={gridMode}
                                  selected={selectedArea === index}
                                  pos={pos}
                                  changeSelectedArea={() => changeSelectedArea({index})}
                                  styles={{
                                    countText: {
                                      fontSize: { xs: "80px", sm: "120px", md: "160px", lg: "220px" },
                                      height: { xs: "80px", sm: "120px", md: "160px", lg: "220px" },
                                      lineHeight: 0,
                                      display:"flex",
                                      alignItems: "center",
                                      WebkitTextStrokeWidth: "5px",
                                      WebkitTextStrokeColor: "rgba(0,0,0,0.5)",
                                    },
                                    underCountText: {
                                      position:"absolute",
                                      fontSize: { xs: "40px", sm: "60px", lg: "80px"},
                                      bottom: 0,
                                      right: `calc(0% + 20px)`,
                                      WebkitTextStrokeWidth: "2px",
                                      WebkitTextStrokeColor: "rgba(0,0,0,0.5)",
                                    },
                                  }}
                                />
                              ))
                            }
                            </Grid>
                          )
                        }
                      </CameraPanel2>
                    </Box>
                </Grid>
                <Grid 
                  sx={{ 
                    p: { xs: "0.5rem 0rem", md: "0.5rem 0.5rem" }, 
                    width: { xs: "100%", lg: `${cameraListWidth-10}px`} ,
                    display: { xs: "grid", lg: "flex" }, 
                    flexDirection: { lg: "column" },
                    overflowY: "auto", 
                    gridTemplateColumns:{ xs: `repeat(2, 1fr)`, lg: 'none' },
                    height: { xs: "auto", lg: firstCamera.maxHeight }
                  }}
                >
                  {
                    devices.map(({ id, nickname, ipv4Addr, transport, macAddr }, i) => (
                      <Grid 
                        key={nickname}
                        ref={i===0 ? firstCamera.targetRef : null}  
                        sx={{ 
                          width: "100%", 
                          aspectRatio: 387/300, 
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          mb: { lg: "0.5rem" },
                          p: { xs: "0.25rem", lg: 0 },
                          cursor: "pointer",
                          opacity: i !== targetCamera ? 0.4 : 1,
                        }}
                        onClick={() => { changeTargetCamera({id: i}) }}
                      >
                        <InCalibrationStatusIcon 
                          progressProps={{size: 25}} 
                          iconSx={{ fontSize: 25, position: "absolute", top: {xs: -5, lg: -8}, left: {xs: -2, lg: -8}}} 
                          ipv4Addr={ipv4Addr}
                          nickname={nickname}
                          transport={transport}
                          add={addCalibrationEngineStatus}
                          remove={removeCalibrationEngineStatus}
                        />
                        <CameraPanel2
                          index={i}
                          videoId={`sub_chessboardIn_camID_${ipv4Addr}`}
                          deviceProps={{ id, nickname, ipv4Addr, transport, macAddr }}
                          styles={{
                            headerSx: { my: 0, cursor: "default"},
                            titleSx: { variant: "subtitle1" },
                            subtitleSx: { display: "none" },
                          }}
                          reNameBtn={false}
                          options={{
                            shutterEffect: i === targetCamera && shutter,
                          }}
                        >
                          {(cameraList.length === devices.length) && 
                            <Grid container sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
                              { Object.entries(cameraList.find((c) => c.ipv4Addr === ipv4Addr)!.snapshots)
                                      .filter((snap) => (!gridMode) ? snap[0] === "CENTER" : snap[0] !== "CENTER")
                                      .map((pos, index) => (
                                      <SnapshotCountPanel
                                        key={`wand_${devices[i].macAddr}${index}`}
                                        gridMode={gridMode}
                                        selected={selectedArea === index}
                                        pos={pos}
                                        styles={{
                                          grid: {
                                            border: {
                                              xs: selectedArea === index ? "5px solid rgb(237, 108, 2)":"0.5px solid white", 
                                              lg: selectedArea === index ? "5px solid rgb(237, 108, 2)":"2px solid white"
                                            },
                                          },
                                          countText: {
                                            fontSize: { xs: "60px", sm: "40px"},
                                            WebkitTextStrokeWidth: "2px",
                                            WebkitTextStrokeColor: "rgba(0,0,0,0.5)",
                                          },
                                          underCountText: {
                                            position:"absolute",
                                            fontSize: { xs: "20px"},
                                            bottom: 0,
                                            right: `calc(0% + 5px)`,
                                            WebkitTextStrokeWidth: "2px",
                                            WebkitTextStrokeColor: "rgba(0,0,0,0.5)",
                                          },
                                        }}
                                      />
                              ))}
                            </Grid>
                          }
                        </CameraPanel2>
                      </Grid>
                    ))
                  }
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CalPageFormat2> */}
      </FullScreenContainer>

      <CustomToolbar>
        <CustomButton
          buttonTitle={`${snapshots(devices[targetCamera].ipv4Addr)}/49`}
          disabled={calibrationCameras.includes(devices[targetCamera].ipv4Addr)}
          startIcon={<PhotoCamera/>}
          sx={{
            background: "#94C213", 
            ":hover": { 
              opacity: 0.8, 
              boxShadow: "none" 
            },
          }}
          loading={takingSnap}
          onClick={() => takeCalibrationSnapshots({ transport: devices[targetCamera].transport, ipv4Addr: devices[targetCamera].ipv4Addr, selectedArea, gridMode  })}
        />

        <CustomButton
          buttonTitle={`計算開始`}
          disabled={calibrationCameras.includes(devices[targetCamera].ipv4Addr)}
          startIcon={<PlayArrowOutlined/>}
          sx={{
            background: "#1bb710ff",
            ":hover": { 
              background: "#1bb710b7", 
              boxShadow: "none" 
            },
          }}
          onClick={() => runCalibration(targetCamera, devices[targetCamera].ipv4Addr, devices[targetCamera].nickname, snapshots(devices[targetCamera].ipv4Addr), devices[targetCamera].transport)}
        />

        <CustomButton
          buttonTitle= { gridMode ? '1×1' : '2×3' }
          startIcon={gridMode ? <CropLandscapeOutlined/> : <ViewModuleOutlined/>}
          color="inherit"
          variant="outlined"
          sx={{
            color: "text.secondary",
            ":hover": { 
              boxShadow: "none" 
            },
          }}
          onClick={() => changeGridMode({gridMode: !gridMode})}
        />

        <CustomButton
          buttonTitle= {'1CAM'}
          disabled={calibrationCameras.includes(devices[targetCamera].ipv4Addr) || snapshots(devices[targetCamera].ipv4Addr) === 0}
          startIcon={<DeleteOutlineOutlined/>}
          color="inherit"
          variant="outlined"
          sx={{
            color: "text.secondary",
            ":hover": { 
              boxShadow: "none" 
            },
          }}
          onClick={() => removeSnapshots(devices[targetCamera].nickname, devices[targetCamera].transport, devices[targetCamera].ipv4Addr)}
        />

        <CustomButton
          buttonTitle= {'All'}
          disabled={calibrationCameras.length!==0 || allCameraSnapshots() === 0}
          startIcon={<Delete/>}
          color="inherit"
          variant="outlined"
          sx={{
            color: "text.secondary",
            ":hover": { 
              boxShadow: "none" 
            },
          }}
          onClick={() => removeAllSnapshots()}
        />

        <NavigateButton
          title="次の画面へ"
          navLocation={succeedNextLocation}
        />
      </CustomToolbar>

      {
        message && <MessageModal message={message}/>
      }
      {
        errorMessageList.map((m) => (
          <MessageModal message={m}/>
        ))
      }
    </>
  )
}