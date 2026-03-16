import { Box, Grid, SxProps, Theme, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { FC, memo } from "react";

export const SnapshotCountPanel: FC<{
  selected: boolean
  gridMode: boolean,
  pos: [string, any],
  changeSelectedArea?: any,
  styles?: {
    grid?: SxProps<Theme>,
    countText: SxProps<Theme>;
    // slashText: SxProps<Theme>;
    underCountText: SxProps<Theme>;
  }
}> = memo(({
  selected,
  gridMode,
  pos,
  changeSelectedArea,
  styles
}) => {
  return (
    <Grid size={{ xs: gridMode ? 4 : 12 }} sx={{ position: "relative", height: gridMode ? "50%" : "100%", }}>
      <Box 
        sx={{
          backgroundColor: pos[1] >= 7 ? green[500] : null, 
          opacity: 0.5, 
          border: {
            xs: selected ? "10px solid rgb(237, 108, 2)": "0.5px solid white", 
            md: selected ? "15px solid rgb(237, 108, 2)" : "2px solid white"
          }, 
          display: "flex", justifyContent:"center", alignItems: "center",
          height: "100%",
          ...styles?.grid
        }}
        onClick={changeSelectedArea}
      >
        <Typography 
          sx={{ 
            color: "white", 
            fontWeight: "bold", 
            // position: "absolute",
            // fontSize: "160px",
            // top: `calc(100%-160px)`,
            // left: `calc(100%-160px)`,
            // WebkitTextStrokeWidth: "5px",
            // WebkitTextStrokeColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 2,
            ...styles?.countText
          }}
        >
          {pos[1] !== null ? pos[1] : "!"}
        </Typography>
        <Typography 
          sx={{ 
            color: "white", 
            position:"absolute",
            fontWeight: "bold", 
            zIndex: 2,
            ...styles?.underCountText
          }}
        >
          /7
        </Typography>
      </Box>
    </Grid>
  )
})