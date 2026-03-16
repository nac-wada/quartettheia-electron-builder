import { FC, memo } from "react";
import { Checkbox, Menu, MenuItem, SxProps, TableCell, TableRow, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { PlayListViewModel } from "../../common";

const PlayListHeader: FC<{
  count: number,
  viewModel: PlayListViewModel,
  scrollTop: () => void,
}> = memo((props) => {
  const { count, viewModel, scrollTop } = props;
  const selectedAllItems = (viewModel.listState.items.length === viewModel.listState.items.filter((item) => item.selected === true).length) && viewModel.listState.items.length !== 0 ? true : false
  const theme = useTheme();
  const md = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const sortList = [
    {number:3, label:"録画日時の古い順"},
    {number:4, label:"録画日時の新しい順"},
    {number:5, label:"サイズ小さい順"},
    {number:6, label:"サイズ大きい順"},
  ]

  const headerTableRow_sx: SxProps<Theme> = {
    width: "100%",
  }

  const headerTableCell_sx: SxProps<Theme> = {
    fontWeight: "bold",
    fontSize: 16,
  }

  const sortMenuButton_sx: SxProps<Theme>= {
    fontSize:13,
    fontWeight: "bold",
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  }

  const SortButton = () => {
    return (
      <>
        <Typography
          sx={sortMenuButton_sx}
          onClick={viewModel.openHandleSortMenu}
        >
          {sortList[viewModel.listState.order-3].label}
          {
            Boolean(viewModel.listState.sortMenuAnchor)
            ? <ExpandLess/>
            : <ExpandMore/>
          }
        </Typography>
        <Menu
          open={Boolean(viewModel.listState.sortMenuAnchor)}
          anchorEl={viewModel.listState.sortMenuAnchor}
          sx={{
            "& .MuiMenu-paper": {
              borderRadius: 2
            }
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={viewModel.closeHandleSortMenu}
        >
        {
          sortList.map((s,index) => (
            <MenuItem
              key={index}
              sx={{
                fontWeight: "bold",
                color: s.number !== viewModel.listState.order ? "text.secondary" : "primary.main"
              }}
              onClick={() => {
                viewModel.changeOrder({ requestOrder: s.number })
                viewModel.getRecordedKeyFileGroupsWithMetadatasFunc({ startIndex: 0, order: s.number , getFiles: count, event: `Sort` }) 
                scrollTop()
                viewModel.closeHandleSortMenu()
              }}
            >
              {
                s.label
              }
            </MenuItem>
          ))
        }
        </Menu>
      </>
    )
  }

  const HeaderContent = (name:string) => {
    return (
      <Typography sx={{height: 16,fontWeight:"bold"}}>
        {name}
      </Typography>
    )
  }

  return (
    <TableRow 
      sx={{
        ...headerTableRow_sx,
        backgroundColor:theme.palette.background.paper,
        height:60,
      }}
    >
      <TableCell sx={{...headerTableCell_sx}} align="center"
        onClick={viewModel.selectAllRecordedKeyFileGroupsFunc}
      >
        <Checkbox color="primary" size="small" sx={{m:-2}} 
          checked={selectedAllItems}
        />
      </TableCell>
      <TableCell sx={headerTableCell_sx} align="center"></TableCell>
      {
        (!md) 
        ? <TableCell align="center" sx={headerTableCell_sx}>{SortButton()}</TableCell>
        : <>
            <TableCell sx={headerTableCell_sx} align="center">
              {HeaderContent("シーン")}
            </TableCell>
            <TableCell sx={headerTableCell_sx} align="center">
            {HeaderContent("被験者")}
            </TableCell>
            <TableCell sx={headerTableCell_sx} align="center">
              <div style={{height:16,display:"flex",justifyContent:"center",alignItems:"center"}}>
                録画日時
                {
                  viewModel.listState.order === 4
                  ? <ArrowDropDown
                      onClick={() => {
                        viewModel.changeOrder({ requestOrder: 3 })
                        viewModel.getRecordedKeyFileGroupsWithMetadatasFunc({ startIndex: 0, order: 3, getFiles: count, event: `time:sort-dropdown` })
                        // scrollToTop()
                      }}
                    />
                  : <ArrowDropUp
                      onClick={() => {
                        viewModel.changeOrder({ requestOrder: 4 })
                        viewModel.getRecordedKeyFileGroupsWithMetadatasFunc({ startIndex: 0, order: 4 , getFiles: count, event: `time:sort-dropup` }) 
                        // scrollToTop()
                      }}
                    />
                }
              </div>
            </TableCell>
            <TableCell sx={headerTableCell_sx} align="center">
              <div style={{height:16,display:"flex",justifyContent:"center",alignItems:"center"}}>
                サイズ
                {
                  viewModel.listState.order === 6
                  ? <ArrowDropDown
                      onClick={() => {
                        viewModel.changeOrder({ requestOrder: 5 })
                        viewModel.getRecordedKeyFileGroupsWithMetadatasFunc({ startIndex: 0, order: 5 , getFiles: 15, event: `size:sort-dropdown` })
                        // scrollToTop()
                      }}
                    />
                  : <ArrowDropUp
                      onClick={() => {
                        viewModel.changeOrder({ requestOrder: 6 })
                        viewModel.getRecordedKeyFileGroupsWithMetadatasFunc({ startIndex: 0, order: 6 , getFiles: 15, event: `size:sort-dropup` })
                        // scrollToTop()
                      }}
                    />
                }
              </div>
            </TableCell>
            <TableCell sx={headerTableCell_sx} align="center"></TableCell>
          </>
      }
    </TableRow>
  )
})

export { PlayListHeader }