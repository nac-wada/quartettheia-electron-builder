// src/components/calibrationViewer/Object/ModelCameraFov.tsx
import React, { useEffect, useState, } from 'react';
import { Line, } from '@react-three/drei';
import { CameraFovlProps } from '../types';

const CameraFov: React.FC<CameraFovlProps> = ({
  positionX,
  intrinsic,
  sensorSize,
  length,
  color,
}) => {
  const [, setFocalLength] = useState<number | null>(null);
  const [sensorCorners, setSensorCorners] = useState<[number, number, number][] | null>(null);

  const calculateFocalLengthAndCorners = () => {
    // for test //カメラの内部パラメータ(mm単位)
    //const cameraMatrix: number[][] = [
    //  [3.67, 0, 949.0],
    //  [0, 3.67, 585.7],
    //  [0, 0, 1],
    //];

    // for test //センサーサイズ
    //const sensorSize = { x: 6.7, y: 4.2 }; // 仮のセンサーサイズ

    // カメラ位置
    const cameraPosition: [number, number, number] = [0, 0, 0];

    // 画角の計算
    //const fovX = 2 * Math.atan(sensorSize.x / (2 * cameraMatrix[0][0]));
    //const fovY = 2 * Math.atan(sensorSize.y / (2 * cameraMatrix[1][1]));
    const fovX = 2 * Math.atan(sensorSize.x / (2 * intrinsic.x));
    const fovY = 2 * Math.atan(sensorSize.y / (2 * intrinsic.y));
    //console.log((fovX * 180) / Math.PI, (fovY * 180) / Math.PI);

    // センサーの四隅の座標を計算
    const sensorCorners: [number, number, number][] = [];

    // 左上
    sensorCorners.push([
      cameraPosition[0] - length * Math.tan(fovX / 2),
      cameraPosition[1] + length * Math.tan(fovY / 2),
      cameraPosition[2] + length,
    ]);

    // 右上
    sensorCorners.push([
      cameraPosition[0] + length * Math.tan(fovX / 2),
      cameraPosition[1] + length * Math.tan(fovY / 2),
      cameraPosition[2] + length,
    ]);

    // 左下
    sensorCorners.push([
      cameraPosition[0] - length * Math.tan(fovX / 2),
      cameraPosition[1] - length * Math.tan(fovY / 2),
      cameraPosition[2] + length,
    ]);

    // 右下
    sensorCorners.push([
      cameraPosition[0] + length * Math.tan(fovX / 2),
      cameraPosition[1] - length * Math.tan(fovY / 2),
      cameraPosition[2] + length,
    ]);

    // 焦点距離の計算
    const denominator_x = 2 * Math.tan(fovX / 2);
    const denominator_y = 2 * Math.tan(fovY / 2);
    if ( -1.0e-6 < denominator_x && denominator_x < 1.0e+6 ) {
      if ( -1.0e-6 < denominator_y && denominator_y < 1.0e+6 ) {
        const calculatedFocalLengthX = sensorSize.x / denominator_x;
        const calculatedFocalLengthY = sensorSize.y / denominator_y;
        const calculatedFocalLength = (calculatedFocalLengthX + calculatedFocalLengthY) / 2;
        setFocalLength(calculatedFocalLength);
        setSensorCorners(sensorCorners);
      }
    }
  };


  useEffect(() => {
    calculateFocalLengthAndCorners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    positionX,
    intrinsic,
    sensorSize,
    length,
    color,
  ]);

  if (sensorCorners === null || sensorCorners.length !== 4) {
    return null;
  }


  return (
    <group>
      <mesh>
        {/* 放射 */}
        {sensorCorners && sensorCorners.map((corner, index) => (
          <Line
            key={`${positionX}_${index}`}
            points={[[0, 0, 0], corner]}
            color={color}
            lineWidth={1.5}
          />
        ))}

        {/* 矩形 */}
        {sensorCorners && (
          <>
            <Line
              key={`${positionX}_square`}
              points={[sensorCorners[0], sensorCorners[1], sensorCorners[3], sensorCorners[2], sensorCorners[0]]}
              color={color}
              lineWidth={1.5}
            />
          </>
        )}

      </mesh>
    </group>
  );
};

export default CameraFov;


