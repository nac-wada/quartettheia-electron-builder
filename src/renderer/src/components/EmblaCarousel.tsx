import React, { ReactNode, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel'
import { IconButton } from '@mui/material';
import { ArrowForwardIosRounded } from '@mui/icons-material';

// 全体のカルーセルコンポーネントのプロパティ型
type EmblaCarouselProps = {
  slides: ReactNode[];
  options?: EmblaOptionsType; // Emblaのオプション
  handleScrollPrev?: (index: number) => void,
  handleScrollNext?: (index: number) => void,
  handleSelect?: (index: number) => void,
};

const EmblaCarousel: React.FC<EmblaCarouselProps> = (props) => {
  const { slides, options, handleScrollNext, handleScrollPrev, handleSelect } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = React.useState(options?.startIndex || 0);
  // const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  // 前のスライドへ移動する関数
  const scrollPrev = useCallback((currentIndex: number) => {
    if(emblaApi) {
      if(currentIndex === 0) {
        handleScrollPrev && handleScrollPrev(slides.length-1)
        emblaApi.scrollTo(slides.length-1)
        return
      }
      handleScrollPrev && handleScrollPrev(currentIndex-1)
      emblaApi.scrollPrev()
    }
  }, [emblaApi]);
  // 次のスライドへ移動する関数
  const scrollNext = useCallback((currentIndex: number) => {
    if(emblaApi) {
      if(currentIndex === slides.length-1) {
        handleScrollNext && handleScrollNext(0)
        emblaApi.scrollTo(0)
        return
      }
      handleScrollNext && handleScrollNext(currentIndex+1)
      emblaApi.scrollNext()
    }
  }, [emblaApi]);
  // ドットボタンで指定のスライドへ移動する関数
  // const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  // APIの変更時に状態を同期
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    handleSelect && handleSelect(emblaApi.selectedScrollSnap())
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    // setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect); // リサイズなどで再初期化された場合にも対応
  }, [emblaApi, onSelect]);

  return (
    <div style={{ position: "relative", aspectRatio: 1936/1216 }}>
      {/* 左右のナビゲーションボタン */}
      <div 
        style={{ 
          position: "absolute", 
          top:"50%", 
          transform: `translateY(-50%)`, 
          width: "100%", 
          display: "flex", 
          justifyContent: "space-between",
          zIndex: 1 
        }}
      >
        <IconButton
          size='small'
          sx={{ 
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            transform: `scale(-1, 1)`,
            m: 1,
            p: 1,
          }} 
          onClick={() => scrollPrev(selectedIndex)}
        >
          <ArrowForwardIosRounded sx={{width: 20, height: 20}}/>
        </IconButton>
        <IconButton 
          size='small'
          sx={{ 
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            m: 1,
            p: 1,
          }} 
          onClick={() => scrollNext(selectedIndex)}
        >
          <ArrowForwardIosRounded sx={{width: 20, height: 20}}/>
        </IconButton>
      </div>

      {/* カルーセルのビューポート */}
      <div
        style={{
          height: "100vh",
          zIndex: 2,
          width: "100%",
          overflow: "hidden",
          alignContent: "center",
        }}
        ref={emblaRef}>
        <div style={{ touchAction: "pan-y", display: "flex" }}>
          {slides.map((slide, index) => (
            // スライド要素
            <div 
              style={{ 
                flex: "0 0 100%", 
                zIndex: 2, 
                width: "100%",
              }} 
              key={index}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* ページネーション（ドットボタン） */}
      {/* <div className="embla__dots">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div> */}
    </div>
  );
};

export default EmblaCarousel;