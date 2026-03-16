import { Transport } from "@connectrpc/connect";
import { quartetBroadcastMessage } from "../../../api/quartetAPI";
import { soloCheckCalibrationResultExists, soloGetCalibrationEngineStatus, soloGetCalibrationResult, soloGetExtrinsicCalibrationSnapshotsCount, soloRunCalibration, } from "../../../api/soloAPI";
import { MessageType } from "../../../gen/quartet/v1/quartet_pb";
import { ExtrinsicCalibStatus, DeviceInfomation } from "../../../types/common";
import { CalibrationType, CameraUnit } from "../../../gen/solo/v1/solo_pb";

// カメラの外部パラメータをXmlフォーマットで読み込み
export async function getExtrinsicResult(props: { transport: Transport }) {
  try {
    // const res = await soloCheckExtrinsicCalibrationResultExists({ transport: props.transport })
    const res = await soloCheckCalibrationResultExists({ transport: props.transport, type: CalibrationType.EXTRINSIC_BOARD });

    if(res) {
      if(res.exists) {

        // const resultCal = await soloGetExtrinsicCalibrationResult({ transport: props.transport });
        const resultCal = await soloGetCalibrationResult({ transport: props.transport, type: CalibrationType.EXTRINSIC_BOARD });
        
        if(resultCal) {
        
          return { success: resultCal.success, result: resultCal.result }
        } else {
        
          return { success: false, result: '' }
        }
      } else {

        return { success: false, result: '' }
      }
    } else {
      return { success: false, result: '' }
    } 

  } catch (error) {
    //console.error("外部パラメータの校正結果の取得中にエラーが発生しました", error);
    throw error; // エラーを再スロー
  }
}

export async function runExtrinsicBoard(props: {
  devices: DeviceInfomation[];
  setDevices: any
}) {
  const { devices, setDevices } = props;

  if (devices.length === 0) {
    // 条件未達成のため計算前にストップ
    setDevices((prevDevices: any[]) =>
      prevDevices.map((device, i) => ({
        ...device,
        calibrationExtrinsic: {
          ...device.calibrationExtrinsic,
          status: ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_ERROR_DEVICES_LIST'],
        }
      }))
    );

    console.error('> RunCalibrations: Invalid input length (Extrinsic)');
    return -1;
  }


  // nicknamesと完了数を元に通知コメントを作成し送信
  const deviceNicknames = devices.map((device: any) => {
      return `・${device.nickname}`;
  }).join('\n');


  // 開始通知送信
  quartetBroadcastMessage({
    type: MessageType.NOTICE,
    header: '計算開始｜カメラ位置と姿勢',
    data: deviceNicknames
  });

  const cameras: CameraUnit[] = devices.map(({ ipv4Addr }, i) => { return { $typeName: "solo.v1.CameraUnit", id: i, ipAddress: ipv4Addr } })

  // マップ関数を使用して、すべての計算を非同期に実行
  await Promise.all(devices.map(async ({ transport, ipv4Addr }, i) => {
    try {
      if (await checkCalibratingEngine({ transport: transport })) {
        const resExSnap = await soloGetExtrinsicCalibrationSnapshotsCount({ transport: transport });

        if(resExSnap) {
          if (resExSnap.count > 0) {
            console.log(`> Preparing to run calibration for ${ipv4Addr} (snap count: ${resExSnap.count})`);
            const resExCalib = await soloRunCalibration({ transport, types: [CalibrationType.EXTRINSIC_BOARD], cameras: cameras })

            if (resExCalib) {
              console.log(`  ✓ RunCalibrations(${ipv4Addr}): Next phase (Extrinsic)`);
              return ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_RUN'];
            } else {
              console.warn(` x RunCalibrations(${ipv4Addr}): Failed (Extrinsic)`);
              // API実行失敗(解析の成否ではない)の場合は、-2 を設定
              return ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_ERROR_RUN'];
            }

          } else {
            console.warn(`  x No RunCalibrations(${ipv4Addr}): Failed. No snapshots available (Extrinsic)`);
            // スナップショットがない場合は、-3 を設定
            return ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_ERROR_EMPTY_SNAP'];
          }
        }
      } else {
        console.warn(`GetCalibrationEngineStatus(${ipv4Addr}): busy`);
        // 別の計算中(ロック)の場合は、-4 を設定
        return ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_ERROR_LOCK'];
      }
    } catch (error: any) {
      console.log(`  RunCalibrations(${ipv4Addr}): Error - ${error.message}`);
      // エラーの場合は、-10 を設定
      return ExtrinsicCalibStatus['STATUS_EX_CALIBRATION_ERROR'];
    }
  }));

  return 0;
}

export async function runExtrinsicLFrame(props: {
  transport: Transport;
  cameras: CameraUnit[],
}) {
  const { transport, cameras } = props

  // 送信
  quartetBroadcastMessage({
    type: MessageType.NOTICE,
    header: '計算開始｜カメラ位置と姿勢',
    data: `Lフレームキャリブレーション`
  })
  
  await soloRunCalibration({ transport, types: [CalibrationType.EXTRINSIC_LFRAME], cameras: cameras})
}

export async function runIntrinsicBoard(props: {
  snapshots: number;
  nickname: string;
  transport: Transport;
  cameras: CameraUnit[];
}) {
  const { nickname, transport, snapshots, cameras } = props

  // 送信
  quartetBroadcastMessage({
    type: MessageType.NOTICE,
    header: '計算開始｜レンズひずみ',
    data: `${nickname}`
  })

  if(snapshots>0) {
    await soloRunCalibration({ transport, types: [CalibrationType.INTRINSIC_BOARD], cameras: cameras })
  }
}

export async function runIntrinsicTWand(props: {
  recalculate: boolean;
  transport: Transport;
  cameras: CameraUnit[];
}) {
  const { transport, cameras, recalculate } = props

  // 送信
  quartetBroadcastMessage({
    type: MessageType.NOTICE,
    header: '計算開始｜レンズひずみ',
    data: `Tワンドキャリブレーション`,
  })

  let types = recalculate ? [CalibrationType.INTRINSIC_TWAND] : [CalibrationType.INTRINSIC_TWAND, CalibrationType.EXTRINSIC_LFRAME];

  await soloRunCalibration({ transport, types, cameras: cameras })  
}

export async function checkCalibratingEngine(props: { transport: Transport }) {
  try {
    
    const res = await soloGetCalibrationEngineStatus({ transport: props.transport })

    if (res) {
      if (res.status === 1) {
        return true;
      } else if (res.status === 2) {
        return false;
      } else {
        console.log('GetCalibrationEngineStatus, unspecified:', res.success, 'res.status', res.status);
        return false;
      }

    } else {
      console.error('Error in GetCalibrationEngineStatus, res.success:', res);
      return false;
    }// if res.success

  } catch (error) {
    console.error('Error in GetCalibrationEngineStatus:', error);
    return false;
  }
}