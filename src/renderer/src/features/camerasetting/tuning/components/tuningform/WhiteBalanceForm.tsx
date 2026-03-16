import { FC, memo, useEffect, useRef } from "react";
import { Transport } from "@connectrpc/connect";
import { LoadingComponent } from "./Loading";
import { Button, Grid, Typography } from "@mui/material";
import { AutoModeIconButton } from "./AutoModeIconButton";
import { useWhiteBalance } from "../../hooks/useWhiteBalance";
import { WhiteBalanceBlueForm } from "./WhiteBalanceBlueForm";
import { AutoModeButton } from "./AutoModeButton";
import { WhiteBalanceRedForm } from "./WhiteBalanceRedForm";
import { useSoloSubscribeEventListener } from "../../../../../globalContexts/SoloSubscribeEventContext";
import { SubscribeEventResponse } from "../../../../../gen/solo/v1/solo_pb";

export const WhiteBalanceForm: FC<{ 
  transport: Transport,
  ipv4Addr: string
}> = memo(({ transport, ipv4Addr }) => {
  const { isLoading, error, autoMode, setWhiteBalanceAuto, recievedEventCallback, getData } = useWhiteBalance(transport)
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
    <LoadingComponent isLoading={isLoading} rectangular2={false} circular2={false}>
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
        : (autoMode !== null) &&
          <>
            <div
              style={{
                display: 'grid',
                alignItems: 'center',
                gridTemplateColumns: '1fr 40px 40px',
                paddingLeft: 2,
                paddingRight: 5,
              }}
            >
              <div>
                <AutoModeButton btnTitle="ホワイトバランス" setParameterAuto={setWhiteBalanceAuto} autoMode={autoMode}/>
              </div>
      
              <div>
                <AutoModeIconButton 
                  title={"オートホワイトバランス"} 
                  autoMode={autoMode} 
                  setParameterAuto={setWhiteBalanceAuto}
                />
              </div>
      
              <div style={{ margin: 0, padding: 0 }}>
                
              </div>
            </div>

            {
              autoMode!==null &&
              <Grid sx={{ ...(autoMode && { display: "none" }) }}>
                <WhiteBalanceBlueForm transport={transport} ipv4Addr={ipv4Addr}/>
                <WhiteBalanceRedForm transport={transport} ipv4Addr={ipv4Addr}/>
                <Typography color="text.secondary" sx={{ fontWeight: 400, fontSize: 11, mx: 1 }}>
                  ※オートホワイトバランス OFF時、設定値と表示値が異なる場合があります
                </Typography>
              </Grid>
            }
          </>
      }
    </LoadingComponent>
  )
})