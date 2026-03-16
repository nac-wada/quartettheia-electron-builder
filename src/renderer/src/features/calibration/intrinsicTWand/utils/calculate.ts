/**
 * 標準偏差の計算
 */
export const calculateStdDev = (angles: number[]) => {
  const n = angles.length;
  if (n < 2) return 0;
  const mean = angles.reduce((a, b) => a + b, 0) / n;
  const variance = angles.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
  return Math.sqrt(variance);
};

/**
 * スケール比の計算
 */
export const calculateScaleRatio = (lengths: number[]) => {
  if (lengths.length < 2) return 1;
  const maxL = Math.max(...lengths);
  const minL = Math.min(...lengths);
  return minL === 0 ? 1 : maxL / minL;
};