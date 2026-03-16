import React, { useState, useEffect } from 'react';
import {
  Box,
  Checkbox,
} from '@mui/material';
import Cameraswitch from '@mui/icons-material/Cameraswitch';
import { ImageFlipMode, EventType, SubscribeEventResponse } from '../../../../../gen/solo/v1/solo_pb'; // mode, typeの種類
import { Transport } from '@connectrpc/connect';
import { useSoloSubscribeEventListener } from '../../../../../globalContexts/SoloSubscribeEventContext';
import { soloGetCameraImageFlipping, soloSetCameraImageFlipping } from '../../../../../api/soloAPI';

const Flip: React.FC<{ transport: Transport; ipv4Addr: string; }> = ({ transport, ipv4Addr }) => {
  const [flipping, setFlipping] = useState<boolean>(false);
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await soloGetCameraImageFlipping({ transport });

        if(!result) {
          setFlipping(false)
          return;
        }

        if(result.mode===ImageFlipMode["UNSPECIFIED"] || result.mode===ImageFlipMode["NONE"]) {
          setFlipping(false)
          return
        } else if(result.mode===ImageFlipMode["BOTH"]) {
          setFlipping(true);
        }
      } catch (e) {
        console.error("Flip, fetchData()", e)
      }
    };
    
    fetchData();

    const listener = (event: SubscribeEventResponse) => {
      if(event.type === EventType['IMAGE_FLIPPING_CHANGED']) {
        fetchData();
      }
    }

    const unsubsribe = subscribeSoloEventListener(ipv4Addr, listener)

    return () => unsubsribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeSoloEventListener]);

  // チェックボックスの状態が変更された時
  const handleFlipChange = async () => {
    setFlipping(!flipping); // 状態を反転させる
    // カメラの反転設定を更新
    await soloSetCameraImageFlipping({ transport, mode: flipping ? ImageFlipMode["NONE"] : ImageFlipMode["BOTH"] })
  };


  return (
    <Box sx={{ mr: "0.2rem" }}>
      <Checkbox
        title={ flipping ? '上下反転' : '上下反転' }
        checked={flipping}          // 状態に応じてチェックボックスの表示を変更
        onChange={handleFlipChange} // チェックボックスの状態が変更された時
        size='small'
        icon={
          <Cameraswitch sx={{ color: 'text.secondary' }} />
        }
        checkedIcon={<Cameraswitch sx={{ transform: 'scaleY(-1)' }} />}
        sx={{
          opacity: 1,
          color: 'text.primary',
          padding: "0.2rem",
          mr: "0.2rem",
          // padding: '0rem',
          // paddingX: '0.3rem',
        }}
      />
    </Box>
  );
}

export default Flip;
