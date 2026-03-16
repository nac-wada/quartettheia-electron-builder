import { Box, Switch, Typography } from "@mui/material";
import { FC, memo, useEffect, useState } from "react";

const RecordingAutoRemoveButton: FC<{
  recordingAutoRemoveEnabled: boolean | "failed" | null,
  openDialog: any,
  closeDialog: any,
  setRecordingAutoRemoveEnabled: any,
  recordingAutoRemoveEnabledAPIStatus: 'free' | 'busy'
}> = memo(({
  recordingAutoRemoveEnabled,
  openDialog,
  closeDialog,
  setRecordingAutoRemoveEnabled,
  recordingAutoRemoveEnabledAPIStatus
}) => {
  const [ value, setValue ] = useState(recordingAutoRemoveEnabled);

  useEffect(() => {
    setValue(recordingAutoRemoveEnabled)
  },[ recordingAutoRemoveEnabled ])

  const enableWarning = `
                          カメラの容量が不足すると、<br>
                          古い録画ファイルから自動的に削除されます。<br>
                          一度削除されたファイルは復元できません。<br>
                          この機能を有効にしますか？<br>
                        `
  const disableWarning = `
                          カメラの容量が不足しても、<br>
                          録画ファイルは自動で削除されなくなります。<br>
                          この機能を無効にしますか？<br>
                         `

  const handleChange = (enable: boolean | "failed" | null) => {
    if(enable !== null && enable !== "failed") {
      openDialog({
        dialog: {
          event: 'warning',
          content: enable ? disableWarning : enableWarning,
          onConfirm: () => { 
            closeDialog() 
            setRecordingAutoRemoveEnabled({ enable: !value })
          },
          onCancel: () => { closeDialog() },
          onClose: () => { closeDialog() },
        }
      })
    }
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Box
        sx={{
          display:"inline-block", 
          mr: "1rem", 
          width: "100%", 
        }}
      >
        <Typography
          color={'text.secondary'} 
          sx={{ fontWeight: "bold", fontSize: "0.9rem"}}
        >
          カメラの容量を自動で管理する
        </Typography>
        <Typography color={'error'} sx={{ fontWeight: "bold", fontSize: 11, ...(value!=="failed" && { display: "none" }) }}>
          エラーが発生しました。
        </Typography>
        <Typography color={'error'} sx={{ fontWeight: "bold", fontSize: 11, ...(value!=="failed" && { display: "none" }) }}>
          アプリを再読み込みしてください。
        </Typography>
      </Box>
      <Switch
        disabled={value === null || value === "failed" || recordingAutoRemoveEnabledAPIStatus === 'busy'} 
        checked={value === null || value === "failed" ? false : value}
        onChange={() => handleChange(value)}
      />
    </Box>
  )
})

export { RecordingAutoRemoveButton }