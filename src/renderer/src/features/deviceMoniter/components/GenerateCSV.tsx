// src/components/deviceMonitor/GenerateCSV.tsx
//import React, { } from 'react';


// CSVデータを生成する関数
const GenerateCSV = (camUrls: string[], nicknames: string[], data: any[], statistics: any, title: string) => {
  const csvData = [];

  // ファイル名/ヘッダ用:(20230927_130200)
  const date = new Date(data[0][data[0].length - 1].time);
  const year = date.getFullYear();
  const month   = String(date.getMonth() + 1).padStart(2, '0');
  const day     = String(date.getDate()).padStart(2, '0');
  const hours   = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  // 指定された形式に変換
  const formattedDate = `${year}${month}${day}_${hours}${minutes}${seconds}`;

  // ヘッダー
  csvData.push([date]);
  csvData.push([title]);

  // 統計情報
  csvData.push(['---']);
  csvData.push([ 'camera', 'min', 'max', 'ave', 'last' ]);
  //const cleanedCamUrls = camUrls.map((url) => url.replace('http://', ''));
  const cleanedCamUrls = nicknames;
  data.forEach((cameraData, index) => {
    const rowData = [cleanedCamUrls[index]]; // 1列目にurl

    rowData.push(statistics[index].minValue.toFixed(1)); // 2列目以降に統計情報
    rowData.push(statistics[index].maxValue.toFixed(1));
    rowData.push(statistics[index].averageValue.toFixed(1));
    rowData.push(statistics[index].currentValue.toFixed(1));
    csvData.push(rowData);
  });

  // 時系列温度の数値データ
  csvData.push(['---']);
  csvData.push(['time', ...cleanedCamUrls]);

  for (let i = 0; i < data[0].length; i++){
    // 1列目時刻(hh:mm:ss)
    const rowData = [ new Date(data[0][i].time).toLocaleTimeString() ];
    for (let j = 0; j < data.length; j++){
      // 2列目以降温度データ(hh:mm:ss, cam1-data, cam2-data, ..)
      rowData.push(data[j][i].temperature.toFixed(1));
    }
    csvData.push(rowData);
  }

  // CSV形式に変換(,と改行追加)
  const csvContent = csvData.map((row) => row.join(',')).join('\n');

  // CSVファイルをダウンロード
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = formattedDate + '_' + title.replace(/\s+/g, '_') + '_temperature_data.csv';
  link.click();
};


export default GenerateCSV;