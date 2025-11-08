import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { WorkCard } from '../components/WorkCard';
import { getWorksByCategory, type Work as MicroCMSWork } from '../lib/microcms';
import { ArrowLeft } from 'lucide-react';
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
      description: 'テーブルフォト',
      imageUrl: 'https://images.unsplash.com/photo-1708430651927-20e2e1f1e8f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZSUyMHBob3RvZ3JhcGh5JTIwY29mZmVlfGVufDF8fHx8MTc2MTQ2MzgyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['tablephoto']
    }
  ]
};

const categoryTitles: Record<string, string> = {
  textile: 'Textile',
  web: 'Web',
  photo: 'Photo'
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
          const tags = new Set<string>();
          mappedWorks.forEach(work => {
            if (work.tags) {
              work.tags.forEach(tag => tags.add(tag));
            }
          });
          const sortedTags = Array.from(tags).sort();
          console.log('🏷️ 抽出されたタグ:', sortedTags);
          setAvailableTags(sortedTags);
        } else {
          // microCMSからデータが取得できない場合はモックデータを使用
          const fallbackWorks = mockWorks[slug] || [];
          setWorks(fallbackWorks);
          
          // モックデータからもタグを抽出
          const tags = new Set<string>();
          fallbackWorks.forEach(work => {
            if (work.tags) {
              work.tags.forEach(tag => tags.add(tag));
            }
          });
          setAvailableTags(Array.from(tags).sort());
        }
      } catch (error) {
        console.error('Error fetching works:', error);
        // エラーの場合もモックデータを使用
        const fallbackWorks = mockWorks[slug] || [];
        setWorks(fallbackWorks);
        
        // モックデータからもタグを抽出
        const tags = new Set<string>();
        fallbackWorks.forEach(work => {
          if (work.tags) {
            work.tags.forEach(tag => tags.add(tag));
          }
        });
        setAvailableTags(Array.from(tags).sort());
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

  // タグフィルタリ���グ（AND条件）
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

          {/* タグフィルター */}
          {availableTags.length > 0 && (
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
          )}

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
                  description={work.description}
                  imageUrl={work.imageUrl}
                  imageUrls={work.imageUrls}
                  aspectRatio={work.aspectRatio}
                  externalLink={work.externalLink}
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
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>© 2025 Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
