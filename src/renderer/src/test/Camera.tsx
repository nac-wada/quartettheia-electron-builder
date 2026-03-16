import React, { FC, memo } from "react"
import { Box, Card, CardHeader, CardProps, Grid, SxProps, Theme, Typography } from "@mui/material";
import RenameCameraButton from "../components/RenameCameraButton";
import FrontOrBack from "../features/calibration/common/FrontOrBack";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { FullScreenButton } from "../components/FullScreenWindow";
import { grey } from "@mui/material/colors";
import { useAppTheme } from "../globalContexts/AppThemeContext";
import { DeviceSyncSignal } from "../components/DeviceSyncSignal";
import { CameraLive, CameraLive2 } from "../components/Live";
import { CameraThermostatSignal } from "../components/CameraThermostatSignal";
import ShutterEffect from "../components/ShutterEffect";
import { changeModeFuncType, closeFullScreenFuncType, openFullScreenFuncType, DeviceInfomation } from "../types/common";

interface CameraPanelProps {
  index: number,
  videoId: string,
  deviceProps: Pick<DeviceInfomation, 'id'|'nickname'|'ipv4Addr'|'macAddr'|'transport'>,
  styles?: {
    cardSx?: SxProps<Theme>,
    headerSx?: SxProps<Theme>,
    titleSx?: SxProps<Theme>,
    subtitleSx?: SxProps<Theme>,
    actionSx?: SxProps<Theme>
  },
  contents?: React.ReactNode,
  children?: React.ReactNode,
  statusIcon?: React.ReactNode, 
  frontBackBtn?: boolean | { readonly?: boolean},
  reNameBtn?: boolean,
  fullScreen?: {
    id: string,
    open: boolean,
    changeMode: changeModeFuncType,
    openFullScreen: openFullScreenFuncType,
    closeFullScreen: closeFullScreenFuncType,
  },
  options?: {
    shutterEffect?: boolean,
    snapshotCounts?: boolean,
  },
  actions?: React.ReactNode
}

