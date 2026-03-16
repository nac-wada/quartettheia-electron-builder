import { Badge, CircularProgress, IconButton, IconButtonProps, Typography } from "@mui/material"
import { FC, memo } from "react"
import { SaveAlt, Stop } from "@mui/icons-material"

export const ProgressIcon: FC< IconButtonProps & { downloading: boolean, progress: number, loadedcount: number, progressSize?: number }> = memo(({progressSize=40, downloading, progress, loadedcount, ...props}) => {
  return (
    <div style={{position: 'relative'}}>
      <IconButton
        title={"ダウンロード"}
        { ...props} 
      >
        <Badge
          invisible={loadedcount === 0 ? true : false}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          badgeContent={loadedcount}
          sx={{
            '& .MuiBadge-badge':{ 
              border:"2px solid white", p: 0, backgroundColor: "white",color: "primary.main"
            }
          }}
        >
          { downloading ? <Stop/> : <SaveAlt/>}
        </Badge>
      </IconButton>
      <>
      {
        (downloading &&
          <CircularProgress 
            size={progressSize} 
            value={progress} 
            variant={"determinate"} 
            sx={{
              color: "primary.main", 
              position: "absolute", 
              top: 0, bottom: 0, 
              left: 0, right: 0
            }}
          />
        )
      }
      </>
    </div>
  )
})