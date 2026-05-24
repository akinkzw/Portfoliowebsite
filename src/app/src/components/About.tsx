import { ImageWithFallback } from "./figma/ImageWithFallback";

export function About() {
  return (
    <section
      id="about"
      className="py-20 px-6 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-12 text-center section-title font-semibold" style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 600 }}>About</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="h-full overflow-hidden rounded-2xl bg-gray-100 shadow-md">
                <ImageWithFallback
                  src="https://images.microcms-assets.io/assets/16bf99f801844d31828495789dff913f/bd1ddb5759a7433087826b2351a85c73/IMG_1258.JPG"
                  alt="Profile"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
            <div className="flex-1 space-y-5">
              <p className="leading-relaxed" style={{ fontWeight: 400 }}>
                美術大学でテキスタイルデザイン、デザインの基礎を学ぶ。大学卒業後、10年以上テキスタイル・繊維関係の業務に従事。
              </p>
              <p className="leading-relaxed" style={{ fontWeight: 400 }}>
                テキスタイル（生地）の商品企画、ファイバーアートの展示会運営、製品カタログのディレクション、テキスタイルデザイン（柄）、ウェブデザインの業務に携わる。
              </p>
              <p className="leading-relaxed" style={{ fontWeight: 400 }}>
                情報発信を行う技術に興味を持ち、独学でコーディングを学ぶ。
                <br />
                現在は、ウェブデザイン、テキスタイルデザイン、写真撮影、動画編集などを中心に制作。
              </p>
              <p className="leading-relaxed" style={{ fontWeight: 400 }}>
                各分野で培った技術と感性を組み合わせ、人に伝わるデザインを創造することを心掛けています。
              </p>
              <p className="leading-relaxed" style={{ fontWeight: 400 }}>
                趣味はトレーニング（水泳・ランニング・食事設計）、渓流釣り、山登りです。
              </p>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-gray-600" style={{ fontWeight: 400 }}>
                  その他の趣味・特技：剣道・武術 / 料理 / 美術館巡り / 旅 / 撮影
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}