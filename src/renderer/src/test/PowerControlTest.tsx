// PowerControlTest.tsx
import { useState } from "react";
import { SoloService } from "../gen/solo/v1/solo_pb";
import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';

export default function PowerControlTest(props: { camfronturl: string; }) {

  const transport = createConnectTransport({
    baseUrl: props?.camfronturl
  });

  const client = createClient(SoloService, transport);
  const [disable, setEnable] = useState(true);

  function shutdown() {
    console.log("shutdown");
    client.shutdownDevice({});
  }

  function reboot() {
    console.log("reboot");
    // client.rebootDevice({});
  }

  function cancel() {
    console.log("cancel");
    console.log(props?.camfronturl);
    // client.cancelPowerEvent({});
  }

  function applyEnable() {
    console.log("applyEnable");
    setEnable(!disable);
  }

  return (
    <>
      <input type="checkbox" checked={disable} id="unlock" onChange={applyEnable} />
      <label htmlFor="unlock">Unlock</label>
      <input type="button" value="SHUTDOWN" disabled={disable} onClick={shutdown} />
      <input type="button" value="REBOOT" disabled={disable} onClick={reboot} />
      <input type="button" value="CANCEL" disabled={disable} onClick={cancel} />
    </>
  );
}