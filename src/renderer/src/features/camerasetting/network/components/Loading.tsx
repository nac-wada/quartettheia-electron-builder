import { Box, Card, Divider, List, ListItem, Skeleton, Switch, Typography } from "@mui/material";
import { FC, memo } from "react";
import { useAppTheme } from "../../../../globalContexts/AppThemeContext";
import { grey } from "@mui/material/colors";

export const Loading: FC = memo(() => {
  const { appTheme } = useAppTheme()
  let borderColor = appTheme==='dark' ? grey[600] : grey[300]

  return (
    <>

      <Box sx={{ marginTop: "10px" }}>
        <Card sx={{boxShadow: "none", p: "0.25rem", borderRadius: 10, border: 1, borderColor: borderColor, display: "flex", justifyContent: "space-between", alignItems:"center"}}>
          <Typography color="text.secondary" sx={{ fontWeight: "bold", mx: "1rem", display: "inline" }}>Wi-Fi</Typography>
          <Switch disabled/>
        </Card>
      </Box>

      <Box sx={{ margin: "10px 0" }}>
        <List>
          <ListItem>
            <Skeleton animation={false} sx={{width:80,height:80,borderRadius:0, mr: "1rem"}}/>
            <Box>
              <Skeleton animation={false} sx={{width:200,height:20,borderRadius:0,}}/>
              <Skeleton animation={false} sx={{width:200,height:20,borderRadius:0,}}/>
              <Skeleton animation={false} sx={{width:200,height:20,borderRadius:0,}}/>
            </Box>

          </ListItem>
        </List>
      </Box>

      <Divider sx={{m:0.5}}/>

      <Box sx={{ margin: "10px 0 10px" }}>
        <List>
        {
          [0,0,0,0,0].map((_, _index) => (
            <ListItem key={_index} sx={{ height: 70 }}>
              <Skeleton animation={false} sx={{width:80,height:80,borderRadius:0, mr: "1rem"}}/>
              <Skeleton animation={false} sx={{width:200,height:30,borderRadius:0,}}/>
            </ListItem>
          ))
        }
        </List>
      </Box>

    </>
  )
})