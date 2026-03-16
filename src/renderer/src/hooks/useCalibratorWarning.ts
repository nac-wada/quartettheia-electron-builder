import { useCallback, useEffect, useState } from "react"
import { CalibratorDetectionMode } from "../gen/solo/v1/solo_pb"
import { useDevices } from "../globalContexts/DeviceContext"
import { soloSetCalibratorDetectionMode } from "../api/soloAPI"
import { quartetBroadcastEvent } from "../api/quartetAPI"
import { QuartetBroadCastCustomEventFlag, MessageModalProps } from "../types/common"
import { EventType } from "../gen/quartet/v1/quartet_pb"

export const useSetCalibratorWarning = (
  props: { calibratorDetectionMode: CalibratorDetectionMode | false }
) => {
  const { devices } = useDevices();
  const [message, setMessage] = useState<MessageModalProps | null>(null);

  useEffect(() => {
    const mode = props.calibratorDetectionMode;
    if (!mode) return;

    // 1. 対象のモードかどうかを判定
    const isLFrame = [
      CalibratorDetectionMode.LFRAME_COPLANAR_4PT,
      CalibratorDetectionMode.LFRAME_NON_COPLANAR_5PT
    ].includes(mode);

    const isTwand = [
      CalibratorDetectionMode.TWAND_I_FORM_1PT,
      CalibratorDetectionMode.TWAND_T_FORM_2PT
    ].includes(mode);

    if (!isLFrame && !isTwand) return;

    // 2. 3秒待機してからモーダルを表示するタイマー
    const timer = setTimeout(() => {
      const targetName = isLFrame ? "Lフレーム" : "Tワンド";
      const messageContent = `${targetName}検出中です。<br>${targetName}モードを解除しますか？`;

      const handleConfirm = () => {
        const flags = BigInt(QuartetBroadCastCustomEventFlag["SET_CALIBRATOR_DETECTION_MODE"]);
        resetCalibratorMode();
        quartetBroadcastEvent({ type: EventType["CUSTOM_EVENT"], flags });
        setMessage(null);
      };

      setMessage({
        event: "warning",
        title: '警告',
        content: messageContent,
        onConfirm: handleConfirm,
        onCancel: () => setMessage(null),
        onClose: () => setMessage(null)
      });
    }, 1000); // 1000ms待機

    // 3. クリーンアップ処理
    // 1秒経つ前に props.calibratorDetectionMode が変わったらタイマーを破棄
    return () => clearTimeout(timer);

  }, [props.calibratorDetectionMode, devices]); // resetCalibratorMode内でdevicesを使うため追加

  const resetCalibratorMode = useCallback(() => {
    return Promise.all(
      devices.map(device => 
        soloSetCalibratorDetectionMode({ 
          transport: device.transport, 
          calibratorDetectMode: CalibratorDetectionMode.NONE 
        })
      )
    );
  }, [devices]);

  return message;
};