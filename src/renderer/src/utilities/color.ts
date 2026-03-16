// '#ffffff'を 'rgba(255, 255, 255, 1)' に変換する関数
export function hexToRGBA(hex: string, alpha: number): string {
  // RGBA形式の文字列かどうかを正規表現で確認
  const rgbaRegex = /^rgba\(\d+,\s*\d+,\s*\d+,\s*\d+(\.\d+)?\)$/;
  if (rgbaRegex.test(hex)) {
    return hex; // 既にRGBA形式の文字列ならそのまま返す
  }

  let formattedHex = hex;

  // 省略型のカラーコード対策 (#fff)
  if (hex.length === 4) {
    formattedHex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  // #ffffff -> rgba(r,g,b,a) に変換
  const r = parseInt(formattedHex.slice(1, 3), 16);
  const g = parseInt(formattedHex.slice(3, 5), 16);
  const b = parseInt(formattedHex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 数字に応じたカラーコードを返す関数
// カメラ色の台数無限対応
export function colorRoulette ({ index, angle=137.508, saturation='100%', lightness='60%' }: {
  index: number,
  angle?: number,
  saturation?: string,
  lightness?: string,
}): string {
  const color = `hsl(${(index * angle) % 360}, ${saturation}, ${lightness})`;
  return color;
};