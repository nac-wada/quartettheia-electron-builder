// src/components/cardVideo_tuning/iconButtonWindow/FrontOrBack.tsx
import React, { useState, useEffect, } from 'react';
import {
  Chip,
  SxProps,
  Theme,
} from "@mui/material";
import SwitchLeftRounded from '@mui/icons-material/SwitchLeftRounded';
import SwitchRightRounded from '@mui/icons-material/SwitchLeftRounded';
import { SettingCalibrationCameraSideAgainstBoard, CheckCalibrationCameraSideAgainstBoard } from '../extrinsicBoard/components/SideAgainstBoard'
import { Transport } from '@connectrpc/connect';

const FrontOrBack: React.FC<{
  url: string;
  transport: Transport
  sx?: SxProps<Theme>,
  readonly?: boolean,
}> = ({
  url,
  transport,
  sx = {
    color: 'white',
    marginX: 1,
    lineHeight: 1.5, // 行間余白(videoタグの真下の余白の原因,0で余白削除)ただしcardでこれを0で指定しているがchipでは0時,文字が消えるためデフォ値の1.5で上書き
  },
  readonly = false,
}) => {

  const [frontOrBack, setFrontOrBack] = useState(0);
  useEffect(() => {
    CheckCalibrationCameraSideAgainstBoard({ transport: transport })
      .then((side) => {
        setFrontOrBack(side);
      });
  }, [url]);

  // front or back button
  const handleChipClick = () => {
    setFrontOrBack((prevNum) => {
      if (prevNum === 1) return 2;
      else if (prevNum === 2) return 1;
      else console.error('[error] front or back (handleChipClick)')
      return -1
    })

    setFrontOrBack((prevNum) => {
      SettingCalibrationCameraSideAgainstBoard({ transport: transport, side: prevNum});
      return prevNum
    })
  };


  return (
      <Chip
        disabled={readonly}
        label={frontOrBack === 1?'FRONT':'BACK'}
        size="small"
        color={frontOrBack === 1 ? 'warning' : 'success'}
        icon={readonly ? <></> : frontOrBack === 1 ? <SwitchRightRounded /> : <SwitchLeftRounded />}
        sx={{ ...sx}}
        onClick={handleChipClick}
      />
  );
};

export default FrontOrBack;