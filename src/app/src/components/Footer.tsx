import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 text-gray-600">
        <a
          href="https://www.instagram.com/akinkzw"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={22} />
        </a>
        <p className="text-sm">© 2026 Portfolio. All rights reserved.</p>
      </div>
    </footer>
  );
}
