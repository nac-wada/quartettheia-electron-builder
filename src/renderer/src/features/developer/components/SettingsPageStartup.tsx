// src/components/set/SettingsPage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  Divider,
} from '@mui/material';
//import { useTranslation } from 'react-i18next'; // 国際化

import SettingItem from '../../settings/components/SettingItem';
import { MainMenuItems } from '../../appmenu/components/MenuItems';
import { DEFAULT_PAGE } from '../../../types/common';


const SettingsPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>(() => {
    const storedPage = localStorage.getItem('initialPage');
    return MainMenuItems.find((menuItem) => menuItem.to === storedPage)?.to || DEFAULT_PAGE;
  });

  const handleSelectChange = useCallback((value: string) => {
    localStorage.setItem('initialPage', value);
    setSelectedOption(value);
    console.log('handleSelectChange', value);
  },[]);

  const handleReset = useCallback(() => {
    localStorage.removeItem('initialPage');
    setSelectedOption(DEFAULT_PAGE);
    console.log('初期画面をRecord画面の設定に戻す(初期化)');
  }, []);

  useEffect(() => {
    const pageName = localStorage.getItem('initialPage') || DEFAULT_PAGE;
    setSelectedOption(pageName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSelectChange, handleReset]);



  return (
    <Card>
      <List sx={{ width: '100%', }}>
        <ListItem sx={{ bgcolor: 'background.paper' }}>
          <ListItemText primary={<Typography fontSize={'1.1rem'} fontWeight='bold'>Startup page</Typography>} />
        </ListItem>
        <Divider/>
        <SettingItem
          label='初期画面選択'
          labelButton='修正'
          description=''
          type='select'
          onChangeSelect={handleSelectChange}
          value={selectedOption}
          options={MainMenuItems
            .filter(menuItem => !['---', ].includes(menuItem.label)) // 除外ページ
            .map((menuItem) => ({
              value: menuItem.to || '',
              label: menuItem.label
            }))
          }
        />

        <SettingItem
          label='初期設定に戻す'
          labelButton='初期化'
          description='Record画面の設定に戻す'
          type='button'
          onClick={handleReset}
        />
      </List>
    </Card>

  );
};

export default SettingsPage;


