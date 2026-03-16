import { FC, memo, useState } from "react";
import { PlayArrowOutlined } from "@mui/icons-material";
import { Box, Grid, Stack } from "@mui/material";
import { FileErrorIcon } from "./FileErrorIcon";
import { ThumbnailProps } from "../types";


export const Thumbnail : FC<ThumbnailProps> = memo((props) => {
  const { item, errorTag, openVideoPlayer, errorMessage } = props;
  const [ isHovered, setIsHovered ] = useState(false)

  const onMouseOver = () => {
    setIsHovered(true)
  }

  const onMouseLeave = () => {
    setIsHovered(false)
  }

  const thumbnail_style = {
    height: 70,
    aspectRatio: 1936/1216,
    marginRight: 2,
    marginLeft: 2,
    padding: 0,
  }

  const hover_style = {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    top:'0%',
    right:'0%', 
    backgroundColor: 'rgba(117,117,117,0.5)', 
    width:'100%',
    height:'100%',
  }


  return (
    <Stack direction={"row"} sx={{ display: "flex", alignItems: "center" }}>
      {
        item.video.map(({ thumbnail }, index) => (
          <Box 
            key={index}
            title={"動画再生画面を開く"}
            style={{ 
              position:"relative",
              ...thumbnail_style,
            }}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onClick={openVideoPlayer}
          >
              <img 
                src={thumbnail} 
                alt="no-image" 
                style={{
                  width:"100%",
                  height:"100%",
                }}
              />
            {
              isHovered &&
              <div style={{...hover_style,position: "absolute"}}>
                <PlayArrowOutlined sx={{width:40,height:40,color:"primary.main"}}/>
              </div>
            }
          </Box>
        ))  
      }
      { errorTag && 
        <FileErrorIcon
          fontSize="medium" 
          sx={{ 
            cursor: "pointer", 
            backgroundColor: "white", 
            borderRadius: "50%", 
            ml: "0.5rem"
          }}
          text={errorMessage}
        /> 
      }
    </Stack>
  )
})

export const ThumbnailContainer : FC<ThumbnailProps> = memo((props) => {
  const { item, openVideoPlayer, errorTag, errorMessage } = props;
  const [ isHovered, setIsHovered ] = useState(false)

  const onMouseOver = () => {
    setIsHovered(true)
  }

  const onMouseLeave = () => {
    setIsHovered(false)
  }

  const thumbnailContainer_sx = {
    height: "100%",
    borderRadius: 2,
    aspectRatio: 1936/1216,
    backgroundColor: '#000000',
    margin: 5,
    minHeight: 100,
    maxHeight: 150,
  }

  const hoverContainer_sx = {
    height: "100%",
    borderRadius: 2,
    aspectRatio: 1936/1216,
    backgroundColor:'rgba(117, 117, 117, 0.5)',
    top:0,
    right:0,
    minHeight: 100,
    maxHeight: 150,
    display:"flex",
    justifyContent:"center",
    alignItems: "center",
  }


  return (
    <div style={{ position: "relative"}}>
      <Grid container direction={"row"} 
        style={{...thumbnailContainer_sx, position:"relative"}}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onClick={openVideoPlayer}>
      {
        isHovered &&
        <Box
          title={"動画再生画面を開く"} 
          style={{...hoverContainer_sx, position:"absolute"}}
        >
          <PlayArrowOutlined sx={{color: "primary.main", width: 40,height: 40}}/>
        </Box>
      }
      {
        item.video.map((file, index) => (
          <img
            key={index} 
            src={file.thumbnail} 
            alt="no-image" 
            style={{
              width: item.video.length !== 1 ? "50%" : "100%",
              height: item.video.length !== 1 ? "50%" : "100%",
            }}
          />
        ))
      }
      </Grid>
      { errorTag && 
        <FileErrorIcon 
          fontSize="medium" 
          sx={{ 
            position: "absolute",
            top: "0px",
            right: "5px",
            zIndex: 1,
            cursor: "pointer",
            backgroundColor: "white",
            borderRadius: "50%",
            p: 0,
          }}
          text={errorMessage}
        />
      }
    </div>
  )
})