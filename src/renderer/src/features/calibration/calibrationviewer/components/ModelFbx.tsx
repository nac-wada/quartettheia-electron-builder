// src/components/calibrationViewer/ModelFbx.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { useFrame } from '@react-three/fiber';
import { FbxModelProps } from '../types';

export const ScaledFbxModel: React.FC<FbxModelProps> = ({ path, position, scales, rotation }) => {
  const [fbx, setFbx] = useState<THREE.Object3D | null>(null);
  const [normalizedScale, setNormalizedScale] = useState<number[]>([-1, -1, -1]);
  const [rotationInRadians, setRotationInRadians] = useState<number[]>([-1, -1, -1]);
  const [, setScaleFactor] = useState<number>(0);

  const mixer = useRef<THREE.AnimationMixer>();
  const boundingBox = useRef<THREE.Box3>();

  // fbxファイル切り替えの初回実行
  useEffect(() => {
    const loader = new FBXLoader();
    loader.load(path, (loadedFbx) => {
      setFbx(loadedFbx);

      mixer.current = new THREE.AnimationMixer(loadedFbx);
      loadedFbx.animations.forEach((clip) => {
        const action = mixer.current!.clipAction(clip);
        action.play();
      });

      boundingBox.current = new THREE.Box3().setFromObject(loadedFbx);
      const modelDimensions = boundingBox.current.getSize(new THREE.Vector3());

      const scalef = 1.0 / modelDimensions.z;
      if (scalef > 0) {
        setScaleFactor(scalef);

        // 確実に直近のscaleFactorにアクセスし,それでスケールをかける
        setScaleFactor((pre) => {
          setNormalizedScale(scales.map((value) => {
            return value * pre;
          }));
          return pre;
        })

        setRotationInRadians(rotation.map((angleInDegrees) => THREE.MathUtils.degToRad(angleInDegrees)));
      }//if
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);


  // スケール用
  useEffect(() => {
    if (fbx) {
      // 確実に直近のscaleFactorにアクセスし,それでスケールをかける
      setScaleFactor((pre) => {
        setNormalizedScale(scales.map((value) => {
          return value * pre;
        }));
        return pre;
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scales]);


  // 回転用
  useEffect(() => {
    if (fbx) {
      setRotationInRadians(rotation.map((angleInDegrees) => THREE.MathUtils.degToRad(angleInDegrees)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation]);


  // アニメ付きの場合再生
  useFrame((_, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });


  // モデルを読み込んでから,fbxモデルを表示
  if (!fbx || normalizedScale[0] < 0) {
    //console.log("!fbx || ", normalizedScale[0], " < 0")
    return null;
  } else {
    //console.log("!fbx || ", normalizedScale[0], " < 0 の 外")
    return <primitive object={fbx} position={position} scale={normalizedScale} rotation={rotationInRadians} />;
  }

};
