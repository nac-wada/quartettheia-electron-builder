// src/components/settings/SettingsPage.tsx
import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  Divider,
} from '@mui/material';
//import { useTranslation } from 'react-i18next'; // 国際化

import SettingItem from './SettingItem'; // 項目用テンプレ


const SettingsPage: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [isPasswordDeleted, setIsPasswordDeleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleNotificationsToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleNotificationsToggleChange', event.target.checked);
    setNotificationsEnabled(event.target.checked);
  };

  const handleSoundToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleSoundToggleChange', event.target.checked);
    setSoundEnabled(event.target.checked);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleUsernameChange', event.target.value);
    setUsername(event.target.value);
  };

  const handleSaveChanges = () => {
    console.log('handleSaveChanges');
  };

  const handleDeletePassword = () => {
    console.log('handleDeletePassword', isPasswordDeleted);
    setIsPasswordDeleted(true);
  };

  const handleSelectChange = (value: string) => { // 正しい引数の型を指定
    console.log('handleSelectChange', value);
    setSelectedOption(value);
  };

  return (
    <Card>
      <List sx={{ width: '100%', }}>
        <ListItem sx={{ bgcolor: 'background.paper' }}>
          <ListItemText primary={<Typography fontSize={'1.1rem'} fontWeight='bold'>
            Settings(テンプレ)
          </Typography>} />
        </ListItem>
        <Divider />

        <SettingItem
          label='Enable Notifications'
          description='Receive notifications for new messages.'
          type='toggle'
          onChange={handleNotificationsToggleChange}
          checked={notificationsEnabled}
        />
        <SettingItem
          label='Enable Sound'
          description='Enable sound for new notifications.'
          type='toggle'
          onChange={handleSoundToggleChange}
          checked={soundEnabled}
        />
        <SettingItem
          label='Username'
          description='Your username will be displayed to other users.'
          type='input'
          onChange={handleUsernameChange}
          value={username}
        />
        <SettingItem
          label='Save Changes'
          labelButton='Save'
          description='Save your changes.'
          type='button'
          onClick={handleSaveChanges}
        />
        <SettingItem
          label='Delete Password'
          labelButton='Delete'
          description='Delete your password.'
          type='button'
          onClick={handleDeletePassword}
          disabled={isPasswordDeleted}
        />
        <SettingItem
          label='Select Option'
          description='Select an option.'
          type='select'
          onChangeSelect={handleSelectChange}
          value={selectedOption}
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
      </List>
    </Card>
  );
};

export default SettingsPage;
