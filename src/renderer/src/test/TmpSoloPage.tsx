// TmpSoloPage.tsx : 表示用ページ
import React from 'react';
import { Typography } from '@mui/material';
import TmpSolo from './TmpSolo'; // 移動するコンポーネント

export default function TmpSoloPage() {
  return (
    <React.Fragment>
      {/*<Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' , justifyContent: 'center', alignItems: 'center'}}>*/}
      <section style={{ display: 'flex', flexDirection: 'column' , justifyContent: 'center', alignItems: 'center'}}>

        <Typography
          variant="h6"
          color= 'primary.main'
        >
          TmpSolo Page
        </Typography>

        <TmpSolo />

      </section>
      {/*</Paper>*/}
    </React.Fragment>
  );
}