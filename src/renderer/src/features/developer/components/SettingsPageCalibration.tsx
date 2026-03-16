// src/components/set/SettingsPage.tsx
import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  Divider,
} from '@mui/material';

import SettingItem from '../../settings/components/SettingItem';
import { useDevices } from '../../../globalContexts/DeviceContext';
import ResetAllCalibrationSnapshots from './ResetAllCalibrationSnapshots';

const SettingsPage: React.FC = () => {
  const { devices } = useDevices();


  const handleResetClick = async () => {
    ResetAllCalibrationSnapshots({camfronturls: devices.map(device => device.ipv4Addr)});
    console.log('ResetAllCalibrationSnapshots is run')
  };


  return (
    <Card>
      <List sx={{ width: '100%', }}>
        <ListItem sx={{ bgcolor: 'background.paper' }}>
          <ListItemText primary={<Typography fontSize={'1.1rem'} fontWeight='bold'>
            Calibration
          </Typography>} />
        </ListItem>
        <Divider />

        <SettingItem
          label='外パラの新規保存フォルダを移動'
          labelButton='All-Delete'
          description='旧All Deleteボタン.'
          type='button'
          onClick={handleResetClick}
        />
      </List>
    </Card>
  );
};

export default SettingsPage;
