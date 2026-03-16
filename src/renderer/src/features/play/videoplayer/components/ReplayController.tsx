import { FC, memo } from "react";
import { CircularProgress, Stack } from "@mui/material";
import { PlaybackButton } from "./ChangeSpeedButton";
import { LoopButton } from "./LoopButton";
import { PlayButton } from "./PlayButton";
import { DownloadButton } from "./DownloadButton";
import { Next3sSkipButton, Prev3sSkipButton, SkipEndButton, SkipStartButton } from "./SkipButton";
import { ModeChangeButton } from "./ModeChangeButton";
import { ClipButton } from "./ClipButton";
import { SkipRangeEndButton, SkipRangeStartButton } from "./SkipRangeButton";
import { CustomSeekbar } from "./CustomSeekBar";
import { SeekContainer } from "./SeekContainer";
import { grey } from "@mui/material/colors";
import { MessageModal } from "../../../../components/MessageModal";
import { clipRangeMinDistance, ReplayControllerProps } from "../types";

export const ReplayController: FC<ReplayControllerProps> = memo(({ id, videos, viewModel, download, stopdownload, downloading, option }) => {
  const { replayFormState,setLoop, setChangeMode, setPlaying, setSeeking, setPlayed, setClipRange, setMasterId, setPlaybackRate, openDialog, closeDialog, clipMp4, clipMp4Group } = viewModel
  const { masterId, control, options, dialog } = replayFormState
  const { played, clipRange, duration, playing } = control
  const { singleMode, loop, playbackRate } = options

  return (
    <>
      <Stack direction={"column"}>
        <SeekContainer played={played} duration={duration}>
        { 
          clipRange && duration ? 
            <CustomSeekbar 
              value={{played: played, clipRange: clipRange, duration: duration}} 
              control={{setPlayed: setPlayed, setClipRange: setClipRange, setSeeking: setSeeking}}
              minDistance={clipRangeMinDistance}
            /> 
          : 
            <>
              <CircularProgress size={15} sx={{ color: "grey" }}/>
              <div style={{ height: 15, borderRadius: 10, backgroundColor: grey[200], width: "100%", marginLeft: "0.5rem" }}></div>
            </>
        }
        </SeekContainer>

        <div style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
          <SkipStartButton playing={playing} setPlayed={setPlayed} setPlaying={setPlaying}/>

          <Prev3sSkipButton playing={playing} setPlayed={setPlayed} setPlaying={setPlaying} played={played}/>
          
          <PlayButton playing={playing} setPlaying={setPlaying}/>
          
          <Next3sSkipButton playing={playing} setPlayed={setPlayed} setPlaying={setPlaying} duration={duration} played={played}/>
          
          <SkipEndButton playing={playing} setPlayed={setPlayed} setPlaying={setPlaying} duration={duration}/>
          
          <LoopButton loop={loop} setLoop={setLoop}/>
          
          <PlaybackButton id={id} playbackRate={playbackRate} setPlaybackRate={setPlaybackRate}/>
          
          <SkipRangeStartButton played={played} clipRange={clipRange} setClipRange={setClipRange} minDistance={clipRangeMinDistance} duration={duration}/>
          
          <SkipRangeEndButton played={played} clipRange={clipRange} setClipRange={setClipRange} minDistance={clipRangeMinDistance}/>
          
          <ClipButton 
            openDialog={openDialog} 
            closeDialog={closeDialog} 
            masterId={masterId} 
            singleMode={singleMode} 
            clipMp4Group={clipMp4Group} 
            clipMp4={clipMp4} 
            videos={videos} 
            clipRange={clipRange} 
          />
          
          <ModeChangeButton singleMode={singleMode} setChangeMode={setChangeMode}/>
          
          <DownloadButton 
            singleMode={singleMode} 
            id={id} 
            videos={videos}
            openDialog={openDialog} 
            closeDialog={closeDialog} 
            download={download} 
            stopdownload={stopdownload}  
            downloading={downloading}
            masterId={masterId}
          />
        
          { option }
        </div>

      </Stack>
      {
        dialog && 
        <MessageModal message={dialog} id={id}/>
      }
    </>
  )
})