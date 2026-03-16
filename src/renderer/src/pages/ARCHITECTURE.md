## pagesディレクトリの構成

`BrowserRouter`の各`Route`に対応するコンポーネント
- **目的**:
  - 各URL（パス）に対応する「画面全体」を定義すること

```text
pages
 ┣ ApplicationVersionPage.tsx     # /AIREAL　AIREALについてページ
 ┣ CalibrationPage.tsx            # /calibration　キャリブレーションページ
 ┣ CalibrationViewerPage.tsx      # /calibrationViewer　計算結果の確認ページ
 ┣ CameraFirmWarePage.tsx         # /firm カメラファームウェア更新ページ（試作）
 ┣ CameraTuningPage.tsx           # /cameraTuning　カメラ設定ページ
 ┣ DeveloperPage.tsx              # /nacdev　開発者ページ
 ┣ DeviceMonitorPage.tsx          # /deviceMonitor　デバイスモニターページ
 ┣ ExtrinsicBoardPage.tsx         # /eboard　キャリブレーション(チェスボード)：カメラ位置と姿勢の計算ページ
 ┣ ExtrinsicLFramePage.tsx        # /lframe　キャリブレーション(アクティブライト)：カメラ位置と姿勢の計算ページ
 ┣ IntrinsicBoardPage.tsx         # /iboard　キャリブレーション(チェスボード)：レンズひずみの計算ページ
 ┣ IntrinsicTWandPage.tsx         # /twand　キャリブレーション(アクティブライト)：レンズひずみの計算ページ
 ┣ LicensePage.tsx                # /license　ライセンスページ
 ┣ LoginPage.tsx                  # /login ログインページ
 ┣ PlaylistPage.tsx               # /playlist　再生ページ
 ┣ RecordPage.tsx                 # /または /recordview　録画ページ
 ┗ SettingsPage.tsx               # /settings　設定ページ
```