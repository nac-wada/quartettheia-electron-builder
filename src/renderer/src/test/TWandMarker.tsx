// import { FC, useCallback, useEffect, useRef, useState } from "react";
// import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
// import { Layer, Line, Shape, Stage } from "react-konva";
// import { CheckCircleOutline, TuneOutlined } from "@mui/icons-material";
// import { colorRoulette } from "../../../../utilities/color";
// import { soloGetTWandMarkerLocationStream } from "../../../../api/soloAPI";
// import { CalibrationTWandMarkerSet, TWandErrorCode, TWandMarkerLocationPacket, TWandMarkerLocationPacketSchema } from "../../../../gen/solo/v1/solo_pb";
// import { createConnectTransport } from "@connectrpc/connect-web";
// import { PortSolo } from "../../../../types/common";
// import { useObserverArea } from "../../../../hooks/useObserver";
// import { fromBinary, toBinary } from "@bufbuild/protobuf";
// import { tWandMarkerDb, TWandMarkerSession } from "../indexedDb/WandDb";
// import { AreaType, SegmentPoints } from "../types";
// import { ActiveLightMarkerPoint } from "../../common";
// import { CurrentMarker } from "./CurrentMarker";

// // const VIRTUAL_WIDTH = 1936;
// // const VIRTUAL_HEIGHT = 1216;
// // const COMPLETE_RECORD_POINTS = 10;
// // const SEMICOMPLETE_RECORD_POINTS = 5;
// // const AREA_BOUNDARIES = [
// //   // 上段: Y < 608
// //   { xMax: 645, yMax: 608, index: 0 }, // Area 0: x < 645, y < 608
// //   { xMax: 1290, yMax: 608, index: 1 }, // Area 1: x < 1290, y < 608
// //   { xMax: 1936, yMax: 608, index: 2 }, // Area 2: x < 1936, y < 608
// //   // 下段: Y > 608
// //   { xMax: 645, yMin: 608, index: 3 }, // Area 3: x < 645, y > 608
// //   { xMax: 1290, yMin: 608, index: 4 }, // Area 4: x < 1290, y > 608
// //   { xMax: 1936, yMin: 608, index: 5 }, // Area 5: x < 1936, y > 608
// // ]

// // // const AREA_BOUNDARIES = [
// // //   // 上段: Y < 608 (0 ~ 607)
// // //   { xMax: 484,  yMax: 608, index: 0 }, // Area 0
// // //   { xMax: 968,  yMax: 608, index: 1 }, // Area 1
// // //   { xMax: 1452, yMax: 608, index: 2 }, // Area 2
// // //   { xMax: 1936, yMax: 608, index: 3 }, // Area 3

// // //   // 下段: Y >= 608 (608 ~ 1215)
// // //   { xMax: 484,  yMin: 608, index: 4 }, // Area 4
// // //   { xMax: 968,  yMin: 608, index: 5 }, // Area 5
// // //   { xMax: 1452, yMin: 608, index: 6 }, // Area 6
// // //   { xMax: 1936, yMin: 608, index: 7 }, // Area 7
// // // ]

// // type AreaType = [number, number, number, number, number, number]
// // type AreaBoundary = typeof AREA_BOUNDARIES[number];
// const COMPLETE_RECORD_POINTS = 3;
// const SEMICOMPLETE_RECORD_POINTS = 1;
// const VIRTUAL_WIDTH = 1936;
// const VIRTUAL_HEIGHT = 1216;

// // 分割数の定義
// const COLS = 6;
// const ROWS = 4;

// // エリア境界を動的に生成
// const AREA_BOUNDARIES = (() => {
//   const boundaries = [];
//   const cellWidth = VIRTUAL_WIDTH / COLS;
//   const cellHeight = VIRTUAL_HEIGHT / ROWS;

//   for (let row = 0; row < ROWS; row++) {
//     for (let col = 0; col < COLS; col++) {
//       boundaries.push({
//         xMin: col * cellWidth,
//         xMax: (col + 1) * cellWidth,
//         yMin: row * cellHeight,
//         yMax: (row + 1) * cellHeight,
//         index: row * COLS + col,
//       });
//     }
//   }
//   return boundaries;
// })();

