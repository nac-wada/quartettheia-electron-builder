import { FC, memo, useMemo } from "react";
import { Typography, TypographyProps } from "@mui/material";


export const RecTimer: FC<{ currTime: number, setTime: number } & TypographyProps> = memo(({currTime, setTime, ...props}) => {
  const curr = new Date(currTime);
  const t = new Date(setTime * 1000);

  let currMiliseconds = useMemo(() => { return `00${curr.getUTCMilliseconds()}`.slice(-3); },[ curr ]); 
  let currSeconds = useMemo(() => { return `0${curr.getUTCSeconds()}`.slice(-2); },[ curr ]); 
  let currMinutes = useMemo(() => { return `0${curr.getUTCMinutes()}`.slice(-2); },[ curr ]); 

  let miliseconds = useMemo(() => { return `00${t.getUTCMilliseconds()}`.slice(-3); },[ t ]); 
  let seconds = useMemo(() => { return `0${t.getUTCSeconds()}`.slice(-2); },[ t ]); 
  let minutes = useMemo(() => { return `0${t.getUTCMinutes()}`.slice(-2); },[ t ]); 

  return (
    <Typography component={"span"}
      sx={{ 
        fontWeight: 'normal', 
        // height: 50, 
        width: { xs: 120, sm: 180 }, mx: 0.5, 
        py: "0.5rem",
        textAlign: "center", borderRadius: "2rem", 
        // backgroundColor: isDarkMode ? grey[900] : grey[200],
        // color: isDarkMode ? "white" : grey[900], 
        display: "block",
        ...props.sx
      }} 
    >
      <Typography sx={{ display: "inline" }}>{ currMinutes }:{ currSeconds }.{ currMiliseconds }</Typography>
      <Typography sx={{ display: { xs: "none", sm: "inline" } }}> / </Typography>
      <Typography sx={{ display: { xs: "none", sm: "inline" } }}>{ minutes }:{ seconds }.{ miliseconds }</Typography>
    </Typography>
  )
})