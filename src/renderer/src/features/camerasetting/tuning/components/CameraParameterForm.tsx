// src/card/index.tsx
import React, {  } from 'react';
import {
  Box,
  Divider,
} from '@mui/material';
import { Transport } from '@connectrpc/connect';
import { ExposureForm } from './tuningform/ExposureForm';
import { GainForm } from './tuningform/GainForm';
import { GammaForm } from './tuningform/GammaForm';
import { WhiteBalanceForm } from './tuningform/WhiteBalanceForm';

export const CameraParameterForm: React.FC<{
  ipv4Addr: string, transport: Transport
}> = ({ ipv4Addr, transport }) => {
  return (
    <Box sx={{ p: "0 10px" }} >
      <Box sx={{ p: "0 0 5px" }} >
        <ExposureForm transport={transport} ipv4Addr={ipv4Addr}/>
        <GainForm transport={transport} ipv4Addr={ipv4Addr} />
        <GammaForm transport={transport} ipv4Addr={ipv4Addr}/>
      </Box>

      <Divider />

      <Box sx={{ p: "5px 0" }} >
        <WhiteBalanceForm transport={transport} ipv4Addr={ipv4Addr}/>
      </Box>
    </Box>
  );
};