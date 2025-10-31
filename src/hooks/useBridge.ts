import { useState, useCallback } from 'react';
import { type Address } from 'viem';
import { BridgeKit, type ChainIdentifier } from '@circle-fin/bridge-kit';
import { createAdapterFromProvider } from '@circle-fin/adapter-viem-v2';

interface BridgeState {
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
  status: 'idle' | 'bridging' | 'success' | 'error';
}

// Arc Testnet (333333) is NOT supported by Circle CCTP yet
// Only include chains that have CCTP contracts deployed
const CHAIN_ID_TO_NAME: Record<number, ChainIdentifier> = {
  11155111: 'Ethereum_Sepolia' as ChainIdentifier,
  421614: 'Arbitrum_Sepolia' as ChainIdentifier,
  84532: 'Base_Sepolia' as ChainIdentifier,
  11155420: 'Optimism_Sepolia' as ChainIdentifier,
  80002: 'Polygon_Amoy' as ChainIdentifier,
  43113: 'Avalanche_Fuji' as ChainIdentifier,
};

export function useBridge() {
  const [state, setState] = useState<BridgeState>({
    isLoading: false,
    error: null,
    txHash: null,
    status: 'idle',
  });

  const bridgeTokens = useCallback(
    async (
      fromChainId: number,
      toChainId: number,
      amount: string,
      tokenAddress: Address
    ) => {
      setState({ isLoading: true, error: null, txHash: null, status: 'bridging' });

      try {
        if (!window.ethereum) {
          throw new Error('Please install MetaMask');
        }

        // Ensure we're on the source chain first
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
        const currentChainIdNum = parseInt(currentChainId, 16);

        if (currentChainIdNum !== fromChainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${fromChainId.toString(16)}` }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              throw new Error(`Please add chain ${fromChainId} to MetaMask first`);
            }
            throw switchError;
          }
        }

        const kit = new BridgeKit({
          rpcConfig: {
            timeout: 30000,
            retryAttempts: 5,
            retryDelay: 2000,
          },
          transactionConfig: {
            maxPriorityFeePerGas: '2000000000',
            maxFeePerGas: '100000000000',
          },
        });

        const adapter = await createAdapterFromProvider({
          provider: window.ethereum,
          capabilities: {
            addressContext: 'user-controlled',
          },
          config: {
            pollingInterval: 2000,
            blockConfirmations: 1,
            gasEstimateMultiplier: 1.3,
          },
        });

        const fromChain = CHAIN_ID_TO_NAME[fromChainId];
        const toChain = CHAIN_ID_TO_NAME[toChainId];

        if (!fromChain || !toChain) {
          throw new Error(`Unsupported chain: ${fromChainId} -> ${toChainId}`);
        }

        console.log('Starting bridge:', { fromChain, toChain, amount });

        console.log('Bridge Kit initialized with optimizations:');
        console.log('- Extended timeout: 5 minutes');
        console.log('- Retry attempts: 3x with 5s delay');
        console.log('- Gas multiplier: 1.2x');
        console.log('- RPC retry: 5 attempts');
        console.log('- Priority gas: 2 Gwei');

        const result = await kit.bridge({
          from: { adapter, chain: fromChain },
          to: { adapter, chain: toChain },
          amount: amount,
          token: 'USDC',
          config: {
            transferSpeed: 'FAST',
            timeout: 300000,
            retryCount: 3,
            retryDelay: 5000,
            gasMultiplier: 1.2,
            confirmationTimeout: 180000,
          },
        });

        console.log('Bridge result:', result);

        const burnStep = result.steps.find((s) => s.name === 'depositForBurn');
        const mintStep = result.steps.find((s) => s.name === 'mint');

        setState({
          isLoading: false,
          error: null,
          txHash: burnStep?.txHash || mintStep?.txHash || 'completed',
          status: 'success',
        });
      } catch (err: any) {
        console.error('Bridge error:', err);
        const errorMessage = err?.message || 'Bridge transaction failed';
        setState({
          isLoading: false,
          error: errorMessage,
          txHash: null,
          status: 'error',
        });
        throw err;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      txHash: null,
      status: 'idle',
    });
  }, []);

  return {
    ...state,
    bridgeTokens,
    reset,
  };
}
