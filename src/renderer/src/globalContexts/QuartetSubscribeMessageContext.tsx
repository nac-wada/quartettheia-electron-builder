import { createContext, FC, ReactNode, useContext, useEffect, useRef } from "react";
import { QuartetMessageListener, QuartetSubscribeMessageContextType } from "../types/common";
import { quartetSubscribeMessage } from "../api/quartetAPI";

const QuartetSubscribeMessageContext = createContext<QuartetSubscribeMessageContextType | null>(null)

export const QuartetSubscribeMessageProvider: FC<{children: ReactNode}> = ({ children }) => {
  const listeners = useRef<Set<QuartetMessageListener>>( new Set() );

  const subscribeQuartetMessageListener = (listener: QuartetMessageListener) => {
    listeners.current.add(listener)

    return () => listeners.current.delete(listener)
  }

  useEffect(() => {
    const listen = async () => {
      try {
        const res = quartetSubscribeMessage()
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
    <QuartetSubscribeMessageContext.Provider value={{ subscribeQuartetMessageListener }}>
      { children }
    </QuartetSubscribeMessageContext.Provider>
  )
}

export const useQuartetSubscribeMessageListener = () => {
  const context = useContext(QuartetSubscribeMessageContext)

  // プロバイダが提供されていない場合にエラーをスロー
  if(!context) {
    throw new Error('useQuartetSubscribeMessageListener must be used within an QuartetSubscribeMessageProvider')
  }

  return context
}