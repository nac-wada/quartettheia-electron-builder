import { Box, Button, Collapse, Grid, InputAdornment, SxProps, TextField, Theme, Typography } from "@mui/material"
import { FC, useEffect, useState } from "react"
import { LensParameterType } from "../../../../types/common";
import { lensMenuList } from "../../../../types/common";

export const LensParameterForm2: FC<{ 
  configFocalLength: LensParameterType,
  disabled: boolean,
  updateFocalLength: (value: string, targetCamera?: string) => void, 
  updateSelectedLens: (value: LensParameterType, targetCamera?: string) => void,
  targetCamera?: string,
  sx?: {
    contentsStyle?: SxProps<Theme>,
    collapsedContentsStyle?: SxProps<Theme>,
  }
}> = ({ configFocalLength, disabled, targetCamera, sx, updateFocalLength, updateSelectedLens }) => {
  const [focus, setFocus] = useState(`${configFocalLength.focalLength}`);
  const [selectedLens, setSelectedLens] = useState<string>(configFocalLength.name);

  useEffect(() => {
    setSelectedLens(configFocalLength.name);
    setFocus(`${configFocalLength.focalLength}`);
  }, [configFocalLength]);
  
  const handleChangeFocusForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    setFocus(newValue)
  }

  const handleClickSeletedLens = (lensName: string, targetCamera?: string) => {
    setSelectedLens(lensName)
    const lens = lensMenuList.filter(({name}) => name === lensName)[0]
    updateSelectedLens(lens, targetCamera)
  }


  return (
    <Box sx={{ p: "0.5rem 1rem", ...sx?.contentsStyle }}>
      <div>
        <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 400, ml: "0.5rem" }} gutterBottom>レンズパラメータ</Typography>

        <Grid container spacing={1} sx={{ p: "0 0.5rem" }}>
          {
            lensMenuList.map((lens, i) => (
              <Grid key={i} size={targetCamera ? { xs: 12, sm: 6 } : { xs: 6 }}>
                <Button 
                  disabled={disabled}
                  size="small"
                  variant={selectedLens===lens.name ? "contained" : "outlined"}
                  sx={{ 
                    width: "100%", 
                    fontSize: 12,
                    textTransform: 'none'
                  }}
                  onClick={() => handleClickSeletedLens(lens.name, targetCamera)}
                >
                  {lens.name}
                </Button>
              </Grid>
            ))
          }
        </Grid>
      </div>

      <Collapse in={selectedLens === 'カスタマイズ'}>
        <Box 
          sx={{ 
            borderRadius: 2, 
            p: "1rem", 
            display: "flex", 
            alignItems: "center", 
            m: "0.5rem", 
            gap: "10px",
            ...sx?.collapsedContentsStyle
          }}
        >
          {/* ラベル部分：改行を禁止 */}
          <Typography
            color="text.secondary" 
            sx={{ 
              fontWeight: 400, 
              fontSize: 14,
              display: "inline-block", 
              whiteSpace: "nowrap", // ← これで折れ曲がりを防止
              ...(disabled && ({ color: "grey" })) 
            }}
          >
            焦点距離
          </Typography>

          <TextField
            disabled={disabled}
            value={focus}
            type='number'
            slotProps={{
              input: { // endAdornment を追加するために slotProps.input を使用
                endAdornment: <InputAdornment position="end">mm</InputAdornment>,
              },
              htmlInput: {
                style: {
                  color: 'text.primary',
                  height: '1rem',
                  textAlign: 'left',
                  padding: '0.2rem',
                  paddingLeft: '0.3rem',
                  paddingRight: '0.3rem',
                },
              }
            }}
            sx={{
              flex: 1, // ← これで残りの横幅をすべてTextFieldが埋める
              '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button': {
                // 単位(mm)を入れる場合、スピンボタンを表示したままでも収まりが良くなります。
                // もし不要なら display: 'none' に設定してください。
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: '2px solid',
                borderColor: "primary.main"
              },
            }}
            onChange={handleChangeFocusForm}
            onBlur={(event) => {
              setFocus(event.target.value)
              updateFocalLength(event.target.value, targetCamera)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                let e = event as unknown as React.ChangeEvent<HTMLInputElement>
                setFocus(e.target.value)
                updateFocalLength(e.target.value, targetCamera)
              }
            }}
          />
        </Box>
      </Collapse>
    </Box>
  )
}