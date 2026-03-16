import { Alert, AlertTitle, Box, Button, ButtonProps, Grow, Paper, SxProps, Theme } from "@mui/material"
import { FC, useMemo } from "react";
import { useCalibrationEngine } from "../../../hooks/useCalibrationEngine";
import { AppBarHeight, FooterHeight, MainAreaPaddingSpace } from "../../../types/common";

export const CalPageFormat2: FC<{
  children: React.ReactNode,
  alert: {
    resultExist: boolean,
    success: { title: string, message: string },
    warning: { title: string, message: string },
    actions?: React.ReactNode
  },
  sx?: SxProps<Theme>,
}> = ({ 
  children, 
  alert,
  sx
}) => {
  const isCalibrating = useCalibrationEngine()

  let alertTitle = useMemo(() => { 
    if(isCalibrating) { return "計算中..." } 
    if(alert.resultExist) { return alert.success.title }
    return alert.warning.title
  }, [isCalibrating, alert])

  let alertMessage = useMemo(() => {
    if(isCalibrating) { return "計算中です。しばらくお待ちください。" }
    if(alert.resultExist) { return alert.success.message }
    return alert.warning.message
  },[isCalibrating, alert])

  let severity: 'success' | 'info' | 'warning' = useMemo(() => {
    if(isCalibrating) { return 'info' }
    if(alert.resultExist) { return 'success' }
    return 'warning'
  },[isCalibrating, alert])

  let alertColor = useMemo(() => {
    if(isCalibrating) { return 'rgba(3, 169, 244, 0.2)' }
    if(alert.resultExist) { return `rgba(76, 175, 80, 0.2)` }
    return 'rgba(255, 152, 0, 0.2)'
  },[isCalibrating, alert])

  // キャリブレーションページでは、デバイスに合わせて設定パネルを最大まで引き伸ばしつつ、パネル内の子要素が大きくなってもパネル内でスクロールできるようにするために高さを固定にする
  // 基本的にレイアウトが画面内に収まるように高さを固定、デバイスが小さいときは縦に並べるため高さに制限をかけない
  return (
    <>
      <Grow 
        in={true} 
        style={{ transformOrigin: '50% 0 0'}}
        timeout={1000}
      >
        <Box
          sx={{ 
            width: "100%", 
            height: {xs: 'auto', sm: `calc(100vh - ${(AppBarHeight + FooterHeight + MainAreaPaddingSpace + MainAreaPaddingSpace)}px)`}, 
            display: "flex", 
            flexDirection: "column", 
            minHeight: 0 ,
            ...sx
          }}
        >
          <Alert 
            severity={severity}
            sx={{ backgroundColor: (theme) => alertColor, borderRadius: 2 }}
          >
            <AlertTitle>{alertTitle}</AlertTitle>
            {alertMessage}{ (!isCalibrating) && alert.actions}
          </Alert>
          <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", minHeight: 0, paddingTop: "16px" }}>
            {children}
          </div>
        </Box>
      </Grow>
    </>
  )
}

export const ActiveLightCalSettingPanel: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Paper
      sx={{
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
        padding: 1,
        width: '100%',
        maxWidth: { xs: "100%", md: 400 }, // 最大幅を設定 (w-full max-w-sm相当)
        borderRadius: 3, // 角丸
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        pb: "1rem",
        p: "1rem",
      }}
    >
      <Box
        sx={{ 
          flex: 1,
          overflowY: "auto",  // 中身が溢れたらスクロール
          minHeight: 0,       // Flexアイテムが縮小できるようにするために必要
          // スクロールバーを少し細く綺麗にする（任意）
          pr: 1, // スクロールバーと中身が被らないよう少し余白
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }
        }}
      >
        {children}
      </Box>
    </Paper>
  )
} 

export const CustomButton: FC<{
  buttonTitle: string,
  sx?: SxProps<Theme>
} & ButtonProps> = ({ buttonTitle, sx, ...props }) => {
  return (
    <Button 
      loadingPosition="start" 
      variant="contained"
      size="large"
      sx={{
        color: "white",
        whiteSpace: 'nowrap', 
        borderRadius: '50px', 
        boxShadow: "none", 
        padding: '6px 20px', 
        minWidth: 'fit-content',
        fontWeight: "bold", 
        ":hover": { 
          boxShadow: "none" 
        },
        '& .MuiButton-startIcon': {
          // デフォルトの 8px ではなく 4px に設定（間隔を狭める）
          marginRight: "6px", 
          marginLeft: "-4px", // アイコンを少し左に寄せてバランスを取る
        },
        ...sx
      }}
      {...props}
    >
      { buttonTitle }
    </Button>
  )
}