// export const TWandMarker:FC<{
//   id: number, 
//   isWanding: boolean, 
//   ipv4Addr: string,
//   refreshed: boolean,
//   focalLength: number,
//   isCollecting: boolean,
//   handleOpenCameraTuning: () => void,
//   updateCompletedCameras: (id: number) => void,
//   addCalibrationTWandMarkerSet: (calibrationTWandMarkerSet: CalibrationTWandMarkerSet) => void,
//   addStableList: (ipv4Addr: string) => void,
//   deleteStableList: (ipv4Addr: string) => void,
//   setRefreshed: () => void,
// }> = ({ 
//   id, isWanding, ipv4Addr, refreshed, focalLength, isCollecting, handleOpenCameraTuning, updateCompletedCameras, addCalibrationTWandMarkerSet, addStableList, deleteStableList, setRefreshed
// }) => {
//   const boxRef = useRef<HTMLDivElement | null>(null);
//   const { maxHeight, maxWidth } = useObserverArea({ ref: boxRef })
//   const [currentBluePosition, setCurrentBluePosition] = useState<ActiveLightMarkerPoint>({ x: 0, y: 0 });
//   const [currentRedPosition, setCurrentRedPosition] = useState<ActiveLightMarkerPoint>({ x: 0, y: 0 });
//   const segmentRef = useRef<SegmentPoints[]>([]);
//   const [area, setArea] = useState<AreaType>(new Array(COLS * ROWS).fill(0));
//   // const areasProgressRef = useRef<AreaType>(new Array(COLS * ROWS).fill(0));
//   const areasProgressRef = useRef<number[][]>(Array.from({ length: COLS * ROWS }, () => [0, 0]));
//   const recording = useRef(false);
//   const [isStable, setIsStable] = useState(false);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const tWandMarkerPacketsRef = useRef<TWandMarkerLocationPacket[]>([]);
//   const controller = new AbortController();
//   const signal = controller.signal;
//   const stableCountRef = useRef(0);

//   // 親要素に十分な特徴点が得られたことを伝える。src\components\cameracalibration\intrinsicTWand\index.tsxのupdateCompletedCamerasにカメラidを渡す
//   useEffect(() => {
//     if(area.filter(a => a=== 100).length===ROWS*COLS) {
//       console.log(areasProgressRef.current)
//       if(tWandMarkerPacketsRef.current) {
//         updateCompletedCameras(id)
//       }
//     }

//   },[area])

//   useEffect(() => {
//     if(isCollecting) {
//       // src\components\cameracalibration\intrinsicTWand\index.tsxのaddMarkerSetsにマーカーセットを渡す
//       addCalibrationTWandMarkerSet({
//         $typeName: "solo.v1.CalibrationTWandMarkerSet",
//         camera: {
//           $typeName: "solo.v1.CameraUnit",
//           id: id,
//           ipAddress: ipv4Addr.replace(/http:\/\/|https:\/\//, '')
//         },
//         tWand: tWandMarkerPacketsRef.current,
//         focalLength: focalLength
//       })

//       console.log(tWandMarkerPacketsRef.current.length)

//     }
//   },[isCollecting])

//   // 親要素のrefreshedが呼ばれた時、マーカーをリセットする
//   useEffect(() => {
//     const resetMarker = () => {
//       const request = indexedDB.deleteDatabase('TWandMarkerDB');
//       request.onsuccess = () => {
//         console.log("deleted t-wand-marker")
//       } 
//       segmentRef.current = [];
//       setCurrentBluePosition({ x:0, y:0 });
//       setCurrentRedPosition({ x:0, y:0 });
//       tWandMarkerPacketsRef.current = [];
//       // bluePathDataRef.current = [];
//       // redPathDataRef.current = [];
//       setArea(new Array(COLS * ROWS).fill(0));
//       areasProgressRef.current = Array.from({ length: COLS * ROWS }, () => [0, 0])
//       setRefreshed()
//     }

//     if(refreshed) {
//       resetMarker()
//     }
//   },[refreshed])

//   // キャッシュにマーカーセットを保存する。
//   const saveTWandMarkerPackets = async () => {
//     const packets = tWandMarkerPacketsRef.current;
//     if(packets.length === 0) return;

//     try {
//       // 1. 各パケットをバイナリ化
//       const binaryList = packets.map(p => toBinary(TWandMarkerLocationPacketSchema, p));

//       function encodeBianryList(list: Uint8Array[]): ArrayBuffer {
//         const base64List = list.map(u8 => btoa(String.fromCharCode(...u8)));
//         const buffer = new TextEncoder().encode(JSON.stringify(base64List)).buffer as ArrayBuffer;
//         return buffer
//       }
      
