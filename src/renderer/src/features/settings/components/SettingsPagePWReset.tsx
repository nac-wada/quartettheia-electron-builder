import React, { useState, } from 'react';
import DialogComponent from './DialogFirst';
import ConfirmationDialogComponent from './DialogConfirmation';
import ResultDialogComponent from './DialogResult';
import { useAuth } from '../../../globalContexts/AuthContext';
import { quartetSetWebAppLoginAccount } from '../../../api/quartetAPI';
import { IconButton, InputAdornment, TextField, Typography, useTheme } from '@mui/material';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import { loadEncryptFromLocalStorage, saveEncryptToLocalStorage } from '../../../utilities/localStorage';
import { DEFAULT_PASSWORD, KeySavedCamerId, KeySavedPassword } from '../../../types/common';
import { createWebAppLoginEncryptTexts } from '../../../utilities/encryptPassword';



export default function SettingsPagePWReset({
  firstDialogOpen,
  setFirstDialogOpen
}: {
  firstDialogOpen: boolean;
  setFirstDialogOpen: (open: boolean) => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [secondDialogOpen, setSecondDialogOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const { setNotPassword } = useAuth();
  const theme = useTheme();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  
  const handleOpenConfirm = () => {
    setSecondDialogOpen(true);
  };

  const handleOpenResult = async () => {
    try {
      const savedCameraId = loadEncryptFromLocalStorage(KeySavedCamerId, '');

      const encrypts = await createWebAppLoginEncryptTexts({ name: username, oldPassword: password, newPassword: DEFAULT_PASSWORD });

      if(encrypts) {
        const isChanged = await quartetSetWebAppLoginAccount({ name: encrypts.name, oldPassword: encrypts.oldPassword, newPassword: encrypts.newPassword });

        if(isChanged) {
          if(isChanged.success) {
            saveEncryptToLocalStorage(KeySavedCamerId, savedCameraId as string);
            saveEncryptToLocalStorage(KeySavedPassword, DEFAULT_PASSWORD as string);
            setSuccess(true);

            // password未設定か判定
            const savedPassword2 = loadEncryptFromLocalStorage(KeySavedPassword, '');
            if (savedPassword2 === DEFAULT_PASSWORD) {
              setNotPassword(true);
            } else {
              setNotPassword(false);
            }
            setTimeout(() => { handleCloseFirstDialog() },1000)
          }
        } else {
          setSuccess(false);
        }
      } else {
        setSuccess(false);
      }
      handleCloseSecondDialog();
      setResultDialogOpen(true);
    } catch (error) {
      handleCloseResultDialog();
      console.error('パスワードの初期化に失敗しました:', error);
    }
  };

  const handleCloseFirstDialog = () => {
    setFirstDialogOpen(false);
  };

  const handleCloseSecondDialog = () => {
    setSecondDialogOpen(false);
  };

  const handleCloseResultDialog = () => {
    handleCloseSecondDialog();
    setResultDialogOpen(false);
  };

  return (
    <>
      <DialogComponent
        open={firstDialogOpen}
        disabledOpen={username === ''}
        handleClose={handleCloseFirstDialog}
        handleOpenConfirm={handleOpenConfirm}
        title='パスワードの初期化'
        //content1='パスワードを変更しますか？<br />初期化するとカメラに記載されたパスワードに変更されます'
        content1='ユーザー名、パスワードを入力してください。'
        content2={
          <>
            {[{label: 'ユーザー名', value: username, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)},
              {label: 'パスワード', value: password, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)},
            ].map((item, index) => (
              <TextField
                key={index}
                color='primary'
                variant='standard'
                margin='normal'
                fullWidth
                label={item.label}
                type={item.label === 'ユーザー名' ? 'text' : (showPassword ? 'text' : 'password')}
                value={item.value}
                onChange={item.onChange}
                InputLabelProps={{ shrink: true, }} // labelを左上に小さく固定
                InputProps={
                  item.label === 'ユーザー名'
                  ? {}
                  : {endAdornment: (
                    <InputAdornment position='end' sx={{marginRight: '1rem'}} >
                      <IconButton
                        tabIndex={-1}
                        onClick={togglePasswordVisibility}
                        onMouseDown={(e) => {e.preventDefault();}}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOffOutlined color={'disabled'} /> : <VisibilityOutlined color={'disabled'} />}
                      </IconButton>
                    </InputAdornment>
                  ),}
                }
                sx={{ width: '100%', mb: theme.spacing(2), }}
              />
            ))}

            {warnings.map((warning, index) => (
              <Typography key={index} variant='body2' color='error' fontSize={'0.8rem'}>
                {warning}
              </Typography>
            ))}

          </>
        }
        buttonRight="適用"
      />
      <ConfirmationDialogComponent
        open={secondDialogOpen}
        handleClose={handleCloseSecondDialog}
        handleOpenResult={handleOpenResult}
        title='確認'
        content='本当にパスワードを初期化しますか？'
      />
      <ResultDialogComponent
        open={resultDialogOpen}
        handleClose={handleCloseResultDialog}
        content1={success ? 'パスワードを初期化しました' : 'パスワードの初期化に失敗しました'}
      />

    </>
  );
};



