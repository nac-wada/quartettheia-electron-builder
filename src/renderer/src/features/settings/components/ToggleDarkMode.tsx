// DebugToggle.tsx
import React, {  } from 'react';
import { useAppTheme } from '../../../globalContexts/AppThemeContext';
import { IconButton } from '@mui/material';

import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ToggleDarkMode: React.FC = () => {
  const { appTheme, changeAppTheme } = useAppTheme();
  
  return (
    <IconButton title={`ナイトモード切替`}
      onClick={changeAppTheme} 
      size='small'   
      sx={{ mr: "0.25rem", ml: "0.5rem" }}
    >
      {
        appTheme === 'dark'
        ? <Brightness7Icon/>
        : <Brightness4OutlinedIcon sx={{color:"white"}}/>
      }
    </IconButton>
  )
}

export default ToggleDarkMode;
