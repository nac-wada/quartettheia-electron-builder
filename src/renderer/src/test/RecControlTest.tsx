// RecControlTest.tsx
import { useState } from "react";
import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { SoloService } from "../gen/solo/v1/solo_pb";

export default function RecControlTest(props: { solourl: string; downloadurl: string; }) {

  const transport = createConnectTransport({
    baseUrl: props?.solourl
  });
  const client = createClient(SoloService, transport);

  const [recordingKey, setRecordingKey] = useState('********');

  function startRecording() {
    client.startRecorder({}).then((res) => {
      setRecordingKey(res.key);
      console.log("rec start");
    });
  }

  function stopRecording() {
    client.stopRecorder({ key: recordingKey }).then((res) => {
      console.log("rec stop");
      //
    });
  }

  function download() {
    const url = `${props?.downloadurl}/${recordingKey}.mp4`;
    const link = document.createElement('a');
    link.href = url;
    link.download = url;
    link.target = "_blank";
    link.click();
  }

  function shutdownRecorderAll() {
    client.shutdownRecorderAll({}).then((res) => {
      console.log('shutdownRecorderAll');
      console.log(res.records);
    });
  }

  function getRecordingKeys() {
    client.getRecordingKeys({}).then((res) => {
      console.log('getRecordingKeys');
      console.log(res.keys);
    });
  }


  return (
    <>
      <input type="button" value="RECSTART" onClick={startRecording} />
      <input type="button" value="RECSTOP" onClick={stopRecording} />
      <input type="button" value="DOWNLOAD" onClick={download} />
      <input type="button" value="shutdownRecorderAll" onClick={shutdownRecorderAll} />
      <input type="button" value="getRecordingKeys" onClick={getRecordingKeys} />
    </>
  );
}