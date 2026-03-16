// src/components/deviceMonitor/ChartAndTableOfTemperature.tsx
import { useState, useEffect } from 'react';
import { Paper, Grid } from '@mui/material';
import { Transport } from '@connectrpc/connect';

import { soloGetDeviceTemperature } from '../../../api/soloAPI';
import PlotGraph from './PlotGraph';
import TableStatistics from './TableStatistics';

// 温度取得の更新間隔（1秒）
const updateIntervalTime: number = 1000;



// カメラから温度データを取得する関数
const FetchTemperature = async (transport: Transport) => {
  try {
    // const transport = createConnectTransport({ baseUrl: `${url}:${PortSolo}` });
    // const client = createClient(SoloService, transport);
    // const res = await client.getDeviceTemperature({});
    const res = await soloGetDeviceTemperature({ transport: transport });
    if (res) {
      return {
        cameraSensor: res.cameraSensor,  // カメラモジュールの温度[C]
        syncCpu:      res.syncCpu,       // 同期子機CPUの温度[C]
        coreAux:      res.coreAux,       // AUXの温度[C]
        coreCpu:      res.coreCpu,       // CPUの温度[C]
        coreThermal:  res.coreThermal,   // 温度センサーの値[C]
        coreAo:       res.coreAo,        // AOの温度[C]
        coreGpu:      res.coreGpu,       // GPUの温度[C]
        coreWifi:     res.coreWifi,      // WiFiモジュールの温度[C]
        corePmic:     res.corePmic,      // PMICの温度[C]
        ssd:          res.ssd,           // SSDの温度[C]
      };
    }
  } catch (error) {
    console.error(`温度取得エラー:`, error);
  }
  return {}; // データが取得できなかった場合は空のオブジェクトを返す
};


// 1種類の温度データから統計値を計算する関数
const calculateStatistics = (temperatureValues: number[]) => {
  const minValue = Math.min(...temperatureValues);
  const maxValue = Math.max(...temperatureValues);
  const sum = temperatureValues.reduce((acc, value) => acc + value, 0);
  const averageValue = sum / temperatureValues.length;
  const currentValue = temperatureValues[temperatureValues.length - 1];
  return {
    minValue,
    maxValue,
    averageValue,
    currentValue,
  };
};


// dataから時刻と各項目の時系列データを抽出する関数
const extractTimeSeriesData = (data: any[], property: string | number) => {
  return data.map((cameraData) =>
    cameraData.map((item: { [x: string]: any; time: any; }) => (
      //{ time: item.time, [property]: item[property] }
      ({
        time: item.time,
        temperature: item[property]
      })
    ))
  );
};


// 統計データから特定のキーのデータを抽出する関数
const extractData = (statistics: any[], key: string) => {
  return statistics.map((cameraStatistics) => cameraStatistics[key]);
};


// グラフとテーブルを描画する関数
const renderGraphAndTable = (title: string, property: string, camUrls: string[], nicknames: string[], data: any, statistics: any, colors: string[], maxTime: Date) => {
  return (
    <>
      <Grid size={{ xs: 12, sm: 12, md: 7, lg: 8, xl: 8 }}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 320,
          }}
        >
          <PlotGraph title={title} camUrls={camUrls} nicknames={nicknames} data={extractTimeSeriesData(data, property)} colors={colors} maxTime={maxTime} />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 5, lg:4, xl: 4 }}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 320,
            minWidth: 330,
          }}
        >
          <TableStatistics title={title} camUrls={camUrls} nicknames={nicknames} data={extractTimeSeriesData(data, property)} statistics={extractData(statistics, property)} colors={colors} />
        </Paper>
      </Grid>
    </>
  );
};


