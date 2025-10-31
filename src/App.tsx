import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { BridgeInterface } from './components/BridgeInterface';
import { SwapInterface } from './components/SwapInterface';
import { AICSwapInterface } from './components/AICSwapInterface';
import { BurnPegInterface } from './components/BurnPegInterface';
import { USDCWithdraw } from './components/USDCWithdraw';
import { VocabularyGame } from './components/VocabularyGame';
import { TransactionAccelerator } from './components/TransactionAccelerator';
import { TransactionHistory } from './components/TransactionHistory';
import { WalletDashboard } from './components/WalletDashboard';
import { InstallPrompt } from './components/InstallPrompt';
import { NetworkStatusBanner } from './components/NetworkStatusBanner';
import { VirtualCard } from './components/VirtualCard';
import { CircleBanking } from './components/CircleBanking';
import { useAICToken } from './hooks/useAICToken';
import { Repeat, Send, Trophy, History, Flame, Zap, CreditCard, Building2 } from 'lucide-react';
import { supabase } from './lib/supabase';

type Tab = 'game' | 'bridge' | 'swap' | 'burn' | 'history' | 'accelerator' | 'card' | 'banking';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('game');
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { usdcBalance } = useAICToken(connectedAddress || undefined);

  useEffect(() => {
    console.log('App mounted!');
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts && accounts.length > 0) {
          setConnectedAddress(accounts[0]);
          await getOrCreateUser(accounts[0]);
        }
      } catch (err) {
        console.error('Failed to check wallet:', err);
      }
    }
  };

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      if (accounts && accounts.length > 0) {
        setConnectedAddress(accounts[0]);
        await getOrCreateUser(accounts[0]);
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      alert(err.message || 'Failed to connect wallet');
    }
  };

  const getOrCreateUser = async (walletAddress: string) => {
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingUser) {
        setUserId(existingUser.id);
        return;
      }

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({ wallet_address: walletAddress.toLowerCase() })
        .select()
        .maybeSingle();

      if (insertError) {
        if (insertError.code === '23505') {
          const { data: retryUser } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', walletAddress.toLowerCase())
            .maybeSingle();

          if (retryUser) {
            setUserId(retryUser.id);
            return;
          }
        }
        throw insertError;
      }

      if (newUser) {
        setUserId(newUser.id);
      }
    } catch (err: any) {
      console.error('Failed to get/create user:', err);
    }
  };

  const handleDisconnect = () => {
    console.log('Disconnecting wallet...');
    setConnectedAddress(null);
    setUserId(null);
    setActiveTab('game');
  };

  console.log('Rendering App, connectedAddress:', connectedAddress);

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Floating Circle Logo icons */}
      <div className="absolute top-20 left-10 w-12 h-12 opacity-5 animate-float">
        <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute top-1/3 right-20 w-20 h-20 opacity-8 animate-float-delayed">
        <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-40 left-1/4 w-10 h-10 opacity-6 animate-float-slow">
        <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="" className="w-full h-full object-contain" />
      </div>

      {/* Floating USDC icons */}
      <div className="absolute top-40 right-10 w-16 h-16 opacity-7 animate-float-delayed">
        <img src="/usdc-3d-icon-download-in-png-blend-fbx-gltf-file-formats--bitcoin-logo-coin-cryptocurrency-symbol-crypto-coins-vol2-pack-science-technology-icons-7947905.webp" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-60 right-1/4 w-14 h-14 opacity-6 animate-float">
        <img src="/usdc-3d-icon-download-in-png-blend-fbx-gltf-file-formats--bitcoin-logo-coin-cryptocurrency-symbol-crypto-coins-vol2-pack-science-technology-icons-7947905.webp" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute top-1/2 left-20 w-18 h-18 opacity-8 animate-float-slow">
        <img src="/usdc-3d-icon-download-in-png-blend-fbx-gltf-file-formats--bitcoin-logo-coin-cryptocurrency-symbol-crypto-coins-vol2-pack-science-technology-icons-7947905.webp" alt="" className="w-full h-full object-contain" />
      </div>

      {/* Floating Arc Logo icons */}
      <div className="absolute top-32 right-1/3 w-10 h-10 opacity-[0.03] animate-float">
        <img src="/ARAC LOGO.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-32 left-1/3 w-12 h-12 opacity-[0.04] animate-float-delayed">
        <img src="/ARAC LOGO.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute top-2/3 right-16 w-10 h-10 opacity-[0.03] animate-float-slow">
        <img src="/ARAC LOGO.png" alt="" className="w-full h-full object-contain" />
      </div>

      {/* Floating AiC Token icons */}
      <div className="absolute top-1/4 left-1/3 w-10 h-10 opacity-[0.03] animate-float">
        <img src="/aic toekn  copy.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-20 right-1/2 w-12 h-12 opacity-[0.04] animate-float-delayed">
        <img src="/aic toekn  copy.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute top-1/2 left-10 w-10 h-10 opacity-[0.03] animate-float-slow">
        <img src="/aic toekn  copy.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-1/3 right-20 w-8 h-8 opacity-[0.02] animate-float">
        <img src="/aic toekn  copy.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="w-full max-w-6xl pb-safe">
        <div className="text-center mb-4 sm:mb-8 px-2">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-xs sm:text-sm font-semibold mb-3 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <span className="animate-pulse">🔥</span>
            LIVE ON ARC TESTNET
            <span className="animate-pulse">🔥</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
            AI Cognitive Token (AiC)
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-medium">
            Learn Blockchain Terms • Earn USDC Rewards • Powered by AI
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            OpenAI Validation • Circle Arc L1 • Programmable USDC
          </p>
        </div>

        {!connectedAddress && (
          <div className="flex justify-center mb-4 sm:mb-6 px-4">
            <button
              onClick={() => {
                console.log('Connect Wallet button clicked');
                handleConnectWallet();
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] touch-manipulation z-50 relative"
            >
              Connect Wallet to Start
            </button>
          </div>
        )}

        {connectedAddress && (
          <>
            <div className="flex flex-col items-center w-full">
              <NetworkStatusBanner />
            </div>

            <WalletDashboard
              key={`wallet-${connectedAddress}-${activeTab}`}
              walletAddress={connectedAddress}
              userId={userId}
              onDisconnect={handleDisconnect}
            />

            <div className="flex justify-center mb-4 sm:mb-6 px-2">
              <div className="inline-flex bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-1 overflow-x-auto max-w-full scrollbar-hide">
                <button
                  onClick={() => {
                    console.log('Game tab clicked');
                    setActiveTab('game');
                  }}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium text-sm transition-all touch-manipulation whitespace-nowrap ${
                    activeTab === 'game'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                      : 'text-gray-300 hover:bg-cyan-500/20'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span className="hidden sm:inline">Play Game</span>
                  <span className="sm:hidden">Play</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Bridge tab clicked');
                    setActiveTab('bridge');
                  }}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium text-sm transition-all touch-manipulation whitespace-nowrap ${
                    activeTab === 'bridge'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                      : 'text-gray-300 hover:bg-cyan-500/20'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Bridge</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Swap tab clicked');
                    setActiveTab('swap');
                  }}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium text-sm transition-all touch-manipulation whitespace-nowrap ${
                    activeTab === 'swap'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                      : 'text-gray-300 hover:bg-cyan-500/20'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                  <span>Swap</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Burn tab clicked');
                    setActiveTab('burn');
                  }}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium text-sm transition-all touch-manipulation whitespace-nowrap ${
                    activeTab === 'burn'
                      ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                      : 'text-gray-300 hover:bg-red-500/20'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  <span>Burn</span>
                </button>
                <button
                  onClick={() => {
                    console.log('History tab clicked');
                    setActiveTab('history');
                  }}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium text-sm transition-all touch-manipulation whitespace-nowrap ${
                    activeTab === 'history'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                      : 'text-gray-300 hover:bg-cyan-500/20'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                  <span className="sm:hidden">Txs</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Accelerator tab clicked');
                    setActiveTab('accelerator');
                  }}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium text-sm transition-all touch-manipulation whitespace-nowrap ${
                    activeTab === 'accelerator'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-[0_0_20px_rgba(250,204,21,0.5)]'
                      : 'text-gray-300 hover:bg-yellow-500/20'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Accelerator</span>
                  <span className="sm:hidden">⚡</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Card tab clicked');
                    setActiveTab('card');
                  }}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium text-sm transition-all touch-manipulation whitespace-nowrap ${
                    activeTab === 'card'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                      : 'text-gray-300 hover:bg-cyan-500/20'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="hidden sm:inline">Virtual Card</span>
                  <span className="sm:hidden">💳</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Banking tab clicked');
                    setActiveTab('banking');
                  }}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium text-sm transition-all touch-manipulation whitespace-nowrap ${
                    activeTab === 'banking'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                      : 'text-gray-300 hover:bg-blue-500/20'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Banking</span>
                  <span className="sm:hidden">🏦</span>
                </button>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-center">
          {activeTab === 'game' && <VocabularyGame key={`game-${connectedAddress}`} userId={userId} walletAddress={connectedAddress} onGoBack={() => setActiveTab('game')} />}
          {activeTab === 'bridge' && <BridgeInterface />}
          {activeTab === 'card' && <VirtualCard walletAddress={connectedAddress || undefined} usdcBalance={usdcBalance} />}
          {activeTab === 'banking' && <CircleBanking walletAddress={connectedAddress || undefined} usdcBalance={usdcBalance} />}
          {activeTab === 'swap' && (
            <div className="space-y-6 w-full max-w-4xl">
              <AICSwapInterface key={`swap-${connectedAddress}-${activeTab}-${refreshKey}`} walletAddress={connectedAddress || undefined} />

              {parseFloat(usdcBalance) > 0 && connectedAddress && (
                <div className="pt-6">
                  <h3 className="text-center text-lg font-semibold text-white mb-4">
                    💸 Send USDC from Your Wallet
                  </h3>
                  <USDCWithdraw
                    walletAddress={connectedAddress}
                    usdcBalance={usdcBalance}
                    onSuccess={() => setRefreshKey(prev => prev + 1)}
                  />
                </div>
              )}
            </div>
          )}
          {activeTab === 'burn' && <BurnPegInterface walletAddress={connectedAddress || undefined} />}
          {activeTab === 'history' && <TransactionHistory userId={userId} />}
          {activeTab === 'accelerator' && <TransactionAccelerator />}
        </div>

        <InstallPrompt />

        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-sm text-gray-600">
              Sub-second finality on Arc with deterministic settlement
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-sm text-gray-600">
              Built on Circle's proven CCTP infrastructure with cryptographic security
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Low Cost</h3>
            <p className="text-sm text-gray-600">
              USDC as native gas on Arc with predictable, minimal fees
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by{' '}
            <a
              href="https://developers.circle.com/bridge-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Circle Bridge Kit
            </a>
            {' '}&middot;{' '}
            <a
              href="https://www.circle.com/en/arc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Arc Testnet
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
