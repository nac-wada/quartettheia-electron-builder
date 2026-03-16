// src/components/sample/Tmpi18n.tsx
import React from 'react';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';

import { useTranslation } from 'react-i18next'; // 国際化

// ターミナルで以下のコマンドを打つとt('')を検出し,
// 辞書ファイル(src/i18n/locales/en.json)を作成/追記してくれる.
// ただし自動翻訳はされない
// $ npm run i18next-extract

// また, t('greeting', { name }) のように変数を持つkeyは
// 'greeting'こっちしか追記してくれないため,
// greeting: 'Hello, {{name}}!',
// greeting: 'Hello, {{name}}!',
// のように自分で, src/i18n/locales/en.json を書き換える必要がある

export default function TmpTest() {
  const { t, i18n } = useTranslation(); // useTranslationフックを使ってt関数とi18nオブジェクトを取得

  const name = 'John';

  // 言語切り替えのハンドラ
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5" color='primary'>
        国際化（{t('internationalization')}）
      </Typography>

      <br/>
      <Typography variant="body1" color='primary'>
        t("Home") {/* 変換されない書き方 */}
        t('Home') {/* 変換されない書き方 */}
        {t('Home')}
        {t("Home")}
      </Typography>

      <br/>
      <Typography variant="body1" color='second'>
        {t('Home')}、
        {t('About')}、
        {t('Connect')}、
        {t('Contact')}、
        {t('Version')}、
      </Typography>

      {/* 変数を含むテキストを表示 */}
      <br/>
      <Typography variant="body1" color='info'>
        {t('greeting', { name })} {/* 'Hello, John!' もしくは 'こんにちは、Johnさん！' と表示される */}
      </Typography>


      <br/>
      <Typography variant="body1" color='primary'>
        {t('AIREALカメラの操作アプリです。ユーザー名には「admin」と入力し、本アプリで設定したパスワードを 入力して、ログインボタンを押してください。')}
      </Typography>

      <div>
        <button onClick={() => handleLanguageChange('en')}>English</button>
        <button onClick={() => handleLanguageChange('ja')}>Japanese</button>
        <button onClick={() => handleLanguageChange('ar')}>Arabian</button>
      </div>
    </>
  );
}
