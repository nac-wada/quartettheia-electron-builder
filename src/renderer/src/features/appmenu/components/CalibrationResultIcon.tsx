import { ReactNode } from "react"
import { useCalibrationEngine } from "../../../hooks/useCalibrationEngine"
import { Badge, CircularProgress } from "@mui/material"
import { CheckCircle, Error } from "@mui/icons-material"

// export const ActiveLightCalResultIcon = (props: {children: ReactNode}) => {
//   const { lFrameResult, tWandResult } = useActiveLightCalResult({})
//   const isCalibrating = useCalibrationEngine()

//   const badgeContent = useMemo(() => {
//     if(isCalibrating) {
//       return <CircularProgress thickness={6} size={16} sx={{ color: "#1bb710ff" }}/>
//     } else {
//       if(lFrameResult && tWandResult) {
//         return <CheckCircle fontSize="small" color="success"/>
//       } else {
//         return <Error fontSize="small" color="error"/>
//       }
//     }
//   },[isCalibrating, lFrameResult, tWandResult])

//   return (
//     <Badge badgeContent={badgeContent}>
//       {props.children}
//     </Badge>
//   )
// }

// export const ChessboardCalResultIcon = (props: {children: ReactNode}) => {
//   const { intrinsicResult } = useIntrinsicResult()
//   const { extrinsicResult } = useExtrinsicResult()
//   const isCalibrating = useCalibrationEngine()

//   const badgeContent = useMemo(() => {
//     if(isCalibrating) {
//       return <CircularProgress thickness={6} size={16} color="success"/>
//     } else {
//       if(extrinsicResult && intrinsicResult) {
//         return <CheckCircle fontSize="small" color="success"/>
//       } else {
//         return <Error fontSize="small" color="error"/>
//       }
//     }
//   },[isCalibrating, intrinsicResult, extrinsicResult])

//   return (
//     <Badge badgeContent={badgeContent}>
//       {props.children}
//     </Badge>
//   )
// }

export const CalibrationResultIcon = (props: {children: ReactNode, intrinsic: boolean, extrinsic: boolean}) => {
  const isCalibrating = useCalibrationEngine()

  // アイコンを決定する関数（またはそのまま変数へ）
  const renderBadge = () => {
    if (isCalibrating) {
      return <CircularProgress thickness={6} size={16} color="success" />;
    }
    if (props.intrinsic && props.extrinsic) {
      return <CheckCircle fontSize="small" color="success" />;
    }
    return <Error fontSize="small" color="error" />;
  };
  
  return (
    <Badge badgeContent={renderBadge()}>
      {props.children}
    </Badge>
  )
}