import { Home, Gamepad2, Coins, CreditCard, Wrench } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function MobileBottomNav({ currentPage, onNavigate }: MobileBottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'play', icon: Gamepad2, label: 'Play' },
    { id: 'rewards', icon: Coins, label: 'Rewards' },
    { id: 'withdraw', icon: CreditCard, label: 'Wallet' },
    { id: 'fund-treasury', icon: Wrench, label: 'Tools' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/98 backdrop-blur-xl border-t border-cyan-500/30 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] safe-area-pb">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg transition-all touch-manipulation min-h-[56px] ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                  : 'text-gray-400 active:bg-gray-800 active:text-cyan-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom"></div>
    </div>
  );
}
