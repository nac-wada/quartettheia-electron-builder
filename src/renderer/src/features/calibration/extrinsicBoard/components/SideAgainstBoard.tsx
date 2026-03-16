// src/components/calibration/calibrationExtrinsic/api/SideAgainstBoard.tsx
import { Transport } from '@connectrpc/connect';
import { CalibrationCameraSide } from '../../../../gen/solo/v1/solo_pb';
import { soloGetCalibrationCameraSideAgainstBoard, soloSetCalibrationCameraSideAgainstBoard } from '../../../../api/soloAPI';

// 外パラ専用：表裏セット
export async function SettingCalibrationCameraSideAgainstBoard(props: { transport: Transport; side: number; }) {
  let frontOrBack = 0;  // front:1, back:2
  if (props.side === 0) {
    frontOrBack = CalibrationCameraSide.FRONT;
  } else if (props.side === 1) {
    frontOrBack = CalibrationCameraSide.FRONT;
  } else if (props.side === 2) {
    frontOrBack = CalibrationCameraSide.BACK;
  }

  try {
    const res = await soloSetCalibrationCameraSideAgainstBoard({ transport: props.transport, side: frontOrBack });
    if (res) {
      // console.log('set: SetCalibrationCameraSideAgainstBoard(' + props.camfronturl + ', side=' + props.side + ') is success');
    } else {
      // console.error('set: SetCalibrationCameraSideAgainstBoard(' + props.camfronturl + ', side=' + props.side + ') is error');
    }

    // const result = await soloclient.getCalibrationCameraSideAgainstBoard({});
    // console.log('get: check(' + props.camfronturl + ') is ' + result.side);
    const resSide = await soloGetCalibrationCameraSideAgainstBoard({ transport: props.transport })

    if(resSide) {
      
    }

  }catch (err) {
    console.error('SetCalibrationCameraSideAgainstBoard', err);
  }

}


// 外パラ専用：表裏取得
export async function CheckCalibrationCameraSideAgainstBoard(props: { transport: Transport; }): Promise<number> {
  return new Promise(async (resolve,reject) => {
    // const soloTransport = createConnectTransport({
    //   baseUrl: `${props.camfronturl}:${PortSolo}`
    // })
    // const soloclient = createClient(SoloService, soloTransport);
    // await soloclient.getCalibrationCameraSideAgainstBoard({}).then( async res => {
    //   if(res.side === 0) {
    //     await soloclient.setCalibrationCameraSideAgainstBoard({ side: CalibrationCameraSide.FRONT })
    //           .catch( e => {
    //             reject(console.log("setCalibarationCameraSideAgainstBoardError",e))
    //           })
    //   }

    //   resolve(res.side)
    // }).catch( e => {
    //   reject(console.log("getCalibrationCameraSideAgainstBoardError:",e))
    // });

    const res = await soloGetCalibrationCameraSideAgainstBoard({ transport: props.transport })

    if(res !== false) {
      if(res.side === 0) {
        const res = await soloSetCalibrationCameraSideAgainstBoard({ transport: props.transport, side: CalibrationCameraSide.FRONT })

        if(!res) {
          reject(console.log(`SetCalibrationERROR`))
        }
      }

      resolve(res.side)
    }
  });
}



