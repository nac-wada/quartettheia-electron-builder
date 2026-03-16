import {  Grid } from "@mui/material"
import { useDevices } from "../../globalContexts/DeviceContext";
import { CameraVersionList } from "./components/CameraVersionList";
import { FC, memo } from "react";
import { ProductVersion } from "./components/ProductVersion";

const ApplicationVersion: FC = memo(() => {
  const { devices } = useDevices();
  const transport = devices.filter(({primary}) => primary===true)[0].transport
  
  return (
    <Grid container direction="column" rowSpacing={2}>

      <Grid>
        <ProductVersion leaderTransport={transport}/>
      </Grid>

      <Grid>
        <CameraVersionList devices={devices}/>
      </Grid>

    </Grid>
  )
})

export { ApplicationVersion }