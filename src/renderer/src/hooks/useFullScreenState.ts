import { useCallback, useState } from "react";
import { changeModeFuncType, FullScreenStateType, fullScreenType } from "../types/common";

export const useFullScreenState = (): FullScreenStateType => {
  const [ fullScreenState, setFullScreenState ] = useState<fullScreenType>({
    opened: false,
    index: "",
  })

  const changeMode: changeModeFuncType = useCallback((multiMode, index) => {
    switch (multiMode) {
      case true: setFullScreenState((prev) => ({ ...prev, multiMode: multiMode })); break;
      case false:
        setFullScreenState((prev) => ({ ...prev, index: index}));
        setFullScreenState((prev) => ({ ...prev, multiMode: multiMode})); break;
    }
  },[])

  const openFullScreen = useCallback(() => {
    setFullScreenState((prev) => ({ ...prev, opened: true}))
  },[])

  const closeFullScreen = useCallback(() => {
    setFullScreenState((prev) => ({ ...prev, opened: false }))
  },[])

  return {
    fullScreenState,
    changeMode,
    openFullScreen,
    closeFullScreen
  }
}
