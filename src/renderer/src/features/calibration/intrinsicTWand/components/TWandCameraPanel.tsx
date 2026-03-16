import { FC } from "react";
import { useAppTheme } from "../../../../globalContexts/AppThemeContext";
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from "@dnd-kit/sortable";
import { Box, Card, CardHeader, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import RenameCameraButton from "../../../../components/RenameCameraButton";
import { FullScreenButton } from "../../../../components/FullScreenWindow";
import { CameraThermostatSignal } from "../../../../components/CameraThermostatSignal";
import { DeviceSyncSignal } from "../../../../components/DeviceSyncSignal";
import { CameraLive2 } from "../../../../components/Live";
import { WandExposure, WandGain, WandGamma } from "../../common/WandCameraTuning";
import TWandMarker2 from "./TWandMarker";
import { TWandCameraPanelProps } from "../types";

export const TWandCameraPanel: FC<TWandCameraPanelProps> = ({ 
  cameraLength,
  deviceProps, 
  videoId, 
  fullScreen,

  markerId,
  addCalibrationTWandMarkerSet,
  updateCompletedCameras,

  lensParameter,
  
  cameraTuningBatchMode,

  isCollecting,
  isWanding,
  refreshed,
  setRefreshed
}) => {
  const { appTheme } = useAppTheme()
  const { id, nickname, ipv4Addr, macAddr, transport } = deviceProps;
  const sortableProps = useSortable({ id: id });
  const { isDragging, transform, transition, attributes, listeners, setNodeRef } = sortableProps
  const styleDnd = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 1000 : undefined,
    opacity: isDragging ? '0.4' : '1',
  }

  return (
    <Card style={styleDnd} key={macAddr} 
      sx={{
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
        borderRadius: "20px",
        display: "flex", 
        flexDirection: "column",
        border: 2,
        borderColor: appTheme==='dark' ? grey[600] : grey[200],
        width: "100%",
        height: { xs: "fit-content", md: "100%" },
        minHeight: { md: "200px" },
        lineHeight: 0,
        ...(((cameraTuningBatchMode==="single") && cameraLength > 2) && { height: "fit-content" })
      }}
    >
      <CardHeader
        componet="div"
        sx={{ p:1, height: "auto", cursor: "default", flexShrink: 0, overflowY: "hidden" }}
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
            <RenameCameraButton nickname={nickname} ipv4Addr={ipv4Addr} transport={transport}/>
            <Box 
              sx={{ fontSize: "1rem", flexGrow: 1 }}
              ref={setNodeRef}
              {...listeners}
              {...attributes}
            >　
            </Box>
          </div>
        }
        subheader={
          <Typography 
            sx={{ cursor: "default", variant: "body2", color: "text.secondary", fontSize: "0.7rem" }} 
            ref={setNodeRef} 
            {...listeners} 
            {...attributes}
          >
            {ipv4Addr.replace(/http:\/\/|https:\/\//, '')}
          </Typography>
        }
        action={
          <Box 
            sx={{
              mr: { xs: "0.5rem", md: "1rem" }, 
              my: "0.5rem", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
            }}
          >
            <FullScreenButton id={fullScreen.id} sx={{ fontSize: '1rem', color: 'text.secondary'}} 
              opened={fullScreen.open}
              openFullScreen={fullScreen.openFullScreen} 
              closeFullScreen={fullScreen.closeFullScreen}
              changeMode={fullScreen.changeMode}
            /> 
            <CameraThermostatSignal ipv4Addr={ipv4Addr}/>
            <DeviceSyncSignal nickname={nickname} ipv4Addr={ipv4Addr} transport={transport}/>
          </Box>
        }
      />
      <Box 
        sx={{
          width: "100%",
          height: { md: "100%" },
          aspectRatio: { xs: 1936/1216, md: ((cameraTuningBatchMode==="single") && cameraLength > 2) ? 1936/1216 : "auto" },
          position: "relative", 
          backgroundColor: "black",
          overflow: "hidden",
          ...(cameraLength<3 && { height: { md: "100%" } })
        }}
      >
        <CameraLive2 
          transport={transport} 
          videoId={videoId}
          overlay={
            <TWandMarker2
              isCollecting={isCollecting}
              focalLength={lensParameter.focalLength}
              ipv4Addr={ipv4Addr} 
              isWanding={isWanding} 
              id={markerId} 
              updateCompletedCameras={updateCompletedCameras}
              addCalibrationTWandMarkerSet={addCalibrationTWandMarkerSet}
              refreshed={refreshed}
              setRefreshed={setRefreshed}
            />
          }
        />
      </Box>
      {/* <Box>
        <Collapse in={cameraTuningBatchMode==='single'}>
          <Box sx={{ p: { xs: 0, lg: "0.5rem 2rem 1rem" } }}>
            <WandExposure transport={transport} ipv4Addr={ipv4Addr}/>
            <WandGain transport={transport} ipv4Addr={ipv4Addr}/>
            <WandGamma transport={transport} ipv4Addr={ipv4Addr}/>
          </Box>
        </Collapse>
      </Box> */}
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: cameraTuningBatchMode === 'single' ? "1fr" : "0fr",
          transition: "grid-template-rows 300ms ease, opacity 300ms ease",
          opacity: cameraTuningBatchMode === 'single' ? 1 : 0,
          overflow: "hidden",
        }}
      >
        <Box 
          sx={{ 
            minHeight: 0,
            transform: cameraTuningBatchMode === 'single' ? "translateY(0)" : "translateY(-10px)",
            transition: "transform 300ms ease"
          }}
        >
          <Box sx={{ p: { xs: "0.5rem", lg: "0.5rem 2rem 1rem" } }}>
            <WandExposure transport={transport} ipv4Addr={ipv4Addr}/>
            <WandGain transport={transport} ipv4Addr={ipv4Addr}/>
            <WandGamma transport={transport} ipv4Addr={ipv4Addr}/>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}