//       // 2. 保存用のデータ構造を作成
//       // const session: TWandMarkerSession = {
//       //   name: `Session_${ipv4Addr}`,
//       //   packets: encodeBianryList(binaryList),
//       //   areasPoint: new Float32Array(areasProgressRef.current).buffer,
//       // }

//       const session: TWandMarkerSession = {
//         name: `Session_${ipv4Addr}`,
//         packets: encodeBianryList(binaryList),
//         // flat() で 24x2 の 48要素の1次元配列に変換
//         areasPoint: new Float32Array(areasProgressRef.current.flat()).buffer,
//       };

//       await tWandMarkerDb.tWandMarkerSessions.put(session)
//     } catch (e) {
//       console.error(`saveTWandMarkerPackets error:`,e);
//     }
//     console.log(`save completed.`)
//   }

//   // キャッシュからマーカーセットを取得する。
//   const loadTWandMarkerPackets = async () => {
//     try {
//       const session = await tWandMarkerDb.tWandMarkerSessions
//         .where('name').equals(`Session_${ipv4Addr}`).last();

//       if(!session || !session.packets || !session.areasPoint) {
//         setIsLoaded(true);
//         return;
//       }

//       // 1. ArrayBufferからBase64配列を復元
//       const jsonString = new TextDecoder().decode(session.packets);
//       const base64List = JSON.parse(jsonString) as string[];

//       // 2. Base64 -> Uint8Array -> Object に戻す
//       const loadedPackets = base64List.map(b64 => {
//         const u8 = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
//         return fromBinary(TWandMarkerLocationPacketSchema, u8);
//       });

//       const areasPoint = new Float32Array(session.areasPoint);
//       const loadedAreasPoint: number[] = Array.from(areasPoint);
//       // areasProgressRef.current = loadedAreasPoint as AreaType

//       // 1次元配列 [0,0,0,0...] を 2個ずつのペア [[0,0], [0,0]...] に戻す
//       const chunkedAreas: number[][] = [];
//       for (let i = 0; i < loadedAreasPoint.length; i += 2) {
//         chunkedAreas.push([loadedAreasPoint[i], loadedAreasPoint[i + 1]]);
//       }

//       areasProgressRef.current = chunkedAreas;

//       tWandMarkerPacketsRef.current = loadedPackets;
//       for(let i=0; i < tWandMarkerPacketsRef.current.length; i++) {
//         const bMarkers = tWandMarkerPacketsRef.current.flatMap(p => (p.markers && p.markers.b) ? [p.markers.b] : []);
//         const rMarkers = tWandMarkerPacketsRef.current.flatMap(p => (p.markers && p.markers.r) ? [p.markers.r] : []);
//         const segment = createSegment(rMarkers, bMarkers, i);
//         segmentRef.current.push(segment)
//       }
//       for(let i=0; i < areasProgressRef.current.length; i++) {
//         const area = areasProgressRef.current[i];
//         const red = area[0];
//         const blue = area[1];
//         setArea(prevArea => {
//           const newArea: AreaType = [...prevArea];
//           if((red >= SEMICOMPLETE_RECORD_POINTS && blue >= SEMICOMPLETE_RECORD_POINTS) && (red < COMPLETE_RECORD_POINTS && blue < COMPLETE_RECORD_POINTS)) {
//             console.log(ipv4Addr,area)
//             newArea[i] = 50;
//           } else if(red >= COMPLETE_RECORD_POINTS && blue >= COMPLETE_RECORD_POINTS) {
//             console.log(ipv4Addr,area)
//             newArea[i] = 100;
//           }
//           return newArea
//         })
//       }
//     } catch (e) {
//       console.error(`loadTWandMarkerPackets error:`,e)
//     }
//     setIsLoaded(true)
//   }

