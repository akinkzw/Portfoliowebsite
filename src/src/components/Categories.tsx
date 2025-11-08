import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
}

interface CategoryData {
  title: string;
  slug: string;
  works: Work[];
}

// 実際の作品データ
const mockCategories: CategoryData[] = [
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
          "https://images.unsplash.com/photo-1701964619775-b18422290cf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwcGF0dGVybiUyMGRlc2lnbnxlbnwxfHx8fDE3NjE0NzA3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1709390890630-2d66bda05bb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWJyaWMlMjB0ZXh0dXJlJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NjE0NzA3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        ],
        tags: ["nature", "printing"],
      },
      {
        title: "Geometric Pattern",
        description: "幾何学模様を用いたテキスタイルデザイン",
        imageUrl:
          "https://images.microcms-assets.io/assets/16bf99f801844d31828495789dff913f/4f75d6d014aa463c874bd5d4fe9d1593/20180206_113651.jpg",
        tags: ["geometric", "weaving"],
      },
      {
        title: "Textured Pattern",
        description: "テクスチャーを生かしたデザイン",
        imageUrl:
          "https://images.microcms-assets.io/assets/16bf99f801844d31828495789dff913f/fc93b8ea19f14b3690b0e419073128ff/16_2p.jpg",
        tags: ["nature", "weaving"],
      },
    ],
  },
  {
    title: "Web",
    slug: "web",
    works: [
      {
        title: "LINEリッチメッセージ",
        description: "週末企画・LINEリッチメッセージ",
        imageUrl:
          "https://images.unsplash.com/photo-1567359871315-56db4f5c9e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMSU5FJTIwYXBwJTIwcmljaCUyMG1lc3NhZ2V8ZW58MXx8fHwxNzYxNDYzODI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        imageUrls: [
          "https://images.unsplash.com/photo-1567359871315-56db4f5c9e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMSU5FJTIwYXBwJTIwcmljaCUyMG1lc3NhZ2V8ZW58MXx8fHwxNzYxNDYzODI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1730794545099-14902983739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBtb2NrdXB8ZW58MXx8fHwxNzYxMzc5ODg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzYxNDU3NzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        ],
        tags: ["line", "banner"],
      },
      {
        title: "LINEリッチメッセージ",
        description: "週末企画・LINEリッチメッセージ",
        imageUrl:
          "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2UlMjBkZXNpZ258ZW58MXx8fHwxNzYxNDU4MTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tags: ["line", "lp"],
      },
      {
        title: "LINEリッチメッセージ",
        description: "週末企画・LINEリッチメッセージ",
        imageUrl:
          "https://images.unsplash.com/photo-1706894267114-f82f15e69c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwc2NyZWVuJTIwVUl8ZW58MXx8fHwxNzYxNDYzODI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tags: ["banner"],
      },
    ],
  },
  {
    title: "Photography",
    slug: "photo",
    works: [
      {
        title: "Into the forest",
        description: "森の中を散策中に",
        imageUrl:
          "https://images.unsplash.com/photo-1723470317938-6ec6fb0d4075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBwYXRoJTIwbmF0dXJlfGVufDF8fHx8MTc2MTQ2MzgyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tags: ["nature", "blackandwhite"],
      },
      {
        title: "Go to Mountain",
        description: "トレッキング時の撮影",
        imageUrl:
          "https://images.unsplash.com/photo-1667021901319-ff71b9036cd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGlraW5nfGVufDF8fHx8MTc2MTQ2MzgyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tags: ["nature"],
      },
      {
        title: "Break Time",
        description: "テーブルフォト",
        imageUrl:
          "https://images.unsplash.com/photo-1708430651927-20e2e1f1e8f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZSUyMHBob3RvZ3JhcGh5JTIwY29mZmVlfGVufDF8fHx8MTc2MTQ2MzgyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tags: ["tablephoto"],
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
        const [textileWorks, webWorks, photoWorks] =
          await Promise.all([
            getWorksByCategory("textile", 3),
            getWorksByCategory("web", 3),
            getWorksByCategory("photo", 3),
          ]);

        setDebugInfo(
          `Got: ${textileWorks.length} textile, ${webWorks.length} web, ${photoWorks.length} photo`,
        );

        // microCMSからデータを取得できた場合のみ更新
        if (
          textileWorks.length > 0 ||
          webWorks.length > 0 ||
          photoWorks.length > 0
        ) {
          const updatedCategories: CategoryData[] = [
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
                    }))
                  : mockCategories[0].works,
            },
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
                        imageUrl: w.image[0]?.url || '', // 配列の最初の画像
                        imageUrls: w.image.map(img => img.url), // すべての画像URL
                        tags: w.tags, // microCMSからタグを取得
                        externalLink: w.externalLink, // 外部リンク
                        aspectRatio: w.aspectRatio || 'portrait', // アスペクト比（デフォルト: portrait）
                      };
                    })
                  : mockCategories[1].works,
            },
            {
              title: "Photo",
              slug: "photo",
              works:
                photoWorks.length > 0
                  ? photoWorks.map((w) => ({
                      title: w.title,
                      description: w.description,
                      imageUrl: w.image[0]?.url || '', // 配列の最初の画像
                      imageUrls: w.image.map(img => img.url), // すべての画像URL
                      tags: w.tags, // microCMSからタグを取得
                      externalLink: w.externalLink, // 外部リンク
                      aspectRatio: w.aspectRatio || 'photo', // アスペクト比（デフォルト: photo）
                    }))
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
        <h2 className="mb-16 text-center">Categories</h2>

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {category.works.map((work, index) => (
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
