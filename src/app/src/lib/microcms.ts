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
  tags?: string[] | string; // タグフィールド（配列またはカンマ区切り文字列）
  displayOrder?: number; // 表示順序フィールド（オプション）
  externalLink?: string; // 外部リンク（オプション）
  aspectRatio?: 'square' | 'portrait' | 'photo' | 'auto' | ('square' | 'portrait' | 'photo' | 'auto')[]; // ライトボックスのアスペクト比（オプション）※配列の場合もある
  createdAt: string;
  updatedAt: string;
}

// microCMS APIレスポンスの型
interface MicroCMSResponse {
  contents: Work[];
  totalCount: number;
  offset: number;
  limit: number;
}

// microCMS APIを呼び出す関数
async function fetchFromMicroCMS(endpoint: string, queries: Record<string, any> = {}): Promise<MicroCMSResponse | null> {
  if (!isConfigured) {
    console.log('microCMS API not configured');
    return null;
  }

  try {
    // クエリパラメータを構築
    const queryString = new URLSearchParams();
    Object.entries(queries).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryString.append(key, String(value));
      }
    });

    const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${endpoint}?${queryString.toString()}`;
    
    console.log('🔍 Fetching from microCMS:', url);

    const response = await fetch(url, {
      headers: {
        'X-MICROCMS-API-KEY': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📥 microCMS APIレスポンス:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error fetching from microCMS:', error);
    return null;
  }
}

// カテゴリごとの作品を取得
export async function getWorksByCategory(
  category: string,
  limit: number = 3,
) {
  // APIが未設定の場合は空配列を返す
  if (!isConfigured) {
    console.log('Client not configured');
    return [];
  }

  try {
    console.log(`🔍 Fetching works for category: ${category}`);
    
    // フィルターをかけて取得
    const response = await fetchFromMicroCMS('works', {
      filters: `category[contains]${category}`,
      limit: limit,
      orders: 'displayOrder', // 表示順序の昇順（数字が小さい順）
    });

    if (!response) {
      return [];
    }

    console.log(`✅ Response for "${category}" (found: ${response.totalCount}):`, response);
    
    // 最初の作品のフィールド一覧を確認
    if (response.contents.length > 0) {
      const firstWork = response.contents[0];
      console.log('📋 最初の作品のフィールド一覧:', Object.keys(firstWork));
      console.log('📋 最初の作品の全データ:', firstWork);
    }
    
    // aspectRatioが配列の場合は最初の要素を取得（microCMSの設定ミス対策）
    // tagsフィールドのデバッグログも追加
    const works = response.contents.map(work => {
      // タグフィールドの可能性のある名前を確認
      const possibleTagFields = ['tags', 'tag', 'tagList', 'labels', 'categories'];
      const tagFieldName = possibleTagFields.find(field => (work as any)[field] !== undefined);
      
      if (tagFieldName && tagFieldName !== 'tags') {
        console.log(`⚠️ Work: ${work.title}, "tags"フィールドが見つかりません。"${tagFieldName}"を使用します。`);
      }
      
      const rawTags = tagFieldName ? (work as any)[tagFieldName] : work.tags;
      
      // タグのデバッグログ
      console.log(`🏷️ Work: ${work.title}, tags (raw):`, rawTags, 'type:', typeof rawTags, 'isArray:', Array.isArray(rawTags));
      
      // tagsの処理: 文字列の場合はカンマ区切りで分割、配列の場合はそのまま、それ以外は空配列
      let processedTags: string[] = [];
      if (typeof rawTags === 'string') {
        // 文字列の場合はカンマで分割して空白を削除
        processedTags = rawTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        console.log(`🏷️ Work: ${work.title}, tags (parsed from string):`, processedTags);
      } else if (Array.isArray(rawTags)) {
        // 配列の場合はそのまま使用（文字列のみフィルタ）
        processedTags = rawTags.filter(tag => typeof tag === 'string' && tag.trim().length > 0);
        console.log(`🏷️ Work: ${work.title}, tags (array):`, processedTags);
      } else if (rawTags === undefined || rawTags === null) {
        console.log(`🏷️ Work: ${work.title}, tags (undefined/null)`);
      } else {
        console.warn(`⚠️ Work: ${work.title}, 予期しないtagsの型:`, typeof rawTags, rawTags);
      }
      
      // aspectRatioの処理
      if (Array.isArray(work.aspectRatio)) {
        console.log(`⚠️ Work: ${work.title}, aspectRatio is Array:`, work.aspectRatio);
        return {
          ...work,
          aspectRatio: work.aspectRatio[0] || 'portrait', // 配列の最初の要素を使用、空なら'portrait'
          tags: processedTags,
        } as Work;
      }
      
      return {
        ...work,
        tags: processedTags,
      };
    });
    
    console.log(`📦 Processed works with tags:`, works.map(w => ({ title: w.title, tags: w.tags })));
    
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
  if (!isConfigured) {
    return [];
  }

  try {
    const response = await fetchFromMicroCMS('works', {
      filters: `category[contains]${category}`,
      orders: 'displayOrder', // 表示順序の昇順（数字が小さい順）
    });

    if (!response) {
      return [];
    }
    
    // 最初の作品のフィールド一覧を確認
    if (response.contents.length > 0) {
      const firstWork = response.contents[0];
      console.log('📋 [getAllWorksByCategory] 最初の作品のフィールド一覧:', Object.keys(firstWork));
      console.log('📋 [getAllWorksByCategory] 最初の作品の全データ:', firstWork);
    }
    
    // aspectRatioが配列の場合は最初の要素を取得（microCMSの設定ミス対策）
    // tagsフィールドのデバッグログも追加
    const works = response.contents.map(work => {
      // タグフィールドの可能性のある名前を確認
      const possibleTagFields = ['tags', 'tag', 'tagList', 'labels', 'categories'];
      const tagFieldName = possibleTagFields.find(field => (work as any)[field] !== undefined);
      
      if (tagFieldName && tagFieldName !== 'tags') {
        console.log(`⚠️ Work: ${work.title}, "tags"フィールドが見つかりません。"${tagFieldName}"を使用します。`);
      }
      
      const rawTags = tagFieldName ? (work as any)[tagFieldName] : work.tags;
      
      // タグのデバッグログ
      console.log(`🏷️ Work: ${work.title}, tags (raw):`, rawTags, 'type:', typeof rawTags, 'isArray:', Array.isArray(rawTags));
      
      // tagsの処理: 文字列の場合はカンマ区切りで分割、配列の場合はそのまま、それ以外は空配列
      let processedTags: string[] = [];
      if (typeof rawTags === 'string') {
        // 文字列の場合はカンマで分割して空白を削除
        processedTags = rawTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        console.log(`🏷️ Work: ${work.title}, tags (parsed from string):`, processedTags);
      } else if (Array.isArray(rawTags)) {
        // 配列の場合はそのまま使用（文字列のみフィルタ）
        processedTags = rawTags.filter(tag => typeof tag === 'string' && tag.trim().length > 0);
        console.log(`🏷️ Work: ${work.title}, tags (array):`, processedTags);
      } else if (rawTags === undefined || rawTags === null) {
        console.log(`🏷️ Work: ${work.title}, tags (undefined/null)`);
      } else {
        console.warn(`⚠️ Work: ${work.title}, 予期しないtagsの型:`, typeof rawTags, rawTags);
      }
      
      // aspectRatioの処理
      if (Array.isArray(work.aspectRatio)) {
        console.log(`⚠️ Work: ${work.title}, aspectRatio is Array:`, work.aspectRatio);
        return {
          ...work,
          aspectRatio: work.aspectRatio[0] || 'portrait', // 配列の最初の要素を使用、空なら'portrait'
          tags: processedTags,
        } as Work;
      }
      
      return {
        ...work,
        tags: processedTags,
      };
    });
    
    console.log(`📦 Processed works with tags:`, works.map(w => ({ title: w.title, tags: w.tags })));
    
    return works;
  } catch (error) {
    // API設定エラーの場合は静かに空配列を返す（モックデータを使用）
    return [];
  }
}