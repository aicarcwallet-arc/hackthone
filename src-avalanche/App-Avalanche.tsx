import { useState } from 'react';
import { AvalancheLandingPage } from './components/AvalancheLandingPage';

type Page = 'home' | 'dashboard';

function AppAvalanche() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to continue');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];

      if (accounts && accounts.length > 0) {
        const useFuji = import.meta.env.VITE_AVALANCHE_NETWORK === 'fuji';

        const avalancheChainId = useFuji ? '0xa869' : '0xa86a';
        const avalancheConfig = {
          chainId: useFuji ? '0xa869' : '0xa86a',
          chainName: useFuji ? 'Avalanche Fuji Testnet' : 'Avalanche C-Chain',
          nativeCurrency: {
            name: 'AVAX',
            symbol: 'AVAX',
            decimals: 18
          },
          rpcUrls: [useFuji ? 'https://api.avax-test.network/ext/bc/C/rpc' : 'https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: [useFuji ? 'https://testnet.snowtrace.io/' : 'https://snowtrace.io/']
        };

        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: avalancheChainId }],
          });

          setConnectedAddress(accounts[0]);
          setCurrentPage('dashboard');
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [avalancheConfig]
              });

              setConnectedAddress(accounts[0]);
              setCurrentPage('dashboard');
            } catch (addError) {
              console.error('Failed to add Avalanche network:', addError);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  if (currentPage === 'home') {
    return <AvalancheLandingPage onGetStarted={handleConnectWallet} />;
  }

  return (
    <div className="min-h-screen bg-white font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-avax-gray-200">
          <h2 className="text-3xl font-bold text-avax-black mb-4">
            Mining Dashboard
          </h2>
          <p className="text-avax-gray-600 mb-6">
            Connected: {connectedAddress?.slice(0, 6)}...{connectedAddress?.slice(-4)}
          </p>

          <div className="bg-avax-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-avax-black mb-3">
              Your Mining Contract
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-avax-gray-600">Total Allocated:</span>
                <span className="font-semibold text-avax-black">100,000 AIC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-avax-gray-600">Mined:</span>
                <span className="font-semibold text-avax-black">0 AIC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-avax-gray-600">Available:</span>
                <span className="font-semibold text-avax-red">0 AIC</span>
              </div>
            </div>
          </div>

          <div className="text-center py-8">
            <p className="text-avax-gray-600 mb-4">
              Mining interface coming soon!
            </p>
            <p className="text-sm text-avax-gray-500">
              This is the Avalanche-themed build. Complete mining features will be integrated next.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentPage('home');
              setConnectedAddress(null);
            }}
            className="w-full bg-avax-gray-100 text-avax-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-avax-gray-200 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppAvalanche;
