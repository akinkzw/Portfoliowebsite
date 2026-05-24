import { HashRouter as Router, Routes, Route } from 'react-router';
import { useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { DiagnosticPage } from './pages/DiagnosticPage';
import { WorkDetailPage } from './pages/WorkDetailPage';
import { ScrollToTop } from './components/ScrollToTop';
import { GoogleAnalytics } from './components/GoogleAnalytics';

export default function App() {
  // Google Fontsを確実に読み込む
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap';
    fontLink.rel = 'stylesheet';
    
    // 既存のlinkタグがない場合のみ追加
    const existingLink = document.querySelector(`link[href="${fontLink.href}"]`);
    if (!existingLink) {
      document.head.appendChild(fontLink);
    }

    // ファビコンを設定
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/svg+xml';
    faviconLink.href = '/favicon.svg';
    
    // 既存のファビコンを削除して新しいものを追加
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
      existingFavicon.remove();
    }
    document.head.appendChild(faviconLink);
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <GoogleAnalytics />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/work/:id" element={<WorkDetailPage />} />
        <Route path="/diagnostic" element={<DiagnosticPage />} />
      </Routes>
    </Router>
  );
}