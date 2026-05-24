import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Google Analyticsのgtag関数の型定義
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // ページ遷移時にページビューを送信
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-7ETE8K5729', {
        page_path: location.pathname + location.search + location.hash,
      });
    }
  }, [location]);

  return null;
}