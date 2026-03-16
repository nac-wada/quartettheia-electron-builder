// src/appLayout/MenuItems.tsx : 左メニューの項目+区切り線+リンク先指定
import RadioButtonChecked from "@mui/icons-material/RadioButtonChecked";
import PlayCircle from "@mui/icons-material/PlayCircle";
import Tune from "@mui/icons-material/Tune";
import PanoramaVertical from "@mui/icons-material/PanoramaVertical";
import PanoramaVerticalTwoTone from "@mui/icons-material/PanoramaVerticalTwoTone";
import Merge from "@mui/icons-material/Merge";
import Pageview from "@mui/icons-material/Pageview";
import Settings from "@mui/icons-material/Settings";
import Help from "@mui/icons-material/Help";
import Info from "@mui/icons-material/Info";
import Balance from "@mui/icons-material/Balance";
import Logout from "@mui/icons-material/Logout";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";


// // urlとアイコンとボーダー(線)を定義 ※英語版
// const MainMenuItems = [
//   { label: 'Getting started',      to: '/gettingStarted',      icon: <Article /> },
//   //{ label: '---'},
//   { label: 'Record',               to: '/recordview',          icon: <RadioButtonChecked /> },
//   { label: 'Play',                 to: '/playlist' ,           icon: <PlayCircle /> },
//   { label: '---'},
//   { label: 'Camera tuning',        to: '/cameraTuning',        icon: <Tune /> },
//   { label: 'Calibration',          to: '/extrinsicParameters', icon: <PanoramaVertical /> },
//   { label: 'Intrinsic parameters', to: '/intrinsicParameters', icon: <PanoramaVerticalTwoTone /> },
//   { label: 'Intrinsic batch',      to: '/intrinsicBatch',      icon: <PanoramaVerticalTwoTone /> },
//   { label: 'Extrinsic parameters', to: '/extrinsicParameters', icon: <PanoramaVerticalSelect /> },
//   { label: 'Calibration viewer',   to: '/calibrationViewer',   icon: <Pageview /> },
//   { label: '---'},
//   { label: 'Settings',             to: '/settings',            icon: <Settings /> },
//   { label: 'Help',                 to: '/help',                icon: <Help /> },
//   { label: 'License',              to: '/license',             icon: <Balance /> },
//   { label: 'Version',              to: '/version',             icon: <Info /> },
//   { label: '---'},
//   { label: 'Logout',               to: '/login',               icon: <Logout /> },
//   { label: 'Shutdown',             to: '/shutdown',            icon: <PowerSettingsNew /> },
//   { label: '---'},
//   { label: 'Device monitor',       to: '/deviceMonitor',       icon: <Monitor /> },
//   { label: 'Quartet',              to: '/tmpQuartet',},
//   { label: 'Solo',                 to: '/tmpSolo',},
//   { label: 'Test',                 to: '/tmpTest',},
// ];

// urlとアイコンとボーダー(線)を定義
const MainMenuItems = [
  // { label: 'チュートリアル',            to: '/gettingStarted',      icon: <Article /> },
  //{ label: '---'},
  { label: '録画',                      to: '/recordview',          icon: <RadioButtonChecked /> },
  { label: '再生',                      to: '/playlist' ,           icon: <PlayCircle /> },
  { label: '---'},
  { label: 'カメラ設定',                to: '/cameraTuning',        icon: <Tune /> },
  { label: 'キャリブレーション',         to: '/calibration',         icon: <PanoramaVertical/> },
  { label: 'レンズひずみの計算',        to: '/twand', icon: <PanoramaVerticalTwoTone /> },
  { label: 'カメラ位置と姿勢の計算',    to: '/lframe', icon: <Merge /> },
  { label: 'レンズひずみの計算',        to: '/iboard', icon: <PanoramaVerticalTwoTone /> },
  { label: 'カメラ位置と姿勢の計算',    to: '/eboard', icon: <Merge /> },
  { label: '計算結果の確認',            to: '/calibrationViewer',   icon: <Pageview /> },
  { label: '---'},
  { label: 'アプリ設定',                to: '/settings',            icon: <Settings /> },
  { label: 'マニュアル',                to: '/help',                icon: <Help /> },
  { label: 'AIREALについて',            to: '/AIREAL',              icon: <Info/>},
  { label: 'ライセンス',                to: '/license',             icon: <Balance /> },
  { label: '---'},
  { label: 'ログアウト',                to: '/login',               icon: <Logout /> },
  { label: 'シャットダウン',            to: '/shutdown',            icon: <PowerSettingsNew /> },
  { label: '---'},
];

export { MainMenuItems };