//   // マーカー座標の制御（マーカーの軌跡、エリア進捗描画）
//   const trackingTWandMarker = useCallback((packet:TWandMarkerLocationPacket) => {
//     if(
//       packet.errorCode===TWandErrorCode['TWAND_ERROR_CODE_SUCCESS'] &&
//       packet.markers &&
//       packet.markers.isFound &&
//       packet.markers.b &&
//       packet.markers.r
//     ) {
//       const b = packet.markers.b;
//       const r = packet.markers.r;
//       const bluePosition: ActiveLightMarkerPoint = { x: b.x, y: b.y };
//       const redPosition: ActiveLightMarkerPoint = { x: r.x, y: r.y };
//       setCurrentBluePosition(bluePosition);
//       setCurrentRedPosition(redPosition);
//       if(recording.current) {
//         tWandMarkerPacketsRef.current.push(packet);
//         if(segmentRef.current && tWandMarkerPacketsRef.current) {
//           const bMarkers = tWandMarkerPacketsRef.current.flatMap(p => (p.markers && p.markers.b) ? [p.markers.b] : []);
//           const rMarkers = tWandMarkerPacketsRef.current.flatMap(p => (p.markers && p.markers.r) ? [p.markers.r] : []);
//           if(segmentRef.current.length === 0 && tWandMarkerPacketsRef.current.length > 1) {
//             const firstSegment = createSegment(rMarkers, bMarkers, 0);
//             segmentRef.current = [firstSegment];
//           } else if(tWandMarkerPacketsRef.current.length > segmentRef.current.length + 1) {
//             const newIndex = segmentRef.current.length;
//             const newSegment = createSegment(rMarkers, bMarkers, newIndex);
//             segmentRef.current = [...segmentRef.current, newSegment]
//           }
//         }

//         let detectedBlueIndex: number | null = null;
//         let detectedRedIndex: number | null = null;
//         // const isPointInArea = (point: Point, boundary: AreaBoundary): boolean => {
//         //   const isXValid = point.x < boundary.xMax;

//         //   const isYValid = (
//         //     (boundary.yMax !== undefined && point.y < boundary.yMax) ||
//         //     (boundary.yMin !== undefined && point.y > boundary.yMin)
//         //   );

//         //   return isXValid && isYValid;
//         // }

//         const isPointInArea = (point: ActiveLightMarkerPoint, b: typeof AREA_BOUNDARIES[number]): boolean => {
//           return (
//             point.x >= b.xMin && point.x < b.xMax &&
//             point.y >= b.yMin && point.y < b.yMax
//           );
//         };
        
//         for(const boundary of AREA_BOUNDARIES) {
//           const isBlueIn = isPointInArea(bluePosition, boundary);
//           const isRedIn = isPointInArea(redPosition, boundary);
//           if(isBlueIn || isRedIn) {
//             if(isBlueIn) {
//               detectedBlueIndex = boundary.index
//             }
//             if(isRedIn) {
//               detectedRedIndex = boundary.index
//             }
//             break;
//           }
//         }

//         if(detectedBlueIndex!==null) {
//           const index = detectedBlueIndex;
//           areasProgressRef.current[index][0] += 1;
//           const currentProgress = areasProgressRef.current[index];
//           const blueProgress = currentProgress[0];

//           setArea(prevArea => {
//             const currentAreaStatus = prevArea[index];

//             if(currentAreaStatus === 0 &&
//               blueProgress >= SEMICOMPLETE_RECORD_POINTS &&
//               blueProgress < COMPLETE_RECORD_POINTS
//             ) {
//               const newArea: AreaType = [...prevArea];
//               newArea[index] = 50;
//               return newArea
//             } else if(currentAreaStatus === 50 && blueProgress >= COMPLETE_RECORD_POINTS && blueProgress < 15) {
//               const newArea: AreaType = [...prevArea];
//               newArea[index] = 100;
//               return newArea;
//             }

//             return prevArea
//           })
//         }
//         if(detectedRedIndex!==null) {
//           const index = detectedRedIndex;
//           areasProgressRef.current[index][1] += 1;
//           const currentProgress = areasProgressRef.current[index];
//           const redProgress = currentProgress[1];

//           setArea(prevArea => {
//             const currentAreaStatus = prevArea[index];

//             if(currentAreaStatus === 0 &&
//               redProgress >= SEMICOMPLETE_RECORD_POINTS &&
//               redProgress < COMPLETE_RECORD_POINTS
//             ) {
//               const newArea: AreaType = [...prevArea];
//               newArea[index] = 50;
//               return newArea
//             } else if(currentAreaStatus === 50 && redProgress >= COMPLETE_RECORD_POINTS && redProgress < 15) {
//               const newArea: AreaType = [...prevArea];
//               newArea[index] = 100;
//               return newArea;
//             }

//             return prevArea
//           })
//         }
//       }
//       stableCountRef.current ++;
//       if(stableCountRef.current>=20) {
//         setIsStable(true)
//       }
//     }
//     else {
//       setCurrentBluePosition({ x: 0, y: 0 });
//       setCurrentRedPosition({ x: 0, y: 0 });
//       stableCountRef.current = 0;
//       setIsStable(false);
//     }
//   },[])

