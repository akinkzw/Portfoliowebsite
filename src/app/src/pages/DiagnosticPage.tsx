import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Link } from 'react-router';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react@0.468.0';

interface DiagnosticResult {
  category: string;
  totalWorks: number;
  worksWithTags: number;
  worksWithoutTags: number;
  allTags: string[];
  sampleWork?: any;
  fieldList?: string[];
}

export function DiagnosticPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function runDiagnostics() {
      setIsLoading(true);
      const categories = ['textile', 'web', 'photo'];
      const diagnosticResults: DiagnosticResult[] = [];

      for (const category of categories) {
        try {
          const SERVICE_DOMAIN = "xorqasmzf7";
          const API_KEY = "nVtMhU5LZYMqQGB6crHG8WAjMVsghfMAQ49a";
          
          const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/works?filters=category[contains]${category}&limit=100`;
          
          const response = await fetch(url, {
            headers: {
              'X-MICROCMS-API-KEY': API_KEY,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const works = data.contents || [];

          // タグフィールドの検出
          const firstWork = works[0];
          const fieldList = firstWork ? Object.keys(firstWork) : [];
          
          // タグの抽出
          const allTags = new Set<string>();
          let worksWithTags = 0;
          let worksWithoutTags = 0;

          works.forEach((work: any) => {
            const rawTags = work.tags || work.tag || work.tagList || work.labels;
            
            if (rawTags) {
              worksWithTags++;
              
              if (typeof rawTags === 'string') {
                rawTags.split(',').forEach((tag: string) => {
                  const trimmed = tag.trim();
                  if (trimmed) allTags.add(trimmed);
                });
              } else if (Array.isArray(rawTags)) {
                rawTags.forEach((tag: any) => {
                  if (typeof tag === 'string' && tag.trim()) {
                    allTags.add(tag.trim());
                  }
                });
              }
            } else {
              worksWithoutTags++;
            }
          });

          diagnosticResults.push({
            category,
            totalWorks: works.length,
            worksWithTags,
            worksWithoutTags,
            allTags: Array.from(allTags).sort(),
            sampleWork: firstWork,
            fieldList
          });
        } catch (error) {
          console.error(`Error diagnosing ${category}:`, error);
          diagnosticResults.push({
            category,
            totalWorks: 0,
            worksWithTags: 0,
            worksWithoutTags: 0,
            allTags: [],
          });
        }
      }

      setResults(diagnosticResults);
      setIsLoading(false);
    }

    runDiagnostics();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 mb-8 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            トップページへ戻る
          </Link>

          <h1 className="mb-8">microCMS タグ診断</h1>

          {isLoading ? (
            <div className="text-center py-12">
              <p>診断中...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {results.map((result) => (
                <div key={result.category} className="border border-gray-200 rounded-lg p-6">
                  <h2 className="mb-4 capitalize">{result.category}</h2>
                  
                  <div className="space-y-4">
                    {/* 基本情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded">
                        <p className="text-sm text-gray-600 mb-1">総作品数</p>
                        <p className="text-2xl">{result.totalWorks}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded">
                        <p className="text-sm text-gray-600 mb-1">タグ有り</p>
                        <p className="text-2xl text-green-600">{result.worksWithTags}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded">
                        <p className="text-sm text-gray-600 mb-1">タグ無し</p>
                        <p className="text-2xl text-red-600">{result.worksWithoutTags}</p>
                      </div>
                    </div>

                    {/* タグリスト */}
                    <div>
                      <p className="mb-2">
                        {result.allTags.length > 0 ? (
                          <span className="inline-flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            検出されたタグ ({result.allTags.length}個)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-red-600">
                            <XCircle className="w-5 h-5" />
                            タグが検出されませんでした
                          </span>
                        )}
                      </p>
                      
                      {result.allTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {result.allTags.map((tag) => (
                            <span 
                              key={tag}
                              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* フィールド一覧 */}
                    {result.fieldList && (
                      <div>
                        <p className="mb-2 inline-flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          利用可能なフィールド
                        </p>
                        <div className="bg-gray-50 p-4 rounded overflow-x-auto">
                          <code className="text-sm">
                            {result.fieldList.join(', ')}
                          </code>
                        </div>
                        {!result.fieldList.includes('tags') && (
                          <p className="mt-2 text-sm text-amber-600">
                            ⚠️ "tags" フィールドが見つかりません。microCMSでフィールドIDを確認してください。
                          </p>
                        )}
                      </div>
                    )}

                    {/* サンプルデータ */}
                    {result.sampleWork && (
                      <details className="border border-gray-200 rounded">
                        <summary className="p-4 cursor-pointer hover:bg-gray-50">
                          サンプルデータを表示
                        </summary>
                        <div className="p-4 bg-gray-50 overflow-x-auto">
                          <pre className="text-xs">
                            {JSON.stringify(result.sampleWork, null, 2)}
                          </pre>
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              ))}

              {/* 推奨事項 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="mb-4">🔧 タグ機能を有効にする方法</h3>
                
                <div className="mb-6">
                  <p className="mb-4 text-sm">
                    microCMSでタグフィールドを設定するには、以下の手順に従ってください：
                  </p>
                  
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-2">
                      <span className="shrink-0 text-blue-600">1.</span>
                      <div>
                        <p className="mb-1">microCMSの管理画面にログイン</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 text-blue-600">2.</span>
                      <div>
                        <p className="mb-1">「API設定」→「works」→「APIスキーマを編集」を開く</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 text-blue-600">3.</span>
                      <div>
                        <p className="mb-1">新しいフィールドを追加：</p>
                        <ul className="ml-4 mt-1 space-y-1 list-disc text-gray-700">
                          <li>フィールドID: <code className="bg-white px-1 py-0.5 rounded">tags</code></li>
                          <li>フィールド名: タグ（任意の名前でOK）</li>
                          <li>種類: セレクトフィールド</li>
                          <li><strong>複数選択: ONにする（重要）</strong></li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 text-blue-600">4.</span>
                      <div>
                        <p className="mb-1">選択肢を追加（例: nature, geometric, weaving, printing, blackandwhite, etc.）</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 text-blue-600">5.</span>
                      <div>
                        <p className="mb-1">各作品コンテンツを編集して、適切なタグを選択</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 text-blue-600">6.</span>
                      <div>
                        <p className="mb-1">このページを再読み込みして、タグが正しく検出されることを確認</p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded p-4">
                  <p className="text-sm">
                    <strong>💡 ヒント:</strong> 上記の「利用可能なフィールド」に "tags" が表示されていない場合は、フィールドがまだ作成されていません。フィールドを作成後、必ず各コンテンツにタグを設定してください。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}