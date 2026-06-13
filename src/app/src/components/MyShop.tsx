import { ExternalLink } from 'lucide-react@0.468.0';

export function MyShop() {
  return (
    <section id="myshop" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-12 text-center section-title font-thin" style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100 }}>My Shop</h2>
        <div className="bg-gray-50 rounded-2xl shadow-lg p-10 text-center space-y-8">
          <p style={{ fontSize: '15px' }}>
            テキスタイル作品をオンラインショップで販売しています。
          </p>
          <a
            href="https://www.ecru-blanc.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Visit Shop</span>
          </a>
        </div>
      </div>
    </section>
  );
}
