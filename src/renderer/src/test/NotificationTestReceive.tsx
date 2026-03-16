// src/components/debug/NotificationTestReceive.tsx
import React, { useState, useEffect } from 'react';
import {
  Stack,
  TextField,
  Accordion,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { createConnectTransport } from '@connectrpc/connect-web';
import { createClient } from '@connectrpc/connect';
import { QuartetService } from '../gen/quartet/v1/quartet_pb';
import { QuartetBaseUrl } from '../types/common';


const NotificationTestReceive: React.FC = () => {
  const [inputValues, setInputValues] = useState<{
    type: number;
    header: string;
    data: string;
  }>({
    type: 0,
    header: '',
    data: '',
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const quartetTransport = createConnectTransport({
          baseUrl: QuartetBaseUrl
        });

        const quartetClient = createClient(QuartetService, quartetTransport);
        const resIterator = quartetClient.subscribeMessage({});

        // イテレータ経由で値にアクセス
        for await (const res of resIterator) {
          setInputValues({
            type: res.type,
            header: res.header,
            data: res.data,
          });

          console.log('Result Receive:', res, inputValues);
        }
      } catch (error) {
        console.error('Receive:', 'エラーが発生しました', error);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>受信内容</Typography>
        </AccordionSummary>
        {

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
            <Stack sx={{ flex: 1, marginBottom: 4, marginRight: 4 }} direction="column" spacing={2}>
              <Stack direction="column" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                <TextField
                  id='textField_test_type'
                  label='type'
                  variant='standard'
                  value={inputValues.type}
                />

                <TextField
                  id='textField_test_header'
                  label='header'
                  variant='standard'
                  value={inputValues.header}
                />

                <TextField
                  id='textField_test_data'
                  label='data'
                  variant='standard'
                  value={inputValues.data}
                />
              </Stack>
            </Stack>
          </Stack>

        }
      </Accordion>
    </>
  );
};

export default NotificationTestReceive;
