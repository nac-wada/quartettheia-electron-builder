import { Box, Collapse, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material"
import { FC } from "react"
import { WandBatchExposure, WandBatchGain, WandBatchGamma } from "./WandCameraTuning"

export const BatchCameraTuningForm: FC<{
  value: 'single'|'multi',
  localStorageKey: {
    exposure: string,
    gain: string,
    gamma: string,
  },
  onChange: (value: string) => void,
}> = ({
  value,
  localStorageKey,
  onChange
}) => {
  const { exposure, gain, gamma } = localStorageKey
  return (
      <Box>
        <FormControl>
          <RadioGroup
            value={value}
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={value}
            name="radio-buttons-group"
            onChange={(_, value) => onChange(value)}
          >
            <FormControlLabel 
              value="single" 
              control={<Radio size="small"/>} 
              label="個別で設定する" 
              slotProps={{
                typography: { sx: { fontSize: '14px', fontWeight: 400 } }
              }}
              // 右側の余白を個別に調整（デフォルトは16px相当）
              sx={{ 
                marginRight: '8px',
                '& .MuiFormControlLabel-root': { p: 0 } 
              }} 
            />
            <FormControlLabel 
              value="multi" 
              control={<Radio size="small"/>} 
              label="すべてのカメラを設定する" 
              slotProps={{
                typography: { sx: { fontSize: '14px', fontWeight: 400 } }
              }}
              sx={{ 
                marginRight: '8px',
                '& .MuiFormControlLabel-root': { p: 0 } 
              }} 
            />
          </RadioGroup>

        </FormControl>

        <Collapse in={value==='multi'}>
          <Box sx={{ margin: "5px 0px 0px" }}>
            <WandBatchExposure localStorageKey={exposure} disabled={value==='single'}/>
            <WandBatchGain localStorageKey={gain} disabled={value==='single'}/>
            <WandBatchGamma localStorageKey={gamma} disabled={value==='single'}/>
          </Box>
        </Collapse>

      </Box>
  )
}