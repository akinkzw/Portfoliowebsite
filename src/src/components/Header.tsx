import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      // ホームページでない場合は、まずホームページに移動してからスクロール
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
          <ul className="flex gap-8">
            <li>
              <button 
                onClick={() => scrollToSection('about')}
                className="hover:opacity-70 transition-opacity"
              >
                About
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('categories')}
                className="hover:opacity-70 transition-opacity"
              >
                Categories
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('contact')}
                className="hover:opacity-70 transition-opacity"
              >
                Contact
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
