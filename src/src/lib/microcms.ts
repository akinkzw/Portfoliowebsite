import { createClient } from "microcms-js-sdk";

// microCMSの設定（環境変数から取得、ない場合はデフォルト値）
const SERVICE_DOMAIN = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MICROCMS_SERVICE_DOMAIN) || "xorqasmzf7";
const API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MICROCMS_API_KEY) || "nVtMhU5LZYMqQGB6crHG8WAjMVsghfMAQ49a";

// デバッグ用
console.log('microCMS Config:', {
  domain: SERVICE_DOMAIN,
  apiKeyLength: API_KEY.length,
  apiKeyStart: API_KEY.substring(0, 5) + '...',
  usingEnvVars: typeof import.meta !== 'undefined' && !!import.meta.env?.VITE_MICROCMS_SERVICE_DOMAIN
});

// APIが設定されているかチェック
const isConfigured = SERVICE_DOMAIN && API_KEY;

export const client = isConfigured
  ? createClient({
      serviceDomain: SERVICE_DOMAIN,
      apiKey: API_KEY,
    })
  : null;

// 作品の型定義（microCMSからのレスポンス）
export interface Work {
  id: string;
  title: string;
  description: string;
  image: Array<{
    url: string;
    height?: number;
    width?: number;
  }>; // microCMSの画像フィールドは配列
  category: string | string[]; // 配列または文字列（既存データは配列、新規データは文字列の可能性）
  tags?: string[]; // タグフィールド（オプション）
  displayOrder?: number; // 表示順序フィールド（オプション）
  externalLink?: string; // 外部リンク（オプション）
  aspectRatio?: 'square' | 'portrait' | 'photo' | 'auto' | ('square' | 'portrait' | 'photo' | 'auto')[]; // ライトボックスのアスペクト比（オプション）※配列の場合もある
  createdAt: string;
  updatedAt: string;
}

// カテゴリごとの作品を取得
export async function getWorksByCategory(
  category: string,
  limit: number = 3,
) {
  // APIが未設定の場合は空配列を返す
  if (!client) {
    console.log('Client not configured');
    return [];
  }

  try {
    console.log(`🔍 Fetching works for category: ${category}`);
    
    // フィルターをかけて取得
    const response = await client.get({
      endpoint: "works",
      queries: {
        filters: `category[contains]${category}`,
        limit: limit,
        orders: "displayOrder", // 表示順序の昇順（数字が小さい順）
      },
    });
    console.log(`✅ Response for \"${category}\" (found: ${response.totalCount}):`, response);
    
    // aspectRatioが配列の場合は最初の要素を取得（microCMSの設定ミス対策）
    const works = (response.contents as Work[]).map(work => {
      if (Array.isArray(work.aspectRatio)) {
        console.log(`⚠️ Work: ${work.title}, aspectRatio is Array:`, work.aspectRatio);
        return {
          ...work,
          aspectRatio: work.aspectRatio[0] || 'portrait' // 配列の最初の要素を使用、空なら'portrait'
        } as Work;
      }
      return work;
    });
    
    return works;
  } catch (error: any) {
    console.error(`Error fetching ${category}:`, error);
    console.error(`Error details:`, error.message);
    // API設定エラーの場合は静かに空配列を返す（モックデータを使用）
    return [];
  }
}

// すべての作品を取得（カテゴリ詳細ページ用）
export async function getAllWorksByCategory(category: string) {
  // APIが未設定の場合は空配列を返す
  if (!client) {
    return [];
  }

  try {
    const response = await client.get({
      endpoint: "works",
      queries: {
        filters: `category[contains]${category}`,
        orders: "displayOrder", // 表示順序の昇順（数字が小さい順）
      },
    });
    
    // aspectRatioが配列の場合は最初の要素を取得（microCMSの設定ミス対策）
    const works = (response.contents as Work[]).map(work => {
      if (Array.isArray(work.aspectRatio)) {
        console.log(`⚠️ Work: ${work.title}, aspectRatio is Array:`, work.aspectRatio);
        return {
          ...work,
          aspectRatio: work.aspectRatio[0] || 'portrait' // 配列の最初の要素を使用、空なら'portrait'
        } as Work;
      }
      return work;
    });
    
    return works;
  } catch (error) {
    // API設定エラーの場合は静かに空配列を返す（モックデータを使用）
    return [];
  }
}
