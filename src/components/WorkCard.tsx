import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface WorkCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageUrls?: string[]; // 複数画像のオプション
  aspectRatio?: 'square' | 'portrait' | 'photo' | 'auto'; // アスペクト比（デフォルトは正方形）
  externalLink?: string; // 外部リンク（オプション）
}

export function WorkCard({ title, description, imageUrl, imageUrls, aspectRatio = 'square', externalLink }: WorkCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 複数画像がある場合はそれを使用、なければ単一画像を配列に
  const images = imageUrls && imageUrls.length > 0 ? imageUrls : [imageUrl];
  const isMultipleImages = images.length > 1;
  
  // 画像切り替え関数
  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  // ライトボックスを開く（または外部リンクへ移動）
  const openLightbox = () => {
    // 外部リンクがある場合は新しいタブで開く
    if (externalLink) {
      window.open(externalLink, '_blank', 'noopener,noreferrer');
      return;
    }
    // 外部リンクがない場合はライトボックスを開く
    setIsOpen(true);
    setCurrentImageIndex(0);
  };
  
  // ライトボックスを閉じる
  const closeLightbox = () => {
    setIsOpen(false);
    setCurrentImageIndex(0);
  };
  
  // Escキーで閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div 
          className="aspect-square overflow-hidden bg-gray-100 cursor-pointer relative"
          onClick={openLightbox}
        >
          <ImageWithFallback
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            width={1000}
            height={1000}
          />
          {isMultipleImages && !externalLink && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              +{images.length}
            </div>
          )}
          {externalLink && (
            <div className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      
      {/* カスタムライトボックス（外部リンクがない場合のみ表示） */}
      {isOpen && !externalLink && (
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
            className="relative w-full h-full flex items-center justify-center px-20 py-16"
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
                  aspectRatio === 'portrait' ? 'aspect-[3/4] w-auto h-full' : 
                  aspectRatio === 'photo' ? 'aspect-[3/2] w-full h-auto' : 
                  'aspect-square w-auto h-full'
                } max-h-[85vh] max-w-[90vw]`}
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
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-[110] bg-white hover:bg-gray-100 rounded-full p-4 shadow-2xl transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8 text-black" />
                </button>
                
                {/* 右矢印 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-[110] bg-white hover:bg-gray-100 rounded-full p-4 shadow-2xl transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8 text-black" />
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
    </>
  );
}
