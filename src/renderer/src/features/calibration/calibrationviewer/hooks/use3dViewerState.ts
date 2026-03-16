import xmljs from 'xml-js';
import { useCallback, useEffect, useState } from "react";
import * as math from "mathjs";
import { Euler } from "three";
import * as THREE from 'three';
import { DeviceInfomation } from '../../../../types/common';
import { CalibrationViewerModel, CalibrationViwerViewModel, Camera3DObjectModel, FBX_FILE_LIST } from '../types';
import { soloGetCameraImageFlipping } from '../../../../api/soloAPI';
import { ImageFlipMode } from '../../../../gen/solo/v1/solo_pb';
import { colorRoulette } from '../../../../utilities/color';
import { getExtrinsicResult } from '../../utils/calibration';
import { exXml, inXml } from '../types';

const useCalibrationViewerState = ({ devices, isCalibration }:{ devices: DeviceInfomation[], isCalibration: boolean }): CalibrationViwerViewModel => {
  const [ calibrationViewerState, setCalibrationViewerState ] = useState<CalibrationViewerModel>({
    status: "unset",
    cameraObjectList: [],
    cameraObjectProperty: {
      'Axis': true, 
      'Name': true, 
      'Cameras': true, 
      'Projection': true, 
      'Length': 0.5, 
      'ColorSync': false, 
      'Color': '#7a7a7a', 
      'Debug(XML)': false,
    },
    lengthXYZ: [10, 10],
    centerPosition: [0, 0, 0],
    gridOptions: {
      Axis: true,
      cellColor: 'gray',
      sectionColor: 'darkgray',
      infiniteGrid: false,
    },
    object: [FBX_FILE_LIST[0], FBX_FILE_LIST[1]],
    canvasCamera: { position: [0, 0, 8], up: [0, 0, 1]  },
    modelOptions: [
      {
        Model: true,
        Select: { options: FBX_FILE_LIST },
        Scale: 1,
        Pos: { x: 0, y: -0.3, z: 0 },
        Rot: { x: 0, y: 0, z: 180 },
      },
      {
        Model: true,
        Select: { options: FBX_FILE_LIST },
        Scale: 1,
        Pos: { x: 0, y: 1, z: 0 },
        Rot: { x: 90, y: -90, z: 0 },
      },
    ]
  })

  useEffect(() => {
    setUp()
  },[isCalibration])

  const setUp = useCallback(async () => {
    changeStatus({ status: "loading" });

    let positions: math.Matrix[] = [];
    for( let i=0; i < devices.length; i++ ) {
      const { ipv4Addr, nickname, transport, id } = devices[i];
      const pos = ((i*0.5) + 0.5) - ((devices.length + 1)/4);
      let color = "lightgray";
      let position: [x: number, y: number, z: number] = [pos, -5*0.5, 0];
      let rotation: [x: number, y: number, z: number] = [-Math.PI/2, 0, 0];
      let exXml: exXml = {
        cameraId: id,
        ip: ipv4Addr,
        nickname: nickname,
        intrinsic: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        distortion: [0, 0, 0, 0, 0],
        rotation: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        translation: [0, 0, 0],
        rms: -1,
      };

      let inXml: inXml = {
        cameraId: id,
        ip: ipv4Addr,
        nickname: nickname,
        intrinsic: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        distortion: [0, 0, 0, 0, 0],
        rms: -1,
      };

      const flip = await soloGetCameraImageFlipping({ transport });
      const reversed = flip ? flip.mode === ImageFlipMode["BOTH"]  ? true : false : false
      const res = await getExtrinsicResult({ transport });
      if(res.success) {
        color = colorRoulette({index: i});
        exXml = await loadCameraExXmlData({ data: res.result, xmlData: exXml })
        inXml = await loadCameraInXmlData({ data: res.result, xmlData: inXml })
        const { vector, rotationMatrix } = cameraCalculate({ exXml })
        positions.push(vector)
        position = [vector.get([0, 0]), vector.get([1, 0]), vector.get([2, 0])];
        const rotationArray = math.flatten(rotationMatrix).toArray() as number[];
        const rotationMatrix3 = [
          rotationArray[0], rotationArray[1], rotationArray[2], 0.0,
          rotationArray[3], rotationArray[4], rotationArray[5], 0.0,
          rotationArray[6], rotationArray[7], rotationArray[8], 0.0,
          0.0, 0.0, 0.0, 1.0
        ]

        const euler = new Euler().setFromRotationMatrix(new THREE.Matrix4().fromArray(rotationMatrix3));
        // カメラのローカル座標を原点から見た回転座標
        rotation = [euler.x, euler.y, euler.z];
        // rotation = [0, 0, 0];
        // console.log(nickname, `position:(${position[0]},${position[1]},${position[2]}) rotation:(${rotation[0]},${rotation[1]},${rotation[2]})`)
        const cameraObject: Camera3DObjectModel = { exXml, inXml, position, rotation, reversed, color }
        setCalibrationViewerState((prev) => ({ ...prev, cameraObjectList: [...prev.cameraObjectList, cameraObject]}))
      }
    }

    
    if(positions.length > 0) {
      const { lengthXYZ, centerPosition } = cameraLengthCalculate({ positions });
      setCalibrationViewerState((prev) => ({
        ...prev,
        lengthXYZ: lengthXYZ,
        centerPosition: centerPosition,
      }))

      changeStatus({ status: "success" });
    } else if(positions.length === 0) {

      changeStatus({ status: "failed" })
    }
  },[])

  const changeStatus = useCallback(({ status }:{ status: "loading" | "unset" | "success" | "failed" }) => {
    setCalibrationViewerState((prev) => ({
      ...prev,
      status: status
    }))
  },[])

  const cameraCalculate = ({ exXml }:{ exXml: exXml }): { vector: math.Matrix, rotationMatrix: math.Matrix } => {
    const { rotation, translation } = exXml;
    let rvec = math.matrix([[0,0,0],[0,0,0],[0,0,0]]);
    let tvec = math.matrix([[0],[0],[0]]);

    if(rotation && rotation.length === 9) {
      rvec = math.matrix([
        [rotation[0], rotation[1], rotation[2]],    
        [rotation[3], rotation[4], rotation[5]],    
        [rotation[6], rotation[7], rotation[8]],    
      ])
    }

    if(translation && translation.length === 3) {
      tvec = math.matrix([
        [translation[0]],
        [translation[1]],
        [translation[2]],
      ])
    }

    const chessvec = math.multiply(math.transpose(rvec), tvec);
    const vector = math.multiply(chessvec, -0.001);

    return { vector: vector, rotationMatrix: rvec }
  }

  const cameraLengthCalculate = ({ positions }:{ positions: math.Matrix[] }): { lengthXYZ: number[], centerPosition: [number, number, number] } => {
    const pointMinMax = {
      minX: Infinity, maxX: -Infinity,
      minY: Infinity, maxY: -Infinity,
      minZ: Infinity, maxZ: -Infinity,
    }

    const { minX, maxX, minY, maxY, minZ, maxZ } = positions.reduce(
      (acc, vec) => {
        return {
          minX: Math.min(acc.minX, vec.get([0, 0])),
          maxX: Math.max(acc.maxX, vec.get([0, 0])),
          minY: Math.min(acc.minY, vec.get([1, 0])),
          maxY: Math.max(acc.maxY, vec.get([1, 0])),
          minZ: Math.min(acc.minZ, vec.get([2, 0])),
          maxZ: Math.max(acc.maxZ, vec.get([2, 0])),
        };
      },
      pointMinMax
    );

    // 考慮に原点座標 (0, 0, 0) を加える
    const origin = math.matrix([[0], [0], [0]]);
    const originMinX = Math.min(minX, origin.get([0, 0]));
    const originMaxX = Math.max(maxX, origin.get([0, 0]));
    const originMinY = Math.min(minY, origin.get([1, 0]));
    const originMaxY = Math.max(maxY, origin.get([1, 0]));
    const originMinZ = Math.min(minZ, origin.get([2, 0]));
    const originMaxZ = Math.max(maxZ, origin.get([2, 0]));

    const lengthXYZ = [ originMaxX - originMinX, originMaxY - originMinY, originMaxZ - originMinZ ]
    const centerPosition: [number, number, number] = [ (originMaxX + originMinX)/2.0, (originMaxY + originMinY)/2.0, 0 ]

    return { lengthXYZ: lengthXYZ, centerPosition: centerPosition}
  }

  return {
    calibrationViewerState
  }
}

