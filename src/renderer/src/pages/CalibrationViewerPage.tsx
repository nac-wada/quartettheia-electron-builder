// src/pages/CalibrationViewerPage.tsx : 表示用ページ
import React, { lazy, Suspense } from "react";
import { SnackbarProvider } from 'notistack';
import Loading from "../components/Loading";

const CalibrationViewer = lazy(() => import('../features/calibration/calibrationviewer/index'))

export default function CalibrationViewerPage() {
  return (
    <React.Fragment>

      <SnackbarProvider maxSnack={4}>
        <Suspense fallback={<Loading/>}>
          <CalibrationViewer/>
        </Suspense>
      </SnackbarProvider>

    </React.Fragment>
  );
}
