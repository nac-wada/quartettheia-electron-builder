import { FC, memo, useEffect, useRef } from "react";
import { Transport } from "@connectrpc/connect";
import { LoadingComponent } from "./Loading";
import { Button, Typography } from "@mui/material";
import { ParameterSlider } from "../../../../../components/ParameterSlider";
import { ParameterTextField } from "../../../../../components/ParameterTextField";
import { ParameterResetButton } from "./ParameterResetButton";
import { useGamma } from "../../../../../hooks/useGamma";
import { useSoloSubscribeEventListener } from "../../../../../globalContexts/SoloSubscribeEventContext";
import { SubscribeEventResponse } from "../../../../../gen/solo/v1/solo_pb";

export const GammaForm: FC<{ 
  transport: Transport,
  ipv4Addr: string
}> = memo(({ transport, ipv4Addr }) => {
  const { isLoading, error, config, value, recievedEventCallback, getData, setGammaValue} = useGamma(transport)
  const buttonRef = useRef<boolean>(false); // 自身のブラウザ上でのボタン,ハンドル操作は同期受信しないためのフラグ(falseのとき同期受信する)
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener();
  
  useEffect(() => {
    const listener = (event: SubscribeEventResponse) => {
      if(!buttonRef.current) {
        recievedEventCallback(event)
      }      
    }

    const unsubsribe = subscribeSoloEventListener(ipv4Addr, listener)

    return () => unsubsribe()
  },[subscribeSoloEventListener])

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
        : (value !==null && config !== null) &&
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
                parameterName={"ガンマ"}
                value={value}
                config={config}
                buttonRef={buttonRef}
                setParameterValue={setGammaValue}
              />
            </div>
    
            <div>
              <ParameterTextField
                value={value}
                config={{ min: config.min, max: config.max }}
                unite={""}
                setParameterValue={setGammaValue}
                decimalPlaces={2}
              />
            </div>

            <div>
            </div>
    
            <div>
              <ParameterResetButton 
                title={"ガンマをデフォルトに戻す"}
                setParameterValue={setGammaValue} 
                defaultValue={config.defaultValue}
              />
            </div>
          </div>
      }
    </LoadingComponent>
  )
})