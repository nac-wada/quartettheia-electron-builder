// src/card/TextInputComponent.tsx
import React, { useEffect, useState } from 'react';
import {
  TextField,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

export const ParameterTextField: React.FC<{
  value: number,
  config: {
    min: number,
    max: number,
  },
  disabled?: boolean,
  unite: string,
  decimalPlaces?: number,
  setParameterValue: (newValue: number) => void,
}> = ({ value, config, disabled, unite, decimalPlaces=0, setParameterValue }) => {
  const theme = useTheme();
  const formatNumber = (value: number, decimalPlaces: number): string => { return value.toFixed(decimalPlaces)}
  const [input, setInput] = useState(formatNumber(value, decimalPlaces))

  useEffect(() => {
    setInput(formatNumber(value, decimalPlaces))
  },[value])

  // テキストフィールドにただ表示する文字(評価しない)(入力途中でも走るため1文字ずつ反応する,sliderには適用しない)
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    setInput(formatNumber(Number(newValue), 0)) // 入力する時、decimalPlacesの引数を0にしないとバックスペースの操作ができない
  };

  // 入力の確定後にスライダーとカメラに値を格納するための関数(制限値内か、小数点はないかなど判定含む)
  const ChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    let integerValue = parseInt(newValue, 10); // 小数点除外
    integerValue = Math.floor(integerValue);
    // 入力値が数値でないor制限を超えている場合,制限値を設定
    if (integerValue < config.min) {
      newValue = config.min.toString();
    } else if (Number(newValue) > config.max) {
      newValue = config.max.toString();
    }

    setInput(formatNumber(Number(newValue), decimalPlaces))
    setParameterValue(Number(newValue))
  };

  // テキストフィールド外をクリックしたとき
  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    ChangeValue(event);
  };

  // エンター、クリック
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') { // 非表示ではないとき&enterキー
      ChangeValue(event as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };


  return (
    <Box
      display='flex'
      alignItems='center'
      mx={1}
      component={'div'}
    >
      <TextField
        type='number'
        value={input}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        disabled={disabled}
        slotProps={{
          htmlInput: {
             min: config.min,
            max: config.max,
            style: {
              color:'text.primary',
              height: '1rem',
              width: '4rem',
              textAlign: 'right',
              padding: '0.2rem',
              paddingLeft: '0.3rem',
              paddingRight: '0.3rem',
              flex: 1,
            },
          }
        }}
        sx={{
          marginLeft:  '0rem',
          marginRight: '0.1rem',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none', // 初期状態では枠線非表示
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: '1px solid', // ホバー時に枠線表示
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '1px solid', // フォーカス時に枠線表示
          },
          '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button': {
            position: 'absolute ', // なぜか上下キーが見えない位置に移動する
          }
        }}
      />
      <Typography 
        width={'1rem'} 
        sx={{ 
          color: disabled ? theme.palette.text.disabled : theme.palette.text.primary 
        }} 
      >
        {unite}
      </Typography>
    </Box>
  );
};


