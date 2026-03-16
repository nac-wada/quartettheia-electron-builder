import { Alert, Box, Card, CardContent, Chip, CircularProgress, LinearProgress, Paper, Typography, alpha, } from "@mui/material"
import { CameraAlt, CameraAltOutlined } from "@mui/icons-material"
import { DropZone } from "./DropZone";
import { CameraFirmPanelProps } from "../types";
import { FC } from "react";

export const CameraFirmPanel: FC<CameraFirmPanelProps> = ({
  camera,
  isProcessing,
  tasks,
  prepareUpload
}) => {
  return (
    <Box key={camera.id}>
      <Card sx={{ display: "flex", flexDirection: "column", borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
              { camera.primary ? <CameraAlt color="info" /> : <CameraAltOutlined color="info" />}{camera.nickname}
            </Typography>
            {camera.primary ? 
              <Chip size="small" color="info" label={"LEADER"} sx={{ fontSize: 12, fontWeight: "bold" }}/> : 
              <Chip size="small" variant="outlined" color="info" label={"FOLLOWER"} sx={{ fontSize: 12, fontWeight: "bold" }}/> 
            }
          </Box>
      
          <Typography color="textSecondary" variant="subtitle2" sx={{ fontWeight: "bold" }}>{camera.ipv4Addr.replace('http://','')}</Typography>

          <DropZone
            isProcessing={isProcessing}
            onFilesDropped={(files) => prepareUpload(camera.ipv4Addr, camera.nickname, camera.id, files)}
          />

          {tasks.map(task => {
            const alertServerity = task.status==="completed" ? "success" : task.status==="error" ? "error" : "info"
            const alertTitle = task.status==="completed" ? "ファームウェア更新完了" : task.status==="error" ? "ファームウェアの更新に失敗しました。やり直してください。" : "ファームウェア更新中です...しばらくお待ちください。" 
            return (
              <Alert 
                severity={alertServerity} 
                key={task.cameraId} 
                icon={
                  task.status === "uploading" ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : undefined // 完了/エラー時はデフォルトのアイコンを表示
                }
                sx={{ 
                  mt: 1, 
                  borderRadius: 2,
                  // 【重要】Alertのメッセージ領域（コンテンツ）を強制的に全幅にする
                  "& .MuiAlert-message": {
                    width: "100%",
                  }
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Typography variant="caption" sx={{ fontSize: "0.8rem", fontWeight: 500 }}>{alertTitle}</Typography>
                  {task.status === "uploading" && (
                    <Box sx={{ position: "relative", width: "100%" }}>
                      {/* 背景付きのLinearProgress */}
                      <LinearProgress 
                        variant="determinate" 
                        value={task.progress} 
                        sx={{ 
                          height: 15,              // 高さを大きく
                          borderRadius: 5,        // 角丸
                          width: "100%",           // 幅いっぱい
                          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.2) // 背景色
                        }} 
                      />
                      {/* %を表示するためのテキスト */}
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",         // 文字色
                          fontWeight: "bold",
                          fontSize: "0.75rem"
                        }}
                      >
                        {`${Math.round(task.progress)}%`}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Alert> 
            )
          })}
        </CardContent>
      </Card>
    </Box>
  )
}