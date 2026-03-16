// TestPage.tsx : 表示用ページ
import React, {  } from 'react';
import { Typography, Paper } from '@mui/material';
// import TmpTest from '../components/sample/TmpTest'; // 移動するコンポーネント
import Tmpi18n from './Tmpi18n'; // 移動するコンポーネント


export default function TmpTestPage() {

  return (
    <React.Fragment>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>

        <Typography
          variant="h6"
          color= 'primary.main'
        >
          TmpTest Page
        </Typography>

        {/*<TmpTest />*/}
        <Tmpi18n />

      </Paper>


    </React.Fragment>
  );
}