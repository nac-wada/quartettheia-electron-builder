// ImageSize.tsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { SoloService } from '../../../../../gen/solo/v1/solo_pb';
import { PortSolo } from '../../../../../types/common'; // 49555
import { CameraFrameSizeType } from '../../../../../gen/solo/v1/solo_pb';
import RoundTag from './RoundTag';

const ImageSize: React.FC<{
  url: string; // Properly define the type of url
  backgroundOpacity?: number;
}> = ({
  url, // Change props to url here
  backgroundOpacity = 0.8,
}) => {

  let transport;
  let client: any;
  const [hasError, setHasError] = useState(false); // エラーが発生したかどうかを示すフラグ
  const [width, setWitdh] = useState('');
  const [height, setHeight] = useState('');

  try {
    transport = createConnectTransport({
      baseUrl: `${url}:${PortSolo}`
    });
    client = createClient(SoloService, transport);

  } catch (error) {
    console.log('[error]Failed to create Connect transport or client:', error);
    setHasError(true); // エラーフラグをセット
    setWitdh(' -- ');
    setHeight(' -- ');
  }

  useEffect(() => {
    const handleImageSize = async () => {
      try {
        const res = await client.getCameraActualFrameSize({ type: CameraFrameSizeType.RECORD });
        if (res) {

          const valWidth = Number(res.width);
          const valHeight = Number(res.height);

          if (valWidth < 0 || valHeight < 0) {
            setWitdh(' -- ');
            setWitdh(' -- ');
          } else {
            // 小数点第2位で四捨五入し、小数点第1位まで表示
            setWitdh(valWidth.toString());
            setHeight(valHeight.toString());
          }
          setHasError(false); // エラーフラグをリセット

        }
      } catch (error) {
        console.log('[waring]カメラのimage sizeデータを取得できませんでした:', error);
        setHasError(true); // エラーフラグをセット
        setWitdh(' -- ');
        setHeight(' -- ');
      }
    };

    if (!hasError) {
      handleImageSize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasError]);

  return (
    <>
      <RoundTag tagName={`${width}×${height}`} backgroundOpacity={backgroundOpacity} />
    </>
  );
};

export default ImageSize;