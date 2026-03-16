// src/components/cardVideo/chip/StorageRemainingTime.tsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { RoundTag2 } from './RoundTag2';
import { Transport } from '@connectrpc/connect';
import { soloGetRecordingStorageUsage } from '../../../../../api/soloAPI';
import { convertHoursToTimeString } from '../../utils/camera';
import { VELOCITY_GB_h } from '../../types';

export const StorageRemainingTime: React.FC<{
  transport: Transport;
  backgroundOpacity?: number;
  intervalDuration?: number;
}> = ({
  transport,
  backgroundOpacity = 0.8,
  intervalDuration = 30000 // [ms]
}) => {
  const [strStorageRemainingTime, setStrStorageRemainingTime] = useState<string>(' -- ');
  const [numStorageRemainingTime, setNumStorageRemainingTime] = useState<number>(0);
  const theme = useTheme();

  useEffect(() => {

    const fetchData = async () => {
      try {
        const res = await soloGetRecordingStorageUsage({ transport })
        if (res) {
          const freeData = (Number(res.free) * 1E-9) / VELOCITY_GB_h
          const FreeHourMinute = convertHoursToTimeString(freeData);
          setStrStorageRemainingTime(FreeHourMinute);
          setNumStorageRemainingTime((Number(res.used) / Number(res.total)) * 100);
        }
      } catch (error) {
        console.warn('データの取得に失敗しました:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, intervalDuration);

    return () => clearInterval(intervalId);
  }, [transport, intervalDuration]);

  return (
    <>

      <RoundTag2
        tagName={strStorageRemainingTime}
        tooltipName={'時：分：秒'}
        openTooltip={false}
        backgroundOpacity={backgroundOpacity}
        fontColor={(numStorageRemainingTime > 80.0) ? theme.palette.error.dark : 'text.primary'}
        fontSize={'13.6px'}
        letterSpacing={'-0.4px'}
        pt={'0.15rem'}
      />

    </>
  );
}



