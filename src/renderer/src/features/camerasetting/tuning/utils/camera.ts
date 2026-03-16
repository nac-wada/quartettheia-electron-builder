export const convertHoursToTimeString = (hours: number): string => {
  const totalSeconds = Math.floor(hours * 3600); // 指定された時間を秒に変換する
  const formattedHours = Math.floor(totalSeconds / 3600); // 時間を取得(床関数)
  const remainingSeconds = totalSeconds % 3600; // 1時間を超える秒数を取得
  const formattedMinutes = Math.floor(remainingSeconds / 60); // 分を取得(床関数)
  const formattedSeconds = remainingSeconds % 60; // 分を取得(余り)
  return `記録可能時間 ${formattedHours.toString().padStart(2, '0')}:${formattedMinutes.toString().padStart(2, '0')}:${formattedSeconds.toString().padStart(2, '0')}`;
};