import { InputBaseComponentProps, SxProps, TextField, Theme } from "@mui/material";
import { FC, memo, useEffect, useState } from "react";
import { VideoGroupType } from "../../../../types/common";
import { PlayListViewModel } from "../../common";
import { FileMetadataType } from "../../../../gen/quartet/v1/quartet_pb";

export const TextBox: FC<{
  id: 'scene' | 'subject';
  sx?: SxProps<Theme> | undefined;
  item: VideoGroupType;
  value: string;
  textinputprops?: InputBaseComponentProps | undefined;
  style?: React.CSSProperties | undefined;
  viewModel: PlayListViewModel
}> = memo((props) => {
  const { id, item, value, sx, textinputprops, style, viewModel } = props
  const [ text, setText ] = useState(value);

  useEffect(() => {
    setText(value)
  },[value])

  const onChange = (event: React.FocusEvent<HTMLInputElement>) => {
    setText(event.target.value)
  }

  const onBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    switch (id) {
      case 'scene':
        viewModel.setRecordedFileMetadataFunc({ value: event.target.value, fileMetaDataType: FileMetadataType.SCENE_NAME, item: item })
        break;
      case 'subject':
        viewModel.setRecordedFileMetadataFunc({ value: event.target.value, fileMetaDataType: FileMetadataType.SUBJECT_ID, item: item })
        break;
    }
  }

  const onKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter') {
      let e = event as unknown as React.ChangeEvent<HTMLInputElement>;
      switch (id) {
        case 'scene':
          viewModel.setRecordedFileMetadataFunc({ value: e.target.value, fileMetaDataType: FileMetadataType.SCENE_NAME, item: item })
          break;
        case 'subject':
          viewModel.setRecordedFileMetadataFunc({ value: e.target.value, fileMetaDataType: FileMetadataType.SUBJECT_ID, item: item })
          break;
      } 
    }
  }


  return (
    <>
      <TextField
        id={id}
        autoComplete="off"
        size="small"
        inputProps={textinputprops}
        placeholder="記入なし"
        sx={sx}
        style={style}
        value={text}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onChange={onChange}
      />
    </>
  )
})