import { EncryptStorage } from 'encrypt-storage';

const secretKey = 'your-secret-key'; // AES鍵
const encryptStorage = new EncryptStorage(secretKey);


// ローカルストレージに設定値を保存する用関数 // 通常はこれ使えばok
export function saveSettingsToLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeSavedLocalStorage(key: string) {
  localStorage.removeItem(key);
}

// 非同期版
export const saveSettingsToLocalStorageAsync = async (key: string, value: any) => {
  try {
    await localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};


// ローカルストレージから前回の設定値を読み込む関数 // 通常はこれ使えばok
export function loadSettingsFromLocalStorage(key: string, defaultValue: any) {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
}


// 変数をAESで暗号化してローカルストレージに保存する関数
export function saveEncryptToLocalStorage(key: string, value: string): void {
  const encryptedValue = encryptStorage.encryptValue(value);
  encryptStorage.setItem(key, encryptedValue);
}


// AESで暗号化された値を取得する関数
export function loadEncryptFromLocalStorage(key: string, defaultValue: string): string {
  const encryptedValue = encryptStorage.getItem<string>(key);
  if (encryptedValue) {
    const originalValue = encryptStorage.decryptValue<string>(encryptedValue);
    return originalValue ?? "";
  }
  return defaultValue;
}


//-----------------
//// 期限ありの保存
//export const setItemWithExpiry = (key: string, value: any, expiryInSeconds: number) => {
//  const now = new Date();
//  const item = {
//    value: value,
//    expiry: now.getTime() + expiryInSeconds * 1000,
//  };
//  localStorage.setItem(key, JSON.stringify(item));
//};


//// 期限確認&データ削除
//export const getItemWithExpiry = (key: string, defaultValue: any) => {
//  const itemString = localStorage.getItem(key);
//  if (!itemString) {
//    return defaultValue;
//  }

//  console.log('itemString', itemString);

//  const item = JSON.parse(itemString);
//  const now = new Date();

//  if (now.getTime() > item.expiry) {
//    // データの保存期限が切れている場合、データを削除
//    localStorage.removeItem(key);
//    return defaultValue;
//  }
//  return item.value;
//};
