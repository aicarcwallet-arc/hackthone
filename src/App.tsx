import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { BridgeInterface } from './components/BridgeInterface';
import { SwapInterface } from './components/SwapInterface';
import { AICSwapInterface } from './components/AICSwapInterface';
import { VocabularyGame } from './components/VocabularyGame';
import { TransactionHistory } from './components/TransactionHistory';
import { WalletDashboard } from './components/WalletDashboard';
import { Repeat, Send, Trophy, History } from 'lucide-react';
import { supabase } from './lib/supabase';

type Tab = 'game' | 'bridge' | 'swap' | 'history';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('game');
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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

  console.log('Rendering App, connectedAddress:', connectedAddress);

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Floating USDC icons */}
      <div className="absolute top-20 left-10 w-16 h-16 opacity-10 animate-float">
        <div className="text-4xl">💵</div>
      </div>
      <div className="absolute top-60 right-20 w-24 h-24 opacity-15 animate-float-delayed">
        <div className="text-6xl">💵</div>
      </div>
      <div className="absolute bottom-40 left-1/4 w-12 h-12 opacity-10 animate-float-slow">
        <div className="text-3xl">💵</div>
      </div>

      {/* Floating Arc/Chain icons */}
      <div className="absolute top-40 right-10 w-20 h-20 opacity-10 animate-float-delayed">
        <div className="text-5xl">⛓️</div>
      </div>
      <div className="absolute bottom-60 right-1/4 w-16 h-16 opacity-15 animate-float">
        <div className="text-4xl">⛓️</div>
      </div>
      <div className="absolute top-1/3 left-20 w-14 h-14 opacity-10 animate-float-slow">
        <div className="text-3xl">⛓️</div>
      </div>

      {/* Floating AiC logo icons */}
      <div className="absolute top-32 right-1/3 w-20 h-20 opacity-10 animate-float">
        <img src="/aic toekn .png" alt="" className="w-full h-full" />
      </div>
      <div className="absolute bottom-32 left-1/3 w-28 h-28 opacity-15 animate-float-delayed">
        <img src="/aic toekn .png" alt="" className="w-full h-full" />
      </div>
      <div className="absolute top-1/2 right-16 w-16 h-16 opacity-10 animate-float-slow">
        <img src="/aic toekn .png" alt="" className="w-full h-full" />
      </div>
      <div className="absolute bottom-20 right-1/2 w-12 h-12 opacity-10 animate-float">
        <img src="/aic toekn .png" alt="" className="w-full h-full" />
      </div>
      <div className="w-full max-w-6xl pb-safe">
        <div className="text-center mb-4 sm:mb-8 px-2">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-xs sm:text-sm font-semibold mb-3">
            <span className="animate-pulse">🔥</span>
            LIVE ON ARC TESTNET
            <span className="animate-pulse">🔥</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3">
            AIC Token Game
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            Type hackathon words • Earn AIC tokens • Bridge to any chain
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Powered by Circle Bridge Kit • Arc Layer 1 • Native USDC Gas
          </p>
        </div>

        {!connectedAddress && (
          <div className="flex justify-center mb-4 sm:mb-6 px-4">
            <button
              onClick={handleConnectWallet}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors touch-manipulation"
            >
              Connect Wallet to Start
            </button>
          </div>
        )}

        {connectedAddress && (
          <>
            <WalletDashboard walletAddress={connectedAddress} userId={userId} />

            <div className="flex justify-center mb-4 sm:mb-6 px-2">
              <div className="inline-flex bg-white rounded-lg shadow-md p-1 overflow-x-auto max-w-full">
                <button
                  onClick={() => {
                    console.log('Game tab clicked');
                    setActiveTab('game');
                  }}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium text-sm transition-all touch-manipulation whitespace-nowrap ${
                    activeTab === 'game'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
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
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
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
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                  <span>Swap</span>
                </button>
                <button
                  onClick={() => {
                    console.log('History tab clicked');
                    setActiveTab('history');
                  }}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium text-sm transition-all touch-manipulation whitespace-nowrap ${
                    activeTab === 'history'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                  <span className="sm:hidden">Txs</span>
                </button>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-center">
          {activeTab === 'game' && <VocabularyGame userId={userId} walletAddress={connectedAddress} />}
          {activeTab === 'bridge' && <BridgeInterface />}
          {activeTab === 'swap' && (
            <div className="space-y-6">
              <AICSwapInterface walletAddress={connectedAddress || undefined} />
              <div className="text-center text-sm text-gray-500">
                Or use other tokens:
              </div>
              <SwapInterface />
            </div>
          )}
          {activeTab === 'history' && <TransactionHistory userId={userId} />}
        </div>

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
