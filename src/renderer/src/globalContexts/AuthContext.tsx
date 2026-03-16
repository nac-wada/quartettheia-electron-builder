// src/components/login/ContextAuth.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { quartetGetWebAppLoginAccountEnable } from '../api/quartetAPI';
import { loadEncryptFromLocalStorage, loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from '../utilities/localStorage';
import { AuthContextType, keyLoginAuth, KeySavedPassword } from '../types/common';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ProviderAuth: React.FC<{ children: ReactNode }> = ({ children }) => {
  const savedPassword = loadEncryptFromLocalStorage(KeySavedPassword, 'false');
  const isAuth = loadSettingsFromLocalStorage(keyLoginAuth, false);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuth);
  const [notPassword, setNotPassword] = useState( savedPassword === '' );
  const [isProtectEnable, setIsProtectEnable] = useState<boolean | null>(null);

  useEffect(() => {
    const getWebAppLoginAccountEnable = async() => {

      try {
        const res = await quartetGetWebAppLoginAccountEnable();
        if(res) {
          setIsProtectEnable(res.enable)

          if(isAuth === false) {
            setIsLoggedIn(false)
          } 
          else if(isAuth === true) {
            setIsLoggedIn(true);
          }

        }
      } catch (e) {
        
      }
    }
    getWebAppLoginAccountEnable()
  },[])

  const login = () => {
    setIsLoggedIn(true);
    saveSettingsToLocalStorage(keyLoginAuth, true)
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem(keyLoginAuth);
  };

  const setAppProtectEnable = (enable: boolean) => {
    setIsProtectEnable(enable)
  }

  return (
    <AuthContext.Provider value={{
      isProtectEnable, setAppProtectEnable,
      isLoggedIn,
      notPassword, setNotPassword,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


