import { Circle } from "@mui/icons-material";
import { Box, IconButton, keyframes } from "@mui/material";
import React, { FC, memo, useState } from "react";

export const CarouselModal: FC<{ 
  children: React.ReactNode[], 
  startIndex: number, 
  open: boolean,
  onClose: any,
}> = memo(({ children, startIndex, open, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(startIndex);

  const prev = (activeIndex: number) => {
    if(activeIndex===0) {
      setActiveIndex(children.length-1)
    } else {
      setActiveIndex((prev) => prev -1)
    }
  }

  const next = (activeIndex: number) => {
    if(activeIndex===children.length-1) {
      setActiveIndex(0)
    } else {
      setActiveIndex((prev) => prev +1)
    }
  }

  const fadeIn = keyframes`
    0% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  `

  return (
    <>
    {
      open &&
      <Box
        onClick={() => onClose(false)}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1300,
          flexDirection: "column"
        }}
      >
        <div style={{ display: "block" }} onClick={(e) => e.stopPropagation()}>
          {
            children.map((child, index) => (
              <Box key={`slide-${index}`} sx={{animation: `${fadeIn} 0.5s ease-in-out forwards`, ...(activeIndex!==index && { display: "none" }) }}>
                {child}
              </Box>
            ))
          }
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.5rem', display: "block" }} onClick={(e) => e.stopPropagation()}>
          {
            children.map((_, index) => (
              <IconButton 
                key={`${index}_indicator`}
                onClick={() => setActiveIndex(index)}
              >
                <Circle 
                  sx={{
                    width: 14, 
                    height: 14, 
                    color: activeIndex===index ? "rgba(255, 255, 255, 0.8)": "rgba(255, 255, 255, 0.4)"
                  }}
                />
              </IconButton>
            ))
          }
        </div>
      </Box>     
    }
    </>
  )
})