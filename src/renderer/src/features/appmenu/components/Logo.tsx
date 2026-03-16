// Logo.tsx
import { useState, useEffect } from 'react';
import { IconButton, Link } from '@mui/material';

export default function Logo() {
  const [locale, setLocale] = useState('ja');

  useEffect(() => {
    // コンポーネントがマウントされたときにロケールを取得する
    const userLocale = navigator.language;
    setLocale(userLocale === 'ja' ? 'ja' : 'other');
  }, []);

  // ロケールに応じてリンクを設定
  const link = locale === 'ja' ? 'https://www.nacinc.jp/' : 'https://www.nacinc.com/';

  const logo = 'nac_Logo_screenshot/white.png';
  //const logo = isDarkMode ? 'nac_Logo_screenshot/blue.png' : 'nac_Logo_screenshot/white.png';

  return (
    <Link href={link} target="_blank" rel="noopener noreferrer">
      <IconButton color='inherit' sx={{ ml: "0.25rem" }}>
        <img src={logo} width={'40px'} alt="file-thumbnails"/>
      </IconButton>
    </Link>
  );
}
