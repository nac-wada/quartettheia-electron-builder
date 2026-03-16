import { createContext, FC, ReactNode, useContext, useState } from "react";
import { NotificationsContextType, SubscribeMessageType } from "../types/common";

const NotificationContext = createContext<NotificationsContextType | null>(null);

export const NotificationProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [notifications, setNotifications] = useState<SubscribeMessageType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = (message: SubscribeMessageType) => {
    setNotifications(prev => [message, ...prev])
    setUnreadCount(prev => prev +1);
  }

  const removeNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  const resetUnreadCount = () => {
    setUnreadCount(0)
  }



  const value = { notifications, unreadCount, addNotification, removeNotifications, resetUnreadCount }

  return (
    <NotificationContext.Provider value={value}>
      { children }
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  // プロバイダが提供されていない場合にエラーをスロー
  if (!context) {
    throw new Error('useNotifications must be used within an MessageProvider');
  }

  return context
}