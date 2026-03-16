import { FC, memo } from "react"
import Delete from "@mui/icons-material/Delete";
import SaveAlt from "@mui/icons-material/SaveAlt";
import { IconButton, Stack } from "@mui/material";
import { CustomToolbar } from "../../../../components/ToolBar";
import { PlayListViewModel } from "../../common";

export const PlayListController: FC<{ viewModel: PlayListViewModel }> = memo((props) => {
  const { viewModel } = props;
  const selectedItems = viewModel.listState.items.filter((item) => item.selected === true)
  const selectedDownloadingItems = selectedItems.filter((item) => item.downloading === true).length > 0 ? true : false

  const downloadVideoGroups = () => {
    if(selectedDownloadingItems) {
      viewModel.openWarningDialogFunc({
        dialog: {
          event: 'warning',
          content:  `
                      選択したファイルにダウンロード中のファイルが存在するため、<br>
                      一括ダウンロードができません。<br>
                      ダウンロード中のファイルの選択をはずしてから、再度実行してください。
                    `,
          onClose: () => {
            viewModel.closeWarningDialogFunc()
          }
        }
      })
    } else {
      viewModel.openWarningDialogFunc({
        dialog: {
          event: 'warning',
          content: `選択したファイルをすべてダウンロードしますか？`,
          onConfirm: () => {
            viewModel.closeWarningDialogFunc()
            viewModel.downloadRecordedKeyFileGroupsFunc({ items: selectedItems })
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
  }

  const removeVideoGroups = () => {
    if(selectedDownloadingItems) {
      viewModel.openWarningDialogFunc({
        dialog: {
          event: 'warning',
          content: `
                      選択したファイルにダウンロード中のファイルが存在するため、<br>
                      一括削除ができません。<br>
                      ダウンロード中のファイルの選択をはずしてから、再度実行してください。
                   `,
          onClose: () => {
            viewModel.closeWarningDialogFunc()
          }
        }
      })
    } else {
      viewModel.openWarningDialogFunc({
        dialog: {
          event: 'warning',
          content: `選択したファイルをすべて削除しますか？`,
          onConfirm: () => {
            openWarningFinalRemoveVideoGroups()
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
  }

  const openWarningFinalRemoveVideoGroups = () => {
    viewModel.openWarningDialogFunc({
      dialog: {
        event: 'warning',
        content: `本当に選択したファイルをすべて削除しますか？`,
        onConfirm: () => {
          viewModel.closeWarningDialogFunc()
          viewModel.removeRecordedKeyFileGroupsFunc({ items: selectedItems })
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

  let disabled = selectedItems.length === 0

  return (
    <CustomToolbar sx={{ display: "flex", justifyContent: "center", overflowX: "hidden" }}>
      <Stack direction={"row"}>
        <IconButton title={"一括ダウンロード"}
          onClick={downloadVideoGroups}
          disabled={disabled}
          sx={{ mx: 0.5 }}
        >
          <SaveAlt/>
        </IconButton>
      
        <IconButton title={"一括削除"}
          onClick={removeVideoGroups}
          disabled={disabled}
          sx={{ mx: 0.5 }}
        >
          <Delete/>
        </IconButton>
      
      </Stack>
    </CustomToolbar>
  )
})