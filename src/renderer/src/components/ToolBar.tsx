import { Box, BoxProps, Paper, PaperProps, SxProps, Theme } from "@mui/material"
import { memo } from "react"
import { useAppTheme } from "../globalContexts/AppThemeContext"

const CustomToolbar: React.FC<{ children?: React.ReactNode, sx?: SxProps<Theme> } & PaperProps > = memo(({ children, sx, ...props }) => {
  const { appTheme } = useAppTheme()

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper 
        elevation={3}
        sx={{
          borderRadius: '100px',
          position: "fixed",
          bgcolor: appTheme ==="dark" ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(8px)',
          bottom: `calc(env(safe-area-inset-bottom) + 24px)`,
          maxWidth: 'calc(100% - 96px)',
          minWidth: "230px",
          mx: "16px",
          // Paper自体のoverflowはhiddenにして、絶対にはみ出さないようにする
          overflow: "hidden", 
          zIndex: 2,
          ...sx
        }}
        {...props} 
      >
        {/* スクロールを担当するインナーコンテナ */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "8px 20px", // 左右に多めの余白をとり、半円のカーブを避ける
          overflowX: "auto",
          whiteSpace: "nowrap",
          // --- スクロールバーのデザイン ---
          scrollbarWidth: 'thin',
          msOverflowStyle: 'auto',
        }}>
          {/* Webkit系（Chrome/Safari）用スタイルを当てるためのBox */}
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            width: "100%",
            '&::-webkit-scrollbar': {
              display: { xs: 'none', md: 'block' },
              height: '4px', // 少し厚みを持たせて、その代わり透明なborderで細く見せる
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '10px',
              // 重要：透明なボーダーを付けて、実際のバーの太さを内側に追い込む
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.4)',
              },
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
              // 左右の余白を 50px 〜 60px まで広げて内側に追い込む
              // これにより、カプセルの両端（半円部分）には絶対にバーが表示されなくなります
              margin: '0 60px', 
            },
          }}>
            { children }
          </Box>
        </div>
      </Paper>
    </div>
  )
}) 

const CustomToolbar2: React.FC<{ children?: React.ReactNode } & BoxProps > = memo(({ children, ...props }) => {
  
  return (
    <Box 
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.6)',
        display: "flex", 
        justifyContent: "center", 
      }}
    >
      <Box
        sx={{ 
          display: "block",
          bgcolor: 'rgba(255, 255, 255, 0.6)',
          position: "fixed",
          backdropFilter: 'blur(8px)',
          bottom: `calc(env(safe-area-inset-bottom) + 24px)`,
          p: "8px",
        }}
        {...props} 
      >
        { children }
      </Box>
    </Box>
  )
}) 
export { CustomToolbar, CustomToolbar2 }