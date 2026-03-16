import { Error } from "@mui/icons-material";
import { SvgIconProps } from "@mui/material";
import { FC, memo, useState } from "react";
import { MessageModal } from "../../../../components/MessageModal";
import { MessageModalProps } from "../../../../types/common";

export const FileErrorIcon: FC<{text: string} & SvgIconProps> = memo(({text, ...props}) => {
  const [message, setMessage] = useState<MessageModalProps|null>(null)

  const openMessage = () => {
    const fileError: MessageModalProps = {
      event: "warning",
      title: "警告",
      content: text,
      onConfirm: () => setMessage(null),
      onConfirmTitle: "閉じる",
      onClose: () => setMessage(null)
    }
    setMessage(fileError)
  }

  return (
    <>
      <div title="警告" onClick={openMessage}>
        <Error 
          {...props} 
          color="error" 
        />
      </div>
      { message && <MessageModal message={message}/> }
    </>
  )
})