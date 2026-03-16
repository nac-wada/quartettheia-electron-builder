// パッケージの型定義をインポート
import '@mui/material/styles';
import { PaletteColor, PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customColor: PaletteColor;
  }
  interface PaletteOptions {
    customColor?: PaletteColorOptions;
  }
}