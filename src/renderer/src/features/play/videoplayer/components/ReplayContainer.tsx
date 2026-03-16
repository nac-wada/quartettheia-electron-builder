import { FC, memo } from "react";
import { FullScreenStateType } from "../../../../types/common";
import { MultiVideoForm } from "./MultiVideoForm";
import { SingleVideoForm } from "./SingleVideoForm";
import { ReplayContainerProps } from "../types";

export const ReplayContainer: FC<
  ReplayContainerProps & { 
    fullScreenProps: FullScreenStateType,
    fullScreenId: string
  }
> = memo((props) => {

  return (
    props.replayFormState.options.singleMode ? 
    <SingleVideoForm {...props}/> : 
    <MultiVideoForm {...props}/>
  )
})