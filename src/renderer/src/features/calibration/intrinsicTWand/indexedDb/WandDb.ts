import Dexie, { Table } from 'dexie';

// データベースに保存するデータの型定義
export interface WandSession {
  // primary key: 自動インクリメント
  id?: number; 
  // セッション名または日付
  name: string; 
  // 座標データ (Float32Arrayで保存することを想定)
  pathData: ArrayBuffer; 
  // 記録日時
  timestamp: Date; 
}

// データベースクラスの定義
export class WandDatabase extends Dexie {
  // 'wandSessions' という名前のテーブル (Object Store) を作成
  wandSessions!: Table<WandSession>;

  constructor() {
    super('WandCalibrationDB'); // データベース名
    this.version(2).stores({
      // id をプライマリキー (自動インクリメント) として設定
      // name をインデックス可能に設定
      wandSessions: '++id, name, timestamp', 
    });
  }
}

// データベースに保存するデータの型定義
export interface WandInSession {
  // primary key: 自動インクリメント
  id?: number; 
  // セッション名または日付
  name: string; 
  // 左端座標データ (Float32Arrayで保存することを想定)
  bluePathData: ArrayBuffer;
  // 右端座標データ (Float32Arrayで保存することを想定)
  redPathData: ArrayBuffer;
  // 各エリアの検出点数
  areasPoint: ArrayBuffer;
}

// データベースクラスの定義
export class WandInDatabase extends Dexie {
  // 'wandSessions' という名前のテーブル (Object Store) を作成
  wandInSessions!: Table<WandInSession>;

  constructor() {
    super('WandCalibrationDB'); // データベース名
    this.version(2).stores({
      // id をプライマリキー (自動インクリメント) として設定
      // name をインデックス可能に設定
      wandInSessions: '++id, name, timestamp', 
    });
  }
}

export interface TWandMarkerSession {
  id?: number;
  name: string;
  packets: ArrayBuffer;
  areasPoint: ArrayBuffer;
}

export class TWandMarkerDatabase extends Dexie {
  tWandMarkerSessions!: Table<TWandMarkerSession>;

  constructor() {
    super('TWandMarkerDB');
    this.version(2).stores({
      // id をプライマリキー (自動インクリメント) として設定
      // name をインデックス可能に設定
      tWandMarkerSessions: '++id, name, timestamp', 
    });
  }
}

export const db = new WandDatabase();

export const wandDb = new WandInDatabase();

export const tWandMarkerDb = new TWandMarkerDatabase();