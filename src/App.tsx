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
import { GasFaucetBanner } from './components/GasFaucetBanner';
import { VirtualCard } from './components/VirtualCard';
import { CircleBanking } from './components/CircleBanking';
import { NavigationHeader } from './components/NavigationHeader';
import { HowItWorks } from './components/HowItWorks';
import { WithdrawPage } from './components/WithdrawPage';
import { Footer } from './components/Footer';
import { useAICToken } from './hooks/useAICToken';
import { Repeat, Send, Trophy, History, Flame, Zap, CreditCard, Building2 } from 'lucide-react';
import { supabase } from './lib/supabase';

type Tab = 'game' | 'bridge' | 'swap' | 'burn' | 'history' | 'accelerator' | 'card' | 'banking';
type Page = 'home' | 'play' | 'swap' | 'withdraw' | 'how';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
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
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Check if MetaMask is NOT installed
    if (!window.ethereum) {
      if (isMobile) {
        // Mobile: Open in MetaMask app
        const dappUrl = window.location.href.replace(/^https?:\/\//, '');
        const metamaskAppDeepLink = `https://metamask.app.link/dapp/${dappUrl}`;
        alert('📱 MetaMask Required\n\n1. Install MetaMask mobile app\n2. Open this website in MetaMask browser\n3. Approve Arc Testnet network when prompted\n\nRedirecting you now...');
        window.location.href = metamaskAppDeepLink;
      } else {
        // Desktop: Show detailed install prompt
        const shouldInstall = confirm(
          '🦊 MetaMask Extension Required\n\n' +
          'Please follow these steps:\n' +
          '1. Click OK to open MetaMask installation page\n' +
          '2. Install MetaMask extension\n' +
          '3. Create or import your wallet\n' +
          '4. Return here and connect again\n' +
          '5. You\'ll be prompted to add Arc Testnet\n\n' +
          'Ready to install MetaMask?'
        );

        if (shouldInstall) {
          window.open('https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');
        }
      }
      return;
    }

    // MetaMask is installed - proceed with connection

    try {
      // First, request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      if (accounts && accounts.length > 0) {
        // Immediately try to switch to Arc Testnet
        const chainIdHex = '0x4CEF52';
        const arcNetworkConfig = {
          chainId: '0x4CEF52',
          chainName: 'Arc Testnet',
          nativeCurrency: {
            name: 'USDC',
            symbol: 'USDC',
            decimals: 18
          },
          rpcUrls: ['https://rpc.testnet.arc.network'],
          blockExplorerUrls: ['https://testnet.arcscan.app']
        };

        try {
          // Try switching to Arc Testnet first
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }],
          });
          // If successful, set user and create account
          setConnectedAddress(accounts[0]);
          await getOrCreateUser(accounts[0]);
        } catch (switchError: any) {
          // If network doesn't exist (error 4902), add it
          if (switchError.code === 4902) {
            try {
              // Show network info before adding
              alert(
                '🌐 Adding Arc Testnet to MetaMask\n\n' +
                'Network Details:\n' +
                '• Name: Arc Testnet\n' +
                '• Chain ID: 5042002 (0x4CEF52)\n' +
                '• RPC: https://rpc.testnet.arc.network\n' +
                '• Symbol: USDC (18 decimals)\n' +
                '• Explorer: https://testnet.arcscan.app\n\n' +
                'Click "Approve" in MetaMask popup to continue.\n\n' +
                '💰 Get Free USDC Gas:\n' +
                'Visit https://faucet.arc.network for testnet USDC\n\n' +
                '🪙 AiC Token Contract:\n' +
                '0x4B71cD610AfCCDf0B02d566dA0071C74444a8666\n' +
                'Add to MetaMask to track your AiC balance!'
              );

              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [arcNetworkConfig]
              });

              // After adding network, set user
              setConnectedAddress(accounts[0]);
              await getOrCreateUser(accounts[0]);

              // Success message with next steps
              alert(
                '✅ Arc Testnet Added Successfully!\n\n' +
                'Next Steps:\n' +
                '1. Get free USDC for gas from faucet.arc.network\n' +
                '2. Add AiC Token (0x4B71cD610AfCCDf0B02d566dA0071C74444a8666)\n' +
                '3. Start playing to earn AiC tokens!\n' +
                '4. View all transactions on testnet.arcscan.app'
              );
            } catch (addError: any) {
              console.error('Failed to add Arc Testnet:', addError);
              if (addError.code === 4001) {
                if (isMobile) {
                  alert(
                    '❌ Arc Testnet Setup Cancelled\n\n' +
                    'You need to approve Arc Testnet to use this app.\n\n' +
                    'Try again and approve the network in MetaMask.'
                  );
                } else {
                  alert(
                    '❌ Arc Testnet Setup Cancelled\n\n' +
                    'Arc Testnet network is required to:\n' +
                    '• Play the vocabulary game\n' +
                    '• Earn AiC tokens\n' +
                    '• Swap AiC for USDC\n\n' +
                    'Please connect again and approve the network.'
                  );
                }
              }
            }
          } else if (switchError.code === 4001) {
            // User rejected the network switch
            if (isMobile) {
              alert(
                '⚠️ Network Switch Required\n\n' +
                'Please switch to Arc Testnet in MetaMask to continue.'
              );
            } else {
              alert(
                '⚠️ Network Switch Required\n\n' +
                'You must be on Arc Testnet to use this app.\n\n' +
                'In MetaMask:\n' +
                '1. Click network dropdown\n' +
                '2. Select "Arc Testnet"\n' +
                '3. Refresh this page'
              );
            }
          } else {
            // Still set the address even if network switch failed
            setConnectedAddress(accounts[0]);
            await getOrCreateUser(accounts[0]);
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      if (err.code === 4001) {
        alert('⚠️ Please connect your wallet to continue');
      }
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

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page === 'play') setActiveTab('game');
    if (page === 'swap') setActiveTab('swap');
  };

  console.log('Rendering App, connectedAddress:', connectedAddress);

  if (currentPage === 'home') {
    return (
      <>
        <NavigationHeader
          currentPage={currentPage}
          onNavigate={handleNavigate}
          walletAddress={connectedAddress || undefined}
          onConnectWallet={handleConnectWallet}
        />
        <LandingPage onGetStarted={() => setCurrentPage('play')} />
      </>
    );
  }

  if (currentPage === 'how') {
    return (
      <>
        <NavigationHeader
          currentPage={currentPage}
          onNavigate={handleNavigate}
          walletAddress={connectedAddress || undefined}
          onConnectWallet={handleConnectWallet}
        />
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <HowItWorks />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (currentPage === 'withdraw') {
    return (
      <>
        <NavigationHeader
          currentPage={currentPage}
          onNavigate={handleNavigate}
          walletAddress={connectedAddress || undefined}
          onConnectWallet={handleConnectWallet}
        />
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            {!connectedAddress ? (
              <div className="text-center max-w-md mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
                <p className="text-gray-300 mb-6">Please connect your wallet to access withdrawal options</p>
                <button
                  onClick={handleConnectWallet}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all"
                >
                  Connect Wallet
                </button>
              </div>
              </div>
            ) : (
              <WithdrawPage walletAddress={connectedAddress} usdcBalance={usdcBalance} />
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
    <NavigationHeader
      currentPage={currentPage}
      onNavigate={handleNavigate}
      walletAddress={connectedAddress || undefined}
      onConnectWallet={handleConnectWallet}
    />
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden py-8">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-xs sm:text-sm font-semibold mb-3 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <span className="animate-pulse">🔥</span>
            LIVE ON ARC TESTNET
            <span className="animate-pulse">🔥</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
            AI Cognitive Token (AiC)
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-medium">
            Learn <span className="text-white font-bold">Blockchain</span> Terms • Earn <span className="text-white font-bold">USDC</span> Rewards • Powered by <span className="text-white font-bold">AI</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            OpenAI Validation • Circle <span className="text-white font-bold">Arc</span> L1 • Programmable <span className="text-white font-bold">USDC</span>
          </p>
        </div>

        {!connectedAddress && (
          <div className="flex justify-center mb-8 sm:mb-12">
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
            <div className="mb-8">
              <NetworkStatusBanner />
            </div>

            <div className="mb-8 flex justify-center">
              <GasFaucetBanner walletAddress={connectedAddress} />
            </div>

            <WalletDashboard
              key={`wallet-${connectedAddress}-${activeTab}`}
              walletAddress={connectedAddress}
              userId={userId}
              onDisconnect={handleDisconnect}
            />

            <div className="flex justify-center mb-8 sm:mb-12">
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

        <div className="w-full">
          {activeTab === 'game' && (
            <div className="max-w-6xl mx-auto">
              <VocabularyGame key={`game-${connectedAddress}`} userId={userId} walletAddress={connectedAddress} onGoBack={() => setActiveTab('game')} />
            </div>
          )}
          {activeTab === 'bridge' && (
            <div className="max-w-5xl mx-auto">
              <BridgeInterface />
            </div>
          )}
          {activeTab === 'card' && (
            <div className="max-w-6xl mx-auto">
              <VirtualCard walletAddress={connectedAddress || undefined} usdcBalance={usdcBalance} />
            </div>
          )}
          {activeTab === 'banking' && (
            <div className="max-w-6xl mx-auto">
              <CircleBanking walletAddress={connectedAddress || undefined} usdcBalance={usdcBalance} />
            </div>
          )}
          {activeTab === 'swap' && (
            <div className="max-w-5xl mx-auto space-y-6">
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
          {activeTab === 'burn' && (
            <div className="max-w-5xl mx-auto">
              <BurnPegInterface walletAddress={connectedAddress || undefined} />
            </div>
          )}
          {activeTab === 'history' && (
            <div className="max-w-6xl mx-auto">
              <TransactionHistory userId={userId} />
            </div>
          )}
          {activeTab === 'accelerator' && (
            <div className="max-w-5xl mx-auto">
              <TransactionAccelerator />
            </div>
          )}
        </div>

        <InstallPrompt />

        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
      <Footer />
    </div>
    </>
  );
}

export default App;
