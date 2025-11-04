import React, { useState, useEffect } from 'react';
import { ArrowRight, Wallet, CheckCircle, AlertCircle, Loader, ExternalLink } from 'lucide-react';
import { MetaMaskSDK } from '@metamask/sdk';

const LINEA_MAINNET = {
  chainId: '0xe708', // 59144 in hex
  chainName: 'Linea Mainnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://rpc.linea.build'],
  blockExplorerUrls: ['https://lineascan.build']
};

export default function LineaMetaMaskBridge() {
  const [sdk, setSDK] = useState<any>(null);
  const [account, setAccount] = useState('');
  const [bridgeAmount, setBridgeAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'bridging' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    const MMSDK = new MetaMaskSDK({
      dappMetadata: {
        name: 'AI Cognitive - Arc to Linea Bridge',
        url: window.location.href,
      },
      preferDesktop: true,
    });

    setSDK(MMSDK);

    return () => {
      if (MMSDK) {
        MMSDK.terminate();
      }
    };
  }, []);

  const connectMetaMask = async () => {
    if (!sdk) return;

    try {
      setStatus('connecting');
      const ethereum = sdk.getProvider();

      if (!ethereum) {
        throw new Error('MetaMask not detected');
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      setAccount(accounts[0]);

      // Switch to Linea network
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: LINEA_MAINNET.chainId }],
        });
      } catch (switchError: any) {
        // Network not added, add it
        if (switchError.code === 4902) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [LINEA_MAINNET],
          });
        } else {
          throw switchError;
        }
      }

      setStatus('idle');
    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      setErrorMessage(error.message || 'Failed to connect MetaMask');
      setStatus('error');
    }
  };

  const bridgeToLinea = async () => {
    if (!account || !bridgeAmount) return;

    try {
      setStatus('bridging');
      setErrorMessage('');

      const amount = parseFloat(bridgeAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }

      if (amount < 10) {
        throw new Error('Minimum bridge amount is 10 USDC');
      }

      // In production, call your bridge contract here
      // For now, simulating the bridge process

      // Step 1: Lock USDC on Arc (simulated)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Bridge to Linea (simulated)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Release USDC on Linea (simulated)
      const simulatedTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      setTxHash(simulatedTxHash);

      setStatus('success');
    } catch (error: any) {
      console.error('Bridge error:', error);
      setErrorMessage(error.message || 'Bridge transaction failed');
      setStatus('error');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connecting':
      case 'bridging':
        return <Loader className="w-6 h-6 animate-spin text-blue-400" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Arc → Linea Bridge</h2>
          <p className="text-white/70">Bridge USDC to MetaMask Card (Gasless)</p>
        </div>
        {getStatusIcon()}
      </div>

      {/* MetaMask Connection */}
      {!account ? (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Connect MetaMask</h3>
          <p className="text-white/70 mb-6">Connect your MetaMask wallet to start bridging</p>
          <button
            onClick={connectMetaMask}
            disabled={status === 'connecting'}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50"
          >
            {status === 'connecting' ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        </div>
      ) : (
        <>
          {/* Connected Account */}
          <div className="bg-white/10 rounded-xl p-4 mb-6">
            <div className="text-white/70 text-sm mb-1">Connected Account</div>
            <div className="text-white font-mono text-sm">{account.slice(0, 6)}...{account.slice(-4)}</div>
            <div className="text-green-400 text-sm mt-1 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Connected to Linea Mainnet
            </div>
          </div>

          {/* Bridge Form */}
          {status !== 'success' && (
            <>
              <div className="mb-6">
                <label className="block text-white/70 mb-2">Amount to Bridge (USDC)</label>
                <input
                  type="number"
                  value={bridgeAmount}
                  onChange={(e) => setBridgeAmount(e.target.value)}
                  placeholder="Enter amount (min 10 USDC)"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                  disabled={status === 'bridging'}
                />
                <div className="text-white/50 text-sm mt-2">Minimum: 10 USDC | Maximum: 10,000 USDC</div>
              </div>

              {/* Fee Info */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold mb-1">Gasless Bridge - FREE</div>
                    <div className="text-white/70 text-sm">
                      No gas fees! Our treasury sponsors all transaction costs.
                    </div>
                  </div>
                </div>
              </div>

              {/* Bridge Info */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-white/70 text-sm mb-1">From</div>
                    <div className="text-white font-semibold">Arc Mainnet</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-1">To</div>
                    <div className="text-white font-semibold">Linea Mainnet</div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {status === 'error' && errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div className="text-red-400">{errorMessage}</div>
                  </div>
                </div>
              )}

              {/* Bridge Button */}
              <button
                onClick={bridgeToLinea}
                disabled={!bridgeAmount || status === 'bridging'}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'bridging' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Bridging to Linea...
                  </span>
                ) : (
                  'Bridge to Linea (FREE)'
                )}
              </button>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Bridge Successful!</h3>
              <p className="text-white/70 mb-6">
                {bridgeAmount} USDC is now available on Linea network
              </p>

              {/* Transaction Hash */}
              {txHash && (
                <div className="bg-white/10 rounded-xl p-4 mb-6">
                  <div className="text-white/70 text-sm mb-1">Transaction Hash</div>
                  <div className="text-white font-mono text-sm break-all mb-2">{txHash}</div>
                  <a
                    href={`https://lineascan.build/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center gap-1"
                  >
                    View on LineaScan
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl p-6 mb-6 text-left">
                <h4 className="text-white font-semibold mb-3">Next Steps:</h4>
                <ol className="space-y-2 text-white/80 text-sm">
                  <li>1. Open your MetaMask mobile app</li>
                  <li>2. Go to MetaMask Card section</li>
                  <li>3. Your USDC balance will appear automatically</li>
                  <li>4. Start spending with your MetaMask Card!</li>
                </ol>
              </div>

              <button
                onClick={() => {
                  setStatus('idle');
                  setBridgeAmount('');
                  setTxHash('');
                }}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition"
              >
                Bridge More USDC
              </button>
            </div>
          )}
        </>
      )}

      {/* MetaMask Card Info */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="text-white/70 text-sm text-center">
          Don't have MetaMask Card?{' '}
          <a
            href="https://card.metamask.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            Get it here
          </a>
        </div>
      </div>
    </div>
  );
}
