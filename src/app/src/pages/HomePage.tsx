import { Header } from '../components/Header';
import { About } from '../components/About';
import { Categories } from '../components/Categories';
import { Contact } from '../components/Contact';
import { MyShop } from '../components/MyShop';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ScrollToTop } from '../components/ScrollToTop';
import { Footer } from '../components/Footer';

export function HomePage() {
  return (
    <div id="top" className="min-h-screen bg-white">
      <Header />
      <ScrollToTop />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          {/* PC用画像（768px以上） */}
          <ImageWithFallback
            src="https://github.com/akinkzw/myportlait/blob/main/mypage_pc_img.jpg?raw=true"
            alt="Hero background"
            className="hidden md:block w-full h-full object-cover"
            style={{ objectPosition: 'center calc(50% - 20px)' }}
          />
          {/* モバイル用画像（768px未満） */}
          <ImageWithFallback
            src="https://github.com/akinkzw/myportlait/blob/main/mypage_sp_img.jpg?raw=true"
            alt="Hero background"
            className="block md:hidden w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center md:translate-y-0 -translate-y-[30px]" style={{ color: '#333333' }}>
          <h1 className="mb-6 hero-title" style={{ fontSize: 'var(--text-4xl)' }}>
            Creative Portfolio
          </h1>
          <p className="text-xl -translate-y-[20px] md:translate-y-0 hero-subtitle" style={{ fontSize: 'calc(1.5rem + 3pt)' }}>
            Web × Textile × Photography
          </p>
        </div>
      </section>

      <About />
      <Categories />
      <MyShop />
      <Contact />

      <Footer />
    </div>
  );
}