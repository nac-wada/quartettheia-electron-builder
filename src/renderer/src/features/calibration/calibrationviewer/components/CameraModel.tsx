import { Html } from "@react-three/drei";
import { FC, memo, useRef } from "react"
import * as THREE from 'three';
import { Mesh } from 'three';
import Axes from "./Axis";
import CameraFov from "./ModelCameraFov";
import { Camera3DModelProps } from "../types";

const Camera3DModel: FC<Camera3DModelProps> = memo(({scale, device, position, intrinsic, sensorSize, rotation, reversed, color, length, setFocusCamera }) => {
  const mesh = useRef<Mesh>(null);

  return (
    <group
      // position={position} 
      // rotation={rotation}
      onClick={(e) => {
        e.stopPropagation(); // 他のオブジェクトへのイベント伝播を防ぐ
        setFocusCamera();
      }}
    >
      {/* 当たり判定専用の透明なメッシュ */}
      <mesh position={position} rotation={rotation} scale={scale}>
        {/* モデルより一回り大きく、特に「奥行き」を持たせると判定が安定します */}
        <boxGeometry args={[0.25, 0.25, 0.5]} /> 
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0}  // ぼんやり見える程度
          depthWrite={false} // モデルが透けて見えるように
        />
      </mesh>

      <mesh position={position} ref={mesh} rotation={rotation} scale={scale}>
        <Axes axisLength={0.3} sphereDiameter={0} labelSize={"0.5rem"} axisColors={{ x: "red", y: "green", z: "blue" }} originPosition={[0, 0, 0,]}/>

        <CameraFov positionX={position[0]} intrinsic={intrinsic} sensorSize={sensorSize} length={length} color={color} />
        
        <mesh rotation={[0, 0, reversed ? THREE.MathUtils.degToRad(180) : 0]}>
          {/* カメラ本体 */}
          <mesh position={[0.0, 0.0, -0.25/2]}>
            <boxGeometry args={[0.15, 0.07, 0.25]} />
            <meshStandardMaterial color={color}/>
          </mesh>
          <mesh position={[0.0, (0.07/2)+0.001/2, -0.25/2]}>
            <boxGeometry args={[0.15, 0.001, 0.25]} />
            {/*<meshStandardMaterial color={'rgb(255, 0, 0)'}  />*/}
            {/*<meshStandardMaterial color={'rgba(255, 0, 0, 0.5)'} />*/}
            <meshStandardMaterial color={'rgb(20, 20, 20)'} transparent opacity={0.8} />
          </mesh>
          {/* アンテナ */}
          <mesh position={[0.0, 0.0, -0.25 -0.03/2]} rotation={[THREE.MathUtils.degToRad(90), 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.03, 32]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0.0, -0.2/2 +0.01/2, -0.25 -0.05/2]}>
            <cylinderGeometry args={[0.01, 0.005, 0.2, 32]} />
            <meshStandardMaterial color={color} />
          </mesh>
          {/* レンズ */}
          <mesh position={[0.0, 0.0, -0.25/2 + 0.16]} rotation={[THREE.MathUtils.degToRad(-90), 0, 0]} >
            <coneGeometry args={[0.08, 0.08, 32]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </mesh>

        <Html position={[0, 0.5, 0]} center zIndexRange={[0, 0]}>
          <div style={{ fontSize: '1rem', color: 'text.secondary', whiteSpace: 'nowrap', userSelect: 'none' }}>{device.nickname}</div>
        </Html>
      </mesh>
    </group>
  )
})

export { Camera3DModel }