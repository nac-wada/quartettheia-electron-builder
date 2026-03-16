// ContextDarkMode.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppThemeContextType } from '../types/common';

const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

export const AppThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 初期状態としてシステム設定を検出
  const getPreferredTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }
  const systemTheme = getPreferredTheme()
  const cacheTheme = localStorage.getItem('systemTheme') 
  const [appTheme, setAppTheme] = useState( cacheTheme ?? systemTheme );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // システム設定が変更された時にテーマを更新するリスナー
    const handleChange = (e: MediaQueryListEvent) => {
      setAppTheme(e.matches ? 'dark' : 'light')
    };

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  },[]);

  const changeAppTheme = () => {
    setAppTheme(prev => {
      if(prev==='light') {
        localStorage.setItem('systemTheme', 'dark');
        return 'dark'
      } else {
        localStorage.setItem('systemTheme', 'light');
        return 'light'
      }
    })
  };

  return (
    <AppThemeContext.Provider value={{ appTheme, changeAppTheme }}>
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = (): AppThemeContextType => {
  const context = useContext(AppThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ProviderDarkMode');
  }
  return context;
};
