import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react@0.468.0';

interface WorkCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageUrls?: string[]; // 複数画像のオプション
  aspectRatio?: 'square' | 'portrait' | 'photo' | 'auto'; // アスペクト比（デフォルトは正方形）
  externalLink?: string; // 外部リンク（オプション）
  detailLink?: string; // 詳細ページへのリンク（オプション）
  cardAspectRatio?: 'square' | 'wide'; // カード表示時のアスペクト比
  workId?: string; // 作品ID（詳細ページ用）
  tags?: string[]; // タグ
  category?: string; // カテゴリ
  accordionText?: React.ReactNode; // アコーディオンに表示するテキスト（オプション）
  modalText?: React.ReactNode; // モーダルに表示するテキスト（オプション）
  titleClassName?: string; // タイトルに適用する追加クラス（オプション）
}

export function WorkCard({ 
  title, 
  description, 
  imageUrl, 
  imageUrls, 
  aspectRatio = 'square', 
  externalLink,
  detailLink,
  cardAspectRatio = 'square',
  workId,
  tags,
  category,
  accordionText,
  modalText,
  titleClassName
}: WorkCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 複数画像がある場合はそれを使用、なければ単一画像を配列に
  const images = imageUrls && imageUrls.length > 0 ? imageUrls : [imageUrl];
  const isMultipleImages = images.length > 1;
  
  // 🔍 デバッグ: WorkCardに渡された画像URLを確認
  console.log(`🎴 WorkCard for "${title}":`, {
    imageUrl,
    imageUrls,
    images,
    firstImage: images[0]
  });
  
  // カードの高さを決定
  const cardPaddingBottom = cardAspectRatio === 'wide' ? '56.25%' : '100%'; // 16:9 or 1:1
  
  // 画像切り替え関数
  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  // ライトボックスを開く
  const openLightbox = () => {
    setIsOpen(true);
    setCurrentImageIndex(0);
  };
  
  // ラトボックスを閉じる
  const closeLightbox = () => {
    setIsOpen(false);
    setCurrentImageIndex(0);
  };
  
  // Escキーで閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
        setIsModalOpen(false);
      }
    };
    
    if (isOpen || isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, isModalOpen]);

  return (
    <>
      <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {detailLink ? (
          // 詳細ページへのリンクがある場合
          <Link 
            to={detailLink}
            className="block relative w-full bg-gray-100 cursor-pointer overflow-hidden"
            style={{ paddingBottom: cardPaddingBottom }}
            onClick={() => {
              // 詳細ページ遷移時にlocalStorageに作品データを保存
              if (workId) {
                const workData = {
                  id: workId,
                  title,
                  description,
                  imageUrls: images,
                  tags,
                  externalLink,
                  category
                };
                localStorage.setItem(`work_${workId}`, JSON.stringify(workData));
              }
            }}
          >
            <ImageWithFallback
              src={images[0]}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {isMultipleImages && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                +{images.length}
              </div>
            )}
          </Link>
        ) : externalLink ? (
          // 外部リンクがある場合は<a>タグで新しいタブで開く
          <a 
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full bg-gray-100 cursor-pointer overflow-hidden"
            style={{ paddingBottom: cardPaddingBottom }}
            onClick={() => {
              // Google Analyticsでクリックイベントを記録
              if (typeof window.gtag !== 'undefined') {
                window.gtag('event', 'click', {
                  event_category: 'external_link',
                  event_label: title,
                  value: externalLink
                });
              }
            }}
          >
            <ImageWithFallback
              src={images[0]}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        ) : (
          // 外部リンクがない場合はライトボックスを開く
          <div 
            className="relative w-full bg-gray-100 cursor-pointer overflow-hidden"
            style={{ paddingBottom: cardPaddingBottom }}
            onClick={openLightbox}
          >
            <ImageWithFallback
              src={images[0]}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {isMultipleImages && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                +{images.length}
              </div>
            )}
          </div>
        )}
        <div className="p-5">
          <h3 className={`mb-2 ${titleClassName ? 'relative inline-block' : ''}`}>
            {title}
            {titleClassName && (
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-gray-800 to-gray-200"></span>
            )}
          </h3>
          {!accordionText && !modalText && (
            <p className="text-gray-600">{description}</p>
          )}
          {modalText && description && (
            <p className="text-gray-600">{description}</p>
          )}
          {modalText && (
            <div className="pt-3 mt-1">
              <button
                className={`w-full flex items-center justify-between text-base font-semibold px-4 py-2 rounded-full transition-all duration-300 ${
                  isModalOpen
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                <span>Details</span>
                <ChevronDown 
                  className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                    isModalOpen ? 'rotate-180' : 'animate-bounce'
                  }`} 
                />
              </button>
            </div>
          )}
          {accordionText && (
            <div className="pt-3 mt-1">
              <button
                className={`w-full flex items-center justify-between text-lg font-semibold px-5 py-3 rounded-full transition-all duration-300 ${
                  isAccordionOpen
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAccordionOpen(!isAccordionOpen);
                }}
              >
                <span>Details</span>
                <ChevronDown 
                  className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                    isAccordionOpen ? 'rotate-180' : 'animate-bounce'
                  }`} 
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isAccordionOpen ? 'max-h-[400px] opacity-100 mt-3' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <div className="text-sm text-gray-600 leading-relaxed max-h-[400px] overflow-y-auto pr-1">
                  {accordionText}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* カスタムライトボックス（外部リンクと詳細リンクがない場合のみ表示） */}
      {isOpen && !externalLink && !detailLink && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* 閉じるボタン */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          {/* 画像エリア */}
          <div 
            className="relative w-full h-full flex items-center justify-center px-4 md:px-20 py-8 md:py-16"
            onClick={(e) => e.stopPropagation()}
          >
            {aspectRatio === 'auto' ? (
              // auto: スクロール可能な縦長レイアウト
              <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                <ImageWithFallback
                  src={images[currentImageIndex]}
                  alt={`${title} - ${currentImageIndex + 1}`}
                  className="w-full h-auto"
                />
              </div>
            ) : (
              // 固定アスペクト比
              <div 
                className={`${
                  aspectRatio === 'portrait' ? 'aspect-[3/4] w-full md:w-auto md:h-full' : 
                  aspectRatio === 'photo' ? 'aspect-[3/2] w-full h-auto' : 
                  'aspect-square w-full md:w-auto md:h-auto'
                } max-h-[95vh] max-w-[95vw]`}
              >
                <ImageWithFallback
                  src={images[currentImageIndex]}
                  alt={`${title} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* 複数画像の場合のみナビゲーションを表示 */}
            {isMultipleImages && (
              <>
                {/* 左矢印 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-[110] bg-white hover:bg-gray-100 rounded-full p-2 md:p-3 shadow-2xl transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </button>
                
                {/* 右矢印 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-[110] bg-white hover:bg-gray-100 rounded-full p-2 md:p-3 shadow-2xl transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </button>
                
                {/* インジケーター */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-5 py-2 rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Details モーダル */}
      {isModalOpen && modalText && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-[fadeInScale_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* モーダルヘッダー */}
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {/* モーダルコンテンツ */}
            <div className="px-6 py-5 text-sm text-gray-600 leading-relaxed font-medium">
              {modalText}
            </div>
          </div>
        </div>
      )}
    </>
  );
}