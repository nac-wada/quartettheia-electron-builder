import { Box, Typography } from "@mui/material";
import { FC, memo, useMemo } from "react";

const CameraBootTimePanel: FC<{ bootTime: Date|null }> = memo((props) => {
  const { bootTime } = props;

  let time = useMemo(() => {
    if(bootTime) {
      const y = String(bootTime.getFullYear())
      const m = String(bootTime.getMonth()+1).padStart(2,"0")
      const d = String(bootTime.getDate()).padStart(2,"0")
      const h = String(bootTime.getHours()).padStart(2,"0")
      const M = String(bootTime.getMinutes()).padStart(2,"0")
      const s = String(bootTime.getSeconds()).padStart(2, "0")
      return `${y}/${m}/${d} ${h}:${M}:${s}`
    }
    return `-- / -- / -- : -- : --`
  },[bootTime])

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: { xs: "50%", sm: "40%" }, display: "flex", alignItems: "start" }}>
        <Typography 
          sx={{ 
            color: "text.secondary", 
            fontWeight:"bold", 
            display: "inline-block", 
            fontSize: "0.9rem",
          }}
        >
          カメラ起動時刻
        </Typography>
      </Box>
      <Box sx={{ width: { xs: "50%", sm: "60%" }, justifyItems: "end", alignItems: "start", display: "grid", gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" } }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: "text.secondary", 
            fontWeight:"bold", 
            fontSize: "0.9rem"
          }}
        >
          {time}
        </Typography>
      </Box>
    </Box>
    // <Grid container>
    //   <Grid size={{ xs: 4 }}>
    //     <Typography 
    //       sx={{ 
    //         color: "text.secondary", 
    //         fontWeight:"bold", 
    //         display: "inline-block", 
    //         width: "100%", 
    //         fontSize: "0.9rem"
    //       }}
    //     >
    //       カメラ起動時刻
    //     </Typography>
    //   </Grid>
    //   <Grid size={{ xs: 8 }}>
    //     <Grid container>
    //       <Grid size={{ xs:12, sm: 7 }} sx={{ textAlign: "right"}}>
    //         <Typography 
    //           variant="subtitle2" 
    //           sx={{ 
    //             color: "text.secondary", 
    //             fontWeight:"bold", 
    //             fontSize: "0.9rem"
    //           }}
    //         >
    //           {time}
    //         </Typography>
    //       </Grid>
    //       <Grid size={{ xs:12, sm: 5 }}></Grid>
    //     </Grid>
    //   </Grid>
    // </Grid>
  )
})

export { CameraBootTimePanel }