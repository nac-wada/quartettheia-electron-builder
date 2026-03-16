// src/components/set/SettingsPage.tsx
//import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  Divider,
  Stack,
  Switch,
} from '@mui/material';
//import { useTranslation } from 'react-i18next'; // 国際化

import SettingItem from '../../settings/components/SettingItem';
import { useDebugDrawer } from '../../../globalContexts/DebugDrawerContext';
import { useRamPercent } from '../../../globalContexts/RamPercentContext';
import { saveSettingsToLocalStorage } from '../../../utilities/localStorage';
import { localStorage_developerMode, localStorage_ramPercentDisplayMode } from '../../../types/common';

const SettingsDevelopermodePage: React.FC = () => {
  const { debugMode, setDebugMode } = useDebugDrawer();
  const { ramPercentDisplay, setRamPercentDisplay } = useRamPercent();

  const changeDeveloperMode = () => {
    setDebugMode(!debugMode);
    setRamPercentDisplay(!debugMode)
    saveSettingsToLocalStorage(localStorage_developerMode, !debugMode);
    saveSettingsToLocalStorage(localStorage_ramPercentDisplayMode, !debugMode)
  }

  const changeRamPercentDisplayMode = () => {
    setRamPercentDisplay(!ramPercentDisplay)
    saveSettingsToLocalStorage(localStorage_ramPercentDisplayMode, !ramPercentDisplay)
  }

  return (
    <Card>
      <List sx={{ width: '100%', }}>
        <ListItem sx={{ bgcolor: 'background.paper' }}>
          <ListItemText 
            primary={
              <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography fontSize={'1.1rem'} fontWeight='bold'>開発者モード</Typography>
                <Switch onChange={changeDeveloperMode} checked={debugMode}/>
              </Stack>
            } />
        </ListItem>
        <Divider/>
        
        <SettingItem
          label='メモリ使用率'
          description='カメラのメモリ使用率を表示'
          type='toggle'
          onChange={changeRamPercentDisplayMode}
          checked={ramPercentDisplay}
        />

      </List>
    </Card>

  );
};

export { SettingsDevelopermodePage }