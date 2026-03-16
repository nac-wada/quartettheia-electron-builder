import { FC, memo, useMemo, useState } from "react";
import { Box, CSSObject, Divider, Drawer, IconButton, List, Theme, useMediaQuery, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { MainMenuItems } from "./MenuItems";
import { MenuListButton } from "./MenuListButton";
import DialogShutdown from "../../shutdown";
import DialogLogout from "../../login/components/dialog";
import { useAuth } from "../../../globalContexts/AuthContext";
import { AppBarHeight, DrawerWidth } from "../../../types/common";
import { AIREALLogo } from "./AIREALIcon";
import { CalibrationResultIcon } from "./CalibrationResultIcon";
import { useCalibrationResults } from "../../../hooks/useCalibrationResults";
const openedMixin = (theme: Theme): CSSObject => {

  return {
    width: DrawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  }
};


const closedMixin = (theme: Theme): CSSObject => {

  return {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  }
};

export const Sidebar: FC<{ open:boolean, setOpen:any }> = memo(({ open, setOpen }) => {
  const theme = useTheme()
  const { isProtectEnable } = useAuth()
  const md = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const variant = useMemo(() => {if(md) { return 'permanent'} return 'temporary'},[md])
  
  // logoutのダイアログ
  const [isDialogOpenLogout, setIsDialogOpenLogout] = useState(false);

  // shutdownのダイアログ
  const [isDialogShutdown, setIsDialogShutdown] = useState(false);

  const filteredMenuListItems = MainMenuItems.filter(menu => menu.label !== "レンズひずみの計算" && menu.label !== "カメラ位置と姿勢の計算")
  const { extrinsicResult, intrinsicResult } = useCalibrationResults({})

  return (
    <>
      <Drawer 
        variant={variant}
        open={open} 
        onClose={() => setOpen(!open)}
        ModalProps={{ keepMounted: true }}
        sx={{ 
          '& .MuiDrawer-paper': {
              maxWidth: DrawerWidth,
              backgroundColor: theme.palette.background.paper
            },
          width: { sm: DrawerWidth },
          flexShrink: { sm: 0 },
          whiteSpace: { sm: 'nowrap' },
          boxSizing: { sm: 'border-box' },
          ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
          }),
          ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
          }),
        }}
      >
        <div 
          style={{ 
            textAlign: "right", 
            height: AppBarHeight, 
            display: "flex", 
            justifyContent: "end", 
            alignItems: "center", 
            backgroundColor: theme.palette.background.paper,
            paddingRight: "0.5rem",
            ...theme.mixins.toolbar
          }}
        >
          <IconButton onClick={() => setOpen(!open)}>
            { open ? <ChevronLeft/> : <ChevronRight/> }
          </IconButton>
        </div>

        <Divider/>

        <List sx={{ backgroundColor: theme.palette.background.paper }}>
        {
          filteredMenuListItems.map(({ label, to, icon }, index) => (
            <div key={index}>
              {(
                (
                  (label !== 'キャリブレーション') &&
                  (label !== 'ログアウト') &&
                  (label !== 'シャットダウン')
                  // (label !== 'キャリブレーション') &&
                  //   (label !== 'レンズひずみの計算') &&
                  //   (label !== 'カメラ位置と姿勢の計算') && 
                )
              ) && (
                <MenuListButton
                  label={label}
                  to={label !== 'マニュアル' ? to : undefined}
                  icon={icon}
                  open={open}
                  selected={location.pathname === to}
                />
              )}

              { label === 'キャリブレーション' && (
                <MenuListButton
                  label={label}
                  icon={<CalibrationResultIcon extrinsic={extrinsicResult} intrinsic={intrinsicResult}>{icon}</CalibrationResultIcon>}
                  to={to}
                  open={open}
                  selected={location.pathname === to}
                />
              )}

              {/* { label === 'キャリブレーション' && (
                <MenuListButton
                  label={label}
                  to={to}
                  icon={icon}
                  open={open}
                  selected={1}
                  onClick={() => setOpenNest(!openNest)}
                  expandNest={true}
                  openNest={openNest}
                />
              )}

              {((label === 'レンズひずみの計算')) && (
                <MenuListButtonNest
                  label={label}
                  to={to}
                  icon={<InCalibStatusBadge isCalibration={isCalibration} isFailed={intrinsicResult.isAnyCalibrationFailed}/>}
                  open={open}
                  selected={1}
                  openNest={openNest}
                />
              )}

              {((label === 'カメラ位置と姿勢の計算')) && (
                <MenuListButtonNest
                  label={label}
                  to={to}
                  icon={<ExCalibStatusBadge isCalibration={isCalibration} isFailed={extrinsicResult.isAnyCalibrationFailed}/>}
                  open={open}
                  selected={1}
                  openNest={openNest}
                />
              )}

              {((label === '計算結果の確認')) && (
                <MenuListButtonNest
                  label={label}
                  to={to}
                  icon={icon}
                  open={open}
                  selected={1}
                  openNest={openNest}
                />
              )} */}

              { label === 'ログアウト' && (isProtectEnable) && (
                <MenuListButton
                  label={label}
                  icon={icon}
                  open={open}
                  selected={location.pathname === to}
                  onClick={() => setIsDialogOpenLogout(true)} // for shutdown
                />
              )}

              { label === 'シャットダウン' && (
                <MenuListButton
                  label={label}
                  icon={icon}
                  open={open}
                  selected={location.pathname === to}
                  onClick={() => setIsDialogShutdown(true)} // for shutdown
                />
              )}

            </div>
          ))
        }

        </List>

        <div style={{ display: open && !sm ? "flex" : "none", justifyContent: "center", textAlign: "center" }}>
          <Box sx={{ width: "80%", height: "auto", backgroundColor: "rgb(14, 71, 149)", borderRadius: "100px", p: "5px", mt: "20px" }}>
            <AIREALLogo style={{ width: 160 }}/>
          </Box>
        </div>
      </Drawer>

      <DialogShutdown open={isDialogShutdown} onClose={() => setIsDialogShutdown(false)}/>

      <DialogLogout isDialogOpen={isDialogOpenLogout} setDialogOpen={setIsDialogOpenLogout}/>
    </>
  )
})