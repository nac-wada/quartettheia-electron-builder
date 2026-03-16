import { FC } from "react";
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from "@dnd-kit/sortable";
import { Box, Card, CardHeader, Divider, Grid, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useAppTheme } from "../../../../globalContexts/AppThemeContext";
import { CameraThermostatSignal } from "../../../../components/CameraThermostatSignal";
import { DeviceSyncSignal } from "../../../../components/DeviceSyncSignal";
import { CameraLive2 } from "../../../../components/Live";
import FrontOrBack from "../../common/FrontOrBack";
import { ViewerCameraPanelProps } from "../types";

export const ViewerCameraPanel: FC<ViewerCameraPanelProps> = ({ isActiveLightData, chessMode, deviceProps, videoId, focused, calibrationData, succeedCalibration, setFocusCamera }) => {
  const { id, nickname, ipv4Addr, transport } = deviceProps;
  const { appTheme } = useAppTheme()
  const sortableProps = useSortable({ id: id });
  const { isDragging, transform, transition, attributes, listeners, setNodeRef } = sortableProps
  const styleDnd = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 1000 : undefined,
    opacity: isDragging ? '0.4' : '1',
  }

  return (
    <Card style={styleDnd}
      sx={{
        borderRadius: "20px",
        lineHeight: 0, 
        display: "flex", 
        flexDirection: "column",
        minHeight: 300,
        width: "100%",
        height: "100%",
        border: 2,
        cursor: "pointer",
        boxShadow: focused ? '0 0 10px rgba(37, 100, 235, 0.8)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: focused ? 1 : 0.7,
        borderColor: focused ? 'primary.main' : 'transparent',
      }}
      onClick={() => setFocusCamera(ipv4Addr)}
    >
      <CardHeader
        componet="div"
        sx={{ p:1, height: "auto", flexShrink: 0, overflowY: "hidden" }}
        title={
          <div style={{ display: "flex" }}>
            <Typography 
              sx={{ variant: "body1", color: "primary.info", fontSize: "1rem", fontWeight: "bold", display: "inline-flex" }}  
              ref={setNodeRef}
              {...listeners}
              {...attributes}
            >
              {nickname}
            </Typography>
          </div>
        }
        action={
          <Box 
            sx={{
              mr: { xs: "0.5rem", sm: "1rem" }, 
              my: "0.5rem", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
            }}
          >
            { chessMode && <FrontOrBack transport={transport} url={ipv4Addr} readonly/> }
            <CameraThermostatSignal ipv4Addr={ipv4Addr}/>
            <DeviceSyncSignal nickname={nickname} ipv4Addr={ipv4Addr} transport={transport}/>
          </Box>
        }
      />
      <Box 
        sx={{
          width: "100%",
          height: "100%", 
          position: "relative", 
          aspectRatio: 1936/1216, 
          backgroundColor: "black",
          overflow: "hidden",
        }}
      >
        <CameraLive2 
          transport={transport} 
          videoId={videoId}
        />
      </Box>
      <Box sx={{ p: "0.5rem"}}>
        <Box>
          <Typography color="textSecondary" sx={{ fontSize: 12, fontWeight: "bold" }}>再投影誤差</Typography>
          {
            isActiveLightData && <Typography color="warning" sx={{ fontSize: 12, fontWeight: "bold" }}>※アクティブライト方式の計算結果です</Typography>
          }
          <Typography color={succeedCalibration ? "textPrimary" : "error"} sx={{ display: "inline", fontSize: calibrationData ? 24 : 16, fontWeight: "bold", mr: 1 }}>{calibrationData ? `${calibrationData.exXml.rms.toFixed(2)}` : "計算結果なし"}</Typography>
          <Typography color="textSecondary" sx={{ display: "inline", fontSize: 12 }}>{calibrationData && `px`}</Typography>
        </Box>

        <Divider sx={{ my: 1 }}/>

        <Grid container spacing={1}>
          <Grid size={{ xs: 4 }} sx={{ borderRadius: 2, backgroundColor: appTheme==="dark" ? grey[900] : grey[200], p: 0.5 }}>
            <Typography color="textSecondary" sx={{ fontSize: 11 }}>X(m)</Typography>
            <Typography color="textPrimary" sx={{ fontSize: 14 }}>{calibrationData && calibrationData.position[0].toFixed(2)}</Typography>
          </Grid>
          <Grid size={{ xs: 4 }} sx={{ borderRadius: 2, backgroundColor: appTheme==="dark" ? grey[900] : grey[200], p: 0.5 }}>
            <Typography color="textSecondary" sx={{ fontSize: 11 }}>Y(m)</Typography>
            <Typography color="textPrimary" sx={{ fontSize: 14 }}>{calibrationData && calibrationData.position[1].toFixed(2)}</Typography>
          </Grid>
          <Grid size={{ xs: 4 }} sx={{ borderRadius: 2, backgroundColor: appTheme==="dark" ? grey[900] : grey[200], p: 0.5 }}>
            <Typography color="textSecondary" sx={{ fontSize: 11 }}>Z(m)</Typography>
            <Typography color="textPrimary" sx={{ fontSize: 14 }}>{calibrationData && calibrationData.position[2].toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}