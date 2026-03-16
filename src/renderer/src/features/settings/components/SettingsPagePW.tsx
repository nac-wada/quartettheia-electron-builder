// src/components/settings/SettingsPagePW.tsx
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
import SettingsPagePWChange from './SettingsPagePWChange';
import SettingsPagePWReset from './SettingsPagePWReset';
import { SettingsPagePWProtect } from './SettingsPagePWProtect';
import { useAuth } from '../../../globalContexts/AuthContext';

const SettingsPagePW: React.FC = () => {
  const { isProtectEnable, setAppProtectEnable } = useAuth()
  const [openPWChangeDialog, setopenPWChangeDialog] = useState(false);
  const [openPWResetDialog, setopenPWResetDialog] = useState(false);
  const [openPasswordProtect, setopenPasswordProtect] = useState(false);

  const handleOpenPWChengDialog = () => {
    setopenPWChangeDialog(true);
  };

  const handleOpenPWResetDialog = () => {
    setopenPWResetDialog(true);
  };

  const handleOpenPWProtectDialog = () => {
    setopenPasswordProtect(!openPasswordProtect);
    console.log(openPasswordProtect)
  }

  return (
    <>

      <Card sx={{borderRadius:5,boxShadow:"none"}}>
        <List sx={{ width: '100%' }}>
          <ListItem sx={{ bgcolor: 'background.paper' }}>
            <ListItemText primary={<Typography fontSize={'1.1rem'} fontWeight='bold'>パスワード</Typography>} />
          </ListItem>
          <Divider />
          
          <SettingItem
            label={'このアプリをパスワードで保護する'} 
            type='toggle'
            description=''
            checked={isProtectEnable ?? false}
            onChange={handleOpenPWProtectDialog}
            dialogComponent={
              (openPasswordProtect) ?
                <SettingsPagePWProtect 
                  isProtectEnable={isProtectEnable ?? false}
                  setAppProtectEnable={setAppProtectEnable}
                  firstDialogOpen={openPasswordProtect}
                  setFirstDialogOpen={setopenPasswordProtect}
                />
              : <></>
            }
          />

          <SettingItem
            label='パスワードの変更'
            labelButton='変更'
            description=''
            type='button'
            onClick={handleOpenPWChengDialog}
            dialogComponent={ 
              (openPWChangeDialog) ?
                <SettingsPagePWChange 
                  firstDialogOpen={openPWChangeDialog} 
                  setFirstDialogOpen={setopenPWChangeDialog} 
                />
              : <></>  
            }
          />

          <SettingItem
            label='パスワードの初期化'
            labelButton='初期化'
            description=''
            type='button'
            onClick={handleOpenPWResetDialog}
            colorButton='error'
            dialogComponent={
              (openPWResetDialog) ?
                <SettingsPagePWReset  
                  firstDialogOpen={openPWResetDialog}  
                  setFirstDialogOpen={setopenPWResetDialog} 
                />
              : <></>
            }
          />

        </List>
      </Card>

    </>
  );
};

export default SettingsPagePW;
