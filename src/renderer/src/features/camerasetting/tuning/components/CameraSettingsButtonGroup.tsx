// src/components/cardVideo/CardVideoMiniIcon.tsx
import React, { HTMLAttributes } from 'react';
import {
  Box,
  Stack,
} from '@mui/material';
import { useDebug } from '../../../../globalContexts/DebugContext';

import Fps from './buttongroup/Fps';
import ImageSize from './buttongroup/ImageSize';
import Flip from './buttongroup/Flip';
import { MasterCamera } from './buttongroup/MasterCamera';
import ConnectionInfo from './buttongroup/ConnectionInfo';
import Online from './buttongroup/Online';
import { StorageRemainingTime } from './buttongroup/StorageRemainingTime';
import { OtherSettingInfo } from './buttongroup/OtherSettings';
import RamPercent from './buttongroup/RamPercent';
import { useRamPercent } from '../../../../globalContexts/RamPercentContext';
import { DeviceInfomation } from '../../../../types/common';

export const CameraSettingsButtonGroup: React.FC<{
  device: Pick<DeviceInfomation, "ipv4Addr"|"primary"|"networkInterface"|"transport">,
  index: number;
  setModal: any,
} & HTMLAttributes<HTMLDivElement>> = ({
  device,
  index,
  setModal,
}) => {
  // fps, image-size 表示(デバッグ用)
  const { ipv4Addr, primary, networkInterface, transport } = device
  const { hiddenFpsAndSizeMode } = useDebug();
  const { ramPercentDisplay } = useRamPercent();

  return (
    <>
      <Box mx='0.5rem' mb='0.4rem' mt='0.4rem' component='div'>
        <Stack direction='row'>
          { hiddenFpsAndSizeMode &&
            <>
              <Fps url={ipv4Addr} />
              <ImageSize url={ipv4Addr} />
            </>
          }

          <MasterCamera 
            primary={primary} 
            index={index}
            setModal={setModal}
          />
          
          <ConnectionInfo 
            netWorkInterface={networkInterface}
            index={index}
            setModal={setModal}
          />

          <Online transport={transport} ipv4Addr={ipv4Addr}/>

          <Flip 
            transport={transport}
            ipv4Addr={ipv4Addr} 
          />
          
          <OtherSettingInfo 
            index={index}
            setModal={setModal}
          />
    
          {
            ramPercentDisplay && (<RamPercent transport={transport} />)
          }

          <StorageRemainingTime transport={transport} />

        </Stack>
      </Box>
    </>
  );
};