//   useEffect(() => {
//     recording.current = isWanding
//   },[isWanding])
 
//   useEffect(() => {
//     const tWandMarkerStream = async () => {
//       try {
//         const streamTransport = createConnectTransport({ baseUrl: `${ipv4Addr}:${PortSolo}` })
//         const res = soloGetTWandMarkerLocationStream({ streamTransport: streamTransport, signal });

//         if(res) {
//           for await (const data of res) {
//             if(data.packet) {
//               const packet = data.packet
//               trackingTWandMarker(packet)
//             }
//           }
//         }
//       } catch (e) {
//         console.error(e)
//       }
//     }

//     if(isLoaded) {
//       tWandMarkerStream()
//     }

//     return () => {
//       controller.abort();
//     }
//   },[isLoaded])

//   useEffect(() => {
//     if(isStable) {
//       addStableList(ipv4Addr)
//     } else {
//       deleteStableList(ipv4Addr)
//     }
//   },[isStable])

//   useEffect(() => {
    
//     // 2. キャッシュに保存されたパケット情報を取得
//     loadTWandMarkerPackets()

//     const handleUnload = () => saveTWandMarkerPackets();

//     // 3. ウィンドウがリロードされる前にイベントリスナーを通知
//     window.addEventListener('beforeunload', handleUnload);
    
//     return () => {
//       window.removeEventListener('beforeunload', handleUnload); // クリーンアップを追加
//       saveTWandMarkerPackets();
//     };
//   },[])

//   const createSegment = (rPoints: ActiveLightMarkerPoint[], bPoints: ActiveLightMarkerPoint[], index: number): number[] => {
//     // R_k, R_{k+1}, B_{k+1}, B_k の4頂点で多角形を形成
//     const Rk = rPoints[index];
//     const RkPlus1 = rPoints[index + 1];
//     const Bk = bPoints[index];
//     const BkPlus1 = bPoints[index + 1];

//     if (!Rk || !RkPlus1 || !Bk || !BkPlus1) {
//         // 座標が足りない場合は空の配列を返す
//         return [];
//     }

//     // 頂点の並び順に注意: R_k -> R_{k+1} -> B_{k+1} -> B_k (閉じたループ)
//     return [
//       Rk.x, Rk.y,
//       RkPlus1.x, RkPlus1.y,
//       BkPlus1.x, BkPlus1.y, // 青点は逆順でたどるように次の点から戻る点へ
//       Bk.x, Bk.y,
//     ];
//   };

//   return (
//     <>
//       <Box
//         key={`wand_in_canvas_${ipv4Addr}`}
//         ref={boxRef}
//         sx={{ 
//           pointerEvents: 'none', 
//           width: '100%', 
//           height: '100%',
//           zIndex: 2,
//         }}
//       >
//         {
//           (
//             boxRef.current && 
//             typeof maxWidth === "number" && 
//             maxWidth !== 0 && 
//             typeof maxHeight === "number" && 
//             maxHeight !== 0
//           ) &&
//           <Stage
//             key={`wand_in_stage_${ipv4Addr}`}
//             width={maxWidth} 
//             height={VIRTUAL_HEIGHT * (maxWidth / VIRTUAL_WIDTH)} 
//             scaleX={maxWidth / VIRTUAL_WIDTH} 
//             scaleY={maxWidth / VIRTUAL_WIDTH}
//           >
//             <Layer key={`wand_in_layer_${ipv4Addr}`}>
//               <Shape
//                 sceneFunc={(context, shape) => {
//                   const segments = segmentRef.current;
//                   if (segments.length === 0) return;

//                   // 共通の設定
//                   context.fillStyle = shape.fill();
//                   context.globalAlpha = shape.opacity();

//                   for (let i = 0; i < segments.length; i++) {
//                     const p = segments[i];
//                     if (p.length < 8) continue;

//                     // 重要：セグメントごとにパスを独立させる
//                     context.beginPath(); 
//                     context.moveTo(p[0], p[1]);
//                     context.lineTo(p[2], p[3]);
//                     context.lineTo(p[4], p[5]);
//                     context.lineTo(p[6], p[7]);
//                     context.closePath();
                    
//                     // 重要：ここで即座に塗りつぶす。
//                     // これにより、後続のパスとの「偶奇判定」に巻き込まれなくなります。
//                     context.fill(); 
//                   }
//                 }}
//                 fill={colorRoulette({ index: id, lightness: '60%' })}
//                 opacity={0.3}
//                 listening={false}
//               />

