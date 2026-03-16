// src\components\appversion\ProductVersion.tsx
import { FC, memo } from "react";
import { Transport } from "@connectrpc/connect";
import { Card, Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useProductVersionState } from "../hooks/useProductVersionState";
import { AIREALIcon } from "../../appmenu/components/AIREALIcon";

const ProductVersion : FC<{ leaderTransport: Transport }> = memo((props) => {
  const { leaderTransport } = props;
  const productVersionViewModel = useProductVersionState({ transport : leaderTransport })

  const style = {
    fontWeight:"bold",
    fontSize: {xs : "0.8rem", sm: '1rem'},
  }

  return (
    <>
      <Card sx={{borderRadius:5,boxShadow:"none"}}>
        <List sx={{ width: 'auto' }}>

            <ListItem sx={{ bgcolor: 'background.paper' }}>
              <ListItemText primary={<Typography fontSize={'1.1rem'} fontWeight='bold'>ファームウェアのバージョン情報</Typography>} />
            </ListItem>

            <Divider sx={{mx:1}}/>

            <ListItem>
              <AIREALIcon style={{width:150,height:150,marginRight:"1rem"}}/>
              <Grid sx={{width:"100%",...style}}>
                <section>
                  <Typography color={"text.secondary"} sx={{...style, display: 'inline-block', width: '100px'}}>バージョン</Typography>
                  <Typography color={"text.secondary"} sx={{...style, display: 'inline-block', width: '100px'}}>{productVersionViewModel.productVersionState.version}</Typography>
                </section>
                <section>
                  <Typography color={"text.secondary"} sx={{...style, display: 'inline-block', width: '100px'}}>リリース</Typography>
                  <Typography color={"text.secondary"} sx={{...style, display: 'inline-block', width: '100px'}}>{productVersionViewModel.productVersionState.releaseDate}</Typography>
                </section>
                <section>
                  <Typography color={"text.secondary"} sx={{...style, display: 'inline-block',marginTop: '1rem'}}>{`© 2025 nac Image Technology Inc.`}</Typography>
                </section>
              </Grid>
            </ListItem>

          </List>
      </Card>

    </>
  )
})

export { ProductVersion }