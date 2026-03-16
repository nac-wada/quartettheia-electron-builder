import { SxProps, Theme, TypographyOwnProps } from "@mui/material";

export type StatusCodeType = {
  code: string;
  status: number;
  document: string;  
}

export type ActiveLightMarkerPoint = {
  x: number;
  y: number;
}

export interface StepperContentProps {
  title: string,
  description: string,
  children?: React.ReactNode
}

interface GuideSectionProps {
  sectionTitle?: string,
  media?: { src: string, mediaTitle?: {text: string, color?: TypographyOwnProps["color"] } }[] | { src: string, mediaTitle?: {text: string, color?: TypographyOwnProps["color"] } },
  description?: string 
}

export interface MarkerGuideProps {
  title: string, 
  sections: GuideSectionProps[]
  sx?: SxProps<Theme>
}

export const localStorage_CameraTuning_BatchMode_Enabled = `cameraTuningBatchMode`

export const VIRTUAL_WIDTH = 1936; 

export const VIRTUAL_HEIGHT = 1216;