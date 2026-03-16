// import { Line, Text } from "react-konva"
// import { Point } from "../../calibration/extrinsic/wand/wandPathGenerator";
// import { FC, useMemo } from "react";
// import { Theme, useMediaQuery } from "@mui/material";
// import { ActiveLightMarkerPoint } from "../../../types/types";

// export const LFrameAxises: FC<{ o: Point, x: Point, y: Point, stable: boolean }> = ({ o, x, y, stable }) => {
//   const sm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
//   const style = useMemo(() => {
//     if(sm) {
//       return { 
//         origin: 30, // Boxの中心
//         lineLength: 15, // 線の長さ
//         labelLength: 22, // ラベルを置く位置（線の先端より外側）
//         strokeWidth: 2,
//         fontSize: 14,
//         offset: 7
//       }
//     } else {
//       return { 
//         origin: 15,
//         lineLength: 7.5,
//         labelLength: 11,
//         strokeWidth: 1,
//         fontSize: 7,
//         offset: 3.5
//       }
//     }
//   },[sm])

//   // 任意の長さ（len）でスケーリングされた座標を返す関数
//   const getScaledCoord = (base: Point, target: Point, len: number) => {
//     const dx = target.x - base.x;
//     const dy = target.y - base.y;
//     const distance = Math.sqrt(dx * dx + dy * dy);

//     if (distance === 0) return { x: style.origin, y: style.origin };

//     return {
//       x: style.origin + (dx / distance) * len,
//       y: style.origin + (dy / distance) * len
//     };
//   };

//   // 線の先端座標
//   const lineX = getScaledCoord(o, x, style.lineLength);
//   const lineY = getScaledCoord(o, y, style.lineLength);

//   // テキストの配置座標（延長線上）
//   const labelX = getScaledCoord(o, x, style.labelLength);
//   const labelY = getScaledCoord(o, y, style.labelLength);

//   const zAxis = useMemo(() => {
//     // 1.原点からのベクトルを計算
//     const vx = { x: x.x - o.x, y: x.y - o.y };
//     const vy = { x: y.x - o.y, y: y.y - o.y };

//     // 2.外積（2Dにおける外積の大きさ）を計算
//     // 右手系: Z = X(x) * Y(y) - X(y) * Y(x)
//     const crossProduct = vx.x * vy.y - vx.y * vy.x;

//     // 3. z軸の描画用座標を計算
//     // 画面上では「斜め上」などに投影させて擬似的に3Dに見せる手法をとります
//     // ここでは、外積の大きさに応じて「奥行き」を表現するベクトルを作成します
//     const scale = 0.5; // z軸の長さを調整する係数
//     return {
//       points: {
//         x: o.x - (vy.y - vx.y) * scale, 
//         y: o.y - (vx.x - vy.x) * scale,
//       },

//     };
//   },[ o, x, y])

//   return (
//     <>
//       {/* X軸の線 */}
//       <Line 
//         points={[style.origin, style.origin, lineX.x, lineX.y]}
//         stroke={stable ? "#ff0000" : "gray" }
//         strokeWidth={style.strokeWidth}
//         // lineCap="round"
//       />
//       {/* Xラベル（延長線上） */}
//       <Text
//         text="x"
//         x={labelX.x}
//         y={labelX.y} // ※計算されたy座標をそのまま使う
//         fontSize={style.fontSize}
//         fill={stable ? "#ff0000" : "gray"}
//         fontStyle="bold"
//         align="center"
//         verticalAlign="middle"
//         offsetX={style.offset} // テキストの中心を座標に合わせるためのオフセット
//         offsetY={style.offset}
//       />

//       {/* Y軸の線 */}
//       <Line 
//         points={[style.origin, style.origin, lineY.x, lineY.y]}
//         stroke={stable ? "#00ff00" : "gray" }
//         strokeWidth={style.strokeWidth}
//         // lineCap="round"
//       />
//       {/* Yラベル（延長線上） */}
//       <Text
//         text="y"
//         x={labelY.x}
//         y={labelY.y}
//         fontSize={style.fontSize}
//         fill={stable ? "#00ff00" : "gray"}
//         fontStyle="bold"
//         align="center"
//         verticalAlign="middle"
//         offsetX={style.offset}
//         offsetY={style.offset}
//       />

//       {/* z軸の線 */}
//       <Line 
//         points={[style.origin, style.origin, lineY.x, lineY.y]}
//         stroke={stable ? "#0000ff" : "gray" }
//         strokeWidth={style.strokeWidth}
//         // lineCap="round"
//       />
//       {/* Yラベル（延長線上） */}
//       <Text
//         text="z"
//         x={labelY.x}
//         y={labelY.y}
//         fontSize={style.fontSize}
//         fill={stable ? "#00ff00" : "gray"}
//         fontStyle="bold"
//         align="center"
//         verticalAlign="middle"
//         offsetX={style.offset}
//         offsetY={style.offset}
//       />
//     </>
//   )
// }