const CameraPanel: FC<CameraPanelProps> = memo(
  ({ 
    index,
    videoId,
    deviceProps, 
    children,
    contents,
    styles,
    statusIcon,
    frontBackBtn,
    reNameBtn = true,
    fullScreen,
    options,
    actions
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
      <>
        <Card style={styleDnd} key={macAddr} 
          sx={{
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
            borderRadius: "20px",
            lineHeight: 0, 
            width: "100%", 
            display: "flex", 
            flexDirection: "column",
            border: 2,
            borderColor: appTheme==='dark' ? grey[600] : grey[200],
            // padding: "0.3rem",
            // aspectRatio: 387/300, 
            ...styles?.cardSx
          }}
        >
          <CardHeader
            componet="div"
            sx={{ p:1, height: "auto", cursor: isDragging ? 'grabbing' : 'grab', ...styles?.headerSx }}
            avatar={statusIcon}
            title={
              <div style={{ display: "flex" }}>
                <Typography 
                  sx={{ variant: "body1", color: "primary.info", fontSize: "1rem", fontWeight: "bold", display: "inline-flex", ...styles?.titleSx }}  
                  ref={setNodeRef}
                  {...listeners}
                  {...attributes}
                >
                  {nickname}
                </Typography>
                { reNameBtn && <RenameCameraButton nickname={nickname} ipv4Addr={ipv4Addr} transport={transport}/>}
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
                sx={{ cursor: isDragging ? 'grabbing' : 'grab', variant: "body2", color: "text.secondary", fontSize: "0.7rem", ...styles?.subtitleSx }} 
                ref={setNodeRef} 
                {...listeners} 
                {...attributes}
              >
                {ipv4Addr.replace(/http:\/\/|https:\/\//, '')}
              </Typography>
            }
            action={
              <Box sx={{mr: "1rem", my: "0.5rem", display: "flex", alignItems: "center", ...styles?.actionSx }}>
                { frontBackBtn && <FrontOrBack transport={transport} url={ipv4Addr} readonly={typeof frontBackBtn!=="boolean" && frontBackBtn.readonly}/> }
                { fullScreen && 
                  <FullScreenButton id={fullScreen.id} sx={{ fontSize: '1rem', color: 'text.secondary', mr: 1}} 
                    opened={fullScreen.open}
                    openFullScreen={fullScreen.openFullScreen} 
                    closeFullScreen={fullScreen.closeFullScreen}
                    changeMode={fullScreen.changeMode}
                  /> 
                } 
                <CameraThermostatSignal ipv4Addr={ipv4Addr}/>
                <DeviceSyncSignal nickname={nickname} ipv4Addr={ipv4Addr} transport={transport}/>
                { actions }
              </Box>
            }
          />
          <Grid sx={{width: "100%", position: "relative", aspectRatio: 1936/1216, backgroundColor: "black"}}>
            { options?.shutterEffect && ShutterEffect({ showShutterEffect: options.shutterEffect }) }
            <CameraLive transport={transport} videoId={videoId}/>
            { children }
          </Grid>
          { contents }
        </Card>
      </>
  )
}) 

const CameraPanel2: FC<CameraPanelProps & CardProps> = memo(
  ({ 
    index,
    videoId,
    deviceProps, 
    children,
    contents,
    styles,
    statusIcon,
    frontBackBtn,
    reNameBtn = true,
    fullScreen,
    options,
    actions,
    ...props
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
      <>
        <Card style={styleDnd} key={macAddr} 
          sx={{
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
            borderRadius: "20px",
            lineHeight: 0, 
            height: "100%",
            display: "flex", 
            flexDirection: "column",
            border: 2,
            borderColor: appTheme==='dark' ? grey[600] : grey[200],
            // aspectRatio: 387/300, 
            ...styles?.cardSx
          }}
          {...props}
        >
          <CardHeader
            componet="div"
            sx={{ p:1, height: "auto", cursor: isDragging ? 'grabbing' : 'grab', flexShrink: 0, overflowY: "hidden", ...styles?.headerSx }}
            avatar={statusIcon}
            title={
              <div style={{ display: "flex" }}>
                <Typography 
                  sx={{ variant: "body1", color: "primary.info", fontSize: "1rem", fontWeight: "bold", display: "inline-flex", ...styles?.titleSx }}  
                  ref={setNodeRef}
                  {...listeners}
                  {...attributes}
                >
                  {nickname}
                </Typography>
                { reNameBtn && <RenameCameraButton nickname={nickname} ipv4Addr={ipv4Addr} transport={transport}/>}
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
                sx={{ cursor: isDragging ? 'grabbing' : 'grab', variant: "body2", color: "text.secondary", fontSize: "0.7rem", ...styles?.subtitleSx }} 
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
                  ...styles?.actionSx 
                }}
              >
                { frontBackBtn && <FrontOrBack transport={transport} url={ipv4Addr} readonly={typeof frontBackBtn!=="boolean" && frontBackBtn.readonly}/> }
                { fullScreen && 
                  <FullScreenButton id={fullScreen.id} sx={{ fontSize: '1rem', color: 'text.secondary'}} 
                    opened={fullScreen.open}
                    openFullScreen={fullScreen.openFullScreen} 
                    closeFullScreen={fullScreen.closeFullScreen}
                    changeMode={fullScreen.changeMode}
                  /> 
                } 
                <CameraThermostatSignal ipv4Addr={ipv4Addr}/>
                <DeviceSyncSignal nickname={nickname} ipv4Addr={ipv4Addr} transport={transport}/>
                { actions }
              </Box>
            }
          />
          <Grid 
            sx={{
              width: "100%",
              height: "100%", 
              position: "relative", 
              aspectRatio: 1936/1216, 
              backgroundColor: "black",
              overflow: "hidden",
            }}
          >
            { options?.shutterEffect && ShutterEffect({ showShutterEffect: options.shutterEffect }) }
            <CameraLive2 
              transport={transport} 
              videoId={videoId}
              overlay={children}
            />
          </Grid>
          { contents }
        </Card>
      </>
  )
}) 

export { CameraPanel, CameraPanel2 }