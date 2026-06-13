import { Mail, Instagram } from 'lucide-react@0.468.0';

export function Contact() {
  return (
    <section id="contact" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-12 text-center section-title font-thin" style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100 }}>Contact</h2>
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center space-y-8">
          <p style={{ fontSize: '15px' }}>
            お問い合わせは以下からお気軽にご連絡ください。
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <a 
              href="mailto:aki.nakazaw@gmail.com" 
              className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
            {/* Instagram - Temporarily hidden */}
            {/* <a 
              href="https://www.instagram.com/akinkzw/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Instagram className="w-5 h-5" />
              <span>Instagram</span>
            </a> */}
            {/* Threads - Temporarily hidden */}
            {/* <a 
              href="https://www.threads.com/@akinkzw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <svg 
                className="w-5 h-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19.2 8.5c-1.2-3-4-5-7.2-5-4.4 0-8 3.6-8 8s3.6 8 8 8c3.2 0 6-2 7.2-5" />
                <circle cx="12" cy="11.5" r="3" />
              </svg>
              <span>Threads</span>
            </a> */}
          </div>
        </div>
      </div>
    </section>
  );
}