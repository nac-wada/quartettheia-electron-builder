import { RefObject, useEffect, useRef, useState } from "react"
import { useDevices } from "../globalContexts/DeviceContext";

export const useObserverArea = ({ref, trigger}:{ ref: RefObject<HTMLDivElement>, trigger?: boolean }) => {
  const { isLoading } = useDevices()
  const [ maxHeight, setMaxHeight ] = useState<number | string>('none');
  const [ maxWidth, setMaxWidth ] = useState<number | string>('none');
  const [ isPortrait, setIsPortrait ] = useState<boolean | null>(null);

  useEffect(() => {
    const target = ref.current;
   if(!target) return;
   
   const observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const height = entry.contentRect.height;
      const width = entry.contentRect.width;
      if(height > width) {
        setIsPortrait(true);
      } else {
        setIsPortrait(false)
      }
      if(height > 0) {
        setMaxHeight(height)
      }
      if(width > 0) {
        setMaxWidth(width)
      }
    }
   })

   observer.observe(target);
   return () => observer.disconnect();
  },[trigger, isLoading])

  return { maxHeight, maxWidth, isPortrait }
}

export const useObserverVideoSize = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [overlayStyle, setOverlayStyle] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });

  const updateOverlaySize = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;

    // 1. videoタグ（枠）自体の表示サイズを取得
    const containerWidth = video.clientWidth;
    const containerHeight = video.clientHeight;

    // 2. ビデオ本来の解像度（比率）を取得
    const videoRatio = video.videoWidth / video.videoHeight;
    const containerRatio = containerWidth / containerHeight;

    let actualWidth, actualHeight;

    // 3. object-fit: contain の計算ロジック
    if (containerRatio > videoRatio) {
      // 左右に余白がある場合
      actualHeight = containerHeight;
      actualWidth = containerHeight * videoRatio;
    } else {
      // 上下に余白がある場合
      actualWidth = containerWidth;
      actualHeight = containerWidth / videoRatio;
    }

    // 4. 中央配置のためのオフセットを計算
    setOverlayStyle({
      width: actualWidth,
      height: actualHeight,
      top: (containerHeight - actualHeight) / 2,
      left: (containerWidth - actualWidth) / 2,
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // サイズが変わった時やメタデータが読み込まれた時に再計算
    const observer = new ResizeObserver(updateOverlaySize);
    observer.observe(video);
    video.addEventListener('loadedmetadata', updateOverlaySize);
    video.addEventListener('canplay', updateOverlaySize);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadedmetadata', updateOverlaySize);
      video.removeEventListener('canplay', updateOverlaySize);
    };
  }, []);

  return { videoRef, overlayStyle };
};