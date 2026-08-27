import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { WorkCard } from '../components/WorkCard';
import { getWorksByCategory, type Work as MicroCMSWork } from '../lib/microcms';
import { ArrowLeft, Instagram } from 'lucide-react@0.468.0';
import { ScrollToTop } from '../components/ScrollToTop';

interface Work {
  title: string;
  description: string;
  imageUrl: string;
  imageUrls?: string[]; // 複数画像のオプション
  tags?: string[]; // タグ
  externalLink?: string; // 外部リンク
  aspectRatio?: 'square' | 'portrait' | 'photo' | 'auto'; // ライトボックスのアスペクト比
}

// モックデータ（microCMSから取得できない場合のフォールバック）
const mockWorks: Record<string, Work[]> = {
  textile: [
    {
      title: 'Organic Form',
      description: '自然をモチーフにした柔らかなパターン',
      imageUrl: 'https://images.microcms-assets.io/assets/16bf99f801844d31828495789dff913f/ee04d7dc26dc4b50be873577aec16e00/colourblock_watercolour_leaves.jpg',
      imageUrls: [
        'https://images.microcms-assets.io/assets/16bf99f801844d31828495789dff913f/ee04d7dc26dc4b50be873577aec16e00/colourblock_watercolour_leaves.jpg',
        'https://images.unsplash.com/photo-1701964619775-b18422290cf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwcGF0dGVybiUyMGRlc2lnbnxlbnwxfHx8fDE3NjE0NzA3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1709390890630-2d66bda05bb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWJyaWMlMjB0ZXh0dXJlJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NjE0NzA3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
      tags: ['nature', 'printing']
    },
    {
      title: 'Geometric Pattern',
      description: '幾何学模様を用いたテキスタイルデザイン',
      imageUrl: 'https://images.microcms-assets.io/assets/16bf99f801844d31828495789dff913f/4f75d6d014aa463c874bd5d4fe9d1593/20180206_113651.jpg',
      tags: ['geometric', 'weaving']
    },
    {
      title: 'Textured Pattern',
      description: 'テクスチャーを生かしたデザイン',
      imageUrl: 'https://images.microcms-assets.io/assets/16bf99f801844d31828495789dff913f/fc93b8ea19f14b3690b0e419073128ff/16_2p.jpg',
      tags: ['nature', 'weaving']
    }
  ],
  web: [
    {
      title: 'LINEリッチメッセージ',
      description: '週末企画・LINEリッチメッセージ',
      imageUrl: 'https://images.unsplash.com/photo-1567359871315-56db4f5c9e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMSU5FJTIwYXBwJTIwcmljaCUyMG1lc3NhZ2V8ZW58MXx8fHwxNzYxNDYzODI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageUrls: [
        'https://images.unsplash.com/photo-1567359871315-56db4f5c9e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMSU5FJTIwYXBwJTIwcmljaCUyMG1lc3NhZ2V8ZW58MXx8fHwxNzYxNDYzODI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1730794545099-14902983739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBtb2NrdXB8ZW58MXx8fHwxNzYxMzc5ODg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzYxNDU3NzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
      tags: ['line', 'banner']
    },
    {
      title: 'LINEリッチメッセージ',
      description: '週末企画・LINEリッチメッセージ',
      imageUrl: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2UlMjBkZXNpZ258ZW58MXx8fHwxNzYxNDU4MTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['line', 'lp']
    },
    {
      title: 'LINEリッチメッセージ',
      description: '週末企画・LINEリッチメッセージ',
      imageUrl: 'https://images.unsplash.com/photo-1706894267114-f82f15e69c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwc2NyZWVuJTIwVUl8ZW58MXx8fHwxNzYxNDYzODI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['banner']
    }
  ],
  photo: [
    {
      title: 'Into the forest',
      description: '森の中を散策中に',
      imageUrl: 'https://images.unsplash.com/photo-1723470317938-6ec6fb0d4075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBwYXRoJTIwbmF0dXJlfGVufDF8fHx8MTc2MTQ2MzgyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['nature', 'blackandwhite']
    },
    {
      title: 'Go to Mountain',
      description: 'トレッキング時の撮影',
      imageUrl: 'https://images.unsplash.com/photo-1667021901319-ff71b9036cd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGlraW5nfGVufDF8fHx8MTc2MTQ2MzgyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['nature']
    },
    {
      title: 'Break Time',
      description: 'テーブフォト',
      imageUrl: 'https://images.unsplash.com/photo-1708430651927-20e2e1f1e8f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZSUyMHBob3RvZ3JhcGh5JTIwY29mZmVlfGVufDF8fHx8MTc2MTQ2MzgyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['tablephoto']
    }
  ]
};

const categoryTitles: Record<string, string> = {
  textile: 'Textile',
  web: 'Web',
  photo: 'Photo & Movie'
};

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchWorks() {
      if (!slug) return;

      try {
        setIsLoading(true);
        
        // microCMSから全件取得（limitを指定しない）
        const microCMSWorks = await getWorksByCategory(slug, 100);
        
        console.log('🔍 microCMSから取得したデータ:', microCMSWorks);
        console.log('🔍 データ数:', microCMSWorks.length);
        console.log('🔍 各作品のtagsフィールド:', microCMSWorks.map(w => ({ 
          title: w.title, 
          tags: w.tags, 
          tagsType: typeof w.tags,
          tagsIsArray: Array.isArray(w.tags)
        })));
        
        if (microCMSWorks.length > 0) {
          // カテゴリごとのデフォルトアスペクト比
          const defaultAspectRatio = 
            slug === 'web' ? 'portrait' : 
            slug === 'photo' ? 'photo' : 
            'square';
          
          const mappedWorks = microCMSWorks.map(w => {
            console.log(`🔍 Work: ${w.title}, aspectRatio from API:`, w.aspectRatio);
            return {
              title: w.title,
              description: w.description,
              imageUrl: w.image[0]?.url || '',
              imageUrls: w.image.map(img => img.url),
              tags: w.tags,
              externalLink: w.externalLink,
              aspectRatio: w.aspectRatio || defaultAspectRatio
            };
          });
          console.log('📦 変換後のデータ:', mappedWorks);
          setWorks(mappedWorks);
          
          // 作品データから利用可能なタグを抽出
          console.log('🏷️ タグ抽出開始...');
          const tags = new Set<string>();
          mappedWorks.forEach((work, index) => {
            console.log(`🏷️ [${index}] ${work.title} - tags:`, work.tags, 'type:', typeof work.tags);
            if (work.tags && Array.isArray(work.tags)) {
              work.tags.forEach(tag => {
                if (tag && typeof tag === 'string') {
                  const trimmedTag = tag.trim();
                  if (trimmedTag.length > 0) {
                    tags.add(trimmedTag);
                    console.log(`🏷️   ✓ タグ追加: "${trimmedTag}"`);
                  }
                }
              });
            } else {
              console.log(`🏷️   ✗ タグがない、または配列ではない`);
            }
          });
          const sortedTags = Array.from(tags).sort();
          console.log('🏷️ 抽出されたタグ一覧:', sortedTags);
          console.log('🏷️ タグ数:', sortedTags.length);
          
          if (sortedTags.length === 0 && microCMSWorks.length > 0) {
            console.log('💡 タグが見つかりません。診断ページ (#/diagnostic) で詳細を確認できます');
          }
          
          setAvailableTags(sortedTags);
        } else {
          // microCMSからデータが取得できない場合はモックデータを使用
          const fallbackWorks = mockWorks[slug] || [];
          setWorks(fallbackWorks);
          
          // モックデータからもタグを抽出
          const tags = new Set<string>();
          fallbackWorks.forEach(work => {
            if (work.tags && Array.isArray(work.tags)) {
              work.tags.forEach(tag => {
                if (tag && typeof tag === 'string') {
                  tags.add(tag.trim()); // 空白を削除
                }
              });
            }
          });
          const sortedTags = Array.from(tags).sort();
          console.log('🏷️ モックデータから抽出されたタグ:', sortedTags);
          setAvailableTags(sortedTags);
        }
      } catch (error) {
        console.error('Error fetching works:', error);
        // エラーの場合もモックデータを使用
        const fallbackWorks = mockWorks[slug] || [];
        setWorks(fallbackWorks);
        
        // モックデータからもタグを抽出
        const tags = new Set<string>();
        fallbackWorks.forEach(work => {
          if (work.tags && Array.isArray(work.tags)) {
            work.tags.forEach(tag => {
              if (tag && typeof tag === 'string') {
                tags.add(tag.trim()); // 空白を削除
              }
            });
          }
        });
        const sortedTags = Array.from(tags).sort();
        console.log('🏷️ エラー時のモックデータから抽出されたタグ:', sortedTags);
        setAvailableTags(sortedTags);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorks();
  }, [slug]);

  // タグのトグル処理
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // タグフィルタリング（AND条件）
  const filteredWorks = selectedTags.length === 0 
    ? works 
    : works.filter(work => {
        console.log('🏷️ フィルタリング中:', { 
          workTitle: work.title, 
          workTags: work.tags, 
          selectedTags,
          hasAllTags: work.tags && selectedTags.every(tag => work.tags!.includes(tag))
        });
        return work.tags && selectedTags.every(tag => work.tags!.includes(tag));
      });
  
  console.log('✅ フィルタリング後の作品数:', filteredWorks.length);

  if (!slug || !categoryTitles[slug]) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">カテゴリが見つかりません</h2>
          <Link to="/" className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            トップページへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ScrollToTop />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* 戻るリンク */}
          <Link 
            to="/#categories" 
            className="inline-flex items-center gap-2 mb-8 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>

          {/* カテゴリタイトル */}
          <h1 className="mb-8 text-center">{categoryTitles[slug]}</h1>

          {/* タグフィルター - 一時的に非表示 */}
          {/* {availableTags.length > 0 && (
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-3">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`
                      px-5 py-2 rounded-full border-2 transition-all duration-300
                      ${selectedTags.includes(tag)
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-gray-800'
                      }
                    `}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    {filteredWorks.length}件の作品が見つかりました
                  </p>
                </div>
              )}
            </div>
          )} */}

          {/* 作品一覧 */}
          {isLoading ? (
            <div className="text-center py-12">
              <p>Loading...</p>
            </div>
          ) : filteredWorks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWorks.map((work, index) => (
                <WorkCard
                  key={index}
                  title={work.title}
                  description={work.title.toLowerCase().includes('fortune cookie') ? '中に運勢やメッセージが書かれた紙片（おみくじ）が入った、甘い薄焼きクッキー、「フォーチュンクッキー」をイメージしてアプリを作成' : work.description}
                  imageUrl={work.imageUrl}
                  imageUrls={work.imageUrls}
                  aspectRatio={work.aspectRatio}
                  externalLink={work.externalLink}
                  cardAspectRatio={work.title.toLowerCase().includes('fortune cookie') || work.title.toLowerCase().includes('weather') || work.title.toLowerCase().includes('e-commerce') || work.title.toLowerCase().includes('anglers') ? 'wide' : 'square'}
                  modalText={work.title.toLowerCase().includes('anglers') ? (
                    <>
                      <p><span className="font-bold text-gray-800">制作の意図：</span><br /><span className="font-normal text-gray-500">手軽に川の名称を入れるだけで天気が分かるアプリを作りたかったこと、API連携の仕組みを理解することが目的です。私自身が渓流釣りをするため、川ごとの天気やライブカメラ、気象警報が手元で分かるアプリを作りたいと考え、制作しました。</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">工夫した点・技術的な取り組み：</span><br /><span className="font-normal text-gray-500">SupabaseのMagic Link認証とお気に入り機能を実装し、ユーザーが普段通う河川を保存して次回すぐ確認できるようにしました。外部APIの呼び出しはSupabase Edge Functions側にまとめ、APIキーをクライアントに露出させない構成にしています。RLSポリシーにより、お気に入りデータが他ユーザーから参照されないようにしました。</span></p>
                      <p className="mt-2"><span className="font-normal text-gray-500">安全性への配慮として、気象庁の防災情報フィードから各地域のリアルタイムな気象警報を取得し、川の一覧・詳細に表示する機能を実装しました。実装にあたり、気象庁の一部データ配信が更新停止していることを実データの検証から発見し、リアルタイム性が担保された正しい配信経路（防災情報XML）に切り替えました。警報データが取得できない場合は「警報なし」と誤表示せず「不明」として扱い、公式サイトでの確認を促す設計にすることで、利用者を誤解させないことを重視しました。</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">使用技術：</span><br /><span className="font-normal text-gray-500">React 18 / TypeScript / Vite / Tailwind CSS v4 / Supabase（PostgreSQL・認証・Edge Functions）/ Python（河川座標データの整形）</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">使用したAPI・データ：</span><br /><span className="font-normal text-gray-500">・気象庁 防災情報XML（気象警報・注意報）<br />・国土地理院 地名検索API（河川座標の取得）<br />・Open-Meteo（気象データ・Geocoding）/ OpenWeather<br />・国土交通省 川の防災情報（水位・ライブカメラの公式情報へ誘導）</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">サイト：</span><br /><a href="https://weather-for-anglers.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-normal text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors">https://weather-for-anglers.netlify.app/</a></p>
                    </>
                  ) : work.title.toLowerCase().includes('fortune cookie') ? (
                    <>
                      <p><span className="font-bold text-gray-800">制作の意図：</span><br /><span className="font-normal text-gray-500">占いやメッセージが記載されたフォーチュンクッキーをアプリにて制作。手軽に手元のスマフォ・デスクトップで今日の占い・運を楽しむことを目的に設計。</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">検証：</span><br /><span className="font-normal text-gray-500">様々な占いアプリを検証。実際に試した中で、よりシンプルで簡素な操作性のあるUIが適切と判断。</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">工夫した点：</span><br /><span className="font-normal text-gray-500">クッキーをクリックすると割れてメッセージが現れる演出を実装し、「引く」という体験そのものを楽しめるUIにしました。抽選部分はランダム選出のロジックを自作し、メッセージデータは型定義を付けて管理することで、文言の追加・修正時に構造の崩れが起きないようにしています。外部APIに依存しない構成のため、通信状態にかかわらず即座に結果が表示される点も意図した設計です。</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">使用したAPI：</span><br /><span className="font-normal text-gray-500">特になし。名言や諺などを自身で調べ、一つずつ選定して設置。</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">使用技術：</span><br /><span className="font-normal text-gray-500">React / TypeScript / HTML / CSS</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">サイト：</span><br /><a href="https://fortune-cookie.figma.site/" target="_blank" rel="noopener noreferrer" className="font-normal text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors">https://fortune-cookie.figma.site/</a></p>
                    </>
                  ) : work.title.toLowerCase().includes('weather') ? (
                    <>
                      <p><span className="font-bold text-gray-800">制作の意図：</span><br /><span className="font-normal text-gray-500">手軽に都市名を入れる事で天気が分かるアプリを作成したかったこと、APIの機能を理解することが目的。</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">検証：</span><br /><span className="font-normal text-gray-500">WeatherAPIでは日本国内の天気情報が限定的だった為、Open-MeteoのGeocoding APIに切り替える対策を行なった。</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">工夫した点：</span><br /><span className="font-normal text-gray-500">都市名の入力欄にインクリメンタルサーチを実装し、入力中の文字列に応じて候補地名をドロップダウンで複数表示するようにしました。同名・類似名の地名が国内外に複数存在するため、候補には地域情報を併せて表示し、ユーザーが目的の地点を取り違えずに選択できる設計にしています。さらにOpen-Meteoと国土地理院の2つのジオコーディングを併用することで、海外の都市名と日本国内の細かい地名の双方に対応させました。</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">使用したAPI：</span><br /><span className="font-normal text-gray-500">・Open-MeteoのGeocoding API<br />・国土地理院のジオコーディングAPI</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">使用技術：</span><br /><span className="font-normal text-gray-500">React / JavaScript / HTML / CSS</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">サイト：</span><br /><a href="https://clever-pasteur-3ecdcf.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-normal text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors">https://clever-pasteur-3ecdcf.netlify.app/</a></p>
                    </>
                  ) : work.title.toLowerCase().includes('e-commerce') ? (
                    <>
                      <p><span className="font-bold text-gray-800">制作の意図：</span><br /><span className="font-normal text-gray-500">アパレル・ライフスタイルブランド「めるげん//賢志」様からのご依頼で、ShopifyによるECサイトを実装しました。衣類とライフプロダクトの2カテゴリに加え、ブランドの世界観を伝える読み物コンテンツ（Journal）を持つ構成で、多言語・多通貨での販売にも対応しています。既存テーマの標準レイアウトでは表現しきれないブランド表現の部分を、Liquidのカスタマイズで実現することを目的としました。</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">検証：</span><br /><span className="font-normal text-gray-500">同ジャンルのアパレルECを複数調査し、商品一覧・商品詳細・読み物コンテンツへの導線を比較。依頼主の要望と既存テーマの標準機能との差分を洗い出し、テーマの標準機能で満たせる範囲（商品管理、絞り込み、決済、多通貨対応）と、独自実装が必要な範囲（トップページとJournalのビジュアル構成）を切り分けた上で着手しました。</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">苦労した点：</span><br /><span className="font-normal text-gray-500">トップページとJournalの記事内で、画像・動画が規則的なグリッドに収まらない配置を求められた点です。段組みが記事ごとに変わり、動画と画像が混在するため、既存テーマのセクションをそのまま使うことができませんでした。さらにPCとスマートフォンで意図した見え方を保つ必要があり、ブレイクポイントごとに要素の並び順とアスペクト比を制御するレスポンシブ調整に最も時間を要しました。</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">工夫した点：</span><br /><span className="font-normal text-gray-500">不規則な配置をその場限りのハードコーディングで終わらせず、Liquidのセクション／ブロックschemaを設計し、管理画面から画像・動画の差し替えや並び替えができる形で実装しました。レイアウトはCSS Gridで組み、SP表示では並び順を再定義することで、どの構成でも崩れない実装にしました。</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">使用技術：</span><br /><span className="font-normal text-gray-500">Shopify / Liquid / HTML / CSS（Grid・Flexbox）/ JavaScript</span></p>
                      <p className="mt-3"><span className="font-bold text-gray-800">サイト：</span><br /><a href="https://www.mergenkenji.com/" target="_blank" rel="noopener noreferrer" className="font-normal text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors">https://www.mergenkenji.com/</a></p>
                    </>
                  ) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {selectedTags.length > 0 
                  ? '選択したタグに一致する作品が見つかりませんでした' 
                  : '作品が見つかりませんでした'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 text-gray-600">
          <a
            href="https://www.instagram.com/akinkzw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={22} />
          </a>
          <p className="text-sm">© 2026 Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}