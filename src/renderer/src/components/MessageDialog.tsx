import { FC, memo } from "react";
import { useMessages } from "../globalContexts/MessagesContext";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export const MessageDialog: FC = memo(() => {
  const { messages, removeMessage } = useMessages()

  if(messages.length === 0) {
    return null
  }

  return (
    <div>
      {
        messages.map((
          { 
            messageId, 
            title, 
            content, 
            children,
            onCancel,
            onCancelButtonProps,
            onCancelTitle,
            onClose,
            onConfirm,
            onConfirmButtonProps,
            onConfirmTitle  
          }, index) => (
          <Dialog
            key={messageId} 
            container={document.getElementById(`${messageId}`)}
            open
            onClose={(!!onClose) ? onClose : () => removeMessage(messageId)}
            scroll="paper"
            slotProps={{ backdrop: {
              sx: {
                ...(index > 0 && {
                  backgroundColor: "rgba(255, 255, 255, 0)"
                })
              }
            }}}
          >
            {
              title && <DialogTitle>{title}</DialogTitle>
            }
            <DialogContent>
              { children }
              <DialogContentText>
                <span dangerouslySetInnerHTML={{ __html: content }}/>
              </DialogContentText>
            </DialogContent>
            {
              ((!!onConfirm) || (!!onCancel)) &&
              <DialogActions>
                {
                  (!!onCancel) &&
                  <Button 
                    color={"error"}
                    onClick={onCancel}
                    {...onCancelButtonProps}
                  >
                    { (!!onCancelTitle) ? onCancelTitle : "いいえ" }
                  </Button> 
                }
                {
                  (!!onConfirm) && 
                  <Button
                    onClick={onConfirm}
                    {...onConfirmButtonProps}
                  >
                    { (!!onConfirmTitle) ? onConfirmTitle : "はい" }
                  </Button>
                }
              </DialogActions>
            }
          </Dialog>
        ))
      }
    </div>
  )
})