// src/components/settings/SettingsPagePWChange.tsx
import React, { useState, } from 'react';
import {
  Typography,
  useTheme,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import DialogComponent from './DialogFirst';
import ConfirmationDialogComponent from './DialogConfirmation';
import ResultDialogComponent from './DialogResult';
import { useAuth } from '../../../globalContexts/AuthContext';
import { quartetGetWebAppLoginAPIPublicKey, quartetSetWebAppLoginAccount } from '../../../api/quartetAPI';
import { saveEncryptToLocalStorage } from '../../../utilities/localStorage';
import { DEFAULT_PASSWORD, KeySavedCamerId, KeySavedPassword } from '../../../types/common';
import { createWebAppLoginEncryptTexts } from '../../../utilities/encryptPassword';

const PW_MIN_LEN = 0;
const PW_MAX_LEN = 16;
const WARNING_COMMENT: string[] = [
  `文字数の制限は${PW_MIN_LEN}～${PW_MAX_LEN}文字です`,
  '記号は使用できません',
  '英字（小文字・大文字）、数字、空白のみ入力できます',
];

export default function SettingsPagePWChange({
  firstDialogOpen,
  setFirstDialogOpen
}:{
  firstDialogOpen: boolean;
  setFirstDialogOpen: (open: boolean) => void;
}) {
  const [secondDialogOpen, setSecondDialogOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const { setNotPassword } = useAuth();

  const [cameraId, setCameraId] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // const [unlimitedMode, setUnlimitedMode] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const theme = useTheme();

  // useEffect(() => {
  //   return () => {
  //     console.log("unmount component")
  //   }
  // },[])

  const handleOpenConfirm = () => {
    if ( newPassword.length < PW_MIN_LEN || newPassword.length > PW_MAX_LEN ) {
      console.log('最終チェック：文字数が範囲外です');
      if (!warnings.includes(WARNING_COMMENT[0])) {setWarnings((prevWarnings) => [...prevWarnings, WARNING_COMMENT[0]]);}
      return;

    } else if (
      /[!@#$%^&*(),.?":{}|<>`'\\\-=^~+;/_]/.test(newPassword)
    ) {
      console.log('最終チェック：記号は未対応です');
      if (!warnings.includes(WARNING_COMMENT[1])) {setWarnings((prevWarnings) => [...prevWarnings, WARNING_COMMENT[1]]);}
      return;

    } else {
      setWarnings([]);
    }
    setSecondDialogOpen(true);
  };

  const handleOpenResult = async () => {
    
    const encrypts = await createWebAppLoginEncryptTexts({ cameraId: cameraId, oldPassword: oldPassword, newPassword: newPassword });
    if(encrypts) {
      const isChanged = await quartetSetWebAppLoginAccount({ name: encrypts.cameraId, oldPassword: encrypts.oldPassword, newPassword: encrypts.newPassword });

      if(isChanged) {
        if(isChanged.success) {
          saveEncryptToLocalStorage(KeySavedCamerId, cameraId as string);
          saveEncryptToLocalStorage(KeySavedPassword, newPassword as string);
          setSuccess(true);

          // password未設定か判定
          if (newPassword === DEFAULT_PASSWORD) {
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
  };


  const handleCloseFirstDialog = () => {
    setFirstDialogOpen(false);
  };

  const handleCloseSecondDialog = () => {
    setSecondDialogOpen(false);
  };

  const handleCloseResultDialog = () => {
    setResultDialogOpen(false);
  };

  // ----

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handlePasswordReChange = (event: React.ChangeEvent<HTMLInputElement>, isConfirm: boolean, setPW: (value: React.SetStateAction<string>) => void, pw2: string) => {
    const password = event.target.value;
    setPW(password);

    if(isConfirm) {

      checkCorrectPassword(password, setPW, pw2)

    } else {
      if(pw2.length > 0) {
        checkCorrectPassword(password, setPW, pw2)
      }
    }
  };

  const checkCorrectPassword = ( password: string, setPW: (value: React.SetStateAction<string>) => void, pw2: string ) => {
    
    checkPasswordLength(password);

    checkIncludesIncorrectText(password);

    setPW((pre) => {
      if (pre !== pw2) {
        if (!warnings.includes('新しいパスワードと確認用パスワードが一致しません')) {
          setWarnings((prevWarnings) => [...prevWarnings, '新しいパスワードと確認用パスワードが一致しません']);
        }
      } else {
        setWarnings([]);
      }
      return pre;
    });
  }

  const checkPasswordLength = (password: string) => {
    if( password.length < PW_MIN_LEN || password.length > PW_MAX_LEN ) {
      if(!warnings.includes(WARNING_COMMENT[0])) {
        setWarnings((prev) => [...prev, WARNING_COMMENT[0]])
      } 
    } else {
      setWarnings((prev) => prev.filter(warning => warning !== WARNING_COMMENT[0]))
    }
  }

  const checkIncludesIncorrectText = (password: string) => {
    if (/[!@#$%^&*(),.?":{}|<>`'\\\-=^~+;/_]/.test(password)) {
      if (!warnings.includes(WARNING_COMMENT[1])) {setWarnings((prevWarnings) => [...prevWarnings, WARNING_COMMENT[1]]);}
    } else {
      setWarnings((prev) => prev.filter(warning => warning !== WARNING_COMMENT[1]))
    }
  }


  return (
    <>
      <DialogComponent
        open={firstDialogOpen}
        handleClose={handleCloseFirstDialog}
        handleOpenConfirm={handleOpenConfirm}
        disabledOpen={cameraId === '' || warnings.length > 0}
        buttonRight='適用'
        title='パスワードの変更'
        content1='新しいパスワードを、英字（小文字・大文字）・数字を1つ以上含み、最大16文字で入力してください。新しいパスワードは、必ず控えてください。'
        content2={
          <>
            {[{label: 'ユーザー名', value: cameraId, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCameraId(e.target.value)},
              {label: '現在のパスワード', value: oldPassword, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)},
              {
                label: '新しいパスワード', 
                value: newPassword, 
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => handlePasswordReChange(e, false, setNewPassword, confirmNewPassword),
                // onBlur: (e: React.FocusEvent<HTMLInputElement>) => handleOnBlur(false, e, setConfirmNewPassword, newPassword), 
                // onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleOnKeyDown(false, e, setConfirmNewPassword, newPassword),
              },
              {
                label: '新しいパスワードの確認', 
                value: confirmNewPassword, 
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => handlePasswordReChange(e, true, setConfirmNewPassword, newPassword),
                // onBlur: (e: React.FocusEvent<HTMLInputElement>) => handleOnBlur(true, e, setConfirmNewPassword, newPassword), 
                // onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleOnKeyDown(true, e, setConfirmNewPassword, newPassword), 
              }
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
      />

      <ConfirmationDialogComponent
        open={secondDialogOpen}
        handleClose={handleCloseSecondDialog}
        handleOpenResult={handleOpenResult}
        title='確認'
        content='本当にパスワードを変更しますか？'
      />

      <ResultDialogComponent
        open={resultDialogOpen}
        handleClose={handleCloseResultDialog}
        content1={success ? 'パスワードを変更しました' : 'パスワードの変更に失敗しました'}
      />

    </>
  );
};




