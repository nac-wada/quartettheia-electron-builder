// src/components/ui/CardTitle.tsx : main areaのカード内のタイトル
//import React from 'react';
import { Typography } from '@mui/material';

function CardTitle({ title, mx='1rem', my='1rem', variant='subtitle1', fontWeight='Bold', color='text.primary', }: { title: string, mx?: string, my?: string, variant?: string, fontWeight?: string, color?: string}) {
  return (
    <Typography
      variant='subtitle1'
      fontWeight={fontWeight}
      color={color}
      marginY={my}
      marginX={mx}
    >
      {title}
    </Typography>
  );
}

export default CardTitle;