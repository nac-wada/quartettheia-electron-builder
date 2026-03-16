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
import FrontOrBack from "../../common/FrontOrBack";
import ShutterEffect from "../../../../components/ShutterEffect";
import { EBoardResultStatusIcon } from "./EBoardResultStatusIcon";
import { EBoardCameraPanelProps } from "../types";

export const EBoardCameraPanel: FC<EBoardCameraPanelProps> = ({ shutter, deviceProps, videoId, fullScreen, addCalibrationEngineStatus, removeCalibrationEngineStatus }) => {
  const { appTheme } = useAppTheme()
  const { id, nickname, ipv4Addr, transport } = deviceProps;
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
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
        borderRadius: "20px",
        lineHeight: 0, 
        height: "100%",
        display: "flex", 
        flexDirection: "column",
        border: 2,
        borderColor: appTheme==='dark' ? grey[600] : grey[200],
        width: { xs: "100%", sm: "auto" },
      }}
    >
      <CardHeader
        componet="div"
        sx={{ p:1, height: "auto", cursor: isDragging ? 'grabbing' : 'grab', flexShrink: 0, overflowY: "hidden" }}
        avatar={
          <EBoardResultStatusIcon 
            progressProps={{ size: 30 }} 
            iconSx={{ fontSize: 30 }}
            ipv4Addr={ipv4Addr}
            transport={transport}
            add={addCalibrationEngineStatus}
            remove={removeCalibrationEngineStatus}
            nickname={nickname}
          />
        }
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
            sx={{ cursor: isDragging ? 'grabbing' : 'grab', variant: "body2", color: "text.secondary", fontSize: "0.7rem" }} 
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
              mr: { xs: "0.5rem", sm: "1rem" }, 
              my: "0.5rem", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
            }}
          >
            <FrontOrBack transport={transport} url={ipv4Addr}/>
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
          height: "100%", 
          position: "relative", 
          aspectRatio: 1936/1216, 
          backgroundColor: "black",
          overflow: "hidden",
        }}
      >
        { ShutterEffect({ showShutterEffect: shutter }) }
        <CameraLive2 
          transport={transport} 
          videoId={videoId}
        />
      </Box>
    </Card>
  )
}