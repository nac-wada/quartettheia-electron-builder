import { FC, memo, useCallback, useMemo, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, LinearProgress } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import { VideoType } from "../../../../types/common";

export const DownloadButton: FC<{
  id?: string, 
  videos: VideoType[],
  openDialog: any, 
  closeDialog: any, 
  download: any,
  stopdownload: any,  
  downloading: boolean, 
  singleMode: boolean,
  masterId: number,
}> = memo(
  ({ 
    id, 
    videos,
    openDialog, 
    closeDialog, 
    download,  
    stopdownload, 
    downloading, 
    singleMode,
    masterId
  }) => {
  const [ open, setOpen ] = useState(false)
  let downloaded = videos.map(({loaded}) => loaded);
  const progress = useMemo(() => { return Math.round(downloaded.reduce((sum, e) => sum + e, 0)/downloaded.length) }, [downloaded])
  const loadedCount = useMemo(() => { return downloaded.filter((v) => v === 100).length }, [downloaded])

  const onClick = useCallback((downloading: boolean, singleMode: boolean, videos: VideoType[], masterId: number) => {
    if(downloading) {
      setOpen(true)
      return;
    }
    openDialog({
      event: 'warning',
      content: `ファイルをダウンロードしますか？`,
      onConfirm: () => { 
        if(!singleMode) {
          download()
          closeDialog()
          setOpen(true)
        }
        else {
          videos[masterId].downloadMp4()
          closeDialog()
        }
      },
      onClose: () => { closeDialog() },
      onCancel: () => { closeDialog() },
    })
  },[])

  const onCancelDownload = useCallback((stopdownload: any) => {
    openDialog({
      event: 'warning',
      content: `ダウンロードをキャンセルしますか？`,
      onConfirm: () => {
        setOpen(false)
        stopdownload()
        openDownloadCanceled()
      },
      onClose: () => { closeDialog() },
      onCancel: () => { closeDialog() },
    })

    const openDownloadCanceled = () => {
      openDialog({
        event: `warning`,
        content: `ダウンロードをキャンセルしました。`,
        onConfirm: () => { closeDialog() },
        onConfirmTitle: `閉じる`,
        onClose: () => { closeDialog() }
      })
    }
  },[])

  let message = downloading ? `ダウンロードしています。${progress}%（${downloaded.length}ファイル中${loadedCount}ファイル完了）` : `ダウンロードが完了しました。`
  
  return (
    <>
      <IconButton title={"ダウンロード"} onClick={() => onClick(downloading, singleMode, videos, masterId)}>
        <SaveAlt/>
      </IconButton>
      <Dialog
        container={id ? document.getElementById(id) : null}
        open={open}
        onClose={() => setOpen(false)}
        scroll="paper"
      >
        <DialogContent>
          <LinearProgress
            variant="determinate" value={progress} 
            sx={{
              display: downloading ? "block" : "none", 
              height: 15, m:"1rem", borderRadius:10,
              "& .MuiLinearProgress-bar": { transition: "none" }
            }}
          />
          <DialogContentText>
            <span dangerouslySetInnerHTML={{ __html: message }}/>
          </DialogContentText>
        </DialogContent>
          <DialogActions>
            {
              downloading &&
              <Button 
                color={"error"}
                onClick={() => onCancelDownload(stopdownload)}
              >
                キャンセル
              </Button>
            } 
            <Button
              onClick={() => setOpen(false)}
            >
              閉じる
            </Button>
        </DialogActions>
      </Dialog>
    </>
  )
})