import React from 'react';
import { Typography } from '@mui/material';
import { useStorageEstimate } from './useStorageEstimate';

// バイトをMBに変換するヘルパー関数
const bytesToMB = (bytes: number): string => {
  return (bytes / 1024 / 1024).toFixed(2);
};

const StorageDisplay: React.FC = () => {
  const { estimate, error } = useStorageEstimate();

  if (error) {
    return <p style={{ color: 'red' }}>エラー: {error}</p>;
  }

  if (!estimate) {
    return <p>ストレージ情報を読み込み中...</p>;
  }

  if(!estimate.usage || !estimate.quota) {
    return <p>エラー</p>
  }

  const usedMB = bytesToMB(estimate.usage);
  const quotaMB = bytesToMB(estimate.quota);

  return (
    <Typography sx={{ padding: '20px', border: '1px solid #ccc', mt: 1}}>
      <h3>💾 ブラウザストレージ使用量</h3>
      <ul>
        <li>**使用量 (Usage):** {usedMB} MB</li>
        <li>**クォータ (Quota):** {quotaMB} MB</li>
        <li>**残り容量:** {bytesToMB(estimate.quota - estimate.usage)} MB</li>
      </ul>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        ※この値は、IndexedDB、Cache APIなど、オリジン全体のストレージの合計値です。
      </p>
    </Typography>
  );
};

export default StorageDisplay;