//               <Line
//                 points={[ currentBluePosition.x, currentBluePosition.y, currentRedPosition.x, currentRedPosition.y ]}
//                 stroke={"#ffffff"}
//                 strokeWidth={8}
//                 lineCap="round"
//                 lineJoin="round"
//                 tension={0.5}
//                 opacity={1}
//               />

//               <CurrentMarker centerX={currentBluePosition.x} centerY={currentBluePosition.y} color={"#0000ff"} size={30}/>
//               <CurrentMarker centerX={currentRedPosition.x} centerY={currentRedPosition.y} color={"#ff0000"} size={30}/>
//             </Layer>
//           </Stage>
//         }
//       </Box>
//       {/* <Grid 
//         container 
//         sx={{ 
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: '100%', 
//           height: '100%', 
//           zIndex: 2,
//           display: "flex", 
//           justifyContent: "center",
//           alignItems: "center"
//         }}
//       >
//         {
//           area.map((progress,i) => (
//             <Grid 
//               key={`box_${i}`} 
//               size={{ xs: 4 }} 
//               sx={{ 
//                 height: "50%", 
//                 // border: 0.1,
//                 // borderColor: "#ffffff",
//                 ...(progress===50 && { backgroundColor: "#5ced46", opacity: 0.2 }),
//                 ...(progress===100 && { backgroundColor: "#5ced46", opacity: 0.7 }),
//               }}
//             />
//           ))
//         }
//       </Grid> */}
//       <Grid 
//         container 
//         sx={{ 
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: '100%', 
//           height: '100%', 
//           zIndex: 2,
//         }}
//       >
//         {area.map((progress, i) => (
//           <Grid 
//             key={`box_${i}`} 
//             // 12カラム中の2スロット = 横に6つ並ぶ
//             size={{ xs: 2 }} 
//             sx={{ 
//               // 縦に4つ並べるために高さを 100% / 4 = 25% に設定
//               height: `${100 / ROWS}%`, 
//               boxSizing: "border-box",
//               border: "0.1px solid rgba(255,255,255,0.05)", // 境界を見やすくする場合
//               ...(progress === 50 && { backgroundColor: "#5ced46", opacity: 0.2 }),
//               ...(progress === 100 && { backgroundColor: "#5ced46", opacity: 0.7 }),
//             }}
//           />
//         ))}
//       </Grid>
//       {
//         area.every(area => area === 100) &&
//         <Box
//           sx={{ 
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: '100%', 
//             height: '100%', 
//             zIndex: 3,
//             display: "flex", 
//             justifyContent: "center",
//             alignItems: "center"
//           }}
//         >
//           <CheckCircleOutline sx={{ fontSize: "5rem", color: "#ffffffff" }}/>
//         </Box>
//       }
//       <Box sx={{ position: "absolute", bottom: 0, right: 0, zIndex: 2, opacity: isWanding ? 0.5 : 0.8 }}>
//         <IconButton
//           size="small"
//           key={`tunning_${id}`}
//           color="default"
//           onClick={handleOpenCameraTuning}
//           sx={{
//             ":hover": {
//               backgroundColor: "rgba(255, 255, 255, 0.1)"
//             }
//           }}
//         >
//           <TuneOutlined sx={{ color: "white", fontSize: { xs: "0.8rem", md: "1.2rem" } }}/>
//         </IconButton>
//         <Button 
//           disabled
//           variant="outlined"
//           size="small"
//           key={`focalLength_${id}`}
//           color="warning"
//           sx={{ 
//             m: { xs: "0.2rem", sm: "0.4rem"},
//             borderRadius: "100px",
//             textTransform: 'none',   // 大文字変換を無効化
//             minWidth: 0,             // ボタンの最小幅を解除（文字に合わせる）
//             px: { xs: 1, sm: 2 },  // 横方向の余白を調整（1 = 8px）
//             lineHeight: 1,           // 縦方向をよりコンパクトにする場合
//           }}
//         >
//           <Typography 
//             color="warning" 
//             sx={{ 
//               fontWeight: "bold", 
//               fontSize: { xs: "0.6rem", sm: "0.8rem", md: "1rem" },
//               lineHeight: 1
//             }}
//           >
//             {focalLength} mm
//           </Typography>
//         </Button>
//       </Box>
//     </>
//   )
// }

// export default TWandMarker