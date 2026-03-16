// src/components/calibrationViewer/GridComponent.tsx
import React from 'react';
import { Grid } from '@react-three/drei';
import { GridProps } from '../types';
import * as THREE from 'three';

const GridComponent: React.FC<GridProps> = ({
  position = [0, 0, 0],
  cellSize = 0.1,
  cellThickness = 0.5,
  cellColor = 'gray',
  sectionSize = 1,
  sectionThickness = 0.8,
  sectionColor = 'darkgray',
  followCamera = false,
  infiniteGrid = false,
  fadeDistance = 100,
  fadeStrength = 1,
  receiveShadow = true,
  rotationEuler = [Math.PI / 2, 0, 0],
  args = [10, 10],
}) => {
  const isValidRotation = rotationEuler && rotationEuler.every(value => !isNaN(value));
  const fixedRotation = isValidRotation ? new THREE.Euler(...rotationEuler!) : new THREE.Euler(0, 0, 0);

  return (
    <Grid
      position={position}
      rotation={fixedRotation}
      args={args}
      cellSize={cellSize}
      cellThickness={cellThickness}
      cellColor={cellColor}
      sectionSize={sectionSize}
      sectionThickness={sectionThickness}
      sectionColor={sectionColor}
      followCamera={followCamera}
      infiniteGrid={infiniteGrid}
      fadeDistance={fadeDistance}
      fadeStrength={fadeStrength}
      receiveShadow={receiveShadow}
    />
  );
};

export default GridComponent;
