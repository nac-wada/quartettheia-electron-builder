import { CSSProperties, SxProps, Theme } from "@mui/material";
import { VideoType, MessageModalProps } from "../../../types/common";
import { Transport } from "@connectrpc/connect";

export interface ChangeVideoButonProps {
  nowId: number,
  setMasterId: any,
  videoLength: number,
  sx?: SxProps<Theme>
}

export interface FullScreenVideoProps {
  containerProps: ReplayContainerProps,
  onClick: () => void,
}

export interface ReplayContainerProps {
  videos: VideoType[],
  replayFormState: ReplayFormModel,
  reset: any,
  setMasterId: any, 
  setClipRange: any, 
  setDuration: any, 
  setPlayed: any, 
  setPlaying: any 
}

export interface SkipButtonProps {
  playing: boolean,
  setPlayed: any,
  setPlaying: any,
}

export interface SkipRangeButtonProps {
  played: number, 
  clipRange: number[] | null, 
  setClipRange: any, 
  minDistance: number
}

export interface ReplayFormModel {
  masterId: number,
  control: {
    played: number,
    playing: boolean,
    seeking: boolean,
    duration: number | null,
    clipRange: number[] | null,
  },
  options: {
    singleMode: boolean,
    loop: boolean,
    playbackRate: number,
    rangePlayMode: boolean,
    downloading: boolean,
    clipping: boolean
  },
  dialog: MessageModalProps | null
}

export interface ReplayFormViewModel {
  replayFormState: ReplayFormModel,
  reset: () => void,
  setMasterId: (masterId: number) => void,
  setPlayed: (played: number) => void,
  setPlaying: (playing: boolean) => void,
  setSeeking: (seeking: boolean) => void,
  setDuration: (duration: number) => void,
  setClipRange: (clipRange: number[]) => void,
  setChangeMode: (singleMode: boolean) => void,
  setLoop: (loop: boolean) => void,
  setPlaybackRate: (playbackRate: number) => void,
  setRangePlayMode: (rangePlayMode: boolean) => void,
  setDownload: (downloading: boolean) => void,
  setClipping: (clipping: boolean) => void,
  downloadMp4: (src: string, date: Date, options: string[]) => void,
  downloadMp4Group: (videos: VideoType[]) => void,
  clipMp4:  (req: TrimMp4RequestProps) => void,
  clipMp4Group: (videos: VideoType[], clipRange: number[]) => void,
  openDialog: (dialog: MessageModalProps) => void,
  closeDialog: () => void,
} 

export interface ReplayControllerProps {
  id?: string,
  videos: VideoType[], 
  viewModel: ReplayFormViewModel, 
  download: any,
  stopdownload: any, 
  downloading: boolean,
  option?: React.ReactNode,
}

export const clipRangeMinDistance = 0.05

export interface VideoComponentProps {
  id: number, 
  src: string, 
  state: ReplayFormModel, 
  setPlaying: any, 
  setDuration: any, 
  setMasterId: any, 
  setPlayed: any, 
  setClipRange: any, 
  progressInterval?: number, 
  style?: CSSProperties
}

export interface TrimMp4RequestProps {
  transport: Transport, 
  mode?: number, 
  fileName: string, 
  rangeStart: number, 
  rangeEnd: number
}