import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  Divider,
} from '@mui/material';
import SettingItem from './SettingItem';
import DialogComponent from './DialogFirst';
import { loadSettingsFromLocalStorage } from '../../../utilities/localStorage';
import { keyLoginAuth, KeySavedCamerId, KeySavedCheckbox, KeySavedPassword } from '../../../types/common';

const SettingsPage: React.FC = () => {
  const savedCheckbox = loadSettingsFromLocalStorage(KeySavedCheckbox, false);
  const [isPasswordDeleted, setIsPasswordDeleted] = useState(savedCheckbox === false);
  const [isLocalStorageCleared, setIsLocalStorageCleared] = useState(false);
  const [openAutoLoginRestDialog, setopenAutoLoginResetDialog] = useState(false);
  const [openAppicationSettingResetDialog, setopenApplicationSettingResetDialog] = useState(false);

  const handleOpenAutoLoginResetDialog = () => {
    setopenAutoLoginResetDialog(true)
  }

  const handleCloseAutoLoginResetDialog = () => {
    setopenAutoLoginResetDialog(false)
  }

  const handleOpenApplicationSettingResetDialog = () => {
    setopenApplicationSettingResetDialog(true)
  }

  const handleCloseApplicationSettingResetDialog = () => {
    setopenApplicationSettingResetDialog(false);
  }

  const handleDeletePassword = () => {
    localStorage.removeItem(KeySavedCamerId);
    localStorage.removeItem(KeySavedPassword);
    localStorage.removeItem(KeySavedCheckbox);
    localStorage.removeItem(keyLoginAuth);
    console.log('パスワードの保存を削除');
    setIsPasswordDeleted(true);
    setopenAutoLoginResetDialog(false);
  };

  const handleDeleteLocalStorage = () => {
    localStorage.clear();
    console.log('設定した値を全て削除');
    setIsLocalStorageCleared(true);
    setopenApplicationSettingResetDialog(false)
  };

  return (
    <>
      <Card sx={{borderRadius:5,boxShadow:"none"}}>
        <List sx={{ width: '100%' }}>
          <ListItem sx={{ bgcolor: 'background.paper' }}>
            <ListItemText primary={<Typography fontSize={'1.1rem'} fontWeight='bold'>リセット</Typography>} />
          </ListItem>

          <Divider />

          <SettingItem
            label='自動ログインの解除'
            labelButton='解除'
            description=''
            type='button'
            onClick={handleOpenAutoLoginResetDialog}
            disabled={isPasswordDeleted}
            colorButton='error'
          />

          <SettingItem
            label='アプリ設定の初期化'
            labelButton='初期化'
            description=''
            type='button'
            onClick={handleOpenApplicationSettingResetDialog}
            disabled={isLocalStorageCleared}
            colorButton='error'
          />
        </List>
      </Card>

      <DialogComponent
        open={openAutoLoginRestDialog}
        handleClose={handleCloseAutoLoginResetDialog}
        handleOpenConfirm={handleDeletePassword}
        title='自動ログインの解除'
        content1='自動ログインを解除しますか？'
      />

      <DialogComponent
        open={openAppicationSettingResetDialog}
        handleClose={handleCloseApplicationSettingResetDialog}
        handleOpenConfirm={handleDeleteLocalStorage}
        title='アプリ設定の初期化'
        content1='設定を初期化しますか？'
      />
    </>
  );
};

export default SettingsPage;
