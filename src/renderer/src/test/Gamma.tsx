// Gamma.tsx
import { useState } from "react";
import { SoloService } from "../gen/solo/v1/solo_pb";
import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';

export default function Gamma(props: { camfronturl: string; }) {

  const transport = createConnectTransport({
    baseUrl: props?.camfronturl
  });
  const client = createClient(SoloService, transport);

  const [value, setValue] = useState("100");

  function applyValue() {

    const val = BigInt(value);
    const min = BigInt(40);
    const max = BigInt(240);
    if (min <= val && val <= max) {
      client.setCameraGamma({ value: BigInt(value) });
    }
  }

  return (
    <>
      <p>
        Gamma (40-240 [default:100]):
        <input type="text" onChange={(event) => setValue(event.target.value)} value={value} />
        <input type="button" value="apply" onClick={applyValue} />
      </p>
    </>
  );
}