// i18n/config.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import ja from "./locales/ja.json";
import en from "./locales/en.json";
import ar from "./locales/ar.json";


i18n
  .use(initReactI18next)
  .use(LanguageDetector) // ユーザーの言語設定を検知するために必要
  .init({
    debug: true,
    fallbackLng: 'ja', // デフォルトの言語を設定
    returnEmptyString: false, // 空文字での定義を許可
    interpolation: {
      // 翻訳された文字列内のHTMLやReactコンポーネントをエスケープすることを無効化
      escapeValue: false
    },
    resources: {
      // 辞書情報 // 用意した翻訳ファイルを読み込む
      ja: {
        translation: ja
      },
      en: {
        translation: en
      },
      ar: {
        translation: ar
      }
    },
    react: {
      // 指定したHTMLノードを翻訳時にそのまま保持して表示するための設定
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'span']
    }
  })

export default i18n