import { FC, memo, useEffect, useRef, useState } from "react";
import { keyframes } from "@mui/material";
import { MessageModal } from "./MessageModal";
import { MessageModalProps } from "../types/common"
import { ThermostatOutlined } from "@mui/icons-material";
import { EventType, SubscribeEventResponse } from "../gen/solo/v1/solo_pb";
import { useSoloSubscribeEventListener } from "../globalContexts/SoloSubscribeEventContext";

export const CameraThermostatSignal: FC<{ipv4Addr: string}> = memo(({ipv4Addr}) => {
  const [message, setMessage] = useState<MessageModalProps|null>(null);
  const [ isTempratureHigh, setIsTempratureHigh ] = useState(false);
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener();
  const blink = keyframes`
    0% { opacity: 0 },
    25% { opacity: 1 },
    50% { opacity: 0 },
    75% { opacity: 1 },
  `
  const cameraThermalWarningError: MessageModalProps = {
    event: "error",
    title: "カメラ温度エラー",
    content: `
               カメラの温度が非常に高くなっています。<br>
               日陰など安全な場所に移動したり、空冷ファンをあてたりして冷却してください。<br>
               より高温状態になると、故障を防ぐためカメラを自動的にシャットダウンします。
             `,
    onConfirmTitle: '閉じる',
    onConfirm: () => setMessage(null),
    onClose: () => setMessage(null)
  }

  const timerIdRef = useRef<any|null>(null)
  
  useEffect(() => {

    const listener = (event: SubscribeEventResponse) => {
      if(event.type === EventType['TEMPERATURE_HIGH']) {
        if(timerIdRef.current) {
          clearTimeout(timerIdRef.current)
        }

        if(!isTempratureHigh) {
          setIsTempratureHigh(true)
        }

        timerIdRef.current = setTimeout(() => {
          setIsTempratureHigh(false);
        }, 60000)

        setIsTempratureHigh(true)
      }
    }

    const unsubsribe = subscribeSoloEventListener(ipv4Addr, listener);

    return () => {
      unsubsribe()
      if(timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    }
  },[subscribeSoloEventListener])

  return (
    <>
      <div
        onClick={() => setMessage(cameraThermalWarningError)}
        title="カメラ温度エラー"
        style={{ display: !isTempratureHigh ? "none" : "inline" }}
      >
        <ThermostatOutlined
          sx={{ 
            fontSize: "1rem", 
            cursor: "pointer", 
            color: "red", 
            animation: `${blink} 1s steps(1, jump-end) infinite`
          }}
        />
      </div>
      { message && <MessageModal message={message}/> }
    </>
  )
})