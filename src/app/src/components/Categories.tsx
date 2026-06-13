import { useState, useEffect } from "react";
import { Link } from "react-router";
import { WorkCard } from "./WorkCard";
import {
  getWorksByCategory,
  type Work as MicroCMSWork,
} from "../lib/microcms";

interface Work {
  title: string;
  description: string;
  imageUrl: string;
  imageUrls?: string[]; // 複数画像のオプション
  tags?: string[]; // タグ
  externalLink?: string; // 外部リンク
  aspectRatio?: 'square' | 'portrait' | 'photo' | 'auto'; // ライトボックスのアスペクト比
  id?: string; // 作品のID
  accordionText?: React.ReactNode; // アコーディオンに表示するテキスト
  titleClassName?: string; // タイトルに適用する追加クラス
}

interface CategoryData {
  title: string;
  slug: string;
  works: Work[];
}

// 実際の作品データ
const mockCategories: CategoryData[] = [
  {
    title: "Web",
    slug: "web",
    works: [
      {
        title: "LINEリッチメッセージ",
        description: "週末企画・LINEリッチメッセージ",
        imageUrl: "",
        imageUrls: [],
        tags: ["line", "banner"],
      },
    ],
  },
  {
    title: "Textile",
    slug: "textile",
    works: [
      {
        title: "Organic Form",
        description: "自然をモチーフにした柔らかなパターン",
        imageUrl:
          "https://images.microcms-assets.io/assets/16bf99f801844d31828495789dff913f/ee04d7dc26dc4b50be873577aec16e00/colourblock_watercolour_leaves.jpg",
        imageUrls: [
          "https://images.microcms-assets.io/assets/16bf99f801844d31828495789dff913f/ee04d7dc26dc4b50be873577aec16e00/colourblock_watercolour_leaves.jpg",
        ],
        tags: ["nature", "printing"],
      },
    ],
  },
  {
    title: "Photo & Movie",
    slug: "photo",
    works: [
      {
        title: "Into the forest",
        description: "森の中を散策中に",
        imageUrl: "",
        tags: ["nature", "blackandwhite"],
      },
    ],
  },
];

