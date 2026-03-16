import { FC, memo, useEffect, useMemo, useRef } from "react";
import { Transport } from "@connectrpc/connect";
import { SubscribeEventResponse } from "../../../../../gen/solo/v1/solo_pb";
import { LoadingComponent } from "./Loading";
import { Button, Typography } from "@mui/material";
import { useGain } from "../../../../../hooks/useGain";
import { ParameterSlider } from "../../../../../components/ParameterSlider";
import { ParameterTextField } from "../../../../../components/ParameterTextField";
import { AutoModeIconButton } from "./AutoModeIconButton";
import { ParameterResetButton } from "./ParameterResetButton";
import { useSoloSubscribeEventListener } from "../../../../../globalContexts/SoloSubscribeEventContext";

export const GainForm: FC<{ 
  transport: Transport,
  ipv4Addr: string,
}> = memo(({ transport, ipv4Addr }) => {
  const { isLoading, error, config, value, autoMode, recievedEventCallback, getData, setGainValue, setGainAuto, getCameraGain } = useGain(transport)
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
      if(intervalRef.current!==null){
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        getCameraGain()
      }, 1000)
    } else if(autoMode===false) {
      getCameraGain()
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
  }, [autoMode])
  
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
                parameterName={"ゲイン"}
                value={value}
                config={config}
                disabled={autoMode}
                buttonRef={buttonRef}
                setParameterValue={setGainValue}
              />
            </div>
    
            <div>
              <ParameterTextField
                value={value}
                config={{ min: config.min, max: config.max }}
                disabled={autoMode}
                unite={"dB"}
                setParameterValue={setGainValue}
                decimalPlaces={2}
              />
            </div>
    
            <div>
              <AutoModeIconButton 
                title={"オートゲイン"} 
                autoMode={autoMode} 
                setParameterAuto={setGainAuto}
              />
            </div>
    
            <div>
              <ParameterResetButton 
                title={"ゲインをデフォルトに戻す"}
                disabled={autoMode}  
                setParameterValue={setGainValue} 
                defaultValue={config.defaultValue}
              />
            </div>
          </div>
      }
    </LoadingComponent>
  )
})