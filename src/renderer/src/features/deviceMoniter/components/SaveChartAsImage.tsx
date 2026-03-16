// src/components/deviceMonitor/SaveChartAsImage.tsx
import html2canvas from 'html2canvas';

// グラフを画像として保存する関数
const SaveChartAsImage = (data: any[], title: string) => {
  const chartContainer = document.getElementById(title.replace(/\s+/g, '_')); // グラフのコンテナのIDを指定

  if (chartContainer) {
    // ファイル名用:(20230927_130200)
    const date = new Date(data[0][data[0].length - 1].time);
    const year = date.getFullYear();
    const month   = String(date.getMonth() + 1).padStart(2, '0');
    const day     = String(date.getDate()).padStart(2, '0');
    const hours   = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 指定された形式に変換
    const formattedDate = `${year}${month}${day}_${hours}${minutes}${seconds}`;
    console.log(formattedDate);

    html2canvas(chartContainer, { scale: 4 }).then((canvas) => {
      const image = canvas.toDataURL('image/png'); // 画像をDataURLとして取得
      const a = document.createElement('a');
      a.href = image;
      a.download = formattedDate + '_' + title.replace(/\s+/g, '_') + '_temperature_chart.png'; // 画像のダウンロード時のファイル名を指定
      a.click();
    });
  }
};

export default SaveChartAsImage;