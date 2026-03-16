import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Theme, Typography, useMediaQuery } from "@mui/material";
import { Layer, Stage } from "react-konva";
import { Transport } from "@connectrpc/connect";
import { CurrentMarker } from "../../intrinsicTWand/components/CurrentMarker";
import { CalibrationLFrameMarkerSet, LFrameErrorCode, LFrameMarkerLocationPacket, Marker } from "../../../../gen/solo/v1/solo_pb";
import { soloGetLFrameMarkerLocationStream } from "../../../../api/soloAPI";
import { LFrameAxises } from "./LFrameAxises";
import { createConnectTransport } from "@connectrpc/connect-web";
import { PortSolo } from "../../../../types/common";
import { useObserverArea } from "../../../../hooks/useObserver";
import { LabelMarkerType } from "../types";
import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "../../common";

export const LFrameMarker: FC<{
  id: number, 
  ipv4Addr: string,
  transport: Transport,
  markerSetLoading: boolean,
  focalLength: number,
  addStableList: (ipv4Addr: string) => void,
  deleteStableList: (ipv4Addr: string) => void,
  addCalibrationLframeMarkerSet: (calibrationLFrameMarkerSet: CalibrationLFrameMarkerSet) => void,
}> = ({ 
  id, ipv4Addr, transport, markerSetLoading, focalLength, addStableList, deleteStableList, addCalibrationLframeMarkerSet
}) => {
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const boxRef = useRef<HTMLDivElement | null>(null);
  const { maxHeight, maxWidth } = useObserverArea({ ref: boxRef })
  const lFrameMarkerPacketRef = useRef<LFrameMarkerLocationPacket | null>(null)
  const [lFrameMarker, setLFrameMarker] = useState<LabelMarkerType[]>([]);
  const [markerError, setMarkerError] = useState<LFrameErrorCode | null>(null)
  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if(markerSetLoading) {
      if(lFrameMarkerPacketRef.current) {
        addCalibrationLframeMarkerSet({ 
          $typeName: "solo.v1.CalibrationLFrameMarkerSet", 
          camera: {
            $typeName: "solo.v1.CameraUnit",
            id: id,
            ipAddress: ipv4Addr.replace(/http:\/\/|https:\/\//, '')
          },
          lFrame: lFrameMarkerPacketRef.current, 
          focalLength: focalLength 
        })
      }
    }
  },[markerSetLoading])

  const trackingLFrameMarker = useCallback((packet: LFrameMarkerLocationPacket) => {
    lFrameMarkerPacketRef.current = packet
    function isMarkerType(value: any): value is Marker {
      return (
        typeof value  === 'object' &&
        value !== null &&
        'x' in value && 'y' in value && 'circularity' in value && 'size' in value
      )
    }

    if(packet && packet.markers) {
      const labelMarkerArray: LabelMarkerType[] = Object.entries(packet.markers)
        .filter((entry): entry is [string, Marker] => {
          const [_, value] = entry;
          return isMarkerType(value)
        })
        .map(([key, marker]) => ({
          ...marker,
          name: key
        }))
      
      setLFrameMarker(labelMarkerArray)
    }
  },[])

  useEffect(() => {
    const lFrameMarkerStream = async () => {
      try {
        const streamTransport = createConnectTransport({ baseUrl: `${ipv4Addr}:${PortSolo}` })
        const res = soloGetLFrameMarkerLocationStream({ streamTransport, signal })
        if(res) {
          let stableCount = 0;
          let toobrightCount = 0;
          for await (const data of res) {
            if(data.packet) {
              const packet = data.packet
              if(
                packet.errorCode===LFrameErrorCode['LFRAME_ERROR_CODE_SUCCESS'] &&
                packet.markers &&
                packet.markers.isFound &&
                packet.markers.numMarkers===4 &&
                packet.markers.o && packet.markers.x && packet.markers.y && packet.markers.m
              ) {
                trackingLFrameMarker(packet)
                stableCount ++;
                if(stableCount>=10) {
                  setMarkerError(packet.errorCode)
                }
              } else if(packet.errorCode===LFrameErrorCode['LFRAME_ERROR_CODE_TOO_BRIGHT']) {
                toobrightCount ++;
                if(toobrightCount>=10) {
                  setMarkerError(packet.errorCode);
                }
              } else {
                stableCount = 0;
                toobrightCount = 0
                setMarkerError(packet.errorCode)
              }
            }
          }
        }
      } catch (e) {
        console.error(e)
      }
    }

    lFrameMarkerStream()

    return () => {
      controller.abort();
    }
  },[])

  useEffect(() => {
    if(markerError===LFrameErrorCode["LFRAME_ERROR_CODE_SUCCESS"]) {
      addStableList(ipv4Addr)
    } else {
      deleteStableList(ipv4Addr)
    }
  },[markerError])

  return (
    <>
      <Box
        key={`lframe_layer_${id}`}
        ref={boxRef}
        sx={{ 
          pointerEvents: 'none', 
          width: '100%', 
          height: '100%',
          zIndex: 2,
          border: "1px rgba(255,255,255,0.5) solid"
        }}
      >
        {
          (
            boxRef.current && 
            typeof maxWidth === "number" && 
            maxWidth !== 0 && 
            typeof maxHeight === "number" && 
            maxHeight !== 0
          ) &&
          <Stage
            width={maxWidth} 
            height={VIRTUAL_HEIGHT * (maxWidth / VIRTUAL_WIDTH)} 
            scaleX={maxWidth / VIRTUAL_WIDTH} 
            scaleY={maxWidth / VIRTUAL_WIDTH}
          >
            <Layer>
              {
                lFrameMarker.map(({ name, x, y }) => {
                  let color = ''
                  switch(name) {
                    case 'o': color = "#ffffff" 
                      break;
                    case 'm': color = "#00ff00" 
                      break;
                    case 'n': color = "#0000ff" 
                      break;
                    case 'x': color = "#ff0000" 
                      break;
                    case 'y': color = "#ffff00ff" 
                      break;
                  }
                  if(markerError!==LFrameErrorCode["LFRAME_ERROR_CODE_SUCCESS"]) { color="gray" }
                  return (
                    <CurrentMarker key={name} centerX={x} centerY={y} color={color} size={30}/>
                  )
                })
              }

            </Layer>
          </Stage>
        }
      </Box>
      <Box
        key={`lframe_axises_${id}`}
        sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0,
          pointerEvents: 'none', 
          width: { xs: '30px', sm: '60px'}, 
          height: { xs: '30px', sm: '60px'},
          zIndex: 2,
          borderRadius: '50%',          // 角を少し丸くする場合（任意）
          // backgroundColor: 'rgba(255, 255, 255, 0.4)', // 背景を少し暗くすると線が見やすくなります
          // overflow: "hidden"
        }}
      >
        <Stage
          width={!sm ? 30 : 60} 
          height={!sm ? 30 : 60} 
          scaleX={1} 
          scaleY={1}
        >
          <Layer>
            {
              lFrameMarker.find(({name}) => name==='o') &&
              lFrameMarker.find(({name}) => name==='x') &&
              lFrameMarker.find(({name}) => name==='y') && 
              <LFrameAxises
                stable={markerError===LFrameErrorCode["LFRAME_ERROR_CODE_SUCCESS"]}
                o={{x: lFrameMarker.find(({name}) => name==='o')!.x, y: lFrameMarker.find(({name}) => name==='o')!.y}}
                x={{x: lFrameMarker.find(({name}) => name==='x')!.x, y: lFrameMarker.find(({name}) => name==='x')!.y}}
                y={{x: lFrameMarker.find(({name}) => name==='y')!.x, y: lFrameMarker.find(({name}) => name==='y')!.y}}
              />
            }
          </Layer>
        </Stage>
      </Box>
      <Box sx={{ position: "absolute", top: 0, left: 0, zIndex: 3 }}>
        <Typography 
          color={markerError===LFrameErrorCode["LFRAME_ERROR_CODE_SUCCESS"] ? "success" : "error"} 
          sx={{
            pl:"0.4rem",
            pt: "0.2rem", 
            fontWeight: "bold",
            fontSize: { xs:"0.6rem", lg: "0.8rem" },
          }}
        >
          {
            markerError===LFrameErrorCode["LFRAME_ERROR_CODE_SUCCESS"] ? "検出中" : 
            markerError===LFrameErrorCode["LFRAME_ERROR_CODE_TOO_BRIGHT"] ? "画像が明るすぎます" : "検出できません"
          }
        </Typography>
      </Box>
      <Box sx={{ position: "absolute", bottom: 0, right: 0, zIndex: 3, opacity: 0.8 }}>
        {/* <IconButton
          size="small"
          key={`tuning_${id}`}
          color="default"
          onClick={handleOpenCameraTuning}
          sx={{
            ":hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)"
            }
          }}
        >
          <TuneOutlined sx={{ color: "white", fontSize: { xs: "0.8rem", md: "1.2rem" } }}/>
        </IconButton> */}
        <Button 
          disabled
          variant="outlined"
          size="small"
          key={`focalLength_${id}`}
          color="warning"
          sx={{ 
            m: { xs: "0.2rem", sm: "0.4rem"},
            borderRadius: "100px",
            textTransform: 'none',   // 大文字変換を無効化
            minWidth: 0,             // ボタンの最小幅を解除（文字に合わせる）
            px: { xs: 1, sm: 2 },  // 横方向の余白を調整（1 = 8px）
            lineHeight: 1,           // 縦方向をよりコンパクトにする場合
          }}
        >
          <Typography 
            color="warning" 
            sx={{ 
              fontWeight: "bold", 
              fontSize: { xs: "0.6rem", sm: "0.8rem", md: "1rem" },
              lineHeight: 1
            }}
          >
            {focalLength} mm
          </Typography>
        </Button>
      </Box>
    </>
  )
}

export default LFrameMarker