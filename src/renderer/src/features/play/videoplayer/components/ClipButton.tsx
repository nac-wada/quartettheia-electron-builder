import { FC, memo, useCallback } from "react";
import { IconButton } from "@mui/material";
import { ContentCut } from "@mui/icons-material";
import { VideoType } from "../../../../types/common";

export const ClipButton: FC<{
  masterId: number,
  singleMode: boolean,
  openDialog: any, closeDialog: any, 
  clipMp4Group: any,
  clipMp4: any,
  videos: VideoType[],
  clipRange: number[] | null,
}> = memo(({ masterId, openDialog, closeDialog, clipMp4, clipMp4Group, videos, clipRange, singleMode }) => {

  const onClick = useCallback((singleMode: boolean, videos: VideoType[], clipRange: number[]|null, masterId: number) => {
    if(clipRange) {
      openDialog({
        event: 'warning',
        content: `選択した範囲をクリップしますか？`,
        onConfirm: async () => {
          if(singleMode) {
            const video = videos[masterId]
            const req = { transport: video.transport, fileName: video.rawSrc, rangeStart: clipRange[0], rangeEnd: clipRange[1] }
            clipMp4(req)
          }
          else {
            clipMp4Group(videos, clipRange)
          }
        },
        onClose: () => {
          closeDialog()
        },
        onCancel: () => {
          closeDialog()
        }
      })
    }
  },[])

  return (
    <>
      <IconButton title={"クリッピング実行"} disabled={clipRange===null} onClick={() => { onClick(singleMode, videos, clipRange, masterId) }}>
        <ContentCut sx={{ color: '#00c853' }}/>
      </IconButton>
    </>
  )
})