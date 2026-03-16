import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, LinearProgress, OutlinedInput, Typography } from "@mui/material";
import { FC, memo, useState } from "react";

export const PasswordForm: FC<{ 
  connect: any, closeForm: any, ssid: string, 
  isConnecting: boolean,
 }> = memo(
  ({ connect, ssid, closeForm, isConnecting }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("")

  const onBlur = (event: React.FocusEvent<HTMLInputElement>,) => {
    let value = event.target.value;
    setPassword(value);
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      let e = event as unknown as React.ChangeEvent<HTMLInputElement>;
      let value = e.target.value;
      setPassword(value);
      connect(ssid, value)
    }
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div style={{ margin: "0.5rem" }}>
    {
      isConnecting ?
      <div style={{ margin:1 }}>
        <LinearProgress color="primary" sx={{ mx: 2}}/>
      </div> :
      <>
        <div>
          <FormControl
            size="small"
            sx={{
              px:1,
              width: '100%',
              borderRadius:0,
            }}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-password">パスワード</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              label="パスワード"
              defaultValue={password}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                  </IconButton>
                </InputAdornment>
              }
            />

          </FormControl>
        </div>
        <div>
          <Button sx={{color: "text.secondary",fontWeight: "normal", width: 90, height: 30, mx: 0.5, my:1 }} onClick={() => closeForm(false)}>キャンセル</Button>
          <Button color="primary" sx={{ fontWeight: "normal", width: 90, height: 30, my:1, mr: 0.5 }} onClick={() => connect(password)}>接続</Button>
        </div>
      </>
    }
    </div>
  )
})