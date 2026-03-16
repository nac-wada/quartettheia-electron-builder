// src/components/tuning/MasterCamera.tsx
import React from 'react';
import {
  Box,
  IconButton,
} from '@mui/material';


const MasterCamera: React.FC<{
  index: number,
  setModal: any,
  primary: boolean;
}> = ({ primary, index, setModal }) => {

  return (
    <Box sx={{ mr: "0.2rem" }}>
      <IconButton
        title={primary ? '親機カメラ' : '子機カメラ'}
        size='small'
        sx={{
          opacity: 1,
          color: 'text.secondary',
          width: '26.38px',
          height: '26.38px',
          padding: "0.2rem",
          mr: "0.2rem",
        }}
        onClick={() => setModal({ index, type: "cameraSync" })}
      >
        { primary
          ? <img src='favicon.ico' alt='App Icon' style={{ width: "24px", height: "24px" }}/>
          : <img src='favicon_gray.ico' alt='App Icon' style={{ width: "24px", height: "24px" }}/>
        }
      </IconButton>
    </Box> 
  );
}

export { MasterCamera };
