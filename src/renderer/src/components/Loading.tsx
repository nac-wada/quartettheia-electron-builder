// src/components/calibration/common/Loading.tsx
// import React from "react";
import {
  Typography,
  CircularProgress,
} from "@mui/material";


const Loading = () => {
  return (
    <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
          textAlign: 'center',
          padding: '20px',
          animation: 'blink 1s infinite'
        }}
      >
          <Typography sx={{ display: 'flex', justifyContent: 'center'}}>
            <CircularProgress size={40} sx={{color:"grey"}}/>
          </Typography>
      </div>
  );
}

export default Loading;
