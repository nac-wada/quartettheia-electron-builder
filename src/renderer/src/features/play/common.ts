import { FileMetadataType } from "../../gen/solo/v1/solo_pb";
import { VideoGroupType, MessageModalProps } from "../../types/common";

export type PlayListModel = {
  items: VideoGroupType[];
  moreItemsLoading: boolean;
  startIndex: number;
  order: number;
  fileCount: number;
  activeItem: string | null;
  dialogProps: MessageModalProps | null; 
  sortMenuAnchor: null | HTMLElement,
  listUpdated: boolean,
}

export type getRecordedKeyFileGroupsWithMetadatasFuncType = (
  { startIndex, order, getFiles, event, toTop } :
  { startIndex: number, order: number, getFiles: number, event: string, toTop?: boolean }
) => void;

export type selectRecordedKeyFileGroupFuncType = (
  { item } : 
  { item: VideoGroupType }
) => void;

export type selectAllRecordedKeyFileGroupsFuncType = () => void;

export type openReplayFormFuncType = (
  { itemKey } : 
  { itemKey: string }
) => void;

export type closeReplayFormFunc = () => void;

export type openWarningDialogFuncType = ({ dialog }:{ dialog: MessageModalProps }) => void;

export type closeWarningDialogFuncType = () => void;

export type removeRecordedKeyFileGroupFuncType = (
  { item } :
  { item: VideoGroupType }
) => void;

export type removeRecordedKeyFileGroupsFuncType = (
  { items } : 
  { items: VideoGroupType[] }
) => void;

export type setRecordedFileMetadataFuncType = (
  { value, item, fileMetaDataType } :
  { value: string, item: VideoGroupType, fileMetaDataType: FileMetadataType }
) => void;

export type downloadMp4FileFuncType = (
  { date, signal, src, nickname, sceneName, subjectId, onProgress } : 
  { date: Date, signal?: AbortSignal|null, src: string, nickname: string, sceneName: string, subjectId: string, onProgress?: any }
) => Promise<boolean>

export type downloadRecordedKeyFileGroupFuncType = (
  { item } :
  { item: VideoGroupType }
) => void;

export type stopDownloadRecordedKeyFileGroupFuncType = (
  { item } :
  { item: VideoGroupType }
) => void;

export type downloadRecordedKeyFileGroupsFuncType = (
  { items } : 
  { items: VideoGroupType[] }
) => void;

export type changeOrderType = (
  { requestOrder } : 
  { requestOrder: number }
) => void;

export type openHandleSortMenuType = (event: React.MouseEvent<HTMLButtonElement>) => void;

export type closeHandleSortMenuType = () => void;

export type PlayListViewModel = {
  listState: PlayListModel,
  getRecordedKeyFileGroupsWithMetadatasFunc: getRecordedKeyFileGroupsWithMetadatasFuncType,
  changeOrder: changeOrderType,
  openReplayFormFunc: openReplayFormFuncType,
  closeReplayFormFunc: closeReplayFormFunc,
  openWarningDialogFunc: openWarningDialogFuncType,
  closeWarningDialogFunc: closeWarningDialogFuncType,
  selectRecordedKeyFileGroupFunc: selectRecordedKeyFileGroupFuncType,
  selectAllRecordedKeyFileGroupsFunc: selectAllRecordedKeyFileGroupsFuncType,
  removeRecordedKeyFileGroupFunc: removeRecordedKeyFileGroupFuncType,
  removeRecordedKeyFileGroupsFunc: removeRecordedKeyFileGroupsFuncType,
  setRecordedFileMetadataFunc: setRecordedFileMetadataFuncType,
  downloadMp4FileFunc: downloadMp4FileFuncType,
  downloadRecordedKeyFileGroupFunc: downloadRecordedKeyFileGroupFuncType,
  stopDownloadRecordedKeyFileGroupFunc: stopDownloadRecordedKeyFileGroupFuncType,
  downloadRecordedKeyFileGroupsFunc: downloadRecordedKeyFileGroupsFuncType,
  openHandleSortMenu: openHandleSortMenuType,
  closeHandleSortMenu: closeHandleSortMenuType
}

