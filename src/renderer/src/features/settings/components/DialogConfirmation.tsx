// src/components/settings/dialog/DialogConfirmation.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleOpenResult: () => void;
  title: string;
  content: string;
}

const ConfirmationDialogComponent: React.FC<Props> = ({ open, handleClose, handleOpenResult, title, content }) => {
  return (
    <Dialog open={open} onClose={handleClose} sx={{ width: '445px', m: '0 auto' }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ fontSize: '0.9rem' }}>
        <DialogContentText sx={{ fontSize: '0.9rem' }}>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='error'>
          いいえ
        </Button>
        <Button onClick={handleOpenResult} color='primary'>
          はい
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialogComponent;


