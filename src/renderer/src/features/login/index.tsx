// src/components/login/index.tsx
import React, { useEffect, useState, } from 'react';
import {
  Button,
  Typography,
} from '@mui/material';
import {
} from '@mui/icons-material';
import { useNavigate, } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../globalContexts/AuthContext';
import LoginForm from './components/LoginForm'
import { DEFAULT_PAGE, DEBUG } from '../../types/common';
import { AIREALTOUCHIcon } from '../appmenu/components/AIREALIcon';

export default function Login() {
  const { isProtectEnable, isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate();
  const initialPage = localStorage.getItem('initialPage') || DEFAULT_PAGE;
  const theme = useTheme();
  const paperStyle: React.CSSProperties = {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    backgroundColor: theme.palette.background.default,
    width: "400px"
  };

  useEffect(() => {
    // ログイン機能が無効な場合は、ログイン画面を表示せずにリダイレクト
    if (isProtectEnable===false) {
      navigate("/recordview", { replace: true });
      return;
    }

    // ログイン機能が有効 かつ すでにログイン済みでここに来た場合
    if (isLoggedIn) {
      logout();
      // logoutを実行すると isLoggedIn が false になり、再レンダリングされてログイン画面に留まる
    }
  }, [isProtectEnable, isLoggedIn, logout, navigate]);

  // for debug
  const handleForceLogin = () => {
    login();
    navigate(initialPage);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", height: "100%"}}>
      <div style={paperStyle}>
        <AIREALTOUCHIcon style={{width:150,height:150}}/>

        <Typography component='h5' sx={{ fontFamily: 'Roboto', fontSize: '0.9rem', marginBottom: theme.spacing(0.5), }}>
          AIREALカメラの操作アプリです。
          <br/>
          ユーザー名には「admin」と入力し、本アプリで設定したパスワードを
          入力して、ログインボタンを押してください。
        </Typography>

        <LoginForm/>

      </div>

      { DEBUG && (
        <Typography variant='body2' fontSize={'0.7rem'} marginTop={'1rem'} textAlign='center' sx={{ color: theme.palette.action.selected }}>
          [デバック用メモ] id: admin, pass: nac555
          <Button onClick={handleForceLogin} sx={{variant: 'body2', margin: 0, padding: 0, color:theme.palette.action.selected, fontSize: '0.7rem', }} >
            カメラない時用の「ログインボタン」
          </Button>
        </Typography>
      )}
    </div>
  );
}
