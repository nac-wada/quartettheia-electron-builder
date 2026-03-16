// src/components/calibration/calibrationExtrinsic/api/ResetAllCalibrationSnapshots.tsx
import { createConnectTransport } from '@connectrpc/connect-web';
import { createClient } from '@connectrpc/connect';
import { PortSolo } from '../../../types/common';
import { CalibrationType, SoloService } from '../../../gen/solo/v1/solo_pb';


// 複数カメラのキャリブレーション情報を全てリセット
async function ResetAllCalibrationSnapshots(props: { camfronturls: string[]; }) {
  if (props.camfronturls.length === 0) {
    console.error('ResetAllCalibrationSnapshots(length=' + props.camfronturls.length + ') is error (Extrinsic)');
    return -1;
  }

  for (let i = 0; i < props.camfronturls.length; i++) {

    const soloTransport = createConnectTransport({
      baseUrl: `${props.camfronturls[i]}:${PortSolo}`
    });
    const soloclient = createClient(SoloService, soloTransport);

    soloclient.getCalibrationSnapshotsCount({ type: CalibrationType.EXTRINSIC_BOARD }).then((snaps) => {
      if (snaps.count > 0) {

        soloclient.resetCalibrationSnapshots({}).then((res) => {
          if (res.success) {

            // check
            soloclient.getCalibrationSnapshotsCount({ type: CalibrationType.EXTRINSIC_BOARD }).then((resnaps) => {
              console.log('ResetAllCalibrationSnapshots(' + props.camfronturls[i] + ') is success. count is ' + resnaps.count + '. (Extrinsic)');
            });//getCal

          } else {
            console.error('ResetAllCalibrationSnapshots(' + props.camfronturls[i] + ') is error (Extrinsic)');
          }
        });//resetCal

      }
    });//getCal

  }//for i
  return (0);
}

export default ResetAllCalibrationSnapshots

