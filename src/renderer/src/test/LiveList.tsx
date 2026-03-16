// LiveList.tsx
import { useEffect, useState } from "react";
import Live from "./Live";
import { v4 as uuidv4 } from 'uuid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function LiveList(props: { sigurls: Promise<string[]>; }) {

  const [state, setState] = useState("");
  const [sigurls, setSigUrls] = useState<string[]>([]);

  useEffect(() => {
    setState("loading");
    props.sigurls.then((sigurls) => {
      setSigUrls([...sigurls]);
      setState("success");
    });
  }, [props.sigurls]);

  const getLiveComponents = () => {
    return sigurls.map((sigurl) => {
      const key = uuidv4();
      return (
        <Box
          sx={{
            border: 1,
            borderRadius: 1,
            borderColor: 'grey.300',
            backgroundColor: 'white',
            m: 1,
            //mt: sigurl == sigurls[0]
            //  ? 6 : 0
          }}
          component="div"
        >
          <Typography
            variant="h1"
            fontSize={20}
            color='primary.main'
            align='left'
            sx={{ p: 1 }}
          >
            camera #{sigurls.indexOf(sigurl) + 1}
          </Typography>
          <Live key={key} sigurl={sigurl} />
        </Box>
      );
    });
  };

  return (
    <>
      {state === "loading" ? (
        <p className={"Record-icon"}>loading...</p>
      ) : (
        <p>{getLiveComponents()}</p>
      )}
    </>
  );
};