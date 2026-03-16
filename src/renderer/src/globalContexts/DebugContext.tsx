// DebugContext.tsx //仮想カメラ用, contextのサンプル
import { createContext, useContext, useState, ReactNode } from 'react';
import { loadSettingsFromLocalStorage } from '../utilities/localStorage';
import { DebugContextType } from '../types/common';

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const DebugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const isDebugMode  = loadSettingsFromLocalStorage('KeyDebugModeToggle', false);
  const isDebugValue = loadSettingsFromLocalStorage('KeyDebugValue', 4);

  const [debugDummyCamera, setDebugDummyCamera] = useState(isDebugMode);
  const [hiddenFpsAndSizeMode, setHiddenFpsAndSizeMode] = useState(false);
  const [debugNumOfCamera, setDebugNumOfCamera] = useState(isDebugValue);

  return (
    <DebugContext.Provider value={{
      debugDummyCamera, setDebugDummyCamera,
      hiddenFpsAndSizeMode, setHiddenFpsAndSizeMode,
      debugNumOfCamera, setDebugNumOfCamera
    }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = (): DebugContextType => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};
