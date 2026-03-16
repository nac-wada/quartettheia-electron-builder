import { Lan } from "@mui/icons-material";
import { Button, Collapse, ListItemButton, Typography } from "@mui/material";
import { FC, memo, useState } from "react";
import { NetworkSignal } from "./NetworkSignal";
import { NetworkChannel } from "./NetworkChannel";
import { ActiveNetworkInterfaceType } from "../types";

export const ConnectedNetwork: FC<ActiveNetworkInterfaceType & 
  { 
    openedCard: string, selectOpenedCard: any, disconnectFromWiFiNetwork: any, disabled: boolean
  }> = memo((
    { ipv4Addr, macAddr, interfaceName, wifi, openedCard, selectOpenedCard, disconnectFromWiFiNetwork, disabled }
  ) => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [result,setResult] = useState("");
  const name = interfaceName !== 'eth0' && wifi ? wifi.ssid : "有線LAN"

  const onClick = () => { if(wifi) { selectOpenedCard(wifi.bssid) } }

  const disconnect = async (ssid: string) => {
    setIsDisconnecting(true)
    setResult("切断しています")
    const res = await disconnectFromWiFiNetwork(ssid)
    if(res) {
      setResult("")
    }
    else {
      setResult("切断に失敗しました")
    }
    setIsDisconnecting(false)
  }
  
  return (
    <>
      <ListItemButton onClick={onClick}>
        {
          wifi ?
          <NetworkSignal signal={wifi.signal} securities={wifi.securities} sx={{ mr: "1rem" }}/> :
          <Lan fontSize="large" sx={{ transform: 'scaleX(-1)', color: 'text.secondary', mr: "1rem" }}/>
        }
        <div>
          <Typography color="text.secondary" sx={{ fontWeight: "bold", display: "inline", mr: "0.5rem" }}>{name}</Typography>
          {wifi && <NetworkChannel channel={wifi.channel}/>}
          <Typography color="text.secondary" sx={{ fontWeight: "bold", display: {xs: "block", sm: "inline"}, fontSize: { xs: "0.8rem", sm: "1rem" } }}>接続済み</Typography>
          <Typography color="text.secondary" variant="subtitle2" sx={{ fontSize: "0.7rem" }}>IPアドレス　{ipv4Addr}</Typography>
          <Typography color="text.secondary" variant="subtitle2" sx={{ fontSize: "0.7rem" }}>MACアドレス　{macAddr}</Typography>
          { result !== "" && <Typography variant="subtitle2" sx={{ color: "text.secondary", mt: "0.2rem" }}>{result}</Typography> }
        </div>
      </ListItemButton>
      {
        wifi &&
        <Collapse in={openedCard===wifi.bssid} unmountOnExit sx={{ textAlign: "right" }}>
          <Button
            color="error" 
            disabled={isDisconnecting || disabled}
            sx={{ fontWeight: "bold", width: 90, height: 30, my:1, mr: 0.5 }} 
            onClick={() => disconnect(wifi.ssid)}
          >
            切断
          </Button>
        </Collapse>
      }
    </>
  )
})