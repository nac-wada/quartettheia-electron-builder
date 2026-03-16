// src/components/settings/item/SettingItem.tsx
import React from 'react';
import {
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
} from '@mui/material';

interface SettingItemProps {
  label: string;
  labelButton?: string;
  description: string;
  type: 'toggle' | 'input' | 'button' | 'select';
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSelect?: (value: string) => void;
  onClick?: () => void;
  checked?: boolean;
  value?: string;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  variantInput?: 'standard' | 'outlined' | 'filled';
  variantButton?: 'outlined' | 'contained' | 'text';
  colorToggle?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';
  colorButton?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
  dialogComponent?: JSX.Element
  selectOpen?:boolean
  onSelectOpen?:() => void
  onSelectClose?:() => void 
}

const SettingItem: React.FC<SettingItemProps> = ({
  label,
  labelButton = 'Save',
  description,
  type,
  onChange,
  onChangeSelect,
  onClick,
  checked,
  value,
  disabled,
  options,
  variantInput,
  variantButton,
  colorToggle,
  colorButton,
  dialogComponent,
  selectOpen,
  onSelectOpen,
  onSelectClose,
}) => {
  const renderSetting = () => {
    switch (type) {
      case 'toggle':
        return (<Switch color={colorToggle ? colorToggle : 'primary'} onChange={onChange} checked={checked} disabled={disabled} />);
      case 'input':
        return (<TextField variant={variantInput ? variantInput : 'outlined'} onChange={onChange} value={value} disabled={disabled} />);
      case 'button':
        return (<Button color={colorButton ? colorButton : 'primary'} variant={variantButton ? variantButton : 'contained'} onClick={onClick} disabled={disabled}>{labelButton}</Button>);
      case 'select':
        return (
          <Select
            value={value}
            onChange={(e) => onChangeSelect?.(e.target.value as string)}
            onClose={onSelectClose}
            variant='outlined'
            disabled={disabled}
            open={selectOpen}
            onOpen={onSelectOpen}
            sx={{
              fontSize: 12,
              fontWeight: "bold",
              color: "text.secondary"
            }}
          >
            {options &&
              options.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: 12, fontWeight: "bold", color: "text.secondary" }}>
                  {option.label}
                </MenuItem>
              ))}
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box component='div' sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <ListItemText
            primary={<Typography variant='subtitle1'>{label}</Typography>}
            secondary={<Typography variant='caption'>{description}</Typography>}
          />
        </Box>
        <Box component='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {renderSetting()}
        </Box>
      </ListItem>

      { dialogComponent }
    </>
  );
};

export default SettingItem;
