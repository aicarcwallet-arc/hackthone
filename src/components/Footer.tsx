export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 border-t border-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <a
              href="#how-it-works"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm md:text-base"
            >
              How it works
            </a>
            <a
              href="https://testnet.arcscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm md:text-base"
            >
              Arc Testnet Explorer
            </a>
            <a
              href="https://testnet.arcscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm md:text-base"
            >
              Arc Mainnet Updates
            </a>
            <a
              href="#partners"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm md:text-base"
            >
              AIC partners on board
            </a>
            <a
              href="mailto:shaz@aictokenwordgame.com"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm md:text-base"
            >
              Chat with us
            </a>
          </nav>

          <p className="text-gray-500 text-xs text-center">
            © 2025 AiC Token Project
          </p>
        </div>
      </div>
    </footer>
  );
}
