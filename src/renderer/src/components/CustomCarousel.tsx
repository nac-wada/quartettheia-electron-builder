import { Circle } from "@mui/icons-material";
import { Box, Dialog, DialogProps, Grow, IconButton } from "@mui/material";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";

interface CarouselProps {
  slides: ReactNode[];
  options?: EmblaOptionsType;
  slideWidth: string
}

export const CustomCarouselModal2: FC<CarouselProps & DialogProps> = ({ slides, options, slideWidth, ...props }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    
    // 初回実行
    onSelect(emblaApi)
  }, [emblaApi, onSelect])

  const styles = {
    viewport: { overflow: 'hidden' } as React.CSSProperties,
    container: {
      display: 'flex',
      backfaceVisibility: 'hidden',
      touchAction: 'pan-y'
    } as React.CSSProperties,
    slide: {
      flex: '0 0 100%',
      minWidth: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column', // 縦並びに強制
      backgroundColor: "rgba(0, 0, 0, 0)",
      fontSize: '2rem',
      fontWeight: 'bold',
    } as React.CSSProperties,
    dots: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      margin: '10px auto',
      width: 'fit-content',
      padding: '8px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    } as React.CSSProperties,
    dot: (isSelected: boolean): React.CSSProperties => ({
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      border: '1px solid #333',
      // 選択時だけ内側に影（点）を作る
      boxShadow: isSelected ? 'inset 0 0 0 3px #333' : 'none',
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }),
  }

  return (
    <Dialog
      scroll="paper"
      slots={{ transition: Grow }}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            backgroundColor: 'transparent !important', // 土台は完全に透明
            backgroundImage: 'none !important',
            boxShadow: 'none !important',
          },
        },
        transition: {
          style: {
            transformOrigin: '50% 50% 0',
          },
          timeout: { 
            enter: 500, 
            exit: 100 
          }
        },
      }}
      
      {...props}
    >
      <Box 
        sx={{ 
          width: "100%", 
          overflow: "hidden", 
          maxWidth: slideWidth, 
          margin: 'auto', 
          backgroundColor: "#00000000",
        }}
      >
        {/* Viewport */}
        <Box sx={styles.viewport} ref={emblaRef}>
          {/* Container */}
          <Box sx={styles.container}>
            {slides.map((slide, index) => (
              <Box sx={styles.slide} key={index}>
                {slide}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Dots */}
        <Box 
          sx={{
            display: scrollSnaps.length === 1 ? "none" : "block",
            textAlign: "center",
            gap: "8px",
            padding: '8px 16px',
            borderRadius: '12px',
            backgroundColor: 'transparent', // 明示的に透明
            backgroundImage: 'none',
          }}
        >
          {scrollSnaps.map((_, index) => (
            <IconButton 
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <Circle 
                sx={{
                  width: 14, 
                  height: 14, 
                  color: selectedIndex===index ? "rgba(255, 255, 255, 0.9)": "rgba(255, 255, 255, 0.4)"
                }}
              />
            </IconButton>
          ))}
        </Box>
      </Box>
    </Dialog>
  )
}