import { CSSProperties, FC } from "react";

interface AIREALProps {
  style?: CSSProperties | undefined;
}


const AIREALTOUCHIcon: FC<AIREALProps> = ({ style }) => {
  return (
    <img
      src={'/icon/Icon_Aireal-Touch.svg'}
      style={style}
      alt={"Icon"}
    />
  );
};


const AIREALIcon: FC<AIREALProps> = ({ style }) => {
  return (
    <img
      src={'/icon/Icon_Aireal.svg'}
      style={style}
      alt={"Icon"}
    />
  );
};


const AIREALLogo: FC<AIREALProps> = ({ style }) => {
  return (
    <img
      src={'/icon/Logo_Aireal-Touch_v2.svg'}
      style={style}
      alt={"AIREAL-Touch"}
    />
  );
};


const AIREALICON_NOTITLE: FC<AIREALProps> = ({ style }) => {
  return (
    <img
      src={'favicon.ico'}
      alt="App Icon"
      style={style}
    />
  )
}

export { AIREALTOUCHIcon, AIREALIcon, AIREALLogo, AIREALICON_NOTITLE };