import { FC } from "react";
import { FullScreen, FullScreenProps } from "./FullScreenWindow";

export const FullScreenContainer: FC<{
  children: React.ReactNode, 
  fullScreenProps: FullScreenProps; 
}> = ({ children, fullScreenProps }) => {

  return (
    <>
      {
        !fullScreenProps.fullScreen.fullScreenState.opened && children
      }

      <FullScreen {...fullScreenProps}/>
    </>
  )
}