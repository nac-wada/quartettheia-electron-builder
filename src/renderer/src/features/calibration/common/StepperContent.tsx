import { Typography } from "@mui/material"
import { FC } from "react"
import { StepperContentProps } from "../common"

export const StepperContent: FC<StepperContentProps> = ({ title, description, children }) => {
  return (
    <div key={title} style={{ marginBottom: "30px" }}>
      <Typography  
        align="left" 
        sx={{fontWeight: 'bold', fontSize: 16}}
        color="textPrimary"
        gutterBottom
      >
        {title}
      </Typography>

      <Typography  
        align="left" 
        sx={{fontWeight: 400, fontSize: 14, whiteSpace: "pre-wrap"}}
        color="textSecondary"
      >
        {description}
      </Typography>

      {children}
    </div>
  )
}