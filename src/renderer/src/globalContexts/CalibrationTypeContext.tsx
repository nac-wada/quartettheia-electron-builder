import { createContext, ReactNode, useContext, useState } from "react";
import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from "../utilities/localStorage";
import { CalibrationType, localStorage_Batch_FocalLength, localStorage_Calibration_Mode, localStorage_FocalLength_BatchMode_Enabled } from "../types/common";
import { CalibrationModeContextType } from "../types/common"

const CalibrationModeContext = createContext<CalibrationModeContextType | null>(null);

export const CalibrationModeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const calType = loadSettingsFromLocalStorage(localStorage_Calibration_Mode, 'chessboard')
  const batchMode = loadSettingsFromLocalStorage(localStorage_FocalLength_BatchMode_Enabled, true);
  const focalLength = loadSettingsFromLocalStorage(localStorage_Batch_FocalLength, 3.5);
  const config: CalibrationType = calType === 'wand' ? { calType: 'wand', batchMode: { mode: batchMode, focalLength } } : { calType: "chessboard" }
  const [ calibrationConfig, setCalibrationConfig ] = useState<CalibrationType>(config)

  const changeCalibrationMode = (mode: 'wand' | 'chessboard') => {
    if(mode==="chessboard") {
      setCalibrationConfig({calType: "chessboard"})
    } else if(mode==="wand") {
      const batchMode = loadSettingsFromLocalStorage(localStorage_FocalLength_BatchMode_Enabled, true);
      const focalLength = loadSettingsFromLocalStorage(localStorage_Batch_FocalLength, 3.5);
      setCalibrationConfig({ 
          calType: 'wand',
          batchMode: {
            mode: batchMode,
            focalLength: focalLength
          }
        })
    }
    saveSettingsToLocalStorage(localStorage_Calibration_Mode,mode)
  }

  return (
    <CalibrationModeContext.Provider value={{ calibrationConfig, changeCalibrationMode }}>
      {children}
    </CalibrationModeContext.Provider>
  )
}

export const useCalibrationMode = (): CalibrationModeContextType => {
  const context = useContext(CalibrationModeContext);
  if(!context) {
    throw new Error('useCalibrationMode must be used within an CalibrationProvider');
  }

  return context
}