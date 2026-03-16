// Exposure.tsx
import { useState } from "react";
import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';

import { SoloService } from "../gen/solo/v1/solo_pb";

export default function Exposure(props: { camfronturl: string; }) {

  const transport = createConnectTransport({
    baseUrl: props?.camfronturl
  });
  const client = createClient(SoloService, transport);

  const [value, setValue] = useState("5017697");

  function applyValue() {
    const val = BigInt(value);
    const min = BigInt(169727);
    const max = BigInt(15000000);
    if (min <= val && val <= max) {
      client.setCameraExposure({ value: BigInt(value) });
    }
  }

  return (
    <>
      <p>
        Exposure [ns](169727-15000000 [default:5017697]):
        <input type="text" onChange={(event) => setValue(event.target.value)} value={value} />
        <input type="button" value="apply" onClick={applyValue} />
      </p>
    </>
  );
}