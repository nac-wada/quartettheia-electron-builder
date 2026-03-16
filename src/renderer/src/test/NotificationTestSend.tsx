// src/components/debug/NotificationTestSend.tsx
import React, { useState } from 'react';
import {
  Stack,
  Box,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { createConnectTransport } from '@connectrpc/connect-web';
import { createClient } from '@connectrpc/connect';
import { QuartetService } from '../gen/quartet/v1/quartet_pb';
import { QuartetBaseUrl } from '../types/common';


const NotificationTestSend: React.FC = () => {
  const [inputValues, setInputValues] = useState<{
    type: number;
    header: string;
    data: string;
  }>({
    type: 6,
    header: 'no-header',
    data: 'no-data',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setInputValues(prevState => ({
      ...prevState,
      [key]: event.target.value,
    }));
  };

  const handleSendClick = async () => {
    console.log('Send(handleSendClick):', inputValues);
    try {
      const quartetTransport = createConnectTransport({
        baseUrl: QuartetBaseUrl
      });

      const quartetClient = createClient(QuartetService, quartetTransport);
      const res = await quartetClient.broadcastMessage({
        type: inputValues.type,
        header: inputValues.header,
        data: inputValues.data,
      });

      if (res.success) {
        console.log('Result Sent:', res.success, inputValues);
      } else {
        console.error('Result Sent:', res.success);
      }

    } catch (error) {
      console.error('Sent:', 'エラーが発生しました', error);
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography>通知APIによる送信テスト</Typography>
      </AccordionSummary>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='flex-start'
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          px: '1.5rem',
          py: '0.5rem',
        }}
      >
        <Stack sx={{ flex: 1, marginBottom: 4, marginRight: 4 }} direction='column' spacing={2}>
          <Stack direction='column' spacing={2} sx={{ justifyContent: 'flex-end' }}>

            <FormControl variant='standard' sx={{ m: 1, }}>
              <InputLabel id='textField_test_type_label'>type</InputLabel>
              <Select
                id='textField_test_type'
                labelId='textField_test_type_label'
                variant='standard'
                value={inputValues.type}
                label='type'
                onChange={(e: any) => handleInputChange(e, 'type')}
              >
                <MenuItem value={0}>MESSAGE_TYPE_UNSPECIFIED</MenuItem>
                <MenuItem value={1}>MESSAGE_TYPE_EMERGENCY</MenuItem>
                <MenuItem value={2}>MESSAGE_TYPE_ALERT</MenuItem>
                <MenuItem value={3}>MESSAGE_TYPE_CRITICAL</MenuItem>
                <MenuItem value={4}>MESSAGE_TYPE_ERROR</MenuItem>
                <MenuItem value={5}>MESSAGE_TYPE_WARNING</MenuItem>
                <MenuItem value={6}>MESSAGE_TYPE_NOTICE</MenuItem>
                <MenuItem value={7}>MESSAGE_TYPE_INFO</MenuItem>
                <MenuItem value={8}>MESSAGE_TYPE_DEBUG</MenuItem>
              </Select>
            </FormControl>

            <TextField
              id='textField_test_header'
              label='header'
              variant='standard'
              value={inputValues.header}
              onChange={(e: any) => handleInputChange(e, 'header')}
            />

            <TextField
              id='textField_test_data'
              label='data'
              variant='standard'
              value={inputValues.data}
              onChange={(e: any) => handleInputChange(e, 'data')}
            />
          </Stack>
        </Stack>

        <Box component='div' sx={{ alignSelf: 'flex-end', marginBottom: 4 }}>
          <Button variant='outlined' onClick={handleSendClick}>送信</Button>
        </Box>
      </Stack>
    </Accordion>
  );
};

export default NotificationTestSend;
