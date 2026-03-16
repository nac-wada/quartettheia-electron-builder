import { FC } from "react";
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from "@dnd-kit/sortable";
import { Box, Card, CardHeader, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { CameraThermostatSignal } from "../../../../components/CameraThermostatSignal";
import { DeviceSyncSignal } from "../../../../components/DeviceSyncSignal";
import { CameraLive2 } from "../../../../components/Live";
import ShutterEffect from "../../../../components/ShutterEffect";
import { IBoardResultStatusIcon } from "./IBoardResultStatusIcon";
import { IBoardSubCameraPanelProps } from "../types";

export const IBoardSubCameraPanel: FC<IBoardSubCameraPanelProps> = ({ focused, selectedArea, gridMode, snapshots, videoId, shutter, deviceProps, fullScreen, addCalibrationEngineStatus, removeCalibrationEngineStatus }) => {
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
      // sx={{
      //   boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
      //   borderRadius: "20px",
      //   lineHeight: 0, 
      //   height: "100%",
      //   display: "flex", 
      //   flexDirection: "column",
      //   border: 2,
      //   borderColor: appTheme==='dark' ? grey[600] : grey[200],
      //   width: { xs: "100%", sm: "auto" },
      //   minHeight: 300
      // }}
      sx={{
        borderRadius: "20px",
        display: "flex", 
        flexDirection: "column",
        border: 2,
        width: "100%",
        height: { xs: "fit-content", md: "100%" },
        lineHeight: 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: focused ? '0 0 10px rgba(37, 100, 235, 0.8)' : 'none',
        borderColor: focused ? 'primary.main' : 'transparent',
      }}
    >
      <CardHeader
        componet="div"
        sx={{ p:1, height: "auto", flexShrink: 0, overflowY: "hidden" }}
        avatar={
          <IBoardResultStatusIcon 
            progressProps={{ size: 20 }} 
            ipv4Addr={ipv4Addr}
            transport={transport}
            add={addCalibrationEngineStatus}
            remove={removeCalibrationEngineStatus}
            nickname={nickname}
            send={false}
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
            <Box 
              sx={{ fontSize: "1rem", flexGrow: 1 }}
              ref={setNodeRef}
              {...listeners}
              {...attributes}
            >　
            </Box>
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
            <CameraThermostatSignal ipv4Addr={ipv4Addr}/>
            <DeviceSyncSignal nickname={nickname} ipv4Addr={ipv4Addr} transport={transport}/>
          </Box>
        }
      />
      <Box 
        // sx={{
        //   width: "100%",
        //   height: "100%", 
        //   position: "relative", 
        //   aspectRatio: 1936/1216, 
        //   backgroundColor: "black",
        //   overflow: "hidden",
        // }}
        sx={{
          width: "100%",
          height: { md: "100%" },
          aspectRatio: {xs: 1936/1216, md: "auto"},
          position: "relative", 
          backgroundColor: "black",
          overflow: "hidden",
        }}
      >
        { ShutterEffect({ showShutterEffect: shutter }) }
        <CameraLive2 
          transport={transport} 
          videoId={videoId}
          overlay={
            <Box 
              sx={{ 
                position: "absolute", 
                top: 0, bottom: 0, left: 0, right: 0, 
                width: "100%", 
                height: "100%",
                display: "grid", 
                gridTemplateColumns: gridMode ? `repeat(3, 2fr)` : `repeat(1, 1fr)`,
              }}
            >
            {
              Object.entries(snapshots)
              .filter(snap => (!gridMode) ? snap[0] === "CENTER" : snap[0] !== "CENTER")
              .map((pos, index) => (
                <Box 
                  sx={{ 
                    width: "100%", 
                    height: "100%", 
                    position: "relative" 
                  }}
                >
                  <Box 
                    sx={{ 
                      width: "100%", 
                      height: "100%", 
                      position: "relative", // 親を基準にする
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // 枠線の設定（前述のboxShadowをここに統合）
                      boxShadow: selectedArea === index 
                        ? "inset 0 0 0 4px rgb(237, 108, 2)" // 選択時
                        : "inset 0 0 0 2px white",         // 通常時
                      ...((pos[1] !== null && pos[1] >= 7) && { backgroundColor: green[500] }),
                      opacity: 0.8, // 文字を見やすくするため少し上げるのがおすすめ
                    }}
                  >
                    {/* メインの数字：中央に配置 */}
                    <Typography 
                      sx={{ 
                        color: "white", 
                        fontWeight: "900", // より太く
                        fontSize: { xs: "24px", md: "32px" }, // グリッドサイズに合わせて調整
                        WebkitTextStroke: "2px rgba(0,0,0,0.6)",
                        lineHeight: 1,
                      }}
                    >
                      {pos[1] ?? "!"}
                    </Typography>

                    {/* 分母：右下に絶対配置 */}
                    <Typography 
                      sx={{ 
                        position: "absolute",
                        bottom: { xs: "4px", md: "6px" }, // 枠線の太さに合わせて調整
                        right: { xs: "4px", md: "6px" },
                        color: "rgba(255, 255, 255, 0.9)", 
                        fontWeight: "bold", 
                        fontSize: { xs: "9px", md: "12px" },
                        WebkitTextStroke: "1px rgba(0,0,0,0.5)",
                      }}
                    >
                      /7
                    </Typography>
                  </Box>
                </Box>
              ))
            } 
            </Box>
          }
        />
      </Box>
    </Card>
  )
}