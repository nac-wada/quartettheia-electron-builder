import { createContext, FC, ReactNode, useContext, useEffect, useRef } from "react";
import { QuartetEventListener, QuartetSubscribeEventContextType } from "../types/common";
import { quartetSubscribeEvent } from "../api/quartetAPI";

const QuartetSubscribeEventContext = createContext<QuartetSubscribeEventContextType | null>(null);

export const QuartetSubscribeEventProvider: FC<{children: ReactNode}> = ({ children }) => {
  const listeners = useRef<Set<QuartetEventListener>>( new Set() );

  const subscribeQuartetEventListener = (listener: QuartetEventListener) => {
    listeners.current.add(listener)

    return () => listeners.current.delete(listener)
  }

  useEffect(() => {
    const listen = async () => {
      try {
        const res = quartetSubscribeEvent()
        if(res) {
          for await (const event of res) {
            listeners.current.forEach(listener => listener(event))
          }
        }
      } catch (e) {
        console.error(e)
      }
    }

    listen()
  },[])

  return (
    <QuartetSubscribeEventContext.Provider value={{ subscribeQuartetEventListener }}>
      { children }
    </QuartetSubscribeEventContext.Provider>
  )
}

export const useQuartetSubscribeEventListener = () => {
  const context = useContext(QuartetSubscribeEventContext)

  // プロバイダが提供されていない場合にエラーをスロー
  if(!context) {
    throw new Error('useQuartetSubscribeEventListener must be used within an QuartetSubscribeEventProvider')
  }

  return context
}