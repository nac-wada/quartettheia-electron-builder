// src/components/calibrationViewer/CameraDataLoader.tsx
import xmljs from 'xml-js';
import { Transport } from '@connectrpc/connect';
import { ExtrinsicCalibStatus, ExtrinsicXMLType, GetExtrinsicDataResponse, GetIntrinsicDataResponse, IntrinsicCalibStatus, IntrinsicXMLType } from '../types/common';
import { CalibrationType } from '../gen/solo/v1/solo_pb';
import { soloCheckCalibrationResultExists, soloGetCalibrationResult } from '../api/soloAPI';

export const getCameraExtrinsicXmlData = async (transport: Transport): Promise<ExtrinsicXMLType | null> => {
  try {
    const type = CalibrationType.EXTRINSIC_BOARD
    let exXmlData: ExtrinsicXMLType = {
      intrinsic: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      distortion: [0, 0, 0, 0, 0],
      rotation: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      translation: [0, 0, 0],
      rms: -1,
    }
    const res = await soloCheckCalibrationResultExists({ transport, type });

    if (res && res.exists) {
      const data = await soloGetCalibrationResult({ transport, type })
      
      if(data) {

        const parser = new DOMParser();
        const xml = parser.parseFromString(data.result, 'text/xml');
        const xmlToString = new XMLSerializer().serializeToString(xml);
        const xml2json = xmljs.xml2json(xmlToString);
        const dataJson = JSON.parse(xml2json);

        for(let i=0; i < dataJson.elements[0].elements.length; i++) {
          const name = dataJson.elements[0].elements[i].name;

          // 文字列から改行を消して,スペースで区切り配列化
          function extractNumbers(dataJson: any, i: number): number[] {
            const numbersText = dataJson.elements[0].elements[i].elements[3].elements[0].text;
            const cleanedText = numbersText.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
            const numbersArray = cleanedText.split(' ').map(Number);
            return numbersArray;
          }

          switch(name) {
            case 'intrinsic':
              exXmlData.intrinsic = extractNumbers(dataJson, i);
              break;
            case 'distortion':
              exXmlData.distortion = extractNumbers(dataJson, i);
              break;
            case 'rotation':
              exXmlData.rotation = extractNumbers(dataJson, i);
              break;
            case 'translation':
              const array = extractNumbers(dataJson, i);
              exXmlData.translation = [array[0], array[1], array[2]];
              break;
            case 'rms':
              exXmlData.rms = parseFloat(dataJson.elements[0].elements[i].elements[0].text);
              break;
          }
        }

        return exXmlData

      } else {
        return exXmlData
      }
    } else {
      return exXmlData
    }
  }
  catch (e) {
    return null
  }
}

export const getCameraIntrinsicXmlData = async (transport: Transport): Promise<IntrinsicXMLType | null> => {
  try {
    const type = CalibrationType.INTRINSIC_BOARD
    let inXmlData = {
      intrinsic: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      distortion: [0, 0, 0, 0, 0],
      rms: -1,
    }
    const res = await soloCheckCalibrationResultExists({ transport, type });

    if (res && res.exists) {
      const data = await soloGetCalibrationResult({ transport, type })
      
      if(data) {

        const parser = new DOMParser();
        const xml = parser.parseFromString(data.result, 'text/xml');
        const xmlToString = new XMLSerializer().serializeToString(xml);
        const xml2json = xmljs.xml2json(xmlToString);
        const dataJson = JSON.parse(xml2json);

        for(let i=0; i < dataJson.elements[0].elements.length; i++) {
          const name = dataJson.elements[0].elements[i].name;

          // 文字列から改行を消して,スペースで区切り配列化
          function extractNumbers(dataJson: any, i: number): number[] {
            const numbersText = dataJson.elements[0].elements[i].elements[3].elements[0].text;
            const cleanedText = numbersText.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
            const numbersArray = cleanedText.split(' ').map(Number);
            return numbersArray;
          }

          switch(name) {
            case 'intrinsic':
              inXmlData.intrinsic = extractNumbers(dataJson, i);
              break;
            case 'distortion':
              inXmlData.distortion = extractNumbers(dataJson, i);
              break;
            case 'rms':
              inXmlData.rms = parseFloat(dataJson.elements[0].elements[i].elements[0].text);
              break;
          }
        }

        return inXmlData

      } else {
        return inXmlData
      }
    } else {
      return inXmlData
    }
  }
  catch (e) {
    return null
  }
}

export const getIntrinsicData = async (transport: Transport, ipv4Addr: string): Promise<GetIntrinsicDataResponse> => {
  const intrinsicData = await getCameraIntrinsicXmlData(transport);
  
  if(!intrinsicData) {
    return { success: false }
  }

  let status = (intrinsicData.rms > 0 && intrinsicData.rms < 1) ? IntrinsicCalibStatus['STATUS_IN_CALIBRATION_EXIST_FILE'] : IntrinsicCalibStatus['STATUS_IN_CALIBRATION_ERROR_EXIST']

  return { success: true, data: intrinsicData, status: status }
}

export const getExtrinsicData = async (transport: Transport, ipv4Addr: string): Promise<GetExtrinsicDataResponse> => {
  const extrinsicData = await getCameraExtrinsicXmlData(transport);
  
  if(!extrinsicData) {
    return { success: false }
  }

  let status = (extrinsicData.rms > 0 && extrinsicData.rms < 1) ? ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_EXIST_FILE'] : ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_ERROR_EXIST']

  return { success: true, data: extrinsicData, status: status }
}