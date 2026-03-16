import { Box, Button, SxProps, Theme } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBackOutlined, ArrowForwardOutlined } from "@mui/icons-material";

export const NavigateButton: FC<{
  prev?: boolean,
  title: string,
  navLocation: string,
  btnSx?: SxProps<Theme>
}> = ({prev,title, navLocation, btnSx}) => {
  const navigate = useNavigate();
  
  return (
    <Button
      title={title}
      variant="contained"
      color={!prev ? "success" : "inherit" }
      size="large"
      onClick={() => navigate(navLocation)}
      sx={{
        whiteSpace: 'nowrap',
        borderRadius: '50px',
        padding: '5px 15px',
        fontWeight: "bold",
        boxShadow: "none",
        // スマホサイズ(xs)では最小幅を解除して正方形に近づける
        minWidth: { xs: '48px', sm: '64px' },
        ":hover": { boxShadow: "none" },
        ...btnSx
      }}
    >
      {/* 1. アイコン部分：常に表示するが、テキストがある時は左側に配置 */}
      {
        !prev ?
        <ArrowForwardOutlined 
          sx={{ 
            // テキストが表示されている(sm以上)ときだけ右側にマージンを作る
            mr: { xs: 0, sm: 1 } 
          }} 
        /> :
        <ArrowBackOutlined
          sx={{ 
            // テキストが表示されている(sm以上)ときだけ右側にマージンを作る
            mr: { xs: 0, sm: 1 },
            ...(prev && { color: 'text.secondary' } )
          }} 
        />
      }

      {/* 2. テキスト部分：xs（スマホ）の時は非表示にする */}
      <Box
        component="span"
        sx={{
          display: { xs: 'none', md: 'inline' },
          ...(prev && { color: 'text.secondary' } )
        }}
      >
        {title}
      </Box>
    </Button>
  );
}