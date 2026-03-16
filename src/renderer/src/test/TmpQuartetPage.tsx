// TmpQuartet.tsx : 表示用ページ
import React from 'react';
import { Typography } from '@mui/material';
import TmpQuartet from './TmpQuartet'; // 移動するコンポーネント

export default function TmpQuartetPage() {
  return (
    <React.Fragment>
      {/*<Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' , justifyContent: 'center', alignItems: 'center'}}>*/}
      <section style={{ display: 'flex', flexDirection: 'column' , justifyContent: 'center', alignItems: 'center'}}>

        <Typography
          variant="h6"
          color= 'primary.main'
        >
          TmpQuartet Page
        </Typography>

        <TmpQuartet />

      </section>
      {/*</Paper>*/}
    </React.Fragment>
  );
}