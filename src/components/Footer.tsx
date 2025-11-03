import { ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: 'home' | 'play' | 'withdraw' | 'how' | 'arc-updates' | 'partners' | 'chat' | 'mainnet-ready' | 'fund-treasury') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleNavClick = (e: React.MouseEvent, page: 'home' | 'play' | 'withdraw' | 'how' | 'arc-updates' | 'partners' | 'chat' | 'mainnet-ready' | 'fund-treasury') => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(page);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-12 border-t border-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <button
              onClick={(e) => handleNavClick(e, 'home')}
              className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-xs sm:text-sm md:text-base cursor-pointer font-medium hover:scale-105"
            >
              Home
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'mainnet-ready')}
              className="text-gray-400 hover:text-green-400 transition-all duration-300 text-xs sm:text-sm md:text-base cursor-pointer font-medium hover:scale-105"
            >
              Mainnet Ready
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'play')}
              className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-xs sm:text-sm md:text-base cursor-pointer font-medium hover:scale-105"
            >
              Play & Earn
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'fund-treasury')}
              className="text-gray-400 hover:text-pink-400 transition-all duration-300 text-xs sm:text-sm md:text-base cursor-pointer font-medium hover:scale-105"
            >
              Fund Treasury
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'how')}
              className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-xs sm:text-sm md:text-base cursor-pointer font-medium hover:scale-105"
            >
              How it Works
            </button>
            <a
              href="https://testnet.arcscan.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-xs sm:text-sm md:text-base font-medium hover:scale-105 inline-flex items-center gap-1"
            >
              <span>Arc Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={(e) => handleNavClick(e, 'arc-updates')}
              className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-xs sm:text-sm md:text-base cursor-pointer font-medium hover:scale-105"
            >
              Arc Updates
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'partners')}
              className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-xs sm:text-sm md:text-base cursor-pointer font-medium hover:scale-105"
            >
              Partners
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'chat')}
              className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-xs sm:text-sm md:text-base cursor-pointer font-medium hover:scale-105"
            >
              Support
            </button>
          </nav>

          <div className="flex flex-col items-center gap-4 border-t border-cyan-500/20 pt-6 w-full max-w-2xl">
            <div className="flex flex-col items-center gap-2">
              <p className="text-cyan-400 text-sm font-semibold tracking-wide">
                Architecting the Future of the Internet Economy
              </p>
              <p className="text-gray-300 text-base font-bold">
                Shazia Sayeed
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">
                Creative Head & Visionary Founder
              </p>
            </div>

            <p className="text-gray-500 text-xs text-center mt-2">
              © 2025 AI Cognitive Token Project. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
