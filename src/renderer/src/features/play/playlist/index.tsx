import { FC, memo, useRef } from "react";
import { SxProps, Table, Theme, useMediaQuery, useTheme } from "@mui/material";
import { TableComponents, TableVirtuoso, TableVirtuosoHandle } from "react-virtuoso"
import React from "react";
import { MessageModal } from "../../../components/MessageModal";
import { ReplayForm } from "../videoplayer";
import { useAppTheme } from "../../../globalContexts/AppThemeContext";
import { VideoGroupType } from "../../../types/common";
import { ContentHeight } from "./components/ViewportMainArea";
import { PlayListHeader } from "./components/PlayListHeader";
import { PlayListBody } from "./components/PlayListBody";
import { PlayListController } from "./components/PlayListController";
import { ListTopButton } from "./components/ListTopButton";
import { usePlayList } from "./hooks/usePlayList";

const table_sx: SxProps<Theme> = {
  width: "100%",
  justifyContent: "center",
}

const COMPONENTS : TableComponents<VideoGroupType, any> = {
  Table: ({style, ...props}) => (
    <Table {...props} style={{ ...style, }} sx={table_sx}/>
  ),
}

const PlayList: React.FC = React.memo(() => {
  const viewheight = ContentHeight(); 
  const md = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const tableheight = viewheight < 300 ? 300 : viewheight 
  const headerheight = 60;
  const listheight = (!md) ? 120 : 80;
  const count = Math.round((tableheight - headerheight) / listheight) + 2;
  
  return (
    <PlayListTable count={count}/>
  )
})

const PlayListTable: FC<{ count: number }> = memo(
  (props) => {
  const { count } = props;
  const { appTheme } = useAppTheme()
  const tableRef = useRef<TableVirtuosoHandle | null>(null);
  const theme = useTheme();
  const playListViewModel = usePlayList({ count: count })

  const scrollTop = () => {
    tableRef.current?.scrollToIndex({
      index: 0,
      align: "start",
      behavior: "auto",
    })
  }

  const closeReplayForm = () => {
    playListViewModel.closeReplayFormFunc()
  }

  let border = appTheme==='dark' ? "solid 2px #757575" : "solid 2px #ffffffff"

  return (
    <>
      <TableVirtuoso
        ref={tableRef}
        style={{
          width:"100%",
          border: border,
          height: "80vh",
          minHeight: 300, 
          borderRadius: 5, 
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
          backgroundColor: theme.palette.background.paper,
        }}
        endReached={async (index) => {
          playListViewModel.getRecordedKeyFileGroupsWithMetadatasFunc({ 
            startIndex: playListViewModel.listState.startIndex, 
            order: playListViewModel.listState.order, 
            getFiles: count , event: `endreached`
          })
        }}
        data={playListViewModel.listState.items}
        components={COMPONENTS}
        fixedHeaderContent={() => (
          <PlayListHeader
            count={count}
            viewModel={playListViewModel}  
            scrollTop={scrollTop}       
          />
        )}
        itemContent={(_, item) => (
          <PlayListBody
            item={item}
            viewModel={playListViewModel}
            count={count}
          />
        )}
      />

      <PlayListController viewModel={playListViewModel}/>
      
      <ListTopButton scrollTop={scrollTop}/>

      {
        playListViewModel.listState.dialogProps && 
        <MessageModal message={playListViewModel.listState.dialogProps}/>
      }

      <ReplayForm
        count={count} 
        viewModel={playListViewModel}
        close={closeReplayForm}
      />
    </>
  )
})

export { PlayList }