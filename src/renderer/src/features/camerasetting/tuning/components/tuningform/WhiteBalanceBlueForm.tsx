import { FC, memo, useEffect, useRef } from "react";
import { Transport } from "@connectrpc/connect";
import { LoadingComponent } from "./Loading";
import { Box, Button, Typography } from "@mui/material";
import { ParameterSlider } from "../../../../../components/ParameterSlider";
import { ParameterResetButton } from "./ParameterResetButton";
import { ParameterTextField } from "../../../../../components/ParameterTextField";
import { lightBlue } from "@mui/material/colors";
import { useSoloSubscribeEventListener } from "../../../../../globalContexts/SoloSubscribeEventContext";
import { SubscribeEventResponse } from "../../../../../gen/solo/v1/solo_pb";
import { useWhiteBalanceBlue } from "../../hooks/useWhiteBalanceBlue";

export const WhiteBalanceBlueForm: FC<{ 
  transport: Transport,
  ipv4Addr: string,
}> = memo(({ transport, ipv4Addr }) => {
  const {isLoading, error, value, config, recievedEventCallback, setWhiteBalanceBlueValue, getData} = useWhiteBalanceBlue(transport)
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
    <LoadingComponent isLoading={isLoading} circular1={false}>
      {
        error ?
        <Box sx={{ margin: "0.5rem 0.5rem 0rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
        </Box>
        : (value !==null && config !== null) &&
          <Box
            sx={{
              display: 'grid',
              alignItems: 'center',
              gridTemplateColumns: '1fr 7rem 40px 40px',
              p: "0 5px"
            }}
          >
            <Box>
              <ParameterSlider 
                parameterName={"青"}
                value={value}
                config={config}
                buttonRef={buttonRef}
                setParameterValue={setWhiteBalanceBlueValue}
                sx={{
                  borderColor: lightBlue[600],
                  backgroundColor: lightBlue[600]
                }}
              />
            </Box>
    
            <Box>
              <ParameterTextField
                value={value}
                config={{ min: config.min, max: config.max }}
                unite={""}
                setParameterValue={setWhiteBalanceBlueValue}
                decimalPlaces={3}
              />
            </Box>

            <Box></Box>

    
            <Box>
              <ParameterResetButton 
                title={"青のホワイトバランスをデフォルトに戻す"}
                setParameterValue={setWhiteBalanceBlueValue} 
                defaultValue={config.defaultValue}
              />
            </Box>
          </Box>
      }
    </LoadingComponent>
  )
})