// main文
const ChartAndTable = ({ camUrls, nicknames, transports }: { camUrls: string[]; nicknames: string[], transports: Transport[] }) => {
  const colors = ['#8884d8', '#82ca9d', '#ff7300', '#00a8cc', '#774936', '#d83a56', '#008000', '#800080'];
  const [data, setData] = useState<Array<Array<{
    time:         number;
    ssd:          number,
    cameraSensor: number,
    coreCpu:      number,
    coreGpu:      number,
    coreAux:      number,
    coreWifi:     number,
    coreAo:       number,
    corePmic:     number,
    coreThermal:  number,
    syncCpu:      number,
  }>>>(camUrls.map(() => []));

  // グラフの横軸の最大値(定期的な更新に対応するため)
  const [maxTime, setMaxTime] = useState(new Date());

  // 統計データの初期化関数
  const initStatistics = () => ({
    ssd:          { minValue: NaN, maxValue: NaN, averageValue: NaN, currentValue: NaN, },
    cameraSensor: { minValue: NaN, maxValue: NaN, averageValue: NaN, currentValue: NaN, },
    coreCpu:      { minValue: NaN, maxValue: NaN, averageValue: NaN, currentValue: NaN, },
    coreGpu:      { minValue: NaN, maxValue: NaN, averageValue: NaN, currentValue: NaN, },
    coreAux:      { minValue: NaN, maxValue: NaN, averageValue: NaN, currentValue: NaN, },
    coreWifi:     { minValue: NaN, maxValue: NaN, averageValue: NaN, currentValue: NaN, },
    coreAo:       { minValue: NaN, maxValue: NaN, averageValue: NaN, currentValue: NaN, },
    corePmic:     { minValue: NaN, maxValue: NaN, averageValue: NaN, currentValue: NaN, },
    coreThermal:  { minValue: NaN, maxValue: NaN, averageValue: NaN, currentValue: NaN, },
    syncCpu:      { minValue: NaN, maxValue: NaN, averageValue: NaN, currentValue: NaN, },
  });
  const [statistics, setStatistics] = useState(camUrls.map(() => initStatistics()));


  // インターバル処理つき
  useEffect(() => {
    if (camUrls.length === 0) {
      console.error("カメラURLが設定されていません。");
      return;
    }

    const fetchData = async () => {
      const time = new Date().getTime();
      const newDataArray: any[] = [];

      try {
        // 各カメラごとに温度データを取得
        const promises = transports.map(async (transport, index) => {
          const temperatures = await FetchTemperature(transport);
          newDataArray[index] = { time, ...temperatures };
        });

        await Promise.all(promises);
      } catch (error) {
        console.error("データ取得エラー:", error);
      }

      // 取得時刻と各種温度データを随時格納し貯める
      setData((prevData) => {
        const updatedDataArray = prevData.map((cameraData, index) => {
          if (newDataArray[index]) {
            return [...cameraData, newDataArray[index]];
          }
          return cameraData;
        });

        // 最初のNaNを削除
        if (Number.isNaN(updatedDataArray[0][0]?.syncCpu)) {
          updatedDataArray.forEach((dataItem) => dataItem.shift());
        }

        // 各カメラ,各種温度の統計データを格納
        const newStatistics = updatedDataArray.map((cameraData) => ({
          ssd:          calculateStatistics(cameraData.map((item) => item.ssd)),
          cameraSensor: calculateStatistics(cameraData.map((item) => item.cameraSensor)),
          coreCpu:      calculateStatistics(cameraData.map((item) => item.coreCpu)),
          coreGpu:      calculateStatistics(cameraData.map((item) => item.coreGpu)),
          coreAux:      calculateStatistics(cameraData.map((item) => item.coreAux)),
          coreWifi:     calculateStatistics(cameraData.map((item) => item.coreWifi)),
          coreAo:       calculateStatistics(cameraData.map((item) => item.coreAo)),
          corePmic:     calculateStatistics(cameraData.map((item) => item.corePmic)),
          coreThermal:  calculateStatistics(cameraData.map((item) => item.coreThermal)),
          syncCpu:      calculateStatistics(cameraData.map((item) => item.syncCpu)),
        }));
        setStatistics(newStatistics);

        // 横軸(時刻)の最大値を更新
        const now = new Date();
        now.setSeconds(0);
        now.setMinutes(now.getMinutes() + 1);
        setMaxTime(now);

        return updatedDataArray;
      });
    };

    // インターバル時間を設定
    const intervalID = setInterval(() => {
      fetchData();
    }, updateIntervalTime);

    // コンポーネントがアンマウントされたときにインターバルをクリア（メモリリーク対策）
    return () => {
      clearInterval(intervalID)
    };

  }, [camUrls]);


  if (camUrls.length === 0) {
    return (
      <div>
        <p>カメラURLが設定されていません。カメラURLを設定してください。</p>
      </div>
    );
  }

  return (
    <>
      {renderGraphAndTable("ssd",          "ssd",          camUrls, nicknames, data, statistics, colors, maxTime)}
      {renderGraphAndTable("cameraSensor", "cameraSensor", camUrls, nicknames, data, statistics, colors, maxTime)}
      {renderGraphAndTable("syncCpu",      "syncCpu",      camUrls, nicknames, data, statistics, colors, maxTime)}
      {renderGraphAndTable("coreCpu",      "coreCpu",      camUrls, nicknames, data, statistics, colors, maxTime)}
      {renderGraphAndTable("coreGpu",      "coreGpu",      camUrls, nicknames, data, statistics, colors, maxTime)}
      {renderGraphAndTable("coreAux",      "coreAux",      camUrls, nicknames, data, statistics, colors, maxTime)}
      {renderGraphAndTable("coreAo",       "coreAo",       camUrls, nicknames, data, statistics, colors, maxTime)}
      {renderGraphAndTable("corePmic",     "corePmic",     camUrls, nicknames, data, statistics, colors, maxTime)}
      {renderGraphAndTable("coreThermal",  "coreThermal",  camUrls, nicknames, data, statistics, colors, maxTime)}
      {renderGraphAndTable("coreWifi",     "coreWifi",     camUrls, nicknames, data, statistics, colors, maxTime)}
    </>
  );
};

export default ChartAndTable;


