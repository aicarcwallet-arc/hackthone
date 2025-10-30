import { useState, useCallback } from 'react';
import { type Address } from 'viem';
import { BridgeKit } from '@circle-fin/bridge-kit';
import { createAdapterFromProvider } from '@circle-fin/adapter-viem-v2';

interface BridgeState {
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
  status: 'idle' | 'bridging' | 'success' | 'error';
}

const CHAIN_ID_TO_NAME: Record<number, string> = {
  333333: 'Arc_Testnet',
  11155111: 'Ethereum_Sepolia',
  421614: 'Arbitrum_Sepolia',
  84532: 'Base_Sepolia',
  11155420: 'Optimism_Sepolia',
  80002: 'Polygon_Amoy',
  43113: 'Avalanche_Fuji',
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

        const kit = new BridgeKit();

        const adapter = await createAdapterFromProvider({
          provider: window.ethereum,
          capabilities: {
            addressContext: 'user-controlled',
          },
        });

        const fromChain = CHAIN_ID_TO_NAME[fromChainId];
        const toChain = CHAIN_ID_TO_NAME[toChainId];

        if (!fromChain || !toChain) {
          throw new Error(`Unsupported chain: ${fromChainId} -> ${toChainId}`);
        }

        const result = await kit.bridge({
          from: { adapter, chain: fromChain },
          to: { adapter, chain: toChain },
          amount: amount,
          token: 'USDC',
          config: { transferSpeed: 'FAST' },
        });

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
