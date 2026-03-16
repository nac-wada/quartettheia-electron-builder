import { FC, memo } from "react";
import { Checkbox, IconButton, Stack, SxProps, TableCell, Theme, Typography, useMediaQuery } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import { Thumbnail, ThumbnailContainer } from "./Thumbnail";
import { TextBox } from "./TextBox";
import { ProgressIcon } from "./ProgressIcon";
import { VideoGroupType } from "../../../../types/common";
import { PlayListViewModel } from "../../common";

const PlayListBody: FC<{
  item: VideoGroupType,
  viewModel: PlayListViewModel,
  count: number
}> = memo((props) => {
  const { item, viewModel } = props;
  const md = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const textField_sx: SxProps<Theme> = {
    my: 2.5,
    mx: 0.5,
    minWidth: 160,
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // 初期状態では枠線非表示
      borderRadius: 1
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: '1px solid', // ホバー時に枠線表示
      borderColor: 'primary.main'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: '1px solid', // フォーカス時に枠線表示
      borderColor: 'primary.main'
    },
    "& .MuiInputBase-input": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontWeight: "bold",
      color: 'text.secondary'
    }
  }

  const bodyTableCell_sx: SxProps<Theme> = {
    paddingX: 0,
    paddingY: 0.1,
    fontWeight: "bold",
    color: "text.secondary",
    fontSize: 15,
    height: { xs: 120, md: 80 },
  }

  const Thumbnail_sx: SxProps<Theme> = {
    paddingX: 0,
    paddingY: 0.1,
    fontWeight: "bold",
    color: "text.secondary",
    fontSize: 15,
  }

  const smTextfield_sx = {
    mr:2,
    height: 20,
    minWidth:160,
    width: "auto",
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // 初期状態では枠線非表示
      borderRadius: 1
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: '1px solid', // ホバー時に枠線表示
      borderColor: 'primary.main'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: '1px solid', // フォーカス時に枠線表示
      borderColor: 'primary.main'
    },
    "& .MuiInputBase-input": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      p:0,
      fontWeight: "bold"
    }
  }

  const smTypography_sx = {
    fontSize:12,
    height: 16,
    maxWidth: 200,
    fontWeight: "bold",
    "& .MuiTypography-subtitle2": {
      overflow: "hidden",
      textOverFlow: "ellipsis"
    }
  }

  const removeVideoGroup = () => {
    viewModel.openWarningDialogFunc({
      dialog: {
        event: 'warning',
        content: `ファイルを削除しますか？`,
        onConfirm: () => {
          openFinalWaringDialog()
        },
        onCancel: () => {
          viewModel.closeWarningDialogFunc()
        },
        onClose: () => {
          viewModel.closeWarningDialogFunc()
        }
      }
    })
  }

  const openFinalWaringDialog = () => {
    viewModel.openWarningDialogFunc({
      dialog: {
        event: 'warning',
        content: `本当にファイルを削除しますか？`,
        onConfirm: () => {
          viewModel.closeWarningDialogFunc()
          viewModel.removeRecordedKeyFileGroupFunc({ item: item })
        },
        onCancel: () => {
          viewModel.closeWarningDialogFunc()
        },
        onClose: () => {
          viewModel.closeWarningDialogFunc()
        }
      }
    })
  }

  const downloadVideoGroup = () => {
    viewModel.openWarningDialogFunc({
      dialog: {
        event: 'warning',
        content: `ファイルをダウンロードしますか？`,
        onConfirm: () => {
          viewModel.closeWarningDialogFunc()
          viewModel.downloadRecordedKeyFileGroupFunc({ item: item })
        },
        onCancel: () => {
          viewModel.closeWarningDialogFunc()
        },
        onClose: () => {
          viewModel.closeWarningDialogFunc()
        }
      }
    })
  }

  const stopDownloadVideoGroup = () => {
    viewModel.openWarningDialogFunc({
      dialog: {
        event: 'warning',
        content: `ダウンロードをキャンセルしますか？`,
        onConfirm: () => {
          viewModel.closeWarningDialogFunc()
          viewModel.stopDownloadRecordedKeyFileGroupFunc({ item })
        },
        onCancel: () => {
          viewModel.closeWarningDialogFunc()
        },
        onClose: () => {
          viewModel.closeWarningDialogFunc()
        }
      }
    })
  }

  const openVideoPlayer = () => {
    viewModel.openReplayFormFunc({ itemKey: item.key })
  }

  const progress = Math.round(item.video.map(v => v.loaded).reduce((sum, e) => sum + e, 0)/item.video.length)
  const loadedcount = item.video.filter((v) => v.loaded === 100).length

  let errorTag = item.video.filter(({ hasFrameDrops, hasUnstableSyncFrames }) => hasFrameDrops || hasUnstableSyncFrames)

  const text = `
                 録画ファイルに問題が発生しています。<br>
                  ${errorTag.map(({ hasFrameDrops, hasUnstableSyncFrames, nickname }) => {
                    let errorText = ""
                    if(hasFrameDrops && hasUnstableSyncFrames) { errorText = "　フレームドロップしています<br>　カメラ同期に失敗しています<br>" }
                    else if(hasFrameDrops && !hasUnstableSyncFrames) { errorText = "　フレームドロップしています<br>" }
                    else if(!hasFrameDrops && hasUnstableSyncFrames) { errorText = "　カメラ同期に失敗しています<br>" }
                    return `・${nickname}：<br> ${errorText}`
                  }).join('')}
               `
  return (
    <>
      <TableCell align="center" size="small" sx={{...bodyTableCell_sx}}
        onClick={() => viewModel.selectRecordedKeyFileGroupFunc({ item: item })}
      >
        <Checkbox color="primary" size="small"
          value={item.key}
          checked={item.selected}
        />
      </TableCell>
      <TableCell sx={{...Thumbnail_sx}} align="center">
        
          {
            (!md) 
            ? <ThumbnailContainer item={item} openVideoPlayer={openVideoPlayer} errorMessage={text} errorTag={errorTag.length!==0}/>
            : <Thumbnail
                item={item}  
                openVideoPlayer={openVideoPlayer}
                errorMessage={text} 
                errorTag={errorTag.length!==0}
              /> 
          }
      </TableCell>
      {
        (!md)
        ? <TableCell align="left" sx={{minWidth:180,...bodyTableCell_sx}}>
            <div style={{ width: "100%", paddingTop: 5 }}>
              <TextBox 
                sx={smTextfield_sx} textinputprops={{ maxLength: 32, style: {textAlign: "initial"}}}
                id='scene' value={item.video[0].sceneName} item={item} 
                viewModel={viewModel}
              />
              <TextBox 
                sx={smTextfield_sx} textinputprops={{ maxLength: 32, style: {textAlign: "initial"}}} 
                id='subject' value={item.video[0].subjectId} item={item} 
                viewModel={viewModel}
              />
              <Typography noWrap color={"text.secondary"} 
                sx={smTypography_sx}
              >
                {`サイズ：${item.bytes}MB`}
              </Typography>
              <Typography noWrap color={"text.secondary"} 
                sx={smTypography_sx}
              >
                { `録画日時: 
                    ${String(item.date.getFullYear())}.
                    ${String(item.date.getMonth() + 1).padStart(2, "0")}.
                    ${String(item.date.getDate()).padStart(2, "0")}
                    ${String(item.date.getHours()).padStart(2, "0")}:
                    ${String(item.date.getMinutes()).padStart(2, "0")}:
                    ${String(item.date.getSeconds()).padStart(2, "0")}` 
                }
              </Typography>
              <Stack direction={"row"} sx={{display:"flex",justifyContent:"flex-end",mr:1}}>
                <ProgressIcon
                  downloading={item.downloading}
                  loadedcount={loadedcount}
                  progress={progress}
                  disabled={item.updatingSceneName || item.updatingSubjectId}
                  sx={{width:40, height: 40, zIndex: 1}}
                  onClick={item.downloading ? stopDownloadVideoGroup : downloadVideoGroup}
                />

                <IconButton 
                  title={"削除"}
                  sx={{width: 40,height: 40,}} 
                  disabled={ item.downloading || item.updatingSceneName || item.updatingSubjectId }
                  onClick={removeVideoGroup}
                >
                  <Delete/>
                </IconButton>
            
              </Stack>
            </div>
          </TableCell>
        : <>
            <TableCell sx={{maxWidth: 200,...bodyTableCell_sx}} align="center" >
              <TextBox 
                sx={textField_sx} textinputprops={{ maxLength: 32, style: { textAlign: "center" } }}
                id='scene' value={item.video[0].sceneName} 
                item={item} 
                viewModel={viewModel}
              />
            </TableCell>
            <TableCell sx={{maxWidth: 200,...bodyTableCell_sx}} align="center" >
              <TextBox 
                sx={textField_sx} textinputprops={{ maxLength: 32, style: {textAlign: "center"}}}
                id='subject'  value={item.video[0].subjectId} item={item} 
                viewModel={viewModel}
              />
            </TableCell>
            <TableCell sx={{minWidth: 150,...bodyTableCell_sx}} align="center" >
              {String(item.date.getFullYear())}.
              {String(item.date.getMonth()+1).padStart(2,"0")}.
              {String(item.date.getDate()).padStart(2,"0")}{" "}
              {String(item.date.getHours()).padStart(2,"0")}:
              {String(item.date.getMinutes()).padStart(2,"0")}:
              {String(item.date.getSeconds()).padStart(2,"0")}
            </TableCell>
            <TableCell sx={{minWidth: 100,...bodyTableCell_sx}} align="center" >{item.bytes}MB</TableCell>
            <TableCell sx={{...bodyTableCell_sx}} align="center" >
              <Stack direction={"row"}>
                <ProgressIcon
                  downloading={item.downloading}
                  loadedcount={loadedcount}
                  progress={progress}
                  disabled={item.updatingSceneName || item.updatingSubjectId}
                  sx={{width:40, height: 40, zIndex: 1}}
                  onClick={item.downloading ? stopDownloadVideoGroup : downloadVideoGroup}
                />
                
                <IconButton
                  title={"削除"}
                  sx={{width:40, height: 40}}
                  disabled={ item.downloading || item.updatingSceneName || item.updatingSubjectId }
                  onClick={removeVideoGroup}
                >
                  <Delete/>
                </IconButton>
              
              </Stack>
            </TableCell>
          </>
      }
    </>
  )
})

export { PlayListBody }