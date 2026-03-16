// src/appLayout/MenuListButton.tsx : 左メニュー項目の追加用関数
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Collapse, List } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface MenuListItemProps {
  label: string;
  to?:  string;
  icon?: React.ReactNode;
  open?: boolean;
  selected: boolean;
  onClick?: () => void;
  expandNest?: boolean;
  openNest?: boolean;
}

let count_func_menulistitem = 0; // カウンター用
function MenuListButton(
  {
    label,
    to = '',
    icon = null,
    open = false,
    selected,
    onClick,
    expandNest = false,
    openNest,
}: MenuListItemProps) {
  const location = useLocation(); // 正しい場所でReactフックを呼び出す
  const currentPath = location.pathname;

  // const { recordingStatus } = useRecordingStatus()

  const theme = useTheme();
  const isActive = to === currentPath; // メニューアイテムがアクティブかどうかを確認
  // isActiveがtrueの場合、選択されているページなので、適切なスタイルを適用
  const listItemButtonStyle = {
    backgroundColor: isActive ? theme.palette.action.selected : theme.palette.background.default,
  };

  // 一意のkey生成
  const key = `${label}-${count_func_menulistitem}`;
  count_func_menulistitem = count_func_menulistitem + 1;

  // 線
  if (label === '---') {
    return (
      <Divider key={key} />
    );
  }

  const linkProps = to ? { component: Link, to } : {};

  return (
      <ListItem key={key} disablePadding sx={{ display: 'block' ,}}>
        <ListItemButton
          title={label}
          href={label === "マニュアル" ? '/doc/manual/AIREAL_MANUAL_JP.pdf' : ""}
          rel={label === "マニュアル" ? "noreferrer" : undefined}
          target={label === "マニュアル" ? '_blank' : undefined}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            textDecoration: 'none',
            color: 'text.primary',
            ...listItemButtonStyle,
            backgroundColor: isActive ? theme.palette.action.selected : theme.palette.background.paper
          }}
          {...linkProps}
          selected={selected}
          onClick={label !== "マニュアル" ? onClick : undefined}
        >
          {icon && (
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {icon}
            </ListItemIcon>
          )}
          <ListItemText
            primary={label}
            primaryTypographyProps={{
              fontSize: 15,
              variant: 'subtitle2',
            }}
            sx={{ display: open ? "block" : "none" }}
          />
          { ((expandNest === true) && (open === true)) && (
            openNest ? <ExpandLess /> : <ExpandMore />
          )}

        </ListItemButton>
      </ListItem>
  );
}


// -------------------------

interface MenuListItemPropsNest {
  label: string;
  to?:  string;
  icon?: React.ReactNode;
  open?: boolean;
  selectedIndex: number;
  onClick?: () => void;
  openNest?: boolean;
}

let count_func_menulistitem_nest = 0; // カウンター用
function MenuListButtonNest(
  {
    label,
    to = '',
    icon = null,
    open = false,
    selectedIndex,
    onClick,
    openNest,
  }: MenuListItemPropsNest) {
  const location = useLocation(); // 正しい場所でReactフックを呼び出す
  const currentPath = location.pathname;

  // const { recordingStatus } = useRecordingStatus()

  const theme = useTheme();
  const isActive = to === currentPath; // メニューアイテムがアクティブかどうかを確認
  // isActiveがtrueの場合、選択されているページなので、適切なスタイルを適用
  const listItemButtonStyle = {
    backgroundColor: isActive ? theme.palette.action.selected : theme.palette.background.default,
  };

  // 一意のkey生成
  const key = `${label}-${count_func_menulistitem_nest}`;
  count_func_menulistitem_nest = count_func_menulistitem_nest + 1;

  // 線
  if (label === '---') {
    return (
      <Divider key={key} />
    );
  }

  const linkProps = to ? { component: Link, to } : {};

  return (
    <Collapse in={openNest} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
          <ListItem key={key} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              title={label}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                textDecoration: 'none',
                color: 'text.primary',
                ...(open && { pl: 4 }),
                ...listItemButtonStyle,
                // backgroundColor: recordingStatus.isRecordings ? red[50] : isActive ? theme.palette.action.selected : theme.palette.background.default,
                backgroundColor: isActive ? theme.palette.action.selected : theme.palette.background.paper
              }}
              {...linkProps}
              selected={selectedIndex === count_func_menulistitem}
              onClick={onClick}
            >
              {icon && (
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {icon}
                </ListItemIcon>
              )}
              <ListItemText primary={label} sx={{ display: open ? "block" : "none" }} />
            </ListItemButton>
          </ListItem>
      </List>
    </Collapse>
  );
}

export { MenuListButton, MenuListButtonNest }