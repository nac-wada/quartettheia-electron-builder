// src/components/calibrationViewer/AxisComponent.tsx
import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AxesProps } from '../types';

const Axes: React.FC<AxesProps> = ({
  axisLength,
  sphereDiameter,
  labelSize = '1rem',
  axisColors = { x: 'red', y: 'green', z: 'blue' },
  originPosition,
}) => {
  const groupRef = useRef<THREE.Group>(null!);

  return (
    <>
      <group ref={groupRef} position={originPosition}>
        {/* X軸 */}
        <arrowHelper
          args={[
            new THREE.Vector3(axisLength, 0, 0).normalize(), // direction
            new THREE.Vector3(0, 0, 0), // origin
            axisLength, // len
            axisColors.x, // color
          ]}
        />
        <Html
          position={[axisLength * 1.2, 0, 0]}
          style={{ color: axisColors.x, fontSize: labelSize, userSelect: 'none' }}
          zIndexRange={[0, 0]}
          distanceFactor={10}
          center
        >
          X
        </Html>
        {/* Y軸 */}
        <arrowHelper
          args={[
            new THREE.Vector3(0, axisLength, 0).normalize(), // direction
            new THREE.Vector3(0, 0, 0), // origin
            axisLength, // len
            axisColors.y, // color
          ]}
        />
        <Html
          position={[0, axisLength * 1.2, 0]}
          style={{ color: axisColors.y, fontSize: labelSize, userSelect: 'none' }}
          zIndexRange={[0, 0]}
          distanceFactor={10}
          center
        >
          Y
        </Html>

        {/* Z軸 */}
        <arrowHelper
          args={[
            new THREE.Vector3(0, 0, axisLength).normalize(), // direction
            new THREE.Vector3(0, 0, 0), // origin
            axisLength, // len
            axisColors.z, // color
          ]}
        />
        <Html
          position={[0, 0, axisLength * 1.2]}
          style={{ color: axisColors.z, fontSize: labelSize, userSelect: 'none' }}
          zIndexRange={[0, 0]}
          distanceFactor={10}
          center
        >
          Z
        </Html>

        {/* 原点 */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[sphereDiameter]} />
          {/*<meshBasicMaterial opacity={0.5} color={"gray"} />*/}
          <meshLambertMaterial transparent opacity={0.5} color={"gray"} />
        </mesh>
      </group>
    </>
  );
};

export default Axes;
