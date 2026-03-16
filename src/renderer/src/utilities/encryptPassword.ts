import { quartetGetWebAppLoginAPIPublicKey } from "../api/quartetAPI";
import forge from "node-forge"

/**
 * PEM形式の公開鍵文字列を読み込んで、RSA-OAEP暗号化を行う関数
 */
export async function encryptPlainText(props: { plainText: string, pemPublicKey: string }) {
  const publicKey = forge.pki.publicKeyFromPem(props.pemPublicKey);

  const encryptedBytes = publicKey.encrypt(
    forge.util.encodeUtf8(props.plainText), 
    "RSA-OAEP", 
    {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create()
      }
    }
  )

  return forge.util.encode64(encryptedBytes)
}

/**
 * 引数のオブジェクトと同じキーを持ち、
 * 値を変換して返す関数
 * WebAppLogin系のusername、passwordを必要とするapiを実行するときに使用する
 */
export async function createWebAppLoginEncryptTexts<T extends Record<string, string>>(input: T): Promise<{
  [K in keyof T]: string;
} | false> {
  const publicKey = await quartetGetWebAppLoginAPIPublicKey();
  if(!publicKey) return false

  const result = {} as { [K in keyof T]: string };

  for (const key in input) {
    // ここで実際の暗号化処理を行う
    // result[key] = `encrypted_${input[key]}` as Encrypted;
    result[key] = await encryptPlainText({ plainText: input[key], pemPublicKey: publicKey.key });
    console.log(result[key])
  }

  return result;
}