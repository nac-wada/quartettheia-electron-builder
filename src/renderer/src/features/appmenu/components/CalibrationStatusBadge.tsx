import { FC, memo } from "react";
import { CheckCircle, Error, PanoramaVerticalTwoTone } from "@mui/icons-material";
import { Badge, CircularProgress } from "@mui/material";
import { Merge } from "@mui/icons-material";

export const InCalibStatusBadge: FC<{ 
  isCalibration: boolean, 
  isFailed: boolean,
}> = memo(({ isCalibration, isFailed,  }) => {

  return (
    <Badge 
      badgeContent={
        (isCalibration ? 
          <CircularProgress size={15} sx={{fontWeight: "bold"}}/> :
          isFailed ?
          <Error fontSize='small' sx={{ color:"error.main" }}/> :
          <CheckCircle fontSize='small' sx={{ color:"success.main" }}/>
        )
      }
    >
      <PanoramaVerticalTwoTone />
    </Badge>
  ) 
})

export const ExCalibStatusBadge: FC<{ 
  isCalibration: boolean, 
  isFailed: boolean,
}> = memo(({ isCalibration, isFailed }) => {

  return (
    <Badge 
      badgeContent={
        (isCalibration ? 
          <CircularProgress size={15} sx={{fontWeight: "bold"}}/> :
          isFailed ?
          <Error fontSize='small' sx={{ color:"error.main" }}/> :
          <CheckCircle fontSize='small' sx={{ color:"success.main" }}/>
        )
      }
    >
      <Merge />
    </Badge>
  ) 
})