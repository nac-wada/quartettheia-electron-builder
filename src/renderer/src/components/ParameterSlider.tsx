// src/card/SliderAndTextComponent.tsx
import React, { useState, useRef, MutableRefObject, useEffect } from 'react';
import {
  Slider,
  Typography,
  Stack,
} from '@mui/material';
import { CameraParameterType } from '../types/common';

export const ParameterSlider: React.FC<{
  parameterName: string,
  value: number,
  config: CameraParameterType,
  disabled?: boolean,
  buttonRef: MutableRefObject<boolean>
  setParameterValue: (newValue: number) => void,
  sx?: {
    borderColor: string,
    backgroundColor: string
  }
}> = ({
  parameterName,
  value,
  config,
  disabled,
  buttonRef,
  setParameterValue,
  sx
}) => {
  const [slider, setSlider] = useState<number>(value);

  useEffect(() => {
    setSlider(value)
  },[value])

  const onChange = (event: Event, newValue: number) => {
    buttonRef.current = true;
    setParameterValue(newValue)
    setSlider(newValue)
  };

  // マウスでハンドルを触るとき
  const onMouseDown = () => {
    buttonRef.current = true;
  };

  // マウスをハンドルから離すとき
  const onMouseUp = () => {
    buttonRef.current = false;
  };

  return (
    <>
      <Stack direction='row' alignItems='center' spacing={1} justifyContent='center'>
        <div style={{ position: 'relative' }}>
          <Typography
            sx={{
              px: -10,
              width: '9rem',
              marginRight: '1rem',
              position: 'absolute',
              top: -11,
              left: 3,
              zIndex: 1,
              pointerEvents: 'none',
              fontWeight: 'normal',
              //fontWeight: 'bold',
              variant: 'body1',
              color: 'primary.info',
              fontSize: '0.9rem',
            }}
          >
            {parameterName}
          </Typography>
        </div>

        <Slider
          value={slider}
          onChange={onChange}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchStart={onMouseDown}  // スマホ用
          onTouchEnd={onMouseUp}      // スマホ用
          onMouseLeave={onMouseUp}    // スマホ用
          min={config.min}
          max={config.max}
          step={config.step}
          //valueLabelDisplay='auto' // chip表示あり
          aria-labelledby="discrete-slider"
          color='primary'
          disabled={disabled}
          style={{
            color:'info.main',
            paddingLeft: '0rem',
            paddingRight: '0rem',
            marginLeft: '0rem',
            marginRight: '0rem',
            marginTop: '0rem',
            flex: 1,
          }}
          sx={{
            '& .MuiSlider-thumb': {
              width: '0px',
              height: '10px',
              borderRadius: '10px',
              backgroundColor: 'transparent',
              padding: '0px',
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit',
              },
              '&:before': {
                display: 'none',
              },
            },
            '& .MuiSlider-rail': {
              height: '25px',
              borderRadius: '7px',
              opacity: 0.15,
              ...sx,
            },
            '& .MuiSlider-track': {
              height: '23px',
              borderRadius: '7px',
              opacity: 0.4,
              ...sx,
            },
          }}
        />

      </Stack>
    </>
  );
};



