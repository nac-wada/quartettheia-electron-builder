// src/components/cardVideo/iconButtonMini/Online.tsx
import React, { useState, useEffect } from 'react';
import { Box, Checkbox } from '@mui/material';
import CloudQueue from '@mui/icons-material/CloudQueue';
import CloudOff from '@mui/icons-material/CloudOff';
import { Transport } from '@connectrpc/connect';
import { EventType, SubscribeEventResponse } from '../../../../../gen/solo/v1/solo_pb';
import { useSoloSubscribeEventListener } from '../../../../../globalContexts/SoloSubscribeEventContext';
import { useQueryCheckInternetConnection } from '../../../../../hooks/useCustomQuery';

const Online: React.FC<{ transport: Transport, ipv4Addr: string }> = ({ transport, ipv4Addr }) => {
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ isOnline, setIsOnline ] = useState<boolean>(false);
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener()
  const checkInternetConnection = useQueryCheckInternetConnection({ transport, ipv4Addr })

  useEffect(() => {
    const listener = (event: SubscribeEventResponse) => {
      switch(event.type) {
        case EventType["NETWORK_INTERNET_CONNECTED"]:
          setIsOnline(true)
          break;
        case EventType["NETWORK_INTERNET_DISCONNECTED"]:
          setIsOnline(false)
          break;
      }
    } 

    const unsubscribe = subscribeSoloEventListener(ipv4Addr, listener)

    return () => unsubscribe()
  }, [subscribeSoloEventListener]);

  useEffect(() => {
    if(checkInternetConnection.isFetched) {
      const res = checkInternetConnection.data;
      if(res) {
        if(res.connected) {
          setIsOnline(true)
        } 
        else {
          setIsOnline(false)
        }
      }
      setLoading(false)
    }
  },[checkInternetConnection.data, checkInternetConnection.isFetched])

  return (
    <Box title={isOnline ? 'クラウド接続' : 'オフライン'} sx={{ mr: "0.2rem" }}>
      <Checkbox
        checked={isOnline}
        icon={ // isOnline === falseの時
          <CloudOff sx={{ color: loading ? 'text.disabled' : 'error.main' }} />
        }
        checkedIcon={ // isOnline === trueの時
          <CloudQueue sx={{ color: 'primary.main' }} />
        }
        size='small'
        sx={{
          opacity: 1,
          color: 'text.secondary',
          padding: '0.2rem',
          mr: "0.2rem",
          pointerEvents: 'none', // マウスホバーを通常アイコン&クリック感&Tooltipの機能をなくす
        }}
      />
    </Box>
  );
};

export default Online;
