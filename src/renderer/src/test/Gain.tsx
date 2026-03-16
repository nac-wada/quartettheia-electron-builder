// Gain.tsx
import { useState } from "react";
import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { SoloService } from "../gen/solo/v1/solo_pb";

export default function Gain(props: { camfronturl: string; }) {

  const transport = createConnectTransport({
    baseUrl: props?.camfronturl
  });
  const client = createClient(SoloService, transport);

  const [value, setValue] = useState("0");

  function applyValue() {
    const val = BigInt(value);
    const min = BigInt(0);
    const max = BigInt(2400);
    if (min <= val && val <= max) {
      client.setCameraGain({ value: BigInt(value) });
    }
  }

  return (
    <>
      <p>
        Gain (0-2400 [default:0]):
        <input type="text" onChange={(event) => setValue(event.target.value)} value={value} />
        <input type="button" value="apply" onClick={applyValue} />
      </p>
    </>
  );
}