// src/components/tuning/Fps.tsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';

import { SoloService } from '../../../../../gen/solo/v1/solo_pb';
import { PortSolo } from '../../../../../types/common';
import { CameraFrameRateType } from '../../../../../gen/solo/v1/solo_pb';
import RoundTag from './RoundTag';
import { updateInterval } from '../../types';

const Fps: React.FC<{
  url: string;
  backgroundOpacity?: number;
}> = ({
  url,
  backgroundOpacity = 0.8,
}) => {
  let transport;
  let client: any;

  // エラーとFPSの表示値の状態管理
  const [hasError, setHasError] = useState(false);
  const [value, setValue] = useState('');

  // FPSの小数点処理用の定数
  const digits: number = 100;

  // 最後に関数が呼ばれた時間を保持
  const [lastCallTime, setLastCallTime] = useState(0);

  try {
    transport = createConnectTransport({
      baseUrl: `${url}:${PortSolo}`
    });

    client = createClient(SoloService, transport);
  } catch (error) {
    console.log('[error] Connectトランスポートまたはクライアントの作成に失敗しました:', error);
    setHasError(true);
    setValue('--');
  }

  useEffect(() => {
    // FPS取得の非同期処理
    const handleFps = async () => {
      try {
        const currentTime = Date.now();

        // 更新間隔以上の時間が経過している場合に処理を実行
        if (currentTime - lastCallTime >= updateInterval) {
          setLastCallTime(currentTime);

          // FPS取得
          const res = await client.getCameraActualFrameRate({ type: CameraFrameRateType.RECORD });

          if (res) {
            const val = Number(res.value);

            // FPSの表示値の設定
            if (val < 0) {
              setValue('--');
            } else {
              setValue((Math.ceil(val * digits) / digits).toFixed(1));
            }

            // エラーフラグをリセット
            setHasError(false);
          }
        }
      } catch (error) {
        console.log('[warning] カメラのfpsデータを取得できませんでした:', error);
        setHasError(true);
        setValue('--');
      }
    };

    if (!hasError) {
      // 初回の呼び出し
      handleFps();
    }

    // 定期的にFPS取得処理を実行するインターバル
    const intervalId = setInterval(() => {
      if (!hasError) {
        handleFps();
      }
    }, updateInterval);

    // コンポーネントがアンマウントされたときにインターバルをクリア（メモリリーク対策）
    return () => {
      clearInterval(intervalId);
    };
  }, [client, hasError, lastCallTime]);

  // 画面にFPSを表示するコンポーネント
  return (
    <>
      <RoundTag
        tagName={`${value} fps`}
        width='5.0rem'
        textAlign='right'
        backgroundOpacity={backgroundOpacity}
      />
    </>
  );
}

export default Fps;
