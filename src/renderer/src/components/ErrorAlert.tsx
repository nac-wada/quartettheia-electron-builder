import { Alert, AlertTitle } from "@mui/material";
import { FC, memo } from "react";

export const ErrorAlert: FC<{message:string}>  = memo(({message}) => {
  return (
    <Alert severity="error">
      <AlertTitle>エラー</AlertTitle>
      {message}
    </Alert>
  )
})