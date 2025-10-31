import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { useNetworkCheck } from '../hooks/useNetworkCheck';

export function NetworkStatusBanner() {
  const { isCorrectNetwork, isConnected, error, switchToArcTestnet } = useNetworkCheck();

  if (!isConnected || isCorrectNetwork) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mb-4 bg-orange-900/30 backdrop-blur-sm border border-orange-500/50 rounded-lg p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="text-orange-300 font-semibold mb-1">Wrong Network Detected</h3>
        <p className="text-orange-200/90 text-sm mb-3">
          {error || 'You need to switch to Arc Testnet to use this app.'}
        </p>
        <button
          onClick={switchToArcTestnet}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm touch-manipulation"
        >
          Switch to Arc Testnet
        </button>
      </div>
    </div>
  );
}

export function NetworkStatusIndicator() {
  const { isCorrectNetwork, isConnected, currentChainId } = useNetworkCheck();

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full border border-gray-700">
        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
        <span className="text-xs text-gray-400">Not Connected</span>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-900/30 rounded-full border border-orange-500/50">
        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
        <span className="text-xs text-orange-300">Wrong Network</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/30 rounded-full border border-green-500/50">
      <div className="w-2 h-2 rounded-full bg-green-500"></div>
      <span className="text-xs text-green-300">Arc Testnet</span>
    </div>
  );
}
