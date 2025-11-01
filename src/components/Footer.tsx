interface FooterProps {
  onNavigate?: (page: 'home' | 'play' | 'swap' | 'withdraw' | 'how' | 'arc-updates' | 'partners' | 'chat') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleNavClick = (e: React.MouseEvent, page: 'how' | 'arc-updates' | 'partners' | 'chat') => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(page);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-8 border-t border-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <button
              onClick={(e) => handleNavClick(e, 'how')}
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm md:text-base cursor-pointer"
            >
              How it works
            </button>
            <a
              href="https://testnet.arcscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm md:text-base"
            >
              Arc Testnet Explorer
            </a>
            <button
              onClick={(e) => handleNavClick(e, 'arc-updates')}
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm md:text-base cursor-pointer"
            >
              Arc Mainnet Updates
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'partners')}
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm md:text-base cursor-pointer"
            >
              AIC partners on board
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'chat')}
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm md:text-base cursor-pointer"
            >
              Chat with us
            </button>
          </nav>

          <p className="text-gray-500 text-xs text-center">
            © 2025 AiC Token Project
          </p>
        </div>
      </div>
    </footer>
  );
}
