// src/components/settings/dialog/DialogResult.tsx
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
} from '@mui/material';

interface Props {
  open: boolean;
  handleClose: () => void;
  content1?: string;
  content2?: any;
  timeout?: number;
}

const ExecutionDialogComponent: React.FC<Props> = ({ open, handleClose, content1='実行が完了しました', content2, timeout=1500 }) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      timer = setTimeout(() => {
        handleClose();
      }, timeout);
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, handleClose]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        {content1 && <DialogContentText sx={{ fontSize: '0.9rem' }}>{content1}</DialogContentText>}
        {content2 && {content2}}
      </DialogContent>
    </Dialog>
  );
};

export default ExecutionDialogComponent;



