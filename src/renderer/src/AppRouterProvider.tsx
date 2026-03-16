import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from "react-router-dom";
import { Dashboard } from "./App";
import RecordPage from "./pages/RecordPage";
import PlaylistPage from "./pages/PlaylistPage";
import TuningPage from "./pages/CameraTuningPage";
import CalibrationPage from "./pages/CalibrationPage";
import CalibrationViewerPage from "./pages/CalibrationViewerPage";
import SettingsPage from "./pages/SettingsPage";
import DeveloperPage from "./pages/DeveloperPage";
import LicensePage from "./pages/LicensePage";
import ApplicationVersionPage from "./pages/ApplicationVersionPage";
import LoginPage from "./pages/LoginPage";
import DeviceMonitorPage from "./pages/DeviceMonitorPage";
import IntrinsicBoardPage from "./pages/IntrinsicBoardPage";
import ExtrinsicBoardPage from "./pages/ExtrinsicBoardPage";
import { useCalibrationMode } from "./globalContexts/CalibrationTypeContext";
import ExtrinsicLFramePage from "./pages/ExtrinsicLFramePage";
import IntrinsicTWandPage from "./pages/IntrinsicTWandPage";
import CameraFirmWarePage from "./pages/CameraFirmWarePage";
import { AuthGuard } from "./AuthGuard";

export default function App() {
  const { calibrationConfig } = useCalibrationMode()

  let routes: RouteObject[] = 
    [
      {index: true, path:'/recordview',          element: <RecordPage/> },
      {path:'/playlist',            element: <PlaylistPage/> },
      {path:'/cameraTuning',        element: <TuningPage /> },
      {path:'/calibration',         element: <CalibrationPage/> },
      {path:'/twand',       element: <IntrinsicTWandPage/> },
      {path:'/lframe',       element: <ExtrinsicLFramePage/> },
      {path:'/iboard', element: <IntrinsicBoardPage /> },
      {path:'/eboard', element: <ExtrinsicBoardPage /> },
      {path:'/calibrationViewer',   element: <CalibrationViewerPage /> },
      {path:'/settings',            element: <SettingsPage /> },
      {path:'/nacdev',              element: <DeveloperPage /> },
      {path:'/license',             element: <LicensePage /> },
      {path:'/AIREAL',              element: <ApplicationVersionPage/> },
      {path:'/deviceMonitor',       element: <DeviceMonitorPage /> },
      {path:'/firmware',            element: <CameraFirmWarePage/>}
    ]
  
  let filteredRoute = (calibrationConfig.calType === "wand") ? 
                      routes.filter((route) => route.path !== "/iboard" && route.path !== "/eboard") :
                      routes.filter((route) => route.path !== "/twand" && route.path !== "/lframe")

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard/>,
      children: [
        {index: true, element: <Navigate to="/recordview" replace />},

        // ログインページ（isProtectEnableの判定はLoginPage内で行うのが確実）
        { path: 'login', element: <LoginPage /> },
        
        // 認証ガード付きルート
        {
          element: <AuthGuard />,
          children: filteredRoute
        },

        // どこにもマッチしない場合
        { path: '*', element: <Navigate to="/recordview" replace /> }
      ]
    },
  ])

  return <RouterProvider router={router}/>
}