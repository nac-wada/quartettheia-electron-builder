import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { FC, memo, useEffect } from "react";
import { IconButton, Theme, Toolbar, Typography, useMediaQuery } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { CheckDeveloperMode } from "./components/CheckDevelopMode";
import { AIREALLogo } from "./components/AIREALIcon";
import NotificationReceive from "./components/NotificationIcon";
import { RecordingEventBatch } from "./components/AirealStatusLabel";
import Logo from "./components/Logo";
import { useDrawer } from "../../globalContexts/DrawerContext";
import { AppBarHeight, DrawerWidth } from "../../types/common";
import { useDevices } from "../../globalContexts/DeviceContext";
import { Sidebar } from "./components/Sidebar";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean,
  md?: boolean
}

const Topbar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop != "open" && prop != "md"

})<AppBarProps>(({ theme, open, md }) => ({
  ...(!open && {zIndex: theme.zIndex.drawer + 1,}),
    ...( md && {
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      ...(open && {
        marginLeft: DrawerWidth,
        width: `calc(100% - ${DrawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
    })
  })
}))


export const Appbar: FC<{ appTitle: string }> = memo(({ appTitle }) => {
  const md = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const { isDrawerOpen, setIsDrawerOpen, setDrawerWidth } = useDrawer()
  const { isLoading, error } = useDevices()

  useEffect(() => {
    if(md) {
      if(isDrawerOpen) {
        setDrawerWidth(279)
      }
      else {
        setDrawerWidth(64)
      }
    }
    else {
      setDrawerWidth(0)
    }
  },[isDrawerOpen, md])

  return (
    <>
      <Topbar style={{ height: AppBarHeight}} open={isDrawerOpen} md={md} position="fixed">
        <Toolbar id="AppToolBar" sx={{ bgcolor: '#094594', pr: "24px", height: AppBarHeight}}>
          <IconButton 
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            sx={{
              marginRight: { xs: "5px", sm: "24px" },
                ...(isDrawerOpen && { display: { xs: "inline", md: "none" } }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <div style={{ display: "flex", alignItems: "center"}}>
            { sm ? <><AIREALLogo style={{ width: 160}}/></> : "" }
          </div>

          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {sm && <>｜</>}{appTitle}
          </Typography>

          <CheckDeveloperMode/>

          <div style={{ display: "flex", alignItems:"center" }}>
            { (!isLoading && !error) && <RecordingEventBatch/> }

            { (!isLoading && !error) && <NotificationReceive /> }

            <Logo />
          </div>
        </Toolbar>
      </Topbar>
      <Sidebar open={isDrawerOpen} setOpen={setIsDrawerOpen}/>
    </>
  )
})