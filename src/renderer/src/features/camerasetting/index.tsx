import { FC, useState } from "react"
import { useDevices } from "../../globalContexts/DeviceContext"
import { DndContainer } from "../../components/DndContainer"
import { Box, Grid, Grow } from "@mui/material"
import { CAMERA_SETTING_MAX_WIDTH, FULLSCREEN_ID } from "../../types/common"
import { OtherSettingModal } from "./otheroptions"
import { CameraSyncModal } from "./devicesync"
import { WiFiSettingModal } from "./network"
import { useFullScreenState } from "../../hooks/useFullScreenState"
import { FullScreenContainer } from "../../components/FullScreenContainer"
import { useCalibratorDetectionMode } from "../../hooks/useCalibratorDetectionMode"
import { useSetCalibratorWarning } from "../../hooks/useCalibratorWarning"
import { MessageModal } from "../../components/MessageModal"
import { TuningCameraPanel } from "./tuning/components/TuningCameraPanel"

export const CameraTuning: FC = () => {
  const { devices } = useDevices()
  const { fullScreenState, openFullScreen, closeFullScreen, changeMode} = useFullScreenState()
  const { opened } = fullScreenState
  const [ modal, setModal ] = useState<{index: number, type: "cameraSync"|"network"|"other"} | null>(null)
  const calibratorDetectionMode = useCalibratorDetectionMode()
  const calibratorWarning = useSetCalibratorWarning({ calibratorDetectionMode　})
  
  return (
    <>
      <FullScreenContainer
        fullScreenProps={{
          id: FULLSCREEN_ID,
          fullScreen: { fullScreenState, openFullScreen, closeFullScreen, changeMode }
        }}
      >
        <Grow 
          in={true} 
          style={{  
            transformOrigin: "50% 0 0"
          }}
          timeout={1000}
        >
          <Box 
            sx={{ 
              display: "block", 
              overflow: "hidden", 
              padding: '5px'
            }}
          >
            <DndContainer items={devices}>
              <Grid 
                container 
                direction={"row"} 
                sx={{ 
                  margin: "0 auto", 
                  pb: "10px", 
                  maxWidth: devices.length > 2 ? "100%": CAMERA_SETTING_MAX_WIDTH, 
                  display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(335px, 1fr))`,
                  gap: "10px"
                }}
              >
              {
                devices.map(({id, nickname, macAddr, ipv4Addr, transport, primary, networkInterface}, i) => (
                  <TuningCameraPanel
                    key={id}
                    videoId={`tuning_${ipv4Addr}`}
                    deviceProps={{ id, nickname, macAddr, ipv4Addr, transport, primary, networkInterface }}
                    fullScreen={{
                      id: FULLSCREEN_ID,
                      open: opened,
                      openFullScreen: openFullScreen,
                      closeFullScreen: closeFullScreen,
                      changeMode: () => {changeMode(false, ipv4Addr)},
                    }}
                    startIndex={i}
                    setModal={setModal}
                  />
                ))
              }
              </Grid>
            </DndContainer>
          </Box>
        </Grow>
      </FullScreenContainer>

      {
        modal?.type==="other" && 
        <OtherSettingModal 
          open={modal?.type==="other"} 
          startIndex={modal.index} 
          onClose={() => setModal(null)}
          otherSettings={devices.map(({ transport, nickname }) => { return { transport, nickname } })}
        />
      }

      {
        modal?.type==="cameraSync" &&
        <CameraSyncModal
          open={modal.type==="cameraSync"}
          startIndex={modal.index}
          onClose={() => setModal(null)}
          cameraSyncs={devices.map(({ primary, nickname, transport, ipv4Addr }) => { return { primary, nickname, transport, ipv4Addr } })}
        />
      }

      {
        modal?.type==="network" &&
        <WiFiSettingModal
          open={modal.type==="network"}
          startIndex={modal.index}
          onClose={() => setModal(null)}
          networkSettings={devices.map(({ nickname, transport, wifiTransport }) => { return { transport, nickname, wifiTransport } })}
        />
      }

      { calibratorWarning && <MessageModal message={calibratorWarning}/>}
    </>
  )
}