import { Box, Grid } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { Layer, Line, Stage } from "react-konva"
import { SegmentPoints } from "../features/calibration/intrinsicTWand/types";

export const Test = () => {
  const [mem, setMem] = useState<any>(null);

  useEffect(() => {
    const updateMemory = () => {
      if('memory' in performance) {
        const m = (performance as any).memory;
        // 必要な数値だけを抽出して新しいオブジェクトを作る
        // これにより、Reactが「中身が変わったかどうか」を正しく判定できる
        setMem({
          used: m.usedJSHeapSize,
          total: m.totalJSHeapSize,
          limit: m.jsHeapSizeLimit
        });
      }
    };

    updateMemory();

    const timer = setInterval(updateMemory, 1000);

    return () => clearInterval(timer)
  },[])
  
  return (
    <>
      {mem ? (
        <>
          <div>使用済み：{(mem.used / 1024 / 1024).toFixed(2)} MB</div>
          <div>確保済み：{(mem.total / 1024 / 1024).toFixed(2)} MB</div>
          <div>制限：{(mem.limit / 1024 / 1024).toFixed(2)} MB</div>
        </>
      ) : (
        <div>このブラウザではメモリ計測がサポートされていません。</div>
      )}
      <WandVisualizer/>
      <WandVisualizer/>
      <WandVisualizer/>
      <WandVisualizer/>
    </>
  )
}

interface DummyMarker {
  x: number,
  y: number,
  circularity: number,
  size: number,
}

export interface DummyTWandMarkers {
  r: DummyMarker,
  b: DummyMarker,
  frameTimestamp: {
    epoch: bigint,
    subFrame: bigint,
    frameRate: bigint
  }
}

export const WandVisualizer = () => {
  // 画面中央を基準に、半径150px程度の8の字を描画
  const wandData = useWandGenerator(175, 150, 100);
  const wandDataRef = useRef<DummyTWandMarkers[]>([]);
  const segmentRef = useRef<SegmentPoints[]>([]);

  useEffect(() => {
    const loadWandData = () => {
      if(!wandData) return;
      wandDataRef.current.push(wandData)
      if(segmentRef.current && wandDataRef.current) {
        const r = wandDataRef.current.map((d) => d.r);
        const b =  wandDataRef.current.map((d) => d.b);

        if(segmentRef.current.length === 0 && wandDataRef.current.length > 1) {
          const firstSegment = createSegment(r, b, 0);
          segmentRef.current = [firstSegment];
        } else if(wandDataRef.current.length > segmentRef.current.length + 1) {
          const newIndex = segmentRef.current.length;
          const newSegment = createSegment(r, b, newIndex);
          segmentRef.current = [...segmentRef.current, newSegment];
        }
      }
    }

    loadWandData()
  },[wandData])

  const createSegment = (rPoints: {x: number, y: number}[], bPoints: {x: number, y: number}[], index: number): number[] => {
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

  if (!wandData) return <div>Loading...</div>;

  return (
    <Box
      sx={{ 
        width: 350, 
        height: 300,
        backgroundColor: "black",
        mb: "30px"
      }}
    >
      <Stage
        width={350} 
        height={300} 
        scaleX={1} 
        scaleY={1}
      >
        <Layer>
          {
            segmentRef.current.map((points, index) => (
              <Line
                key={index}
                points={points}
                fill={"rgba(255, 255, 255, 0.5)"}
                opacity={0.3}
                lineCap="round" // 来週試す
                lineJoin="round" // 来週試す
                // 帯状の図形にするために、線と線をつなぐ (多角形として閉じる)
                closed={true} 
                strokeWidth={0} // 枠線は不要
                // 必要に応じて、曲線を滑らかにする tension の設定も可能です
                // tension={0} // 直線でつなぐ
              />
            ))
          }

          <Line
            points={[ wandData.b.x, wandData.b.y, wandData.r.x, wandData.r.y ]}
            stroke={"#ffffff"}
            strokeWidth={8}
            lineCap="round"
            lineJoin="round"
            tension={0.5}
            opacity={1}
          />

        </Layer>
      </Stage>
      座標点数：{wandDataRef.current.length}
    </Box>
  );
};

export const useWandGenerator = (centerX: number, centerY: number, scale: number = 100) => {
  const [data, setData] = useState<DummyTWandMarkers | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const frameRate = 20;
    const intervalMs = 1000 / frameRate;

    const generateFrame = () => {
      const t = frameRef.current * 0.1; // 速度調整
      
      // 8の字の計算 (リサジュー曲線)
      const dx = Math.cos(t) * scale;
      const dy = Math.sin(2 * t) * (scale / 2);

      // マーカーRとBで少し位相をずらす、あるいは対角に配置
      const createMarker = (offset: number): DummyMarker => ({
        x: centerX + dx * offset,
        y: centerY + dy * offset,
        // circularityを0.8〜1.0の間で揺らす
        circularity: 0.8 + Math.abs(Math.sin(t + offset)) * 0.2,
        // sizeを10〜20の間で揺らす
        size: 10 + Math.abs(Math.cos(t + offset)) * 10,
      });

      const newFrame: DummyTWandMarkers = {
        r: createMarker(1),
        b: createMarker(-1), // 反対方向に配置
        frameTimestamp: {
          epoch: BigInt(Date.now()),
          subFrame: BigInt(frameRef.current),
          frameRate: BigInt(frameRate),
        },
      };

      setData(newFrame);
      frameRef.current++;
    };

    const timer = setInterval(generateFrame, intervalMs);
    return () => clearInterval(timer);
  }, [centerX, centerY, scale]);

  return data;
};
