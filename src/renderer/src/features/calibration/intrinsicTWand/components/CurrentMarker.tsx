import { FC } from "react"
import { Line } from "react-konva";
import { CuurentMarkerProps } from "../types";

export const CurrentMarker: FC<CuurentMarkerProps> = ({ centerX, centerY, size, color='#ffffff' }) => {
  const L = size;

  const horizontalPoints = [
    centerX - L, centerY,
    centerX + L, centerY
  ]

  const verticalPoints = [
    centerX, centerY - L,
    centerX, centerY + L
  ]
  
  return (
    <>
      {/* 水平線 */}
      <Line 
        points={horizontalPoints} 
        stroke={color} 
        strokeWidth={10} 
        lineCap="round" 
        perfectDrawEnabled={false} 
      />
      
      {/* 垂直線 */}
      <Line 
        points={verticalPoints} 
        stroke={color} 
        strokeWidth={10} 
        lineCap="round" 
        perfectDrawEnabled={false} 
      />
    </>
  )
}