import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { PasswordProtection } from './components/PasswordProtection';

export default function App() {
  return (
    <PasswordProtection>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
        </Routes>
      </HashRouter>
    </PasswordProtection>
  );
}