export { useCalibrationViewerState }

async function loadCameraExXmlData(props: { data: string, xmlData: exXml }) {
  const { data, xmlData } = props;
  try {
    const xml = new DOMParser().parseFromString(data, 'text/xml');
    const xmlString = new XMLSerializer().serializeToString(xml);
    const result1 = xmljs.xml2json(xmlString);
    const dataJson = JSON.parse(result1);

    for(let i = 0; i < dataJson.elements[0].elements.length; i++) {
      const name = dataJson.elements[0].elements[i].name;
      switch (name) {
        case 'intrinsic': xmlData.intrinsic = extractNumbers(dataJson, i); break;
        case 'distortion': xmlData.distortion = extractNumbers(dataJson, i); break;
        case 'rotation': xmlData.rotation = extractNumbers(dataJson, i); break;
        case 'translation': 
          const numArray = extractNumbers(dataJson, i);
          xmlData.translation = [numArray[0], numArray[1], numArray[2]] 
          break;
        case 'rms': xmlData.rms = parseFloat(dataJson.elements[0].elements[i].elements[0].text); break;
        default : break;
      }
    }
    return xmlData;
  } catch {
    //処理に失敗した場合
    return xmlData
  }
}

async function loadCameraInXmlData(props: { data: string, xmlData: inXml }) {
  const { data, xmlData } = props;

  try {
    const xml = new DOMParser().parseFromString(data, 'text/xml');
    const xmlString = new XMLSerializer().serializeToString(xml);
    const result1 = xmljs.xml2json(xmlString);
    const dataJson = JSON.parse(result1);

    for(let i = 0; i < dataJson.elements[0].elements.length; i++) {
      const name = dataJson.elements[0].elements[i].name;
      switch(name) {
        case 'intrinsic': xmlData.intrinsic = extractNumbers(dataJson, i); break;
        case 'distortion': xmlData.distortion = extractNumbers(dataJson, i); break;
        case 'rms': xmlData.rms = parseFloat(dataJson.elements[0].elements[i].elements[0].text); break;
        default : break;
      }
    }
    return xmlData
  } catch {
    return xmlData
  }
}

function extractNumbers(dataJson: any, i: number): number[] {
  const numbersText = dataJson.elements[0].elements[i].elements[3].elements[0].text;
  const cleanedText = numbersText.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
  const numbersArray = cleanedText.split(' ').map(Number);
  return numbersArray;
}