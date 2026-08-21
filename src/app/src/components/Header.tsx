import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Categories', id: 'categories' },
    { label: 'My Shop', id: 'myshop' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection('top')}
            className="hover:opacity-70 transition-opacity"
          >
            Portfolio
          </button>

          {/* PC メニュー */}
          <ul className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="hover:opacity-70 transition-opacity"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* ハンバーガーボタン（モバイルのみ） */}
          <button
            className="md:hidden p-1 hover:opacity-70 transition-opacity"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="メニューを開く"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* モバイルドロワーメニュー */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100">
          <ul className="flex flex-col px-6 py-4 gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left py-3 hover:opacity-70 transition-opacity border-b border-gray-100 last:border-0"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
