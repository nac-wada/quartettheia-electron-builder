import { VideoGroupType } from "../../../types/common";

export interface ThumbnailProps {
  item: VideoGroupType,
  openVideoPlayer: () => void,
  errorTag: boolean,
  errorMessage: string,
}
