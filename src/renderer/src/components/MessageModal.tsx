import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grow } from "@mui/material";
import { FC, memo } from "react";
import { MessageModalProps } from "../types/common"

const MessageModal: FC<{message:MessageModalProps, id?: string}> = memo (({ message, id }) => {
  const { onCancelTitle, onConfirmTitle, onCancelButtonProps, onConfirmButtonProps, children } = message;
  const confirmTitle = (!!onConfirmTitle) ? onConfirmTitle : 'はい'
  const cancelTitle = (!!onCancelTitle) ? onCancelTitle : 'いいえ'

  return (
    <Dialog
      container={id ? document.getElementById(id) : null}
      open={!!message.event}
      onClose={message.onClose}
      scroll="paper"
      slots={{ transition: Grow }}
      slotProps={{
        transition: {
          style: {
            transformOrigin: '50% 50% 0',
          },
          timeout: { 
            enter: 500, 
            exit: 500 
          }
        }
      }}
    >
      {
        message.title &&
        <DialogTitle>{message.title}</DialogTitle>
      }
      <DialogContent>
        { children }
        <DialogContentText>
          <span dangerouslySetInnerHTML={{ __html: message.content }}/>
        </DialogContentText>
      </DialogContent>
      {
        ((!!message.onConfirm) || (!!message.onCancel)) &&
        <DialogActions>
          {
            (!!message.onCancel) &&
            <Button 
              color={"error"}
              onClick={message.onCancel}
              {...onCancelButtonProps}
            >
              { cancelTitle }
            </Button> 
          }
          {
            (!!message.onConfirm) && 
            <Button
              onClick={message.onConfirm}
              {...onConfirmButtonProps}
            >
              { confirmTitle}
            </Button>
          }
        </DialogActions>
      }
    </Dialog>
  )
})

export { MessageModal }