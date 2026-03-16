import { createConnectTransport } from "@connectrpc/connect-web";
import { defaultTimeoutMs, PortSolo, } from "../types/common";
import { Client, createClient, Transport } from "@connectrpc/connect";
import { DescService } from "@bufbuild/protobuf";

export function createSoloTransportFunc(props: { baseUrl: string }) {
  return createConnectTransport({ baseUrl: `${props.baseUrl}:${PortSolo}`, defaultTimeoutMs: defaultTimeoutMs })
}

export function createClientFunc<T extends DescService>(service: T, transport: Transport): Client<T>{
  return createClient(service, transport)
}