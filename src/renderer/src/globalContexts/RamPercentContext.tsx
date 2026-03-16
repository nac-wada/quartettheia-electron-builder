// DebugContextDrawer.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { RamPercentContextType } from '../types/common';

const RamPercentDisplayContext = createContext<RamPercentContextType | undefined>(undefined);

export const RamPercentDisplayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ramPercentDisplay, setRamPercentDisplay] = useState(false);

  return (
    <RamPercentDisplayContext.Provider value={{ ramPercentDisplay, setRamPercentDisplay }}>
      {children}
    </RamPercentDisplayContext.Provider>
  );
};

export const useRamPercent = (): RamPercentContextType => {
  const context = useContext(RamPercentDisplayContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};
