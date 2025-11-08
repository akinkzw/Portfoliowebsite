import { ImageWithFallback } from "./figma/ImageWithFallback";

export function About() {
  return (
    <section id="about" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-12 text-center">About</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-md">
                <ImageWithFallback
                  src="https://raw.githubusercontent.com/akinkzw/myportlait/main/akinkzw.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 space-y-5">
              <p className="leading-relaxed">
                テキスタイルデザイン、ウェブデザイン、写真撮影、動画編集などを中心に制作しています。
                デザインを通じて、新しい価値と体験を創造することを目指しています。
              </p>
              <p className="leading-relaxed">
                各分野で培った技術と感性を組み合わせ、作品を制作しています。
                お気軽にお問い合わせください。
              </p>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-gray-600">
                  趣味：渓流釣り / 山登り / 料理 / 美術館巡り / 旅
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}