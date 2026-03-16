// src/appLayout/Footer.tsx
import { Box } from '@mui/material';

import Copyright from './Copyright';
import { FooterHeight } from '../../../types/common';

const Footer: React.FC = () => {
  const footerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: `${FooterHeight}px`,
    width: "100%"
  };

  // カメラが見つからないアラート

  return (
    <Box id='Footer' sx={footerStyle} component="div">

      <Copyright/>
    
    </Box>
  );
};

export default Footer;


