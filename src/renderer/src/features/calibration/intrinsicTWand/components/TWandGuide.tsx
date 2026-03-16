import { Box, Card, Grid, Typography } from "@mui/material";
import { FC } from "react";
import { TWandGuideProps } from "../types";

export const TWandGuide: FC<TWandGuideProps> = ({ title, media, description, completed, point, sx }) => {
  return (
    <Card
      sx={{
        width: "100%",
        p: 2,
        height: { xs: "450px", sm: "600px" }, // 固定の親の高さ
        borderRadius: "20px",
        display: "flex",        // 追加: 子要素を縦に制御
        flexDirection: "column", // 追加
        ...sx,
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          whiteSpace: "pre-line", 
          color: "text.secondary",
          flexShrink: 0         // 縮まないように固定
        }}
      >
        {title}
      </Typography>

      <Box sx={{
        flexGrow: 1,
        overflowY: "auto",
        mt: 1,
        px: "0.5rem",
        // スクロールバーを少し綺麗にするオプション（任意）
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: "10px" }
      }}>

        {/* メディアエリア */}
        {
          media &&
          <Box sx={{ flexShrink: 0 }}> 
            {typeof media === "object" && media !== null && !Array.isArray(media) ? 
              <Box sx={{ my: "10px", display: "flex", justifyContent: "center" }}>
                <video 
                  muted 
                  autoPlay 
                  playsInline 
                  loop={true} 
                  src={media.src} 
                  style={{ 
                    width: "100%", 
                    height: "auto", 
                    display: "block",
                    borderRadius: "8px" 
                  }} 
                />
              </Box> : 
              <Box sx={{ display: "grid", m: "10px 0 10px", gap: "2px",...( media.length > 1 && {gridTemplateColumns: "repeat(2, 1fr)"}) }}>
              {
                media.map(({src, mediaTitle}) => (
                  <Box>
                    <img
                      style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }} 
                      src={src}
                    />
                    {mediaTitle && <Typography color={mediaTitle.color} textAlign={"center"} variant="body1">{mediaTitle.text}</Typography>}
                  </Box>
                ))
              }
              </Box>
            }
          </Box>
        }

        <Typography 
          variant="body1" 
          sx={{ whiteSpace: "pre-line", color: "text.secondary", mb: "20px" }}
        >
          {description}
        </Typography>

        {
          completed &&
          <>
            <Typography variant="subtitle1" sx={{ whiteSpace: "pre-line", color: "text.secondary" }}>
              目標✅
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ whiteSpace: "pre-line", color: "text.secondary", mb: "20px" }}
            >
              {completed}
            </Typography>
          </>
        }

        {
          point &&
          <>
            <Typography variant="subtitle2" sx={{ whiteSpace: "pre-line", color: "text.secondary" }}>
              ポイント💡
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ whiteSpace: "pre-line", color: "text.secondary" }}
            >
              {point}
            </Typography>
          </>
        }

      </Box>
    </Card>
  );
};