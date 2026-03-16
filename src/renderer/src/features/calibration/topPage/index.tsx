import { Box, Grow } from "@mui/material"
import { useCalibrationMode } from "../../../globalContexts/CalibrationTypeContext";
import { ActiveLightCalCard } from "./components/ActiveLightCalCard";
import { ChessboardCalCard } from "./components/ChessboardCalCard";
import { useCalibrationResults } from "../../../hooks/useCalibrationResults";

export const CalibrationTopPage = () => {
  const { calibrationConfig } = useCalibrationMode()
  const { extrinsicResult, intrinsicResult } = useCalibrationResults({})

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        height: "100%"
      }}
    >
      {/* メインの白いカード (Paperを使用) */}
      <Grow 
        in={true} 
        style={{ transformOrigin: '50% 0 0' }}
        timeout={1000}
      >

        <div>
          {
            calibrationConfig.calType==='wand' ? 
              <ActiveLightCalCard extrinsicResult={extrinsicResult} intrinsicResult={intrinsicResult}/> :
              <ChessboardCalCard extrinsicResult={extrinsicResult} intrinsicResult={intrinsicResult}/>
          }
        </div>

      </Grow>
    </Box>
  )
}