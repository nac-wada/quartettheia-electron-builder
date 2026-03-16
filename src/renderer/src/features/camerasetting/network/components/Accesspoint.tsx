import { Button, Collapse, ListItemButton, Typography } from "@mui/material";
import { FC, memo, useEffect, useState } from "react";
import { MessageModal } from "../../../../components/MessageModal";
import { MessageModalProps } from "../../../../types/common";
import { NetworkSignal } from "./NetworkSignal";
import { NetworkChannel } from "./NetworkChannel";
import { PasswordForm } from "./PasswordForm";
import { AccesspointType } from "../types";

export const Accesspoint: FC<AccesspointType & { openedCard: string, selectOpenedCard: any, connectToNetWiFiNetwork: any }> = memo(
  ({bssid, ssid, signal, channel, securities, openedCard, selectOpenedCard, connectToNetWiFiNetwork}) => {
  const [ openForm, setOpenform ] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [result, setResult] = useState("");
  const [dialog, setDialog] = useState<MessageModalProps | null>(null)

  useEffect(() => {
    if(openedCard!==bssid) {
      setOpenform(false)
    }
  },[openedCard])

  useEffect(() => {
    if(!openForm) {
      setResult("")
    }
  }, [openForm])

  const onClick = (channel: number) => {
    if(channel >= 1 && channel <= 14) {
      setOpenform(true)
      return;
    }
    setDialog({
      event: "warning",
      title: `※注意`,
      content: `
                選択したWi-Fiネットワークの周波数帯は屋内専用です。<br/>
                電波法により屋外では使用できませんので、ご注意ください。<br/>
                (法令により許可された場合を除く。)
              `,
      onClose: () => setDialog(null),
      onConfirm: () => {
        setOpenform(true)
        setDialog(null)
      },
      onConfirmTitle: "OK"
    })
  }

  const connect = async (value: string) => {
    setIsConnecting(true)
    setResult("接続しています")
    const res = await connectToNetWiFiNetwork(ssid, value)
    if(res) {
      setOpenform(false)
      setResult("")
    }
    else {
      setResult("接続に失敗しました")
    }
    setIsConnecting(false)
  }


  return (
    <>
      <ListItemButton sx={{ p: "1rem" }} onClick={() => selectOpenedCard(bssid)}>
        <NetworkSignal signal={signal} securities={securities} sx={{ mr: "1rem" }}/>
        <div>
          <Typography color="text.secondary" sx={{ fontWeight: "bold", display: "inline", mr: "0.5rem"}}>{ssid}</Typography>
          <NetworkChannel channel={channel}/>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>{result}</Typography>
        </div>
      </ListItemButton>
      <Collapse in={openedCard===bssid} unmountOnExit sx={{ textAlign: "right"}}>
      {
        openForm ?
          <PasswordForm ssid={ssid} connect={connect} closeForm={setOpenform} isConnecting={isConnecting}/>
        :
        <div style={{ margin: "0.5rem" }}>
          <Button color="primary" sx={{ fontWeight: "normal", width: 90, height: 30 }} onClick={() => onClick(channel)}>接続</Button>
        </div>
      }
      </Collapse>

      { dialog && <MessageModal message={dialog}/> }
    </>
  )
})