export function Categories() {
  const [categories, setCategories] =
    useState<CategoryData[]>(mockCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    async function fetchWorks() {
      try {
        setIsLoading(true);
        setDebugInfo("Fetching data from microCMS...");

        // 各カテゴリのデータを並列で取得
        const [webWorks, textileWorks, photoWorks] =
          await Promise.all([
            getWorksByCategory("web", 1),
            getWorksByCategory("textile", 1),
            getWorksByCategory("photo", 1),
          ]);

        setDebugInfo(
          `Got: ${webWorks.length} web, ${textileWorks.length} textile, ${photoWorks.length} photo`,
        );

        // microCMSからデータを取得でき場合のみ更新
        if (
          textileWorks.length > 0 ||
          webWorks.length > 0 ||
          photoWorks.length > 0
        ) {
          const updatedCategories: CategoryData[] = [
            {
              title: "Web",
              slug: "web",
              works:
                webWorks.length > 0
                  ? webWorks.map((w) => {
                      console.log(`🔍 Work: ${w.title}, aspectRatio from API:`, w.aspectRatio);
                      return {
                        title: w.title,
                        description: w.description,
                        imageUrl: w.image[0]?.url || '', // 配列の最初の
                        imageUrls: w.image.map(img => img.url), // すべての画像URL
                        tags: w.tags, // microCMSからタグを取得
                        externalLink: w.externalLink, // 外部リンク
                        aspectRatio: w.aspectRatio || 'portrait', // アスペクト比（デフォルト: portrait）
                        id: w.id, // 作品のID
                        accordionText: w.title.toLowerCase().includes('anglers')
                          ? (
                            <>
                              <div><span className="!font-bold text-gray-800">制作の意図：</span><br /><span className="!font-normal text-gray-500">釣り人は釣行時の天気や川の水位を気にする習慣があります。釣り人達にとって、釣行時に天気と水位が分かるアプリがあるとより有意義な釣行ができるのではと思ったことがきっかけで制作しました。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">検証：</span><br /><span className="!font-normal text-gray-500">既に公開されている他社アプリを検証。総合的に不足してい要素を付与。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">工夫した点：</span><br /><span className="!font-normal text-gray-500">全国の河川の名称をデータベースから収集する為に国土交通データプラットフォームAPIから抽出。各河川のデータ（川名、都道府県、水系名など）を基に、より正確なライブカメラの個別ページ、または該当地域のカメラ一覧ページへと正しく遷移できるようにURLの生成ロジック（スクレイピングやAPI呼び出し・検索URLの組み立て）を工夫。各河川の前後3日間の天気のみをリアルタイムに取得する点に切り替えてUIデザインを構築。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">使用したAPI：</span></div>
                              <div className="!font-normal text-gray-500">・国土交通データプラットフォーム API</div>
                              <div className="!font-normal text-gray-500">・Open Weather API</div>
                            </>
                          )
                          : w.title.toLowerCase().includes('weather')
                          ? (
                            <>
                              <div><span className="!font-bold text-gray-800">制作の意図：</span><br /><span className="!font-normal text-gray-500">手軽に都市名を入れる事で天気が分かるアプリを作成したかったこと、APIの機能を理解することが目的。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">検証：</span><br /><span className="!font-normal text-gray-500">WeatherAPIでは日本国内の天気情報が限定的だった為、Open-MeteoのGeocoding APIに切り替える対策を行なった。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">使用したAPI：</span></div>
                              <div className="!font-normal text-gray-500">・Open-MeteoのGeocoding API</div>
                              <div className="!font-normal text-gray-500">・国土地理院のジオコーディングAPI</div>
                            </>
                          )
                          : undefined,
                        titleClassName: w.title.toLowerCase().includes('anglers') || w.title.toLowerCase().includes('weather')
                          ? 'underline decoration-[1px] underline-offset-4'
                          : undefined,
                      };
                    })
                  : mockCategories[0].works,
            },
            {
              title: "Textile",
              slug: "textile",
              works:
                textileWorks.length > 0
                  ? textileWorks.map((w) => ({
                      title: w.title,
                      description: w.description,
                      imageUrl: w.image[0]?.url || '', // 配列の最初の画像
                      imageUrls: w.image.map(img => img.url), // すべての画像URL
                      tags: w.tags, // microCMSからタグを取得
                      externalLink: w.externalLink, // 外部リンク
                      aspectRatio: w.aspectRatio || 'square', // アスペクト比（デフォルト: square）
                      titleClassName: 'gradient-underline',
                    }))
                  : mockCategories[1].works,
            },
            {
              title: "Photo & Movie",
              slug: "photo",
              works:
                photoWorks.length > 0
                  ? photoWorks.map((w) => {
                      // 🔍 画像データの診断ログ
                      console.log(`🖼️ Photo Work: ${w.title}`);
                      console.log('  - image field type:', typeof w.image);
                      console.log('  - image is Array:', Array.isArray(w.image));
                      console.log('  - image data:', w.image);
                      console.log('  - image[0]?.url:', w.image[0]?.url);
                      
                      // 画像URLの取得（柔軟な対応）
                      let imageUrl = '';
                      let imageUrls: string[] = [];
                      
                      if (Array.isArray(w.image) && w.image.length > 0) {
                        imageUrls = w.image.map(img => img.url);
                        imageUrl = imageUrls[0] || '';
                      } else if (w.image && typeof w.image === 'object' && 'url' in w.image) {
                        imageUrl = (w.image as any).url || '';
                        imageUrls = [imageUrl];
                      }
                      
                      console.log('  - extracted imageUrl:', imageUrl);
                      console.log('  - extracted imageUrls:', imageUrls);
                      
                      // aspectRatioの処理（配列の場合は最初の要素を取得）
                      const aspectRatio = Array.isArray(w.aspectRatio) 
                        ? w.aspectRatio[0] || 'photo' 
                        : w.aspectRatio || 'photo';
                      
                      console.log('  - aspectRatio:', aspectRatio);
                      
                      return {
                        title: w.title,
                        description: w.description,
                        imageUrl: imageUrl,
                        imageUrls: imageUrls,
                        tags: w.tags,
                        externalLink: w.externalLink,
                        aspectRatio: aspectRatio,
                        titleClassName: 'gradient-underline',
                      };
                    })
                  : mockCategories[2].works,
            },
          ];
          setCategories(updatedCategories);
          setDebugInfo("✅ microCMS data loaded successfully!");
        } else {
          setDebugInfo(
            "⚠️ No data from microCMS, using mock data",
          );
        }
        setIsLoading(false);
      } catch (error) {
        setDebugInfo(
          `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        setIsLoading(false);
      }
    }

    fetchWorks();
  }, []);

  return (
    <section id="categories" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-16 text-center section-title font-semibold" style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 600 }}>Categories</h2>

        {/* Debug Info - コメントアウト */}
        {/* {debugInfo && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded text-center">
            <p className="text-sm">{debugInfo}</p>
          </div>
        )} */}

        <div className="space-y-24">
          {categories.map((category) => (
            <div key={category.title}>
              <div className="flex items-center gap-4 mb-10">
                <h3 className="relative inline-block">
                  {category.title}
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-gray-800 to-gray-400"></span>
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-8 mb-8 max-w-4xl mx-auto">
                {category.works.map((work, index) => (
                  <WorkCard
                    key={index}
                    title={work.title}
                    description={work.description}
                    imageUrl={work.imageUrl}
                    imageUrls={work.imageUrls}
                    aspectRatio={work.aspectRatio}
                    externalLink={work.externalLink}
                    cardAspectRatio="wide"
                    detailLink={category.slug === 'web' && work.id && !work.externalLink ? `/work/${work.id}` : undefined}
                    workId={work.id}
                    tags={work.tags}
                    category={category.slug}
                    accordionText={work.accordionText}
                    titleClassName={work.titleClassName}
                  />
                ))}
              </div>
              <div className="text-center">
                <Link
                  to={`/category/${category.slug}`}
                  className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-all duration-300"
                >
                  <span>more</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}