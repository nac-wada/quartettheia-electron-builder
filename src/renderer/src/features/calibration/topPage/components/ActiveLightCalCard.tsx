import { Box, Button, Paper, Stack, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material"
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { activeLightCalSteps } from "../types";

export const ActiveLightCalCard = (props: { extrinsicResult: boolean, intrinsicResult: boolean }) => {
  const { extrinsicResult, intrinsicResult } = props
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  

  useEffect(() => {
    if(extrinsicResult) {
      if(intrinsicResult) {
        setActiveStep(2)
        return;
      }
      setActiveStep(1);
      return;
    } else {
      setActiveStep(0)
    }
  },[ extrinsicResult, intrinsicResult ])

  return (
    <Paper
      elevation={10} // 影 (shadow-2xl相当)
      sx={{
        padding: 3,
        width: '100%',
        maxWidth: 400, // 最大幅を設定 (w-full max-w-sm相当)
        borderRadius: 3, // 角丸
      }}
    >
      {/* タイトル */}
      <Typography variant="h6" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', position:"relative", fontSize: 16, mb: "20px" }}>
        アクティブライトキャリブレーション
        {/* <IconButton sx={{ position: "absolute", top: 0, right: 0, p: 0.2 }}><Settings/></IconButton> */}
      </Typography>

      {/* プレースホルダー画像エリア */}
      {/* <Box
        sx={{
          backgroundColor: '#e0e0e0', // 灰色のプレースホルダー背景
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          marginBottom: 3,
        }}
      >
        <Typography variant="body1" color="text.secondary">
        { calibrationConfig.calType==="wand"?"ワンドの画像":"チェスボードの画像" }
        </Typography>
      </Box> */}

      {/* ボタンエリア (Stackで縦に並べる) */}
      <Stack spacing={1.5}>
        {/* 主要なボタン */}
        <Button
          disabled={!(extrinsicResult && intrinsicResult)}
          variant="contained" // 塗りつぶしボタン
          sx={{
            textTransform: 'none', // 大文字変換を解除
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: "30px"
          }}
          onClick={() => navigate('/calibrationViewer')}
        >
          計算結果を確認する
        </Button>

        {/* 副次的なボタン (テキストボタン風にLinkを使用) */}
        <Typography variant="subtitle1" component="h2" align="left" sx={{ fontWeight: 'bold', pt: "5px" }}>
          キャリブレーションステータス
        </Typography>
        <Box sx={{ maxWidth: 400 }}> 
          <Stepper activeStep={activeStep} orientation="vertical">
            {activeLightCalSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {step.label}
                    {
                      activeStep ===2 &&
                      <Button
                        variant="outlined"
                        sx={{ borderRadius: "20px", ml: 2, fontWeight: "400", fontSize: 12 }}
                        onClick={() => navigate(step.navigate)}
                      >
                        再計算する
                      </Button>
                    }
                  </Box>
                </StepLabel>
                <StepContent>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography color="textSecondary" sx={{ fontWeight: "400", fontSize: 14, whiteSpace: "pre-line", mb: "10px" }} variant="body1">{step.description}</Typography>

                    <Button
                      variant="contained"
                      sx={{ mt: 1, mr: 1, borderRadius: "20px" }}
                      onClick={() => navigate(step.navigate)}
                    >
                      計算を開始する
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Stack>

    </Paper>
  )
}