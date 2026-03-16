// src/components/login/LoginForm.tsx
import React, { useEffect, useState, } from 'react';
import {
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../../globalContexts/AuthContext';
import { DEFAULT_PAGE, KeySavedCamerId, KeySavedCheckbox, KeySavedPassword, DEFAULT_PASSWORD } from '../../../types/common';
import { quartetAuthenticateWebAppLoginAccount, quartetGetWebAppLoginAPIPublicKey } from '../../../api/quartetAPI';
import { loadEncryptFromLocalStorage, loadSettingsFromLocalStorage, saveEncryptToLocalStorage, saveSettingsToLocalStorage } from '../../../utilities/localStorage';
import { createWebAppLoginEncryptTexts, encryptPlainText } from '../../../utilities/encryptPassword';

export default function LoginForm() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false); // インジケータ表示用
  const [loginResult, setLoginResult] = useState(''); // ログイン結果 成功or失敗
  
  const savedCameraId = loadEncryptFromLocalStorage(KeySavedCamerId, '');
  const savedPassword = loadEncryptFromLocalStorage(KeySavedPassword, '');
  const savedCheckbox = loadSettingsFromLocalStorage(KeySavedCheckbox, false);

  const [cameraId, setCameraId] = useState(savedCameraId);
  const [password, setPassword] = useState(savedPassword);
  const [checkboxIdPassword, setCheckboxIdPassword] = useState(savedCheckbox);

  const { isLoggedIn, login, logout, setNotPassword } = useAuth();
  const navigate = useNavigate();
  const initialPage = localStorage.getItem('initialPage') || DEFAULT_PAGE;
  const currentPath = useLocation().pathname;

  // flag, password visibility
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCheckboxChange = (isChecked: boolean) => {
    setCheckboxIdPassword(isChecked);
    saveSettingsToLocalStorage(KeySavedCheckbox, isChecked);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const inputCameraId = data.get('cameraId');
    const inputPassword = data.get('password');

    // Update
    setCameraId(inputCameraId as string);
    setPassword(inputPassword as string);

    //// for debug
    //console.log('handleSubmit',{
    //  cameraId: inputCameraId,
    //  password: inputPassword,
    //});
  };


  // loading(logging) settings
  const [isLoginEnabled, setIsLoginEnabled] = useState(false);
  useEffect(() => {
    if (cameraId) {
      setIsLoginEnabled(true);
    } else {
      setIsLoginEnabled(false);
    }
  }, [cameraId]);


  const handleLogin = async () => {
    setIsLoading(true);
    const encrypts = await createWebAppLoginEncryptTexts({ cameraId: cameraId, password: password || "" });
    if(!encrypts) {
      setLoginResult('Invalid ID or password');

      // ログイン成功後、0.3秒後にisLoadingをfalseにする
      setTimeout(() => {
        setIsLoading(false);
      }, 300);

      return
    } 

    const res = await quartetAuthenticateWebAppLoginAccount({ name: encrypts.cameraId, password: encrypts.password })

    if (res && currentPath === '/login'){
      if (checkboxIdPassword) {
        // Save
        saveEncryptToLocalStorage(KeySavedCamerId, cameraId as string);
        saveEncryptToLocalStorage(KeySavedPassword, password as string);
        saveSettingsToLocalStorage(KeySavedCheckbox, true);
      } else {
        // Clear
        saveEncryptToLocalStorage(KeySavedCamerId, '');
        saveEncryptToLocalStorage(KeySavedPassword, '');
        saveSettingsToLocalStorage(KeySavedCheckbox, false);
      }

      // password未設定か判定
      if (password === DEFAULT_PASSWORD) {
        setNotPassword(true);
      } else {
        setNotPassword(false);
      }

      setLoginResult('Login successful'); // ログイン成功メッセージ(flag)
      login();
      navigate(initialPage);

    } else if (res === false){
      setLoginResult('Invalid ID or password');

      // ログイン成功後、0.3秒後にisLoadingをfalseにする
      setTimeout(() => {
        setIsLoading(false);
      }, 300);

    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <TextField
        color='primary'
        variant='standard'
        margin='normal'
        fullWidth
        id='cameraId'
        name='cameraId'
        value={cameraId}
        onChange={(e) => setCameraId(e.target.value)}
        autoComplete='cameraId'
        autoFocus
        InputProps={{  }}
        InputLabelProps={{ shrink: true, }} // labelを左上に小さく固定
        label='ユーザー名'
        style={{ width: '100%', marginBottom: theme.spacing(2), }}
        error={loginResult === 'Invalid ID or password'}
      />
      <TextField
        color='primary'
        variant='standard'
        margin='normal'
        fullWidth
        name='password'
        type={showPassword ? 'text' : 'password'}
        id='password'
        value={password}
        onChange={(e) => {setPassword(e.target.value); }}
        autoComplete='current-password'
        InputLabelProps={{
          shrink: true,
        }}
        label='パスワード'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end' sx={{ marginRight: '1rem' }}>
              <IconButton
                tabIndex={-1}
                onClick={togglePasswordVisibility}
                onMouseDown={(e) => { e.preventDefault(); }}
                edge='end'
              >
                {showPassword ? <VisibilityOffOutlined color={'disabled'} /> : <VisibilityOutlined color={'disabled'} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        style={{ width: '100%', marginBottom: theme.spacing(2), }}
        error={loginResult === 'Invalid ID or password'}
      />

      <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControlLabel
          label={
            <Typography variant='body2' color='textSecondary' fontSize={'0.8rem'}>
              次回から自動ログインする
            </Typography>
          }
          control={
            <Checkbox
              name='checkboxIdPassword'
              size='small'
              checked={checkboxIdPassword}
              onChange={ (e) => {handleCheckboxChange(e.target.checked)} }
            />
          }
        />

        {/*<Link
          sx={{
            textDecoration: 'none',
            cursor: 'pointer'
          }}
          onClick={onResetPasswordDialogOpen}
        >
          <Typography variant='body2' color='textSecondary' fontSize={'0.8rem'} marginTop={0}>
            パスワード初期化
          </Typography>
        </Link>*/}

      </Grid>

      <Button
        type='submit'
        fullWidth
        variant='contained'
        color={(loginResult === 'Invalid ID or password') ? 'error' : 'primary'}
        sx={{ margin: theme.spacing(3, 0, 3), }}
        onClick={handleLogin}
        disabled={!isLoginEnabled || isLoading} // インジケータ表示中はボタンを無効化
      >
        {isLoading ? 'ログイン中...' : 'ログイン'}
      </Button>

      {/*<Divider />

      <Link
        sx={{
          textDecoration: 'none',
          cursor: 'pointer'
        }}
        onClick={onChangePasswordDialogOpen}
      >
        <Typography variant='body2' color='textSecondary' fontSize={'0.8rem'} marginTop={'1rem'} textAlign='center'>
          パスワード変更
        </Typography>
      </Link>*/}

    </form>
  );
}
