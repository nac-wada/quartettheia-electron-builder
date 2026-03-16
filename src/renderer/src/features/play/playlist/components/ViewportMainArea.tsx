// src/components/ui/viewportMainArea.tsx // スクロールしないで表示できる高さ範囲のpixelを計算
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { useDrawer } from "../../../../globalContexts/DrawerContext";

const ContentHeight = () => {
  const [viewportHeight, setViewportHeight] = useState(0); // ビューポートの高さ
  const [toolbarHeightApp, setToolbarHeightApp] = useState(0); // Toolbarの高さ
  const [footer, setFooter] = useState(0); // Footerの高さ

  const theme = useTheme();
  const mt = parseInt(theme.spacing(3), 10); // MainArea分 <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
  //const mb = parseInt(theme.spacing(3), 10); // theme.spacing(3)は文字列'24px'なので数値に変換

  useEffect(() => {
    // ビューポートの高さを取得
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    // Toolbarの高さを取得
    const toolbarAppToolBar = document.getElementById('AppToolBar');
    if (toolbarAppToolBar) {
      setToolbarHeightApp(toolbarAppToolBar.clientHeight);
    }

    // Footerの高さを取得
    const footer = document.getElementById('Footer');
    if (footer) {
      setFooter(footer.clientHeight);
    }

    // ウィンドウのリサイズ時に再計算
    window.addEventListener('resize', handleResize);

    // 初回の計算
    handleResize();

    return () => { // イベントリスナーのクリーンアップ
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 100vhからToolbarとFooterの高さとMainAreaの余白(mt4+mb4 = 32px+32px = 64px)を引いた高さを計算(スクロールしないで表示できる範囲のpx)
  //const contentHeight = viewportHeight - toolbarHeightApp - footer - mt - mb;
  const contentHeight = viewportHeight - toolbarHeightApp - footer - mt;
  //console.log('viewportMainArea : ', contentHeight, ' = ', viewportHeight, ' - ', toolbarHeightApp, ' - ', footer, ' - ', mt, ' - ', mb);

  return (contentHeight);
};


const ContentHeight2 = () => {
  const theme = useTheme();
  const mt = parseInt(theme.spacing(3), 10); // MainArea分 <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
  const mb = parseInt(theme.spacing(3), 10); // theme.spacing(4)は文字列'32px'なので数値に変換

  let contentHeight = -1;
  const appToolBarElement = document.getElementById('AppToolBar');
  const footerElement = document.getElementById('Footer');

  if (appToolBarElement?.clientHeight !== undefined && footerElement?.clientHeight !== undefined) {
    contentHeight = window.innerHeight - appToolBarElement.clientHeight - footerElement.clientHeight - mt - mb;
  }
  return (contentHeight);
};


const ToolbarHeight = () => {
  const [toolbarHeightApp, setToolbarHeightApp] = useState(0); // Toolbarの高さ

  useEffect(() => {
    // Toolbarの高さを取得
    const toolbarAppToolBar = document.getElementById('AppToolBar');
    if (toolbarAppToolBar) {
      setToolbarHeightApp(toolbarAppToolBar.clientHeight);
    }
  }, []);

  return (toolbarHeightApp);
};




const ContentWidth = () => {
  const [viewportWidth, setViewportWidth] = useState(0); // ビューポートの幅
  //const [drawerWidth, setDrawerWidth] = useState(0); // drawerの幅
  // const { drawerWidth } = useDevice(); // set drawer width
  const { drawerWidth } = useDrawer();

  const theme = useTheme();
  const mt = parseInt(theme.spacing(3), 10); // MainArea分 <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
  const mb = parseInt(theme.spacing(3), 10); // theme.spacing(4)は4*8Ppxで文字列かつ'32px'なので数値に変換


  useEffect(() => {
    // ビューポートの幅を取得
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    //const docDrawerWitdh = document.getElementById('DrawerLeft');
    //if (docDrawerWitdh) {
    //  setDrawerWidth(docDrawerWitdh.clientWidth);
    //}

    // ウィンドウのリサイズ時に再計算
    window.addEventListener('resize', handleResize);

    // 初回の計算
    handleResize();

    return () => { // イベントリスナーのクリーンアップ
      window.removeEventListener('resize', handleResize);
    };
  }, [drawerWidth]);


  // 100vhからdrawerとMainAreaの余白(mt3+mb3 = 24px+24px = 48px)を引いた幅を計算(スクロールしないで表示できる範囲のpx)
  //const contentWidth = viewportWidth - drawerWidth;
  const contentWidth = viewportWidth - drawerWidth - mt - mb;
  //const contentWidth = viewportWidth - drawerWidth - 48;
  //const contentWidth = viewportWidth - drawerWidth - 56;
  //console.log('viewportMainArea : ', contentWidth, ' = ', viewportWidth, ' - ', drawerWidth);
  //console.log('viewportMainArea : ', contentWidth, ' = ', viewportWidth, ' - ', drawerWidth, ' - ', mt, ' - ', mb);

  //1231  =  1336  -  57  -  24  -  24

  return (contentWidth);
};


export { ContentHeight, ContentHeight2, ToolbarHeight, ContentWidth };