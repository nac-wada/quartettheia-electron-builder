// src/components/login/dialog.tsx
//import react, { } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
} from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { useAuth } from '../../../globalContexts/AuthContext';
import { keyLoginAuth } from '../../../types/common';

export default function DialogLogout({
  isDialogOpen,
  setDialogOpen,
}: {
  isDialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth()
  const MESSAGE = "アプリからログアウトしますか？";
  const REDIRECT_URL = "/login";

  // 閉じる時の処理
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // ログアウト画面に移動
  const handleLogout = () => {
    logout()
    closeDialog();
    localStorage.removeItem(keyLoginAuth)
    // Redirect to the "/login" page
    navigate(REDIRECT_URL);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Dialog
          open={isDialogOpen}
          onClose={closeDialog}
        >
          <DialogContent>
            <DialogContentText>{MESSAGE}</DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={closeDialog}
              color="primary"
            >
              いいえ
            </Button>
            <Button
              onClick={handleLogout}
              color="error"
            >
              はい
            </Button>
          </DialogActions>

        </Dialog>
      </ThemeProvider>
    </>
  );
}

