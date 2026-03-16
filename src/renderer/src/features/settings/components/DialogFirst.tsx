// src/components/settings/dialog/DialogFirst.tsx
import React, { useEffect } from 'react';
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
  handleOpenConfirm: () => void;
  disabledOpen?: boolean;
  title: string;
  content1?: string;
  content2?: any;
  buttonLeft?: string;
  buttonRight?: string;
}

const DialogComponent: React.FC<Props> = ({
  open,
  handleClose,
  handleOpenConfirm,
  disabledOpen=false,
  title,
  content1,
  content2,
  buttonLeft='閉じる',
  buttonRight='はい',
}) => {

  return (
    <Dialog open={open} onClose={handleClose} sx={{ minWidth: '400px', m: '0 auto' }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ fontSize: '0.9rem' }}>
        {content1 && (
          <DialogContentText sx={{ fontSize: '0.9rem' }}>
            {content1.split('<br />').map((line, index, array) => (
              <React.Fragment key={index}>
                {line}
                {index !== array.length - 1 && <br />} {/* 最後の行以外は <br /> を追加 */}
              </React.Fragment>
            ))}
          </DialogContentText>
        )}
        {content2 && content2}
      </DialogContent>
      <DialogActions>
        <Button tabIndex={-1} onClick={handleClose} color='error'>
          {buttonLeft}
        </Button>
        <Button onClick={handleOpenConfirm} color='primary' disabled={disabledOpen}>
          {buttonRight}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;


