import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Layer, Line, Shape, Stage } from "react-konva";
import { CheckCircleOutline } from "@mui/icons-material";
import { colorRoulette } from "../../../../utilities/color";
import { soloGetTWandMarkerLocationStream } from "../../../../api/soloAPI";
import { CalibrationTWandMarkerSet, TWandErrorCode, TWandMarkerLocationPacket, TWandMarkerLocationPacketSchema } from "../../../../gen/solo/v1/solo_pb";
import { CurrentMarker } from "./CurrentMarker";
import { createConnectTransport } from "@connectrpc/connect-web";
import { PortSolo } from "../../../../types/common";
import { useObserverArea } from "../../../../hooks/useObserver";
import { fromBinary, toBinary } from "@bufbuild/protobuf";
import { tWandMarkerDb, TWandMarkerSession } from "../indexedDb/WandDb";
import { ActiveLightMarkerPoint, VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "../../common";
import { AreaType, COLS, COMPLETE_RECORD_POINTS, ROWS, SegmentPoints, SEMICOMPLETE_RECORD_POINTS } from "../types";
import { calculateScaleRatio, calculateStdDev } from "../utils/calculate";

export const TWandMarker:FC<{
  id: number, 
  isWanding: boolean, 
  ipv4Addr: string,
  refreshed: boolean,
  focalLength: number,
  isCollecting: { collect: boolean, progress: "completed" | "stop" | null},
  updateCompletedCameras: (id: number) => void,
  addCalibrationTWandMarkerSet: (calibrationTWandMarkerSet: CalibrationTWandMarkerSet, progress: 'completed' | 'stop' | null) => void,
  setRefreshed: () => void,
}> = ({ 
  id, isWanding, ipv4Addr, refreshed, focalLength, isCollecting, updateCompletedCameras, addCalibrationTWandMarkerSet, setRefreshed
}) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const { maxHeight, maxWidth } = useObserverArea({ ref: boxRef })
  const [currentBluePosition, setCurrentBluePosition] = useState<ActiveLightMarkerPoint>({ x: 0, y: 0 });
  const [currentRedPosition, setCurrentRedPosition] = useState<ActiveLightMarkerPoint>({ x: 0, y: 0 });
  const segmentRef = useRef<SegmentPoints[]>([]);
  const [area, setArea] = useState<AreaType>(new Array(COLS * ROWS).fill(0));
  const areasProgressRef = useRef<number[][]>(Array.from({ length: COLS * ROWS }, () => [0, 0]));
  const recording = useRef(false);
  const [markerError, setMarkerError] = useState<TWandErrorCode | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tWandMarkerPacketsRef = useRef<TWandMarkerLocationPacket[]>([]);
  const controller = new AbortController();
  const signal = controller.signal;
  const stableCountRef = useRef(0);
  const tooBrightRef = useRef(0);
  const [isReported, setIsReported] = useState(false);

  // 1. 各エリアの生データを一時保存するバッファ (useRefでメモリ節約)
  // 構造: { cellIndex: { angles: [], lengths: [] } }
  const cellStatsBuffer = useRef<Record<number, { angles: number[], lengths: number[] }>>({});

  // 判定しきい値
  const MIN_SAMPLES = 10;
  const STD_DEV_THRESHOLD = 30;
  const SCALE_RATIO_THRESHOLD = 1.5;

  // カメラ全体のスケールを保持（初期値は minL に大きな値、maxL に 0）
  const globalStatsRef = useRef({ maxL: 0, minL: Infinity });

  // スケール更新用の関数（trackingTWandMarker 内で呼ぶ）
  const updateGlobalScale = (length: number) => {
    if (length === 0) return;
    globalStatsRef.current.maxL = Math.max(globalStatsRef.current.maxL, length);
    globalStatsRef.current.minL = Math.min(globalStatsRef.current.minL, length);
  };

  useEffect(() => {
    if(isCollecting.collect) {
      // src\components\cameracalibration\intrinsicTWand\index.tsxのaddMarkerSetsにマーカーセットを渡す
      addCalibrationTWandMarkerSet({
        $typeName: "solo.v1.CalibrationTWandMarkerSet",
        camera: {
          $typeName: "solo.v1.CameraUnit",
          id: id,
          ipAddress: ipv4Addr.replace(/http:\/\/|https:\/\//, '')
        },
        tWand: tWandMarkerPacketsRef.current,
        focalLength: focalLength
      }, isCollecting.progress)

    }
  },[isCollecting])

  // 親要素のrefreshedが呼ばれた時、マーカーをリセットする
  useEffect(() => {
    const resetMarker = () => {
      // const request = indexedDB.deleteDatabase('TWandMarkerDB');
      // request.onsuccess = () => {
      //   console.log("deleted t-wand-marker")
      // } 
      segmentRef.current = [];
      setCurrentBluePosition({ x:0, y:0 });
      setCurrentRedPosition({ x:0, y:0 });
      tWandMarkerPacketsRef.current = [];
      setArea(new Array(COLS * ROWS).fill(0));
      areasProgressRef.current = Array.from({ length: COLS * ROWS }, () => [0, 0])
      setRefreshed()
    }

    if(refreshed) {
      resetMarker()
    }
  },[refreshed])

  // キャッシュにマーカーセットを保存する。
  const saveTWandMarkerPackets = async () => {
    const packets = tWandMarkerPacketsRef.current;
    if(packets.length === 0) return;

    try {
      // 1. 各パケットをバイナリ化
      const binaryList = packets.map(p => toBinary(TWandMarkerLocationPacketSchema, p));

      function encodeBianryList(list: Uint8Array[]): ArrayBuffer {
        const base64List = list.map(u8 => btoa(String.fromCharCode(...u8)));
        const buffer = new TextEncoder().encode(JSON.stringify(base64List)).buffer as ArrayBuffer;
        return buffer
      }
      
      // 2. 保存用のデータ構造を作成
      // const session: TWandMarkerSession = {
      //   name: `Session_${ipv4Addr}`,
      //   packets: encodeBianryList(binaryList),
      //   areasPoint: new Float32Array(areasProgressRef.current).buffer,
      // }

      const session: TWandMarkerSession = {
        name: `Session_${ipv4Addr}`,
        packets: encodeBianryList(binaryList),
        // flat() で 24x2 の 48要素の1次元配列に変換
        areasPoint: new Float32Array(areasProgressRef.current.flat()).buffer,
      };

      await tWandMarkerDb.tWandMarkerSessions.put(session)
    } catch (e) {
      console.error(`saveTWandMarkerPackets error:`,e);
    }
    console.log(`save completed.`)
  }

  // キャッシュからマーカーセットを取得する。
  const loadTWandMarkerPackets = async () => {
    try {
      const session = await tWandMarkerDb.tWandMarkerSessions
        .where('name').equals(`Session_${ipv4Addr}`).last();

      if(!session || !session.packets || !session.areasPoint) {
        setIsLoaded(true);
        return;
      }

      // 1. ArrayBufferからBase64配列を復元
      const jsonString = new TextDecoder().decode(session.packets);
      const base64List = JSON.parse(jsonString) as string[];

      // 2. Base64 -> Uint8Array -> Object に戻す
      const loadedPackets = base64List.map(b64 => {
        const u8 = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        return fromBinary(TWandMarkerLocationPacketSchema, u8);
      });

      const areasPoint = new Float32Array(session.areasPoint);
      const loadedAreasPoint: number[] = Array.from(areasPoint);
      // areasProgressRef.current = loadedAreasPoint as AreaType

      // 1次元配列 [0,0,0,0...] を 2個ずつのペア [[0,0], [0,0]...] に戻す
      const chunkedAreas: number[][] = [];
      for (let i = 0; i < loadedAreasPoint.length; i += 2) {
        chunkedAreas.push([loadedAreasPoint[i], loadedAreasPoint[i + 1]]);
      }

      areasProgressRef.current = chunkedAreas;

      tWandMarkerPacketsRef.current = loadedPackets;
      for(let i=0; i < tWandMarkerPacketsRef.current.length; i++) {
        const bMarkers = tWandMarkerPacketsRef.current.flatMap(p => (p.markers && p.markers.b) ? [p.markers.b] : []);
        const rMarkers = tWandMarkerPacketsRef.current.flatMap(p => (p.markers && p.markers.r) ? [p.markers.r] : []);
        const segment = createSegment(rMarkers, bMarkers, i);
        segmentRef.current.push(segment)
      }
      for(let i=0; i < areasProgressRef.current.length; i++) {
        const area = areasProgressRef.current[i];
        const red = area[0];
        const blue = area[1];
        setArea(prevArea => {
          const newArea: AreaType = [...prevArea];
          if((red >= SEMICOMPLETE_RECORD_POINTS && blue >= SEMICOMPLETE_RECORD_POINTS) && (red < COMPLETE_RECORD_POINTS && blue < COMPLETE_RECORD_POINTS)) {
            newArea[i] = 50;
          } else if(red >= COMPLETE_RECORD_POINTS && blue >= COMPLETE_RECORD_POINTS) {
            newArea[i] = 100;
          }
          return newArea
        })
      }
    } catch (e) {
      console.error(`loadTWandMarkerPackets error:`,e)
    }
    setIsLoaded(true)
  }

  const trackingTWandMarker = useCallback((packet: TWandMarkerLocationPacket) => {
    if (
      packet.errorCode === TWandErrorCode['TWAND_ERROR_CODE_SUCCESS'] &&
      packet.markers?.isFound && packet.markers.b && packet.markers.r
    ) {
      const b = packet.markers.b;
      const r = packet.markers.r;
      const bluePosition: ActiveLightMarkerPoint = { x: b.x, y: b.y };
      const redPosition: ActiveLightMarkerPoint = { x: r.x, y: r.y };
      
      setCurrentBluePosition(bluePosition);
      setCurrentRedPosition(redPosition);

      if (recording.current) {
        tWandMarkerPacketsRef.current.push(packet);

        // 角度と長さの計算
        const dx = b.x - r.x;
        const dy = b.y - r.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        // 全体のスケールを更新
        updateGlobalScale(length);

        // --- 軌跡描画用のセグメント作成 ---
        if(segmentRef.current && tWandMarkerPacketsRef.current) {
          const bMarkers = tWandMarkerPacketsRef.current.flatMap(p => (p.markers && p.markers.b) ? [p.markers.b] : []);
          const rMarkers = tWandMarkerPacketsRef.current.flatMap(p => (p.markers && p.markers.r) ? [p.markers.r] : []);

          if(segmentRef.current.length === 0 && tWandMarkerPacketsRef.current.length > 1) {
            const firstSegment = createSegment(rMarkers, bMarkers, 0);
            segmentRef.current = [firstSegment];
          } else if(tWandMarkerPacketsRef.current.length > segmentRef.current.length + 1) {
            const newIndex = segmentRef.current.length;
            const newSegment = createSegment(rMarkers, bMarkers, newIndex);
            segmentRef.current = [...segmentRef.current, newSegment]
          }

          // 新しいセグメントのインデックス
          // const newIndex = tWandMarkerPacketsRef.current.length - 2;

          // if (newIndex >= 0) {
          //   const newSegment = createSegment(rMarkers, bMarkers, newIndex);
            
          //   if (newSegment.length > 0) {
          //     // 最新のセグメントを追加
          //     const nextSegments = [...segmentRef.current, newSegment];

          //     // --- ここで古いセグメントを捨てるロジック ---
          //     const MAX_SEGMENTS = 1000; // 画面に残したい軌跡の数
          //     if (nextSegments.length > MAX_SEGMENTS) {
          //       nextSegments.shift(); // 一番古い（配列の先頭）を削除
          //     }
              
          //     segmentRef.current = nextSegments;
          //   }
          // }
        }
        
        // --- エリア判定ロジック ---
        const midX = (bluePosition.x + redPosition.x) / 2;
        const midY = (bluePosition.y + redPosition.y) / 2;

        const col = Math.floor(midX / (VIRTUAL_WIDTH / COLS));
        const row = Math.floor(midY / (VIRTUAL_HEIGHT / ROWS));
        const cellIndex = row * COLS + col;

        if (cellIndex >= 0 && cellIndex < COLS * ROWS) {
          const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 180) % 180;

          // バッファの初期化と追加
          if (!cellStatsBuffer.current[cellIndex]) {
            cellStatsBuffer.current[cellIndex] = { angles: [], lengths: [] };
          }
          const buffer = cellStatsBuffer.current[cellIndex];
          buffer.angles.push(angle);
          buffer.lengths.push(length);

          // 10個溜まったら判定
          if (buffer.angles.length >= MIN_SAMPLES) {
            const stdDev = calculateStdDev(buffer.angles);
            const scaleRatio = calculateScaleRatio(buffer.lengths);

            setArea(prev => {
              const next = [...prev];
              // 判定：数・角度・スケールが揃えば100(緑)、数だけなら50(黄)
              if (stdDev >= STD_DEV_THRESHOLD && scaleRatio >= SCALE_RATIO_THRESHOLD) {
                next[cellIndex] = 100;
              } else if (next[cellIndex] < 100) {
                next[cellIndex] = 50;
              }
              return next;
            });

            // バッファをリセット（または古いデータを少し残すなら slice）
            buffer.angles = [];
            buffer.lengths = [];
          }
        }
      }

      stableCountRef.current++;
      if (stableCountRef.current >= 20) setMarkerError(packet.errorCode);
    } else if(packet.errorCode===TWandErrorCode['TWAND_ERROR_CODE_TOO_BRIGHT']) {
      tooBrightRef.current++;
      if(tooBrightRef.current >= 10) setMarkerError(packet.errorCode);
    } else {
      // すでに 0,0 ならセットしない 不要レンダリング防止
      setCurrentBluePosition(prev => (prev.x === 0 && prev.y === 0 ? prev : { x: 0, y: 0 }));
      setCurrentRedPosition(prev => (prev.x === 0 && prev.y === 0 ? prev : { x: 0, y: 0 }));
      
      stableCountRef.current = 0;
      tooBrightRef.current = 0;

      // エラーコードが変わった時だけ state を更新する　不要レンダリング防止
      setMarkerError(prev => (prev === packet.errorCode ? prev : packet.errorCode));
    }
  }, [recording]);

  useEffect(() => {
    recording.current = isWanding
  },[isWanding])
 
  useEffect(() => {
    const tWandMarkerStream = async () => {
      try {
        const streamTransport = createConnectTransport({ baseUrl: `${ipv4Addr}:${PortSolo}` })
        const res = soloGetTWandMarkerLocationStream({ streamTransport: streamTransport, signal });

        if(res) {
          for await (const data of res) {
            if(data.packet) {
              const packet = data.packet
              trackingTWandMarker(packet)
            }
          }
        }
      } catch (e) {
        console.error(e)
      }
    }

    tWandMarkerStream()
    // if(isLoaded) {
    //   tWandMarkerStream()
    // }

    return () => {
      controller.abort();
    }
  },[])

  // useEffect(() => {
    
  //   // 2. キャッシュに保存されたパケット情報を取得
  //   loadTWandMarkerPackets()

  //   const handleUnload = () => saveTWandMarkerPackets();

  //   // 3. ウィンドウがリロードされる前にイベントリスナーを通知
  //   window.addEventListener('beforeunload', handleUnload);
    
  //   return () => {
  //     window.removeEventListener('beforeunload', handleUnload); // クリーンアップを追加
  //     saveTWandMarkerPackets();
  //   };
  // },[])

  const createSegment = (rPoints: ActiveLightMarkerPoint[], bPoints: ActiveLightMarkerPoint[], index: number): number[] => {
    // R_k, R_{k+1}, B_{k+1}, B_k の4頂点で多角形を形成
    const Rk = rPoints[index];
    const RkPlus1 = rPoints[index + 1];
    const Bk = bPoints[index];
    const BkPlus1 = bPoints[index + 1];

    if (!Rk || !RkPlus1 || !Bk || !BkPlus1) {
        // 座標が足りない場合は空の配列を返す
        return [];
    }

    // 頂点の並び順に注意: R_k -> R_{k+1} -> B_{k+1} -> B_k (閉じたループ)
    return [
      Rk.x, Rk.y,
      RkPlus1.x, RkPlus1.y,
      BkPlus1.x, BkPlus1.y, // 青点は逆順でたどるように次の点から戻る点へ
      Bk.x, Bk.y,
    ];
  };

  const isCameraReady = useMemo(() => {
    // 1. カバレッジチェック: 100(緑)のマスが20個以上あるか
    const greenCells = area.filter(v => v === 100).length;
    const coverageReady = greenCells >= 20;
    
    // 2. スケール分散チェック: 最大/最小の比率が1.5以上か
    const { maxL, minL } = globalStatsRef.current;
    const currentScaleRatio = minL === Infinity || minL === 0 ? 1 : maxL / minL;
    const scaleReady = currentScaleRatio >= 1.5;

    // デバッグ用にログを出しておくと調整しやすいです
    console.log(`Cam ${id} Status: GreenCells=${greenCells}, ScaleRatio=${currentScaleRatio.toFixed(2)}`);

    return coverageReady && scaleReady;
  }, [area, id]); // areaが変わるたびに再評価

  // 親要素に十分な特徴点が得られたことを伝える。src\components\cameracalibration\intrinsicTWand\index.tsxのupdateCompletedCamerasにカメラidを渡す
  useEffect(() => {
    if(isCameraReady && tWandMarkerPacketsRef.current && !isReported) {
      updateCompletedCameras(id)
      setIsReported(true);
    }

  },[isCameraReady, isReported, id])

  const visibleSegments = useMemo(() => {
    const MAX_DISPLAY = 1000;
    return segmentRef.current.slice(-MAX_DISPLAY);
  },[segmentRef.current.length])
  
  return (
    <>
      <Box
        key={`wand_in_canvas_${ipv4Addr}`}
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
            key={`wand_in_stage_${ipv4Addr}`}
            width={maxWidth} 
            height={VIRTUAL_HEIGHT * (maxWidth / VIRTUAL_WIDTH)} 
            scaleX={maxWidth / VIRTUAL_WIDTH} 
            scaleY={maxWidth / VIRTUAL_WIDTH}
          >
            <Layer key={`wand_in_layer_${ipv4Addr}`}>
              <Shape
                sceneFunc={(context, shape) => {
                  const segments = visibleSegments;
                  if (segments.length === 0) return;

                  // 共通の設定
                  context.fillStyle = shape.fill();
                  context.globalAlpha = shape.opacity();

                  for (let i = 0; i < segments.length; i++) {
                    const p = segments[i];
                    if (p.length < 8) continue;

                    // 重要：セグメントごとにパスを独立させる
                    context.beginPath(); 
                    context.moveTo(p[0], p[1]);
                    context.lineTo(p[2], p[3]);
                    context.lineTo(p[4], p[5]);
                    context.lineTo(p[6], p[7]);
                    context.closePath();
                    
                    // 重要：ここで即座に塗りつぶす。
                    // これにより、後続のパスとの「偶奇判定」に巻き込まれなくなります。
                    context.fill(); 
                  }
                }}
                fill={colorRoulette({ index: id, lightness: '60%' })}
                opacity={0.3}
                listening={false}
              />

              <Line
                points={[ currentBluePosition.x, currentBluePosition.y, currentRedPosition.x, currentRedPosition.y ]}
                stroke={"#ffffff"}
                strokeWidth={8}
                lineCap="round"
                lineJoin="round"
                tension={0.5}
                opacity={1}
              />

              <CurrentMarker centerX={currentBluePosition.x} centerY={currentBluePosition.y} color={"#0000ff"} size={30}/>
              <CurrentMarker centerX={currentRedPosition.x} centerY={currentRedPosition.y} color={"#ff0000"} size={30}/>
            </Layer>
          </Stage>
        }
      </Box>
      <Box 
        sx={{ 
          position: "absolute",
          top: 0,
          left: 0,
          width: '100%', 
          height: '100%', 
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "repeat(6, 4fr)"
        }}
      >
        {area.map((progress, i) => (
          <Box 
            key={`box_${i}`} 
            sx={{ 
              height: `100%`, 
              boxSizing: "border-box",
              border: "0.5px solid rgba(255,255,255,0.2)",
              transition: "background-color 0.3s ease", // 変化を滑らかに
              // 色の定義を更新
              backgroundColor: 
                progress === 100 ? "rgba(92, 237, 70, 0.7)" : // 合格：濃い緑
                progress === 50 ? "rgba(237, 231, 70, 0.4)" :  // 不足：黄色
                "transparent",
            }}
          />
        ))}
      </Box>
      {/* 24区画中20区画以上が100なら完了とする */}
      {isCameraReady && (
        <Box
          sx={{ 
            position: "absolute",
            top: 0,
            left: 0,
            width: '100%', 
            height: '100%', 
            zIndex: 3,
            display: "flex", 
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <CheckCircleOutline sx={{ fontSize: "5rem", color: "#ffffffff" }}/>
        </Box>
      )}
      <Box sx={{ position: "absolute", top: 0, left: 0, zIndex: 3, ...(isWanding && { opacity: 0 }) }}>
        <Typography 
          color={markerError===TWandErrorCode['TWAND_ERROR_CODE_SUCCESS'] ? "success" : "error"} 
          sx={{
            pl:"0.4rem",
            pt: "0.2rem", 
            fontWeight: "bold",
            fontSize: { xs:"0.6rem", lg: "0.8rem" },
          }}
        >
          {
            markerError===TWandErrorCode['TWAND_ERROR_CODE_SUCCESS'] ? "検出中" : 
            markerError===TWandErrorCode['TWAND_ERROR_CODE_TOO_BRIGHT'] ? "画像が明るすぎます" : "検出できません"
          }
        </Typography>
      </Box>
      <Box sx={{ position: "absolute", bottom: 0, right: 0, zIndex: 2, opacity: isWanding ? 0.5 : 0.8 }}>
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

export default TWandMarker