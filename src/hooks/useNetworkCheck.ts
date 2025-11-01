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
    console.log('switchToArcTestnet called');

    if (!window.ethereum) {
      console.error('MetaMask not found');
      throw new Error('MetaMask not installed');
    }

    const targetChainId = `0x${ARC_TESTNET_CHAIN_ID.toString(16)}`;
    console.log('Attempting to switch to chain ID:', targetChainId, `(${ARC_TESTNET_CHAIN_ID})`);

    try {
      console.log('Calling wallet_switchEthereumChain...');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
      console.log('Successfully switched to Arc Testnet');
      await checkNetwork();
      return true;
    } catch (switchError: any) {
      console.error('Switch error:', switchError);

      if (switchError.code === 4902) {
        console.log('Chain not found, attempting to add it...');
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: targetChainId,
                chainName: 'Arc Testnet',
                nativeCurrency: {
                  name: 'USDC',
                  symbol: 'USDC',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.testnet.arc.network'],
                blockExplorerUrls: ['https://testnet.arcscan.app'],
              },
            ],
          });
          console.log('Successfully added Arc Testnet');
          await checkNetwork();
          return true;
        } catch (addError) {
          console.error('Add error:', addError);
          throw new Error('Failed to add Arc Testnet to MetaMask');
        }
      }

      if (switchError.code === 4001) {
        throw new Error('User rejected the network switch');
      }

      throw new Error(switchError.message || 'Failed to switch to Arc Testnet');
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
