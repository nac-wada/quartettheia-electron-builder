import { createContext, useContext, useState, ReactNode } from 'react';
import { DebugDrawerContextType } from '../types/common';

const DebugContext = createContext<DebugDrawerContextType | undefined>(undefined);

export const DebugProviderDrawer: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [debugMode, setDebugMode] = useState(false);

  return (
    <DebugContext.Provider value={{ debugMode, setDebugMode }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebugDrawer = (): DebugDrawerContextType => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};
