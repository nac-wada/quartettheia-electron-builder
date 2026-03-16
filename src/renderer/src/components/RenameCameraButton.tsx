import React, { useMemo, useState, } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton } from "@mui/material";
import Edit from '@mui/icons-material/Edit';
import { useDevices } from '../globalContexts/DeviceContext';
import { RecordingKeyStatus } from '../gen/quartet/v1/quartet_pb';
import { soloSetCameraNickname } from '../api/soloAPI';
import { Transport } from '@connectrpc/connect';

type RenameCameraButtonProps = {
  ipv4Addr: string;
  transport: Transport;
  nickname: string;
};

const RenameCameraButton: React.FC<RenameCameraButtonProps> = ({ ipv4Addr, transport, nickname }) => {
  const { setDevices, airealTouchRecording } = useDevices();

  const [isDialogOpenRename, setIsDialogOpenRename] = useState(false);
  const [newNickName, setNewNickName] = useState<string>('');

  const handleDialogOpen = () => {
    setIsDialogOpenRename(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpenRename(false);
  };

  const handleConfirmRename = async () => {
    if(newNickName !== '') {
      const res = await soloSetCameraNickname({ transport, newValue: newNickName })

      if(res) {
        setDevices((prev) => prev.map((prevDevice) => (
          prevDevice.ipv4Addr === ipv4Addr ?
          {
            ...prevDevice,
            nickname: newNickName
          }: prevDevice
        )))

        handleDialogClose()
      } 
    }
  }

  let disabled = useMemo(() => {
    if(
      airealTouchRecording===RecordingKeyStatus.RESERVED || 
      airealTouchRecording===RecordingKeyStatus.RECORDING || 
      airealTouchRecording===RecordingKeyStatus.RECORDED
    ) {
      return true
    } 
    else {
      return false
    }
  },[airealTouchRecording])

  return (
    <>
      <IconButton
        title={"カメラ名変更"}
        disabled={disabled}
        onClick={handleDialogOpen}
        sx={{
          width: "19px", height: "19px",
          fontSize: '15px',
          ml: "0.2rem",
          color: 'primary.main',
        }}
      >
        <Edit fontSize='inherit' />
      </IconButton>

      <Dialog 
        open={isDialogOpenRename} 
        onClose={handleDialogClose} 
        sx={{
          '& .MuiDialog-paper': {
            minWidth: '300px',
          }
        }}
      >
        <DialogTitle>名前の変更</DialogTitle>
        <DialogContent>
        <TextField
          autoFocus
          color='primary'
          variant='standard'
          margin='normal'
          fullWidth
          label={nickname}
          type="text"
          value={newNickName}
          onChange={(e) => setNewNickName(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleConfirmRename();
            }
          }}
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="inherit">
            キャンセル
          </Button>
          <Button onClick={handleConfirmRename} color="primary" disabled={newNickName.length === 0}>
            変更
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RenameCameraButton;
