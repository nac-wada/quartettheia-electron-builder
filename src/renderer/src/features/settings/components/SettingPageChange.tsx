import { Card, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { FC, useState } from "react";
import SettingItem from "./SettingItem";
import { useCalibrationMode } from "../../../globalContexts/CalibrationTypeContext";
import { MessageModal } from "../../../components/MessageModal";
import { MessageModalProps } from "../../../types/common";
import { useAppTheme } from "../../../globalContexts/AppThemeContext";

export const SettingChangeContainer: FC = () => {
  const [message, setMessage] = useState<MessageModalProps|null>(null)
  const { calibrationConfig, changeCalibrationMode } = useCalibrationMode()
  const [open, setOpen] = useState(false);
  const { appTheme, changeAppTheme } = useAppTheme();

  const onChangeSelect = (value: string) => {
    setOpen(true);
    setMessage({
      event: 'warning',
      title: '警告',
      content: `
                    ${value==='chessboard' ? "チェスボード" : "アクティブライト"}方式に変更しますか？<br>
                  `,
      onConfirm: () => {
        if(value==='wand' || value==='chessboard') {
          changeCalibrationMode(value)
        }
        setMessage(null)
        setOpen(false);
      },
      onClose: () => {
        setMessage(null) 
        setOpen(false);
      },
      onCancel: () => {
        setMessage(null) 
        setOpen(false);
      }
    })
  }
  
  return (
    <>
      <Card sx={{ borderRadius:5, boxShadow:"none" }}>
        <List sx={{ width: '100%' }}>
          <ListItem sx={{ bgcolor: 'background.paper' }}>
            <ListItemText primary={<Typography fontSize={'1.1rem'} fontWeight='bold'>詳細設定</Typography>} />
          </ListItem>

          <Divider />

          <SettingItem
            checked={appTheme==="dark"}
            label='アプリテーマをダークモードにする'
            description=''
            type='toggle'
            onChange={changeAppTheme}
          />
          
          <SettingItem
            value={calibrationConfig.calType}
            label='キャリブレーション方式'
            description=''
            type='select'
            onChangeSelect={(value:string) => {
              onChangeSelect(value)
            }}
            onSelectOpen={() => setOpen(true)}
            onSelectClose={() => setOpen(false)}
            selectOpen={open}
            colorButton='error'
            options={[
              { value: "chessboard", label: "チェスボードキャリブレーション" },
              { value: "wand", label: "アクティブライトキャリブレーション" }
            ]}
          />
        </List>
      </Card>

      { message && <MessageModal message={message}/> }
    </>
  )
} 