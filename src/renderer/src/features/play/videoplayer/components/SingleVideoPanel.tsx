import { FC, useMemo } from "react"
import { useAppTheme } from "../../../../globalContexts/AppThemeContext"
import { Box, Card, CardHeader, Typography } from "@mui/material"
import { CropSquare } from "@mui/icons-material"
import { FileErrorIcon } from "../../playlist/components/FileErrorIcon"
import { grey } from "@mui/material/colors"
import { FullScreenButton } from "../../../../components/FullScreenWindow"
import { closeFullScreenFuncType, openFullScreenFuncType } from "../../../../types/common"

export const SingleVideoPanel: FC<{
  setMasterId: () => void,
  children?: React.ReactNode, cardTitle: string, 
  hasFrameDrops: boolean, hasUnstableSyncFrames: boolean
  fullScreen: {opened: boolean, id: string, open: openFullScreenFuncType, close: closeFullScreenFuncType, change: any } 
}> = ({ children, setMasterId, cardTitle, fullScreen, hasFrameDrops, hasUnstableSyncFrames }) => {
  const { opened, id, open, close, change } = fullScreen
  const { appTheme } = useAppTheme()

  let text = useMemo(() => {
    if(hasFrameDrops && hasUnstableSyncFrames) {
      return `フレームドロップしています<br>カメラ同期に失敗しています`
    }
    else if(hasFrameDrops && !hasUnstableSyncFrames) {
      return `フレームドロップしています`
    }
    else if(!hasFrameDrops && hasUnstableSyncFrames) {
      return `カメラ同期に失敗しています`
    }
    else {
      return ``
    }
  },[hasFrameDrops, hasUnstableSyncFrames])

  return (
    <Card 
      // sx={{
      //   border: 2,
      //   borderColor: appTheme==='dark' ? grey[600] : grey[200],
      //   // padding: "0.3rem", 
      //   borderRadius: "20px",
      //   boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      //   lineHeight: 0, width: "100%", display: "flex", flexDirection: "column"
      // }}
      sx={{
        // boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
        // borderRadius: "20px",
        // lineHeight: 0, 
        // // width: "100%",
        // height: "100%",
        // display: "flex", 
        // flexDirection: "column",
        // border: 2,
        // borderColor: appTheme==='dark' ? grey[600] : grey[200],
        // aspectRatio: 1936/1216,
        // // width: { xs: "100%", sm: "auto" },
        // // minHeight: 300
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
        borderRadius: "20px",
        display: "flex", 
        flexDirection: "column",
        border: 2,
        borderColor: appTheme === 'dark' ? grey[600] : grey[200],
        
        // --- はみ出し防止の重要設定 ---
        width: "100%",
        height: "100%",          // 親の高さに合わせる
        maxWidth: "100%",
        maxHeight: "100%",       // これが重要！親を超えない
        aspectRatio: 1936 / 1216, 
        overflow: "hidden",      // 中身がはみ出さないように
        m: "auto",               // 上下左右中央に寄せる
      }}
    >
      <CardHeader
        componet="div"
        sx={{ p:1, height:"auto"}}
        avatar={
          (hasFrameDrops || hasUnstableSyncFrames) && 
          <FileErrorIcon
            text={text}
            fontSize="large"
            sx={{
              cursor: "pointer",
              backgroundColor: "white",
              borderRadius: "50%",
            }}
          />
        }
        title={
          <Typography 
            sx={{ 
              float: "left", 
              variant: "body1", 
              color: "primary.info", 
              fontSize: "1.00rem", 
              fontWeight: "bold", 
              ml: "1rem"
            }}
          >
            {cardTitle}
          </Typography>
        }
        action={
          <Box sx={{display: "flex", margin: "0.5rem" }}>
            <FullScreenButton 
              opened={opened}
              id={id} 
              icon={<CropSquare fontSize="inherit" sx={{ fontSize: "1.2rem", color: "text.secondary" }}/>}
              openFullScreen={open} 
              closeFullScreen={close}
              changeMode={change}
              size="medium"
              handleClick={setMasterId}
            />
          </Box>
        }
      />
      <Box 
        sx={{
          // width: "100%", 
          // position: "relative", 
          // aspectRatio: 1936/1216, 
          // backgroundColor: "black"
          width: "100%",
          height: "100%", 
          position: "relative", 
          aspectRatio: 1936/1216, 
          backgroundColor: "black",
          overflow: "hidden",
        }}
      >
        {children}
      </Box>
    </Card>
  )
}