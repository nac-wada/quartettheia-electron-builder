// Copyright.tsx : 一番下のリンク
// import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.disabled" align="center" {...props} >
      {'© '}
      {'2025'}
      {' '}
      <Link 
        color="inherit" 
        href="https://www.nacinc.jp/"
        target="_blank"               // 新しいタブで開く
        rel="noopener noreferrer"     // セキュリティ対策
      >
        nac Image Technology Inc.
      </Link>
    </Typography>
  );
}

export default Copyright;