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
        title: "Built an E-Commerce Website",
        description: "Shopify による EC サイトの実装",
        imageUrl: "",
        imageUrls: [],
        tags: ["shopify", "ec"],
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
            getWorksByCategory("web", 3),
            getWorksByCategory("textile", 3),
            getWorksByCategory("photo", 3),
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
                              <div><span className="!font-bold text-gray-800">制作の意図：</span><br /><span className="!font-normal text-gray-500">手軽に川の名称を入れるだけで天気が分かるアプリを作りたかったこと、API連携の仕組みを理解することが目的です。私自身が渓流釣りをするため、川ごとの天気やライブカメラ、気象警報が手元で分かるアプリを作りたいと考え、制作しました。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">工夫した点・技術的な取り組み：</span><br /><span className="!font-normal text-gray-500">SupabaseのMagic Link認証とお気に入り機能を実装し、ユーザーが普段通う河川を保存して次回すぐ確認できるようにしました。外部APIの呼び出しはSupabase Edge Functions側にまとめ、APIキーをクライアントに露出させない構成にしています。RLSポリシーにより、お気に入りデータが他ユーザーから参照されないようにしました。</span></div>
                              <div className="mt-2"><span className="!font-normal text-gray-500">安全性への配慮として、気象庁の防災情報フィードから各地域のリアルタイムな気象警報を取得し、川の一覧・詳細に表示する機能を実装しました。実装にあたり、気象庁の一部データ配信が更新停止していることを実データの検証から発見し、リアルタイム性が担保された正しい配信経路（防災情報XML）に切り替えました。警報データが取得できない場合は「警報なし」と誤表示せず「不明」として扱い、公式サイトでの確認を促す設計にすることで、利用者を誤解させないことを重視しました。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">使用技術：</span><br /><span className="!font-normal text-gray-500">React 18 / TypeScript / Vite / Tailwind CSS v4 / Supabase（PostgreSQL・認証・Edge Functions）/ Python（河川座標データの整形）</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">使用したAPI・データ：</span></div>
                              <div className="!font-normal text-gray-500">・気象庁 防災情報XML（気象警報・注意報）</div>
                              <div className="!font-normal text-gray-500">・国土地理院 地名検索API（河川座標の取得）</div>
                              <div className="!font-normal text-gray-500">・Open-Meteo（気象データ・Geocoding）/ OpenWeather</div>
                              <div className="!font-normal text-gray-500">・国土交通省 川の防災情報（水位・ライブカメラの公式情報へ誘導）</div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">サイト：</span><br /><a href="https://weather-for-anglers.netlify.app/" target="_blank" rel="noopener noreferrer" className="!font-normal text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors">https://weather-for-anglers.netlify.app/</a></div>
                            </>
                          )
                          : w.title.toLowerCase().includes('weather')
                          ? (
                            <>
                              <div><span className="!font-bold text-gray-800">制作の意図：</span><br /><span className="!font-normal text-gray-500">手軽に都市名を入れる事で天気が分かるアプリを作成したかったこと、APIの機能を理解することが目的。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">検証：</span><br /><span className="!font-normal text-gray-500">WeatherAPIでは日本国内の天気情報が限定的だった為、Open-MeteoのGeocoding APIに切り替える対策を行なった。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">工夫した点：</span><br /><span className="!font-normal text-gray-500">都市名の入力欄にインクリメンタルサーチを実装し、入力中の文字列に応じて候補地名をドロップダウンで複数表示するようにしました。同名・類似名の地名が国内外に複数存在するため、候補には地域情報を併せて表示し、ユーザーが目的の地点を取り違えずに選択できる設計にしています。さらにOpen-Meteoと国土地理院の2つのジオコーディングを併用することで、海外の都市名と日本国内の細かい地名の双方に対応させました。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">使用したAPI：</span></div>
                              <div className="!font-normal text-gray-500">・Open-MeteoのGeocoding API</div>
                              <div className="!font-normal text-gray-500">・国土地理院のジオコーディングAPI</div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">使用技術：</span><br /><span className="!font-normal text-gray-500">React / JavaScript / HTML / CSS</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">サイト：</span><br /><a href="https://clever-pasteur-3ecdcf.netlify.app/" target="_blank" rel="noopener noreferrer" className="!font-normal text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors">https://clever-pasteur-3ecdcf.netlify.app/</a></div>
                            </>
                          )
                          : w.title.toLowerCase().includes('e-commerce')
                          ? (
                            <>
                              <div><span className="!font-bold text-gray-800">制作の意図：</span><br /><span className="!font-normal text-gray-500">アパレル・ライフスタイルブランド「めるげん//賢志」様からのご依頼で、ShopifyによるECサイトを実装しました。衣類とライフプロダクトの2カテゴリに加え、ブランドの世界観を伝える読み物コンテンツ（Journal）を持つ構成で、多言語・多通貨での販売にも対応しています。既存テーマの標準レイアウトでは表現しきれないブランド表現の部分を、Liquidのカスタマイズで実現することを目的としました。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">検証：</span><br /><span className="!font-normal text-gray-500">同ジャンルのアパレルECを複数調査し、商品一覧・商品詳細・読み物コンテンツへの導線を比較。依頼主の要望と既存テーマの標準機能との差分を洗い出し、テーマの標準機能で満たせる範囲（商品管理、絞り込み、決済、多通貨対応）と、独自実装が必要な範囲（トップページとJournalのビジュアル構成）を切り分けた上で着手しました。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">苦労した点：</span><br /><span className="!font-normal text-gray-500">トップページとJournalの記事内で、画像・動画が規則的なグリッドに収まらない配置を求められた点です。段組みが記事ごとに変わり、動画と画像が混在するため、既存テーマのセクションをそのまま使うことができませんでした。さらにPCとスマートフォンで意図した見え方を保つ必要があり、ブレイクポイントごとに要素の並び順とアスペクト比を制御するレスポンシブ調整に最も時間を要しました。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">工夫した点：</span><br /><span className="!font-normal text-gray-500">不規則な配置をその場限りのハードコーディングで終わらせず、Liquidのセクション／ブロックschemaを設計し、管理画面から画像・動画の差し替えや並び替えができる形で実装しました。これにより、依頼主が納品後も自分でトップページと記事の構成を更新できる状態になっています。実際に運用が継続され、記事が追加され続けていることが、この設計の成果だと考えています。レイアウトはCSS Gridで組み、SP表示では並び順を再定義することで、どの構成でも崩れない実装にしました。</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">使用技術：</span><br /><span className="!font-normal text-gray-500">Shopify / Liquid / HTML / CSS（Grid・Flexbox）/ JavaScript</span></div>
                              <div className="mt-3"><span className="!font-bold text-gray-800">サイト：</span><br /><a href="https://www.mergenkenji.com/" target="_blank" rel="noopener noreferrer" className="!font-normal text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors">https://www.mergenkenji.com/</a></div>
                            </>
                          )
                          : undefined,
                        titleClassName: w.title.toLowerCase().includes('anglers') || w.title.toLowerCase().includes('weather') || w.title.toLowerCase().includes('e-commerce')
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

        <div className="space-y-20">
          {categories.map((category) => (
            <div key={category.title}>
              <div className="flex items-center gap-4 mb-10">
                <h3 className="relative inline-block">
                  {category.title}
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-gray-800 to-gray-400"></span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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