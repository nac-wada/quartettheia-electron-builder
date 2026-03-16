// src/components/deviceMonitor/index.tsx
import React, { lazy, Suspense, useEffect } from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDevices } from '../../globalContexts/DeviceContext';
import Loading from '../../components/Loading';

const TemperatureChartAndTable = lazy(() => import('./components/ChartAndTableOfTemperature'))

export default function DeviceMonitor() {
  // const { camUrls, nicknames } = useDevice();
  const { devices } = useDevices();

  useEffect(() => {
    // カメラURLが空の場合のエラーハンドリング
    if (devices.length === 0) {
      console.log('deviceMonitor-index.tsx loading...');
      return;
    }
  }, [devices]);

  const centeredMessageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '65vh',
  };

  const theme = useTheme();
  const messageStyle: React.CSSProperties = {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: '0px',
    animation: 'blink 1s infinite', // 点滅アニメーションを適用
  };

  // カメラURLが空の場合、エラーメッセージを表示
  if (devices.length === 0) {
    return (
      <div style={centeredMessageStyle}>
        <p style={messageStyle}>LOADING ...</p>
      </div>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Suspense fallback={<Loading/>}>
          <TemperatureChartAndTable camUrls={devices.map(device => device.ipv4Addr)} nicknames={devices.map(device => device.nickname)} transports={devices.map(device => device.transport)}/>
        </Suspense>
      </Grid>
    </>
  );
}


