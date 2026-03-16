import { useEffect } from "react";
import { useDebugDrawer } from "../../../globalContexts/DebugDrawerContext";
import { useRamPercent } from "../../../globalContexts/RamPercentContext";
import { loadSettingsFromLocalStorage } from "../../../utilities/localStorage";
import { localStorage_developerMode, localStorage_ramPercentDisplayMode } from "../../../types/common";

const CheckDeveloperMode = () => {
  const { setDebugMode } = useDebugDrawer();
  const { setRamPercentDisplay} = useRamPercent();
 
  useEffect(() => {
    setDebugMode(loadSettingsFromLocalStorage(localStorage_developerMode,false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    setRamPercentDisplay(loadSettingsFromLocalStorage(localStorage_ramPercentDisplayMode,false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <></>
  )
}

export { CheckDeveloperMode }