// 要相談
import { Line, Text } from "react-konva";
import { FC, useMemo } from "react";
import { Theme, useMediaQuery } from "@mui/material";
import { ActiveLightMarkerPoint } from "../../common";

export const LFrameAxises: FC<{ o: ActiveLightMarkerPoint, x: ActiveLightMarkerPoint, y: ActiveLightMarkerPoint, stable: boolean }> = ({ o, x, y, stable }) => {
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  
  const style = useMemo(() => {
    const isLarge = sm;
    return { 
      origin: isLarge ? 30 : 15,
      lineLength: isLarge ? 15 : 7.5,
      labelLength: isLarge ? 22 : 11,
      strokeWidth: isLarge ? 2 : 1,
      fontSize: isLarge ? 14 : 7,
      offset: isLarge ? 7 : 3.5
    };
  }, [sm]);

  // 各軸の方向ベクトルと描画座標の計算
  const axisData = useMemo(() => {
    // 1. 各軸のスクリーン空間でのベクトル
    const vx = { x: x.x - o.x, y: x.y - o.y };
    const vy = { x: y.x - o.x, y: y.y - o.y };

    // 2. Z軸（Z-up）の定義
    // 「地面に垂直」を2Dで表現する場合、カメラが水平に近いなら「真上」を向きます。
    // ここでは右手系を維持しつつ、視覚的に垂直に見えるよう外積から向きを決定します。
    const cross = vx.x * vy.y - vx.y * vy.x;
    
    // Z-upとして、画面上での「真上（yマイナス方向）」をベースに、
    // X, Yの歪みに合わせた補正ベクトルを作成
    const vz = {
      x: 0, // 垂直に立てるためx成分は0
      y: -1 // 外積の向き（表裏）によって上下を決定
    };

    // スケーリング関数
    const scale = (vec: {x: number, y: number}, len: number) => {
      const mag = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
      if (mag === 0) return { x: 0, y: 0 };
      return { x: (vec.x / mag) * len, y: (vec.y / mag) * len };
    };

    const sVx = scale(vx, style.lineLength);
    const sVy = scale(vy, style.lineLength);
    const sVz = scale(vz, style.lineLength);

    const lVx = scale(vx, style.labelLength);
    const lVy = scale(vy, style.labelLength);
    const lVz = scale(vz, style.labelLength);

    return {
      lines: {
        x: { x: style.origin + sVx.x, y: style.origin + sVx.y },
        y: { x: style.origin + sVy.x, y: style.origin + sVy.y },
        z: { x: style.origin + sVz.x, y: style.origin + sVz.y }
      },
      labels: {
        x: { x: style.origin + lVx.x, y: style.origin + lVx.y },
        y: { x: style.origin + lVy.x, y: style.origin + lVy.y },
        z: { x: style.origin + lVz.x, y: style.origin + lVz.y }
      }
    };
  }, [o, x, y, style]);

  const colors = {
    x: stable ? "#ff4444" : "#888888",
    y: stable ? "#44ff44" : "#888888",
    z: stable ? "#4444ff" : "#888888"
  };

  return (
    <>
      {/* X軸 */}
      <Line points={[style.origin, style.origin, axisData.lines.x.x, axisData.lines.x.y]} stroke={colors.x} strokeWidth={style.strokeWidth} />
      <Text text="x" x={axisData.labels.x.x} y={axisData.labels.x.y} fontSize={style.fontSize} fill={colors.x} fontStyle="bold" offsetX={style.offset} offsetY={style.offset} />

      {/* Y軸 */}
      <Line points={[style.origin, style.origin, axisData.lines.y.x, axisData.lines.y.y]} stroke={colors.y} strokeWidth={style.strokeWidth} />
      <Text text="y" x={axisData.labels.y.x} y={axisData.labels.y.y} fontSize={style.fontSize} fill={colors.y} fontStyle="bold" offsetX={style.offset} offsetY={style.offset} />

      {/* Z軸 (Z-up) */}
      {/* <Line points={[style.origin, style.origin, axisData.lines.z.x, axisData.lines.z.y]} stroke={colors.z} strokeWidth={style.strokeWidth} /> */}
      {/* <Text text="z" x={axisData.labels.z.x} y={axisData.labels.z.y} fontSize={style.fontSize} fill={colors.z} fontStyle="bold" offsetX={style.offset} offsetY={style.offset} /> */}
    </>
  );
};