import { Outlet } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { Helmet, } from 'react-helmet-async';
import MainArea from './features/appmenu/components/MainArea';
import { useAppTheme } from './globalContexts/AppThemeContext'; // flag for dark mode
import { useLocation } from 'react-router-dom'; // local storage // 元useHistory() at v6
import { MainMenuItems } from './features/appmenu/components/MenuItems';
import { grey, red } from '@mui/material/colors';
import { Appbar } from './features/appmenu';
import { MessageDialog } from './components/MessageDialog';
import { useEffect } from "react";

export function Dashboard() {
  const location = useLocation()
  const currentPath = useLocation().pathname;
  const currentLabel = MainMenuItems.find(item => item.to === currentPath)?.label ?? '';
  const appTitle = 'AIREAL-Touch'
  const appTitleAndSubtitle = `
    ${appTitle}${currentLabel ? `${currentLabel === 'ログアウト' ? 'ログイン' : currentLabel}` : '' }
  `
  const appSubtitle = `
    ${currentLabel ? `${currentLabel === 'ログアウト' ? 'ログイン' : currentLabel}` : '' }
  `
  const { appTheme } = useAppTheme();
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 3840, // for 4K // defaul:1536pix
      },
    },
    palette: {
      mode: appTheme==='dark' ? 'dark' : 'light',

      customColor: {
        main: appTheme==='dark' ? grey[900] : grey[100],
        dark: appTheme==='dark' ? red[900] : red[50],
      },

      background: {
        // default: '#bdbdbd',
        paper: appTheme==='dark' ? '#000000' : '#ffffff',
      },

    },
  });

  // デプロイの前後でサーバー上のファイルとブラウザキャッシュ上のファイルが異なるときに強制的に画面リロードする処理
  useEffect(() => {
    const handleChunkError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const message = "message" in event ? event.message : (event as any).reason?.message;

      if (
        message?.includes("Failed to fetch dynamically imported module") ||
        message?.includes("error loading dynamically imported module")
      ) {
        const CHUNK_RELOAD_KEY = "global_app_chunk_retry_timestamp";
        const now = Date.now();
        const lastReload = sessionStorage.getItem(CHUNK_RELOAD_KEY);

        // 10秒以内にリロードしていなければ実行
        if (!lastReload || now - parseInt(lastReload) > 10000) {
          sessionStorage.setItem(CHUNK_RELOAD_KEY, now.toString());
          window.location.reload();
        }
      }
    };

    window.addEventListener("error", handleChunkError, true);
    window.addEventListener("unhandledrejection", handleChunkError);

    return () => {
      window.removeEventListener("error", handleChunkError, true);
      window.removeEventListener("unhandledrejection", handleChunkError);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <title>
          {appTitleAndSubtitle}
        </title>
      </Helmet>

      <Box
        id={'App-top'}
        sx={{
          display: 'flex',
          minHeight: '100vh',
          backgroundColor: "customColor.main",
        }}
        component="div"
      >
        <CssBaseline />

        {
          location.pathname !== '/login' &&
          <>
            <Appbar appTitle={appSubtitle}/>

            <MessageDialog/>
          </>
        }

        {/* Dashboard main area */}
        <MainArea>
          <Outlet/>
        </MainArea>

      </Box>

    </ThemeProvider>
  )
}