import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DrawerContextType, DrawerWidth } from '../types/common';
import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from '../utilities/localStorage';

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const ProviderDrawerOpen: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ls_isDrawerOpen  = loadSettingsFromLocalStorage('keyOpenDrawer', true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(ls_isDrawerOpen);
  const [drawerWidth, setDrawerWidth] = useState<number>(DrawerWidth)

  useEffect(() => {
    saveSettingsToLocalStorage('keyOpenDrawer', isDrawerOpen);
  }, [isDrawerOpen]);

  return (
    <DrawerContext.Provider value={{
      isDrawerOpen, setIsDrawerOpen,
      drawerWidth, setDrawerWidth
    }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = (): DrawerContextType => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a Provider');
  }
  return context;
};
