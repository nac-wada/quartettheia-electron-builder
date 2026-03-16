import { createContext, FC, ReactNode, useContext, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ApplicationMessageEvent, ApplicationMessagesContextType, ApplicationMessageType } from "../types/common";

const MessagesContext = createContext<ApplicationMessagesContextType | null>(null);

export const MessagesProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [messages, setMessages] = useState<ApplicationMessageType[]>([]);

  const addMessage = (message: Omit<ApplicationMessageType, 'messageId'>, checkSomeMessage?: ApplicationMessageEvent) => {
    setMessages((prevMessages) => {

      // 同じメッセージをメッセージリストに入れたくない場合
      if(checkSomeMessage) {
        const existSomeMessages = prevMessages.some(prevMessage => prevMessage.type===checkSomeMessage)
        if (existSomeMessages) {
          return prevMessages
        }
      }

      const createMessage = (message: Omit<ApplicationMessageType, 'messageId'>): ApplicationMessageType => {
        const id = uuidv4()

        return {
          messageId: id,
          ...message,
          ...(message.onCancel && { 
            onCancel: () => {
              message.onCancel!()
              removeMessage(id)
            } 
          }),
          ...(message.onConfirm && { 
            onConfirm: () => {
              message.onConfirm!()
              removeMessage(id)
            } 
          }),
          ...(message.onClose && { 
            onClose: () => {
              message.onClose!()
            } 
          }),
        }
      } 

      const newMessage = createMessage(message);

      return [...prevMessages, newMessage]
    });
  }

  const removeMessage = (messageId: string) => {
    setMessages((prevMessages) => prevMessages.filter((e) => e.messageId !== messageId));
  }

  const clearMessages = () => setMessages([]);

  const value = { messages, addMessage, removeMessage, clearMessages }

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
}

export const useMessages = () => {
  const context = useContext(MessagesContext);

  // プロバイダが提供されていない場合にエラーをスロー
  if (!context) {
    throw new Error('useMessages must be used within an MessageProvider');
  }

  return context
}