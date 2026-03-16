// src/components/ui/RoundTag.tsx
import React from 'react';
import { Box, Typography, useTheme, } from '@mui/material';
import { grey } from '@mui/material/colors';

const RoundTag: React.FC<{
  tagName: string;
  tooltipName?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  width?: string;
  textAlign?: 'left' | 'center' | 'right';
  placement?: 'top-start' | 'top' | 'top-end' | 'left-start' | 'left' | 'left-end' | 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end';
  style?: React.CSSProperties;
}> = ({
  tagName,
  tooltipName = '',
  backgroundColor = grey[200],
  backgroundOpacity = 0.8,
  color = 'text.primary',
  fontSize = 'body2.fontSize',
  fontWeight = 'normal',
  width = 'auto',
  textAlign = 'left',
  placement='top',
  style,
}) => {
  // dark mode対策
  const theme = useTheme();
  if (backgroundColor === grey[200]) {
    backgroundColor =
      theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800];
  }

  const tagStyle: React.CSSProperties = {
    backgroundColor:
      `rgba(
        ${parseInt(backgroundColor.slice(1, 3), 16)},
        ${parseInt(backgroundColor.slice(3, 5), 16)},
        ${parseInt(backgroundColor.slice(5, 7), 16)},
        ${backgroundOpacity})`,
    borderRadius: '50px',
    padding: '0.6rem',
    paddingTop: '0.1rem',
    paddingBottom: '0.1rem',
    marginLeft: '0.1rem',
    marginRight: '0.1rem',
    fontWeight: fontWeight,
    display: 'inline-block',
    width: width,
    textAlign: textAlign,
    whiteSpace: 'nowrap', // 半角スペースが含まれていても改行を抑制
    ...style,
  };

  return (
    <Box sx={tagStyle} component="div">
      <Typography title={tooltipName} variant='body1' color={color} fontSize={fontSize}>
        {tagName}
      </Typography>
    </Box>
  );
};

export default RoundTag;