// GettingStartedPage.tsx : 表示用ページ
import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function GettingStartedPage() {
  return (
    <React.Fragment>
      <Button component={Link} to="/login" variant="contained" color="primary" style={{width: '15rem',}}>
        ログインページ
      </Button>

    </React.Fragment>
  );
}
