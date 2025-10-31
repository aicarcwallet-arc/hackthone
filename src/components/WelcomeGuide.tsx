import { useState, useEffect } from 'react';
import { X, Wallet, CheckCircle2, ExternalLink, Sparkles, ArrowRight, Copy, Check } from 'lucide-react';

interface WelcomeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectWallet: () => void;
}

export function WelcomeGuide({ isOpen, onClose, onConnectWallet }: WelcomeGuideProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    if (typeof window.ethereum !== 'undefined') {
      setHasMetaMask(true);
      setCurrentStep(2);
    }
  }, []);

  const arcTestnetConfig = {
    chainId: '0x4CF0D2',
    chainName: 'Arc Testnet',
    nativeCurrency: {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
    },
    rpcUrls: ['https://rpc.testnet.arc.network'],
    blockExplorerUrls: ['https://testnet.arcscan.app'],
  };

  const handleAddNetwork = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask first!');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [arcTestnetConfig],
      });
      setCurrentStep(3);
    } catch (error: any) {
      console.error('Error adding network:', error);
      if (error.code === 4001) {
        alert('Please approve the network addition in MetaMask');
      }
    }
  };

  const handleCopyRPC = () => {
    navigator.clipboard.writeText('https://rpc.testnet.arc.network');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectAndClose = () => {
    onConnectWallet();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-[0_0_100px_rgba(34,211,238,0.5)] border-2 border-cyan-500/50 overflow-hidden animate-scaleIn">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all hover:scale-110 border border-cyan-500/30"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>

        <div className="relative z-10 p-6 sm:p-8">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-[0_0_20px_rgba(34,211,238,0.5)] animate-bounce-slow">
              <Sparkles className="w-5 h-5" />
              Welcome to AiC Token!
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent mb-3">
              Let's Get You Started! 🚀
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Your Arc Testnet wallet address will be your <span className="text-cyan-400 font-bold">unique gaming ID</span>
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-110'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-1 mx-1 transition-all ${
                        currentStep > step ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 min-h-[300px]">
            {/* Step 1: Install MetaMask */}
            {currentStep === 1 && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Install MetaMask</h3>
                </div>

                <p className="text-gray-300 mb-6">
                  MetaMask is a crypto wallet that lets you interact with blockchain apps. It's required to play and earn AiC tokens!
                </p>

                {isMobile && (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                      📱 Mobile User?
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Download the MetaMask app, then open this website inside the MetaMask browser!
                    </p>
                    <div className="flex gap-2">
                      <a
                        href="https://apps.apple.com/us/app/metamask/id1438144202"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-xs font-semibold text-center transition-all"
                      >
                        📱 iOS App
                      </a>
                      <a
                        href="https://play.google.com/store/apps/details?id=io.metamask"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-xs font-semibold text-center transition-all"
                      >
                        🤖 Android App
                      </a>
                    </div>
                  </div>
                )}

                <div className="bg-gray-900/50 rounded-xl p-4 mb-6 border border-cyan-500/20">
                  <h4 className="font-semibold text-cyan-400 mb-3">Why MetaMask?</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Secure wallet for your tokens</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Your wallet = Your gaming ID</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Earn real USDC rewards</span>
                    </li>
                  </ul>
                </div>

                {!isMobile ? (
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.8)] transition-all flex items-center justify-center gap-3 group"
                  >
                    <Wallet className="w-6 h-6" />
                    <span>Download MetaMask</span>
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      const dappUrl = window.location.href.replace(/^https?:\/\//, '');
                      window.location.href = `https://metamask.app.link/dapp/${dappUrl}`;
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.8)] transition-all flex items-center justify-center gap-3 group"
                  >
                    <Wallet className="w-6 h-6" />
                    <span>Open in MetaMask App</span>
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                <button
                  onClick={() => {
                    if (typeof window.ethereum !== 'undefined') {
                      setHasMetaMask(true);
                      setCurrentStep(2);
                    } else {
                      alert('MetaMask not detected. Please install it first.');
                    }
                  }}
                  className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  I Already Have MetaMask
                </button>
              </div>
            )}

            {/* Step 2: Add Arc Testnet */}
            {currentStep === 2 && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <img src="/ARAC LOGO.png" alt="Arc" className="w-8 h-8 rounded-full" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Add Arc Testnet Network</h3>
                </div>

                <p className="text-gray-300 mb-6">
                  Arc Testnet is where AiC tokens live! Add this network to MetaMask to start earning.
                </p>

                <div className="bg-gray-900/50 rounded-xl p-4 mb-6 border border-cyan-500/20">
                  <h4 className="font-semibold text-cyan-400 mb-3">Network Details:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">Network Name:</span>
                      <span className="text-white font-mono">Arc Testnet</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">Chain ID:</span>
                      <span className="text-white font-mono">5042002</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">Currency:</span>
                      <span className="text-white font-mono">USDC (6 decimals)</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">RPC URL:</span>
                      <button
                        onClick={handleCopyRPC}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <span className="font-mono text-xs">rpc-testnet.arc.network</span>
                        {copied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddNetwork}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] transition-all flex items-center justify-center gap-3 group mb-3"
                >
                  <span>Add Arc Testnet to MetaMask</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  I Already Added The Network
                </button>
              </div>
            )}

            {/* Step 3: Connect Wallet */}
            {currentStep === 3 && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Connect Your Wallet</h3>
                </div>

                <p className="text-gray-300 mb-6">
                  Almost there! Connect your MetaMask wallet to start your gaming journey on Arc Testnet.
                </p>

                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-6 mb-6 border border-cyan-500/30">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    Important: Your Wallet = Your Gaming ID!
                  </h4>
                  <ul className="space-y-3 text-sm text-gray-200">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Your <strong>Arc wallet address</strong> is your unique player ID</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>All your game progress and tokens are saved to this address</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>You'll earn <strong>AiC tokens</strong> that convert to real <strong>USDC</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Use the <strong>USDC Faucet</strong> to get 100 free USDC every 24h for testing</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleConnectAndClose}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:shadow-[0_0_50px_rgba(34,197,94,0.8)] transition-all flex items-center justify-center gap-3 group animate-pulse-slow"
                >
                  <Wallet className="w-6 h-6" />
                  <span>Connect Wallet & Start Playing!</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Need help?{' '}
              <a
                href="https://docs.arc.network"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                View Arc Docs
              </a>
              {' '}or{' '}
              <button
                onClick={() => (window.location.hash = 'contact')}
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Contact Us
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
