import { FC, memo } from "react"
import { DeviceInfomation } from "../../../../types/common"
import { GizmoHelper, GizmoViewport, OrbitControls } from "@react-three/drei"
import GridFloor from "./GridFloor"
import { Box, Typography } from "@mui/material"
import { Canvas } from "@react-three/fiber"
import Axes from "./Axis"
import { Camera3DModel } from "./CameraModel"
import { ChessboardModel } from "./ChessboardModel"
import { LframeModel } from "./LframeModel"
import { useAppTheme } from "../../../../globalContexts/AppThemeContext"
import { blueGrey, grey } from "@mui/material/colors"
import { SENSOR_SIZE, IMAGE_RESOLUTION, Camera3DObjectModel, Camera3DObjectSettingProps } from "../types"

const Viewer: FC<{ 
  devices: DeviceInfomation[], 
  calibrationMode: 'wand' | 'chessboard', 
  focusCamera: string, 
  isCalibrating: boolean,
  setFocusCamera: any,
  canvasCamera: {position: [number, number, number]; up: [number, number, number];},
  lengthXYZ: number[],
  centerPosition: [number, number, number],
  cameraObjectList: Camera3DObjectModel[],
  gridOptions: {
    Axis: boolean;
    cellColor: string;
    sectionColor: string;
    infiniteGrid: boolean;
  },
  cameraObjectProperty: Camera3DObjectSettingProps
}> = memo(({ calibrationMode, focusCamera, gridOptions, cameraObjectProperty, centerPosition, setFocusCamera, canvasCamera, lengthXYZ, cameraObjectList }) => {
  const { appTheme } = useAppTheme()
  
  
  return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
       >
        <Box sx={{ borderBottom: 1, p: "0.5rem", display: "flex", justifyContent: "space-between", borderColor: grey[400]}}>
          <Typography color="textSecondary" sx={{ fontSize: 14, fontWeight: "bold" }}>
            キャリブレーション結果（ {calibrationMode==="wand" ? "アクティブライト" : "チェスボード"}方式 ）
          </Typography>
        </Box>
        <Box 
          sx={{ 
            backgroundColor: appTheme==="dark" ? blueGrey[900] : blueGrey[50], 
            borderRadius: 3, 
            flex: 1, 
            position: "relative", 
            minHeight: 0,
          }}
        >
          <Canvas
            resize={{ offsetSize: true }} //必須：自動スケーリングする
            camera={{ 
              position: canvasCamera.position, 
              up: canvasCamera.up 
            }}
            style={{ 
              width: "100%", 
              height: "100%", 
              display: "block" 
            }}
          >
            <OrbitControls makeDefault enableDamping={false}/>
            
            <GizmoHelper alignment='bottom-right' margin={[50, 80]} >
              <GizmoViewport scale={35} axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor='white'/>
            </GizmoHelper>

            <ambientLight color='white' intensity={0.5} />

            <directionalLight color='white' intensity={0.8} position={[1, 5, 5]} />

            <GridFloor args={[lengthXYZ[0], lengthXYZ[1]]} position={centerPosition} {...gridOptions}/>

            <Axes axisLength={1} sphereDiameter={0.1} axisColors={{ x: 'red', y: 'green', z: 'blue' }} originPosition={[0, 0, 0]}/>

            {
              calibrationMode==="chessboard" ? <ChessboardModel/> : <LframeModel markers={4}/>
            }

            {
              cameraObjectList.map(({ exXml, position, rotation, reversed, color }, index) => (
                <Camera3DModel setFocusCamera={() => setFocusCamera(exXml.ip)} key={index} device={{ ipv4Addr: exXml.ip, nickname: exXml.nickname }} position={position}
                  intrinsic={{ 
                    x: (exXml.intrinsic[0]*(SENSOR_SIZE.x)) / IMAGE_RESOLUTION.x, 
                    y: (exXml.intrinsic[4]*(SENSOR_SIZE.y) / IMAGE_RESOLUTION.y) 
                  }}
                  sensorSize={{x: SENSOR_SIZE.x, y: SENSOR_SIZE.y}}
                  rotation={rotation}
                  reversed={reversed}
                  color={exXml.ip === focusCamera ? color : "white" }
                  length={cameraObjectProperty['Length']}
                  scale={exXml.ip === focusCamera ? 1.2 : 1}
                />
              ))
            }
          </Canvas>
        </Box>
      </Box>
  )
})

export { Viewer }