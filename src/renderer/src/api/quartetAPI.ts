import { Duration, Timestamp } from "@bufbuild/protobuf/wkt";
import { quartetStreamingTransport, quartetTransport } from "../types/common";
import { DeviceSyncCf, DeviceSyncTxPower, EventType, FileMetadataType, QuartetService } from "../gen/quartet/v1/quartet_pb";
import { createClientFunc } from "../utilities/client";

export async function quartetGetRecordedKeyFileGroupsWithMetadatas(props: { order: number, startIndex: number, countFiles: number }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport).getRecordedKeyFileGroupsWithMetadatas({
      order: props.order,
      range: {
        startIndex: props.startIndex,
        countFiles: props.countFiles,
      }
    })

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetRecordedKeyFileGroupsWithMetadatas")
    return false
  }
}

export async function quartetGetRecordedKeyFileGroupsCount() {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport).getRecordedKeyFileGroupsCount({})

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetRecordedKeyFileGroupsCount")
    return false
  }
}

export async function quartetRemoveRecordedKeyFileGroup(props: { key: string }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport).removeRecordedKeyFileGroup({ key: props.key })

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: RemoveRecordedKeyFileGroup")
    return false
  }
}

export async function quartetRemoveRecordedKeyFileGroups(props: { keys: string[] }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport).removeRecordedKeyFileGroups({ keys: props.keys })

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: RemoveRecordedKeyFileGroups")
    return false
  }
}

export async function quartetGetDevices() {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport).getDevices({})

    if(res) {
      return res;
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetDevices")
    return false
  }
}

export async function quartetAuthenticateWebAppLoginAccount(props: { name: string, password: string }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport).authenticateWebAppLoginAccount({ name: props.name, password: props.password })

    if(res.success) {
      
      return res
    } else {
      
      return false
    }
    
  } catch (e) {
    console.error("api request failed: AuthenticateWebAppLoginAccount")
    return false
  }
}

export async function quartetGetWebAppLoginAccountEnable() {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport).getWebAppLoginAccountEnable({})

    if(res.success) {
      
      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetWebAppLoginAccountEnable")
    return false
  }
}

export async function quartetSetWebAppLoginAccountEnable(props: { enable?: boolean, name?: string, password?: string }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport)
                      .setWebAppLoginAccountEnable({ enable: props.enable, name: props.name, password: props.password })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: SetWebAppLoginAccountEnable")
    return false
  }
}

export async function quartetSetWebAppLoginAccount(props: { name?: string, oldPassword?: string, newPassword?: string }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport)
                      .setWebAppLoginAccount({ name: props.name, oldPassword: props.oldPassword, newPassword: props.newPassword })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: SetWebAppLoginAccount");
    return false
  }
}

export async function quartetGetWebAppLoginAPIPublicKey() {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport)
                      .getWebAppLoginAPIPublicKey({})

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetWebAppLoginAPIPublicKey")
    return false
  }
}

export async function quartetGetRecordingKeyStatus(props: { key?: string }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport).getRecordingKeyStatus({ key: props.key })

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetRecordingKeyStatus")

    return false
  }
}

export async function quartetGetRecordingStartTime(props: { key?: string }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport).getRecordingStartTime({ key: props.key });

    if(res.startTime !== undefined) {

      return { startTime: res.startTime }
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: GetRecordingStartTime")

    return false
  }
}

export async function quartetGetCurrentTime() {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport).getCurrentTime({});

    if(res.timestamp !== undefined) {
      
      return { timestamp: res.timestamp, frameTimestamp: res.frameTimestamp }
    } else {
      
      return false
    }
  } catch (e) {
    console.error("api request failed: GetCurrentTime")
    return false
  }
}

export async function quartetStartRecorderWithDuration(props: { key?: string, fileName?: string, duration?: Duration, metadatas?: {type: FileMetadataType, data: string}[] }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport)
                      .startRecorderWithDuration({
                        key: props.key,
                        fileName: props.fileName,
                        duration: props.duration,
                        metadatas: props.metadatas
                      })

    if(res.success) {
      
      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: StartRecorderWithDuration")
    return false
  }
}

export async function quartetStopRecorder(props: { key?: string, stopTime?: Timestamp, blocking?: boolean }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport)
                      .stopRecorder({ 
                        key: props.key, 
                        stopTime: props.stopTime, 
                        blocking: props.blocking 
                      })
              
    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: StopRecorder")
    return false
  }
}

export async function quartetCanApplyDeviceConfiguration() {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport)
                      .canApplyDeviceConfiguration({})

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: QuartetCanApplyDeviceConfiguration")
    return false
  }
}

export async function quartetGetSystemTime() {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport).getSystemTime({})

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetSystemTime")
    return false
  }
}

export async function quartetSetSystemTime(props: { time?: Timestamp }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport)
                      .setSystemTime({ time: props.time })

    if(res.success) {
      
      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: SetSytemTime")
    return false
  }
}

export async function quartetGetDeviceSyncTxPower() {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport)
                      .getDeviceSyncTxPower({})

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch(e) {
    console.error("api request failed: GetDeviceSyncTxPower")
    return false
  }
}

export async function quartetSetDeviceSyncTxPower(props: { txPower: DeviceSyncTxPower }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport)
                      .setDeviceSyncTxPower({ txPower: props.txPower })

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: SetDeviceSyncTxPower")
    return false
  }
}

export async function quartetGetDeviceSyncCf() {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport)
                      .getDeviceSyncCf({})
    
    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: GetDeviceSyncCf")
    return false
  }
}

export async function quartetSetDeviceSyncCf(props: { cf: DeviceSyncCf }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport)
                      .setDeviceSyncCf({ cf: props.cf })

    if(res.success) {
      return res
    } else {
      return false
    }
  } catch (e) {
    console.error("api request failed: SetDeviceSyncCf")
    return false
  }
}

/* イベントを受信するためのストリームを取得する subsribeEvent用のtransportでAPI実行 */
export function quartetSubscribeEvent() {
  try {
    const res = createClientFunc(QuartetService, quartetStreamingTransport).subscribeEvent({})

    if(res) {
      
      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: QuartetSubscribeEvent")
    return false
  }
}

/* メッセージを受信するためのストリームを取得する subsribeEvent用のtransportでAPI実行 */
export function quartetSubscribeMessage() {
  try {
    const res = createClientFunc(QuartetService, quartetStreamingTransport).subscribeMessage({})

    if(res) {

      return res
    } else {

      return false
    }
  } catch(e) {
    console.error("api request failed: QuartetSubscribeMessage")
    return false
  }
}

export async function quartetBroadcastMessage(props: { type?: number, header?: string; data?: string }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport)
                      .broadcastMessage({ type: props.type, header: props.header, data: props.data });

    if(res.success) {

      return res
    } else {

      return false
    }

  } catch (e) {
    console.error("api request failed: QuartetBroadcastMessage")
    return false
  }
}

export async function quartetBroadcastEvent(props: { type: EventType, flags?: bigint, tag?: string }) {
  try {
    const res = await createClientFunc(QuartetService, quartetTransport)
                      .broadcastEvent({ type: props.type, flags: props.flags, tag: props.tag });

    if(res.success) {

      return res
    } else {

      return false
    }
  } catch (e) {
    console.error("api request failed: QuartetBroadcastEvent")
    return false
  }
}