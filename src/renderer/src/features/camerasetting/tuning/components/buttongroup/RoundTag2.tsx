// src/components/ui/tag/RoundTag.tsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

export const RoundTag2: React.FC<{
  tagName: string;
  tooltipName?: string;
  openTooltip?: boolean;
  placement?: 'top-start' | 'top' | 'top-end' | 'left-start' | 'left' | 'left-end' | 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end';
  backgroundColor?: string;
  backgroundOpacity?: number;
  fontColor?: string;
  fontSize?: string;
  fontWeight?: string;
  letterSpacing?: string;
  pt?: string;
  style?: React.CSSProperties;
}> = ({
  tagName,
  tooltipName = '',
  openTooltip = true,
  placement='top',
  backgroundColor = grey[200],
  backgroundOpacity = 0.8,
  fontColor = 'text.primary',
  fontSize = 'body2.fontSize',
  fontWeight = 'normal',
  letterSpacing = '0px',
  pt = '0.1rem',
  style,
}) => {
  // Dark mode対策
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
    paddingTop: pt,
    paddingBottom: '0.1rem',
    marginLeft: '0.1rem',
    marginRight: '0.1rem',
    fontWeight: fontWeight,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    whiteSpace: 'nowrap', // 半角スペースが含まれていても改行を抑制
    ...style,
  };

  return (
    <Box sx={tagStyle} component="div">
      <Typography title={tooltipName} variant='body1' color={fontColor} fontSize={fontSize} letterSpacing={letterSpacing} >
        {tagName}
      </Typography>
    </Box>
  );
};