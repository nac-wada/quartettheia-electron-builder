// src/components/cardVideo/iconButtonMini/RamPercent.tsx
import React, { useState, useEffect } from 'react';
import RoundTag from './RoundTag';
import { Transport } from '@connectrpc/connect';
import { soloGetDeviceMemoryUsage } from '../../../../../api/soloAPI';

const RamPercent: React.FC<{
  transport: Transport;
  backgroundOpacity?: number;
  intervalDuration?: number;
}> = ({ transport, backgroundOpacity = 0.8, intervalDuration = 5000 }) => {
  const [ramPercent, setRamPercent] = useState<string>(' -- ');
  const [tagWidth, setTagWidth] = useState<string>('5.0rem'); // 初期幅

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await soloGetDeviceMemoryUsage({ transport });

        if(res && res.ram) {
          let percent = `${((Number(res.ram.used) / Number(res.ram.total)) * 100).toFixed(1)} RAM%`; // 小数点第一位までに丸める
          setRamPercent(percent);

          setRamPercent((prevPer) => {
            const width = `${(prevPer.length * 0.65)}rem`;
            setTagWidth(width);
            return prevPer;
          })
        }
      } catch (error) {
        console.warn('データの取得に失敗しました:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, intervalDuration);

    return () => clearInterval(intervalId);
  }, [intervalDuration]);

  return (
    <RoundTag
      tagName={`${ramPercent}`}
      tooltipName={'メモリー使用率'}
      width={tagWidth}
      textAlign='right'
      backgroundOpacity={backgroundOpacity}
    />
  );
}

export default RamPercent;


