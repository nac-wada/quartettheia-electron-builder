## srcディレクトリ内の構成とルール※以下のルールはメモ用のため守らなくてもいい

### srcディレクトリの構成と基本ルール

- **ルール**:
  - jsxコンポーネントを使わない場合（計算用関数、カスタムフックなど）は.tsファイルにする。
  - `src/api`：バックエンドのカメラapiが追加されたらapi下に追記していく。コンポーネントからapi呼び出すときはapi/のファイルからimportする。
  - `src/components`：どの画面でも使うコンポーネントはcomponentsに入れる。
  - `src/hooks`：どの画面でも使うカスタムフックはhooksに入れる。
  - `src/types`：どの画面でも使う定数や型定義、ローカルストレージキーはsrc/types/common.tsに追記する。
  - `src/test`：使用していないコード、サンプルコードはsrc/testにまとめる

```text
src
 ┣ api                    # カメラapiの関数
 ┣ assets                 # 画像・フォントなどの静的資産
 ┣ components             # 再利用可能な共通コンポーネント
 ┣ features               # 特定の機能に基づくUI               
 ┃ ┣ applicense           # ライセンスページの機能
 ┃ ┣ appmenu              # アップバー・サイドメニューの機能
 ┃ ┣ appversion           # AIREALについてページの機能
 ┃ ┣ calibration
 ┃ ┃ ┣ calibrationviewer  # 計算結果の確認ページの機能
 ┃ ┃ ┣ common             # キャリブレーション関連ページの共通機能
 ┃ ┃ ┣ extrinsicBoard     # キャリブレーション(チェスボード)：カメラ位置と姿勢の計算ページの機能
 ┃ ┃ ┣ extrinsicLFrame    # キャリブレーション(アクティブライト)：カメラ位置と姿勢の計算ページの機能
 ┃ ┃ ┣ intrinsicBoard     # キャリブレーション(チェスボード)：レンズひずみの計算ページの機能
 ┃ ┃ ┣ intrinsicTWand     # キャリブレーション(アクティブライト)：レンズひずみの計算ページの機能
 ┃ ┃ ┗ topPage            # キャリブレーションページの機能
 ┃ ┣ camerasetting
 ┃ ┃ ┣ devicesync         # カメラ同期設定ダイアログの機能
 ┃ ┃ ┣ network            # カメラネットワーク設定ダイアログの機能
 ┃ ┃ ┣ otheroptions       # その他の設定ダイアログの機能
 ┃ ┃ ┗ tuning             # パラメータ調整(カメラ設定ページ)の機能
 ┃ ┣ developer            # 開発者ページの機能
 ┃ ┣ deviceMoniter        # デバイスモニターページの機能
 ┃ ┣ firmware             # カメラファームウェア更新機能（試作版）
 ┃ ┣ login                # ログインページの機能
 ┃ ┣ play                 
 ┃ ┃ ┣ playlist           # 再生リスト(再生ページ)の機能
 ┃ ┃ ┗ videoplayer        # ビデオ再生画面の機能
 ┃ ┣ record               # 録画ページの機能
 ┃ ┣ settings             # 設定ページの機能
 ┃ ┗ shutdown             # シャットダウンダイアログの機能
 ┣ gen                    # カメラapiの型定義
 ┣ globalContexts         # グローバルコンテキストコンポーネント
 ┣ hooks                  # 共通のカスタムフック
 ┣ i18n                   # 多言語対応
 ┣ pages                  # アプリケーションのルーティングページ
 ┣ test                   # サンプルコード
 ┣ types                  # プロジェクト共通の型定義(定数、共通で使う型定義、ローカルストレージキーなど)
 ┣ utilities              # 共通の純粋なtypescriptの関数
 ┣ App.css
 ┣ App.test.tsx
 ┣ App.tsx
 ┣ AppRouterProvider.tsx  # アプリケーションのルーティングプロバイダー
 ┣ AuthGuard.tsx          # ログイン中またはアプリ保護無効か判別してフィルタリングするコンポーネント
 ┣ colorOptions.ts
 ┣ index.css
 ┣ index.tsx
 ┣ reportWebVitals.ts
 ┣ setupTests.ts
 ┗ vite-app-env.d.ts
```

### src/features下の各機能ディレクトリの構成と基本ルール

- **ルール**:
  - 画面全体を形成しないコンポーネント（ButtonやTextBoxはcomponents）はcomponentsにまとめる
  - カスタムフックはhooksにまとめる
  - 純粋なtypescriptの関数はutilsにまとめる
  - 定数や型定義、ローカルストレージキーはtypes.tsにまとめる（複雑なプロパティでない場合は型定義せず、直接書く）。

以下`src/features/record`を例とする
```text
src
 ┣ features
 ┃ ┣ record
 ┃ ┃ ┣ components               # 録画ページで使用するUIコンポーネント
 ┃ ┃ ┃ ┣ MoreItemsButton.tsx
 ┃ ┃ ┃ ┣ NicknameButton.tsx
 ┃ ┃ ┃ ┣ PopperInputForm.tsx
 ┃ ┃ ┃ ┣ RecordButton.tsx
 ┃ ┃ ┃ ┣ RecordCameraPanel.tsx
 ┃ ┃ ┃ ┣ RecordController.tsx
 ┃ ┃ ┃ ┣ RecordSelectButton.tsx
 ┃ ┃ ┃ ┣ RecStatuslabel.tsx
 ┃ ┃ ┃ ┣ RecTimer.tsx
 ┃ ┃ ┃ ┣ SceneTextBox.tsx
 ┃ ┃ ┃ ┗ SubjectIDTextBox.tsx
 ┃ ┃ ┣ hooks                    # 録画ページで使用するカスタムフック
 ┃ ┃ ┃ ┗ useRecordViewState.ts
 ┃ ┃ ┣ utils                    # 録画ページで使用するts関数
 ┃ ┃ ┃ ┗ checkCameraSync.ts
 ┃ ┃ ┣ index.tsx                # 録画ページの全体画面
 ┃ ┃ ┗ types.ts                 # 録画ページで使用する定数、型定義、ローカルストレージキー
```