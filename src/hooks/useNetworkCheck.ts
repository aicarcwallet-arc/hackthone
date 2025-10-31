import { useState, useEffect } from 'react';
import { ARC_TESTNET_CHAIN_ID } from '../config/chains';

interface NetworkStatus {
  isCorrectNetwork: boolean;
  currentChainId: number | null;
  isConnected: boolean;
  error: string | null;
}

export function useNetworkCheck() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isCorrectNetwork: false,
    currentChainId: null,
    isConnected: false,
    error: null,
  });

  const checkNetwork = async () => {
    if (!window.ethereum) {
      setNetworkStatus({
        isCorrectNetwork: false,
        currentChainId: null,
        isConnected: false,
        error: 'MetaMask not installed',
      });
      return;
    }

    try {
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);
      const isCorrect = chainId === ARC_TESTNET_CHAIN_ID;

      setNetworkStatus({
        isCorrectNetwork: isCorrect,
        currentChainId: chainId,
        isConnected: true,
        error: isCorrect ? null : `Wrong network. Please switch to Arc Testnet (Chain ID: ${ARC_TESTNET_CHAIN_ID})`,
      });
    } catch (err) {
      setNetworkStatus({
        isCorrectNetwork: false,
        currentChainId: null,
        isConnected: false,
        error: 'Failed to check network',
      });
    }
  };

  const switchToArcTestnet = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${ARC_TESTNET_CHAIN_ID.toString(16)}` }],
      });
      await checkNetwork();
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${ARC_TESTNET_CHAIN_ID.toString(16)}`,
                chainName: 'Arc Testnet',
                nativeCurrency: {
                  name: 'USDC',
                  symbol: 'USDC',
                  decimals: 6,
                },
                rpcUrls: ['https://rpc.testnet.arc.network'],
                blockExplorerUrls: ['https://testnet.arcscan.app'],
              },
            ],
          });
          await checkNetwork();
          return true;
        } catch (addError) {
          throw new Error('Failed to add Arc Testnet to MetaMask');
        }
      }
      throw new Error('Failed to switch to Arc Testnet');
    }
  };

  useEffect(() => {
    checkNetwork();

    if (window.ethereum) {
      const handleChainChanged = () => {
        checkNetwork();
      };

      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return {
    ...networkStatus,
    checkNetwork,
    switchToArcTestnet,
  };
}
