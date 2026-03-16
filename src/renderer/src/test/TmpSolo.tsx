// TmpSolo.tsx : コンポーネント用
//import React from 'react';
import Gamma from './Gamma';
import Gain from './Gain';
import Exposure from './Exposure';
import RecControlTest from './RecControlTest';

import Live from './Live';
import PowerControlTest from './PowerControlTest';
import { Box } from '@mui/material';
import { Hostname } from '../types/common';
const downloadBaseUrl = `http://${Hostname}:9090`;
const sigBaseUrl = `http://${Hostname}:49555`;
const camfrontBaseUrl = `http://${Hostname}:50052`;
const soloBaseUrl = `http://${Hostname}:49555`;

export default function TmpSolo() {
  return (
    <Box
      sx={{
        //backgroundColor:"#2C3E50",
        //width:"100%",
        mt: 3,
      }}
      component="div"
    >
      <h1>Solo-UI</h1>
      <p><Live sigurl={sigBaseUrl} /></p>
      <p><RecControlTest solourl={soloBaseUrl} downloadurl={downloadBaseUrl} /></p>
      <p><Gamma camfronturl={camfrontBaseUrl} /></p>
      <p><Gain camfronturl={camfrontBaseUrl} /></p>
      <p><Exposure camfronturl={camfrontBaseUrl} /></p>
      <p><PowerControlTest camfronturl={camfrontBaseUrl} /></p>
    </Box>
  );
}
