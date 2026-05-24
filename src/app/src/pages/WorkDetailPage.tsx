import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react@0.468.0';

interface Work {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  tags?: string[];
  externalLink?: string;
  category: string;
}

export function WorkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [work, setWork] = useState<Work | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ページトップへスクロール
    window.scrollTo(0, 0);

    // Google Analytics - ページビュー
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_view', {
        page_title: `Work Detail - ${id}`,
        page_location: window.location.href,
        page_path: window.location.pathname + window.location.hash,
      });
    }

    // 作品データを取得（現在はlocalStorageから、後でmicroCMSから取得可能）
    const workData = localStorage.getItem(`work_${id}`);
    if (workData) {
      setWork(JSON.parse(workData));
    }
    setIsLoading(false);
  }, [id]);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? (work?.imageUrls.length || 1) - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === (work?.imageUrls.length || 1) - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4">作品が見つかりません</h1>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border-2 border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-all"
            >
              ホームに戻る
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isMultipleImages = work.imageUrls && work.imageUrls.length > 1;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* 戻るボタン */}
          <button
            onClick={() => navigate(-1)}
            className="mb-8 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>戻る</span>
          </button>

          {/* 作品情報 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* 画像エリア */}
            <div className="relative bg-gray-100">
              {work.imageUrls && work.imageUrls.length > 0 ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <ImageWithFallback
                    src={work.imageUrls[currentImageIndex]}
                    alt={`${work.title} - ${currentImageIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  
                  {/* 複数画像の場合のみナビゲーションを表示 */}
                  {isMultipleImages && (
                    <>
                      <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-3 shadow-xl transition-all"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 text-black" />
                      </button>
                      
                      <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-3 shadow-xl transition-all"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 text-black" />
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-5 py-2 rounded-full">
                        {currentImageIndex + 1} / {work.imageUrls.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 flex items-center justify-center text-gray-400">
                  画像がありません
                </div>
              )}
            </div>

            {/* テキスト情報 */}
            <div className="p-8 md:p-12">
              <h1 className="mb-4">{work.title}</h1>
              <p className="text-gray-600 mb-6 whitespace-pre-wrap">{work.description}</p>
              
              {/* タグ */}
              {work.tags && work.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {work.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* 外部リンク */}
              {work.externalLink && (
                <a
                  href={work.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all"
                  onClick={() => {
                    if (typeof window.gtag !== 'undefined') {
                      window.gtag('event', 'click', {
                        event_category: 'external_link',
                        event_label: work.title,
                        value: work.externalLink
                      });
                    }
                  }}
                >
                  <span>サイトを見る</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}