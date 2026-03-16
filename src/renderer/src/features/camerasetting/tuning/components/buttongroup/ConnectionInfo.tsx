// src/components/cardVideo/iconButtonMini/ConnectionInfo.tsx
import {
  Box,
  Checkbox,
} from '@mui/material';
import Wifi from '@mui/icons-material/Wifi';
import LanIcon from '@mui/icons-material/Lan';

const ConnectionInfo: React.FC<{
  index: number;
  setModal: any;
  netWorkInterface: string;
}> = ({ netWorkInterface, index, setModal }) => {
  
  return (
    <Box sx={{ mr: "0.2rem" }}>
      <Checkbox
        title={ netWorkInterface === 'eth0' ? 'LANケーブル接続' : 'Wi-Fi' }
        checked={netWorkInterface === 'wlan0'}
        icon={<LanIcon sx={{ color: 'primary.main' }}/>}
        checkedIcon={
          <Wifi sx={{ color: 'primary.main' }} />
        }
        size='small'
        sx={{
          opacity: 1,
          color: 'text.secondary',
          padding: "0.2rem",
          mr: "0.2rem",
        }}
        onClick={() => setModal({ index, type: "network" })}
      />
    </Box>
  );
}

export default ConnectionInfo;
