import '../../App.css';
import { createConnectTransport } from '@connectrpc/connect-web';
import { createClient } from '@connectrpc/connect';
import { QuartetService } from '../gen/quartet/v1/quartet_pb';
import LiveList from './LiveList';
import { Box } from '@mui/material';
import { PortQuartet, QuartetBaseUrl } from '../types/common';

function findCameras() {
  const quartetTransport = createConnectTransport({
    baseUrl: QuartetBaseUrl
  });
  const quartetClient = createClient(QuartetService, quartetTransport);

  quartetClient.getDevices({}).then((res) => {
    for (const d of res.devices) {
      console.log(d.ipv4Addr);

      // 初回ページ読み込み時に見つかったカメラでfixする
    }
  });
}

const getDeviceSigUrls = () => {
  const quartetTransport = createConnectTransport({
    baseUrl: QuartetBaseUrl
  });
  const quartetClient = createClient(QuartetService, quartetTransport);

  return quartetClient.getDevices({}).then((res) => {
    const urls: string[] = [];
    for (const d of res.devices) {
      console.log(`http://${d.ipv4Addr}:${PortQuartet}`);

      // 初回ページ読み込み時に見つかったカメラでfixする
      urls.push(`http://${d.ipv4Addr}:${PortQuartet}`);
    }
    console.log(urls);
    return urls;
  });
};


const fixSyncTime = () => {
  const quartetTransport = createConnectTransport({
    baseUrl: QuartetBaseUrl
  });
  const quartetClient = createClient(QuartetService, quartetTransport);

  // return quartetClient.fixSyncTime({}).then((res) => {
  //   console.log('fixSyncTime');
  // });
  return;
};


const getCurrentTime = () => {
  const quartetTransport = createConnectTransport({
    baseUrl: QuartetBaseUrl
  });
  const quartetClient = createClient(QuartetService, quartetTransport);

  return quartetClient.getCurrentTime({}).then((res) => {
    console.log('getCurrentTime');
    console.log(res.frameTimestamp);
    console.log(res.timestamp);
  });

};


export default function TmpQuartet() {
  return (
    <Box
      sx={{
        //backgroundColor:"#2C3E50",
        mt: 3,
      }}
      component="div"
    >

      <h1>Quartet-UI</h1>
      <LiveList sigurls={getDeviceSigUrls()} />
      <input type="button" value="findCameras" onClick={findCameras} />
      <input type="button" value="fixSyncTime" onClick={fixSyncTime} />
      <input type="button" value="getCurrentTime" onClick={getCurrentTime} />

    </Box>
  );
}

export { };
