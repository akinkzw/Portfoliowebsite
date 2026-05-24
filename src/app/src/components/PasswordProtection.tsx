import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react@0.468.0';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 環境変数からパスワードを取得（デフォルトは "portfolio2024"）
  const CORRECT_PASSWORD = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_PASSWORD) || 'portfolio2024';

  useEffect(() => {
    // ローカルストレージから認証状態を確認
    const authStatus = localStorage.getItem('portfolio_auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('portfolio_auth', 'authenticated');
      setError('');
    } else {
      setError('パスワードが正しくありません');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Lock className="w-8 h-8 text-gray-600" />
              </div>
              <h1 className="text-2xl">Portfolio</h1>
              <p className="text-gray-600">
                このサイトはパスワードで保護されています
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block mb-2 text-sm text-gray-700">
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                  placeholder="パスワードを入力"
                  autoFocus
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                ログイン
              </button>
            </form>

            <p className="text-xs text-center text-gray-500">
              パスワードをお持ちでない方は管理者にお問い合わせください
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
