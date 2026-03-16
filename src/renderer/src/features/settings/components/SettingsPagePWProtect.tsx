import { IconButton, InputAdornment, TextField, Typography, useTheme } from "@mui/material"
import DialogComponent from "./DialogFirst";
import { useCallback, useState } from "react";
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import React from "react";
import { quartetSetWebAppLoginAccountEnable } from "../../../api/quartetAPI";
import ResultDialogComponent from "./DialogResult";
import { createWebAppLoginEncryptTexts } from "../../../utilities/encryptPassword";
import { keyLoginAuth } from "../../../types/common";

// const PW_MIN_LEN = 0;
// const PW_MAX_LEN = 16;

const SettingsPagePWProtect = ({
  firstDialogOpen, 
  setFirstDialogOpen,
  isProtectEnable,
  setAppProtectEnable,
}:{
  firstDialogOpen: boolean;
  setFirstDialogOpen: React.Dispatch<React.SetStateAction<boolean>>; 
  isProtectEnable: boolean;
  setAppProtectEnable: (enable: boolean) => void;
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const theme = useTheme();
  // ----

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleCloseFirstDialog = () => {
    setFirstDialogOpen(false)
  }

  const handleOpenConfirm = useCallback(async () => {
    const encrypts = await createWebAppLoginEncryptTexts({ name: username, password: password });
    if(encrypts) {
      const res = await quartetSetWebAppLoginAccountEnable({ enable: !(isProtectEnable), name: encrypts.name, password: encrypts.password });
      if(res) {
        setAppProtectEnable(!(isProtectEnable))
        setFirstDialogOpen(false)
        if(isProtectEnable) {
          localStorage.removeItem(keyLoginAuth);
        } else {
          location.reload()
        }
      } else {
        setResultDialogOpen(true)
      }
    } else {
      setResultDialogOpen(true)
    }
  },[username, password, isProtectEnable])

  return (
    <>
      <DialogComponent
        key={"settingPagePWProtectPage"}
        open={firstDialogOpen}
        disabledOpen={username === ''}
        handleClose={handleCloseFirstDialog}
        handleOpenConfirm={handleOpenConfirm}
        title={isProtectEnable ? 'パスワード保護を解除' : 'パスワードで保護する'}
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

      <ResultDialogComponent
        open={resultDialogOpen}
        handleClose={() => { setResultDialogOpen(false) }}
        content1="ユーザー名またはパスワードが間違っています"
      />
    </>
  )
}

export { SettingsPagePWProtect }