import { Duration, timestampFromDate } from "@bufbuild/protobuf/wkt";
import { soloTrimMP4File } from "../../../../api/soloAPI";
import { TrimMp4RequestProps } from "../types";

export async function trimMp4(props: TrimMp4RequestProps) {
  const { transport, mode=2, fileName, rangeStart, rangeEnd } = props
  
  try {
    let startTime = Math.floor(rangeStart*1000)/1000;
    let endTime = Math.floor(rangeEnd*1000)/1000;
    startTime = 1000000000000 + (startTime*1000);
    endTime = 1000000000000 + (endTime*1000);
    
    const initDate = new Date(1000000000000);
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    const initTimestamp = timestampFromDate(initDate)
    const startTimestamp = timestampFromDate(startDate)
    const endTimestamp = timestampFromDate(endDate)
    
    const start: Duration = { $typeName: "google.protobuf.Duration", seconds: BigInt(0), nanos: 0 }
    const length: Duration = { $typeName: "google.protobuf.Duration", seconds: BigInt(0), nanos: 0 }
    start.seconds = startTimestamp.seconds - initTimestamp.seconds;
    start.nanos = startTimestamp.nanos - initTimestamp.nanos;
    
    if(endTimestamp.seconds > startTimestamp.seconds) { 
      length.seconds = endTimestamp.seconds - startTimestamp.seconds 
    }
    else {
      length.seconds = startTimestamp.seconds - endTimestamp.seconds
    }

    if(endTimestamp.nanos > startTimestamp.nanos) {
      length.nanos = Math.floor((endTimestamp.nanos-startTimestamp.nanos)/10000000)*10000000
    }
    else {
      length.nanos = Math.floor((startTimestamp.nanos - endTimestamp.nanos)/10000000)*10000000
    }

    const res = await soloTrimMP4File({ transport, mode, fileName, start, length })

    if(res) {
      return { result: res }
    } 
    else {
      return { result: null }
    }
  } catch (e) {
    return { result: null }
  }
}
