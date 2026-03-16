import { Box, Skeleton } from "@mui/material";
import { FC, memo, ReactNode } from "react";

export const LoadingComponent: FC<{
  children: ReactNode, 
  isLoading: boolean,
  rectangular1?: boolean 
  rectangular2?: boolean 
  circular1?: boolean 
  circular2?: boolean
}> = memo(({
  isLoading,
  children,
  rectangular1=true,
  rectangular2=true,
  circular1=true,
  circular2=true
}) => {
  
  return (
    <>
    {
      isLoading ?
      <Box
        sx={{
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: '1fr 7rem 40px 40px',
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <Box>
          {rectangular1 && <Skeleton variant="rectangular" height={25} sx={{ mt: 1, mr: 0.5 }} />}
        </Box>

        <Box>
          {rectangular2 && <Skeleton variant="rectangular" height={25} sx={{ mt: 1, mx: 0.6 }} />}
        </Box>

        <Box>
          {circular1 && <Skeleton variant="circular" height={25} width={25} sx={{ mt: 1, mx: 1 }} />}
        </Box>

        <Box>
          {circular2 && <Skeleton variant="circular" height={25} width={25} sx={{ mt: 1, mx: 1 }} />}
        </Box>

      </Box>
      : <>{children}</>
    }
    </>
  )
})