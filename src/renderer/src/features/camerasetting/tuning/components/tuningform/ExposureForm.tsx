import { FC, memo, useEffect, useRef } from "react";
import { useExposure } from "../../../../../hooks/useExposure";
import { Transport } from "@connectrpc/connect";
import { SubscribeEventResponse } from "../../../../../gen/solo/v1/solo_pb";
import { LoadingComponent } from "./Loading";
import { Button, Typography } from "@mui/material";
import { ParameterSlider } from "../../../../../components/ParameterSlider";
import { AutoModeIconButton } from "./AutoModeIconButton";
import { ParameterResetButton } from "./ParameterResetButton";
import { ParameterTextField } from "../../../../../components/ParameterTextField";
import { useSoloSubscribeEventListener } from "../../../../../globalContexts/SoloSubscribeEventContext";

export const ExposureForm: FC<{ 
  transport: Transport,
  ipv4Addr: string,
}> = memo(({ transport, ipv4Addr }) => {
  const { isLoading, error, config, value, autoMode, recievedEventCallback, getData, setExposureValue, setExposureAuto, getCameraExposure } = useExposure(transport)
  const buttonRef = useRef<boolean>(false); // 自身のブラウザ上でのボタン,ハンドル操作は同期受信しないためのフラグ(falseのとき同期受信する)
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener();
  const intervalRef = useRef<any | null>(null);

  useEffect(() => {
    const listener = (event: SubscribeEventResponse) => {
      if(!buttonRef.current) {
        recievedEventCallback(event)
      }      
    }

    const unsubsribe = subscribeSoloEventListener(ipv4Addr, listener)

    return () => unsubsribe()
  },[subscribeSoloEventListener])

  useEffect(() => {
    if(autoMode) {
      if(intervalRef.current!==null) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        getCameraExposure()
      },1000)
    } else if(autoMode===false) {
      getCameraExposure()
      if(intervalRef.current!==null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null
      }
      return;
    }

    return () => {
      if(intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  },[autoMode])

  return (
    <LoadingComponent isLoading={isLoading}>
      {
        error ?
        <div style={{ margin: "0.5rem 0.5rem 0rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            color="error"
            sx={{
              fontWeight: 'normal',
              variant: 'body1',
              fontSize: '0.9rem',
            }}
          >
            {error.message}
          </Typography>
          <Button color="inherit" variant="outlined" size="small" onClick={getData}>再読込み</Button>
        </div>
        : (value !==null && config !== null && autoMode !== null) &&
          <div
            style={{
              display: 'grid',
              alignItems: 'center',
              gridTemplateColumns: '1fr 7rem 40px 40px',
              paddingLeft: 5,
              paddingRight: 5,
            }}
          >
            <div>
              <ParameterSlider 
                parameterName={"露光時間"}
                value={value}
                config={config}
                disabled={autoMode}
                buttonRef={buttonRef}
                setParameterValue={setExposureValue}
              />
            </div>
    
            <div>
              <ParameterTextField
                value={value}
                config={{ min: config.min, max: config.max }}
                disabled={autoMode}
                unite={"μs"}
                setParameterValue={setExposureValue}
              />
            </div>
    
            <div>
              <AutoModeIconButton 
                title={"オート露光時間"} 
                autoMode={autoMode} 
                setParameterAuto={setExposureAuto}
              />
            </div>
    
            <div>
              <ParameterResetButton 
                title={"露光時間をデフォルトに戻す"}
                disabled={autoMode} 
                setParameterValue={setExposureValue} 
                defaultValue={config.defaultValue}
                
              />
            </div>
          </div>
      }
    </LoadingComponent>
  )
})