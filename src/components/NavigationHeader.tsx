import { useState } from 'react';
import { Menu, X, Home, Gamepad2, CreditCard, Building2, BookOpen, Send, Download, Heart, Rocket, Trophy, Coins, ChevronDown, Zap, ArrowRightLeft, Flame, History, Wrench } from 'lucide-react';

interface NavigationHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  walletAddress?: string;
  onConnectWallet: () => void;
}

export function NavigationHeader({ currentPage, onNavigate, walletAddress, onConnectWallet }: NavigationHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlayMenuOpen, setIsPlayMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'mainnet-ready', label: 'MAINNET READY', icon: Rocket, special: true },
    {
      id: 'play',
      label: 'Play & Earn',
      icon: Gamepad2,
      submenu: [
        { id: 'play', label: 'Game', icon: Gamepad2 },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
        { id: 'rewards', label: 'My Rewards', icon: Coins }
      ]
    },
    {
      id: 'tools',
      label: 'Tools & Features',
      icon: Wrench,
      submenu: [
        { id: 'swap', label: 'Convert AIC to USDC', icon: ArrowRightLeft },
        { id: 'bridge', label: 'Bridge Tokens', icon: Send },
        { id: 'accelerator', label: 'Transaction Accelerator', icon: Zap },
        { id: 'history', label: 'Transaction History', icon: History },
        { id: 'card', label: 'Virtual Card', icon: CreditCard },
        { id: 'banking', label: 'Circle Banking', icon: Building2 }
      ]
    },
    { id: 'fund-treasury', label: 'Fund Treasury', icon: Heart },
    { id: 'withdraw', label: 'Withdraw', icon: Download },
  ];

  const handleMenuClick = (pageId: string) => {
    onNavigate(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-cyan-500/30 shadow-[0_4px_20px_rgba(34,211,238,0.15)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <img
                src="/aic toekn .png"
                alt="AiC Logo"
                className="w-10 h-10 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  AI Cognitive Token
                </h1>
                <p className="text-xs text-gray-400">Learn • Earn • Freedom</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id || (item.submenu && item.submenu.some(sub => sub.id === currentPage));
                const isSpecial = item.special;

                if (item.submenu) {
                  const isMenuOpen = item.id === 'play' ? isPlayMenuOpen : isToolsMenuOpen;
                  const setMenuOpen = item.id === 'play' ? setIsPlayMenuOpen : setIsToolsMenuOpen;

                  return (
                    <div key={item.id} className="relative">
                      <button
                        onClick={() => setMenuOpen(!isMenuOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-cyan-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-30"
                            onClick={() => setMenuOpen(false)}
                          />
                          <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-cyan-500/30 rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.3)] min-w-[200px] overflow-hidden z-40">
                            {item.submenu.map((subItem) => {
                              const SubIcon = subItem.icon;
                              const isSubActive = currentPage === subItem.id;
                              return (
                                <button
                                  key={subItem.id}
                                  onClick={() => {
                                    handleMenuClick(subItem.id);
                                    setMenuOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                                    isSubActive
                                      ? 'bg-cyan-500/20 text-cyan-400'
                                      : 'text-gray-300 hover:bg-gray-800 hover:text-cyan-400'
                                  }`}
                                >
                                  <SubIcon className="w-4 h-4" />
                                  <span className="text-sm">{subItem.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isSpecial
                        ? isActive
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.6)] animate-pulse font-black'
                          : 'bg-gradient-to-r from-green-500/80 to-emerald-600/80 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] animate-pulse font-black'
                        : isActive
                        ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-cyan-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              {walletAddress ? (
                <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 px-4 py-2 rounded-lg border border-cyan-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-cyan-400 font-mono">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
              ) : (
                <button
                  onClick={onConnectWallet}
                  className="hidden md:block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all"
                >
                  Connect Wallet
                </button>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-cyan-400 active:bg-gray-800 sm:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-cyan-500/30 bg-gray-900/98 backdrop-blur-xl">
            <nav className="px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id || (item.submenu && item.submenu.some(sub => sub.id === currentPage));
                const isSpecial = item.special;

                if (item.submenu) {
                  return (
                    <div key={item.id} className="space-y-1">
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                        isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-300'
                      }`}>
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <div className="pl-4 space-y-1">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = currentPage === subItem.id;
                          return (
                            <button
                              key={subItem.id}
                              onClick={() => handleMenuClick(subItem.id)}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all touch-manipulation min-h-[48px] ${
                                isSubActive
                                  ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                                  : 'text-gray-300 active:bg-gray-800 active:text-cyan-400 sm:hover:bg-gray-800 sm:hover:text-cyan-400'
                              }`}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span className="text-sm">{subItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg font-medium transition-all touch-manipulation min-h-[52px] ${
                      isSpecial
                        ? isActive
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.6)] animate-pulse font-black'
                          : 'bg-gradient-to-r from-green-500/80 to-emerald-600/80 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse font-black'
                        : isActive
                        ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                        : 'text-gray-300 active:bg-gray-800 active:text-cyan-400 sm:hover:bg-gray-800 sm:hover:text-cyan-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-4 border-t border-gray-800">
                {walletAddress ? (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 px-4 py-3 rounded-lg border border-cyan-500/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-cyan-400 font-mono">
                      {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onConnectWallet();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 active:from-cyan-600 active:to-blue-700 sm:hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] text-white px-6 py-4 rounded-lg font-bold transition-all touch-manipulation min-h-[56px]"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <div className="h-16"></div>
    </>
  );
}
