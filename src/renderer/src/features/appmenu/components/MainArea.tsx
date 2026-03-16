// src/appLayout/MainArea.tsx
import React from 'react';
import { Box, Toolbar } from '@mui/material';

import Footer from './Footer';
import { useDevices } from '../../../globalContexts/DeviceContext';
import Loading from '../../../components/Loading';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { MainAreaPaddingSpace } from '../../../types/common';


const MainArea = (props: { children: React.ReactNode }) => {
  const { children } = props
  const { isLoading, error } = useDevices()

//   return (
//     <React.Fragment>
//       <Box
//         component="main"
//         sx={{
//           backgroundColor: "customColor.main",
//           // display: 'flex',
//           // flexDirection: 'column',
//           // flexGrow: 1,
//           minHeight: '100vh',
//           overflow: 'auto', // スクロール自動表示&非表示
//         }}
//       >
//         <Toolbar />

//         {/* main-area 内の余白指定 */}
//         <Container
//           maxWidth="xl"
//           sx={{ mt: 3, mb: 0, height: '100%'}} // mtとmbを0に設定
//         >
//           <Grid container spacing={0} sx={{ height: '100%' }}>
//              {/* xs=12の時, 1アイテム1エリア独占 */}
//             <Grid size={{xs: 12}} sx={{ height: '100%' }}>

//               {/* --- ↓ 以下描画エリア --- */}
//               {/* 各ページのreturnがここに表示(src\components\appLayout\menuItems.tsx) */}
//               {
//                 isLoading 
//                 ? <Loading/>
//                 : error
//                 ? <ErrorAlert message={error.message}/>
//                 : <>{children}</>
//               }

//               {/* --- ↑ 以上描画エリア --- */}

//             </Grid>
//           </Grid>
//         </Container>

//         {/* 著作権表記 */}
//         <Footer />
//       </Box>
//     </React.Fragment>
//   );
// }
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', flexDirection: 'column' }}>
      <Toolbar />
      <Box sx={{ flexGrow: 1, p: `${MainAreaPaddingSpace}px` }}>
        {
          isLoading 
          ? <Loading/>
          : error
          ? <ErrorAlert message={error.message}/>
          : <>{children}</>
        }
      </Box>
      {/* 著作権表記 */}
      <Footer />
    </Box>
  )
}

export default MainArea;
