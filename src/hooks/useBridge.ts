import { useState, useCallback } from 'react';
import { createPublicClient, createWalletClient, custom, http, type Address } from 'viem';
import { BridgeKit } from '@circle-fin/bridge-kit';

interface BridgeState {
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
  status: 'idle' | 'bridging' | 'success' | 'error';
}

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
          throw new Error('Please install MetaMask or another Web3 wallet');
        }

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        }) as Address[];

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found. Please connect your wallet.');
        }

        const walletClient = createWalletClient({
          account: accounts[0],
          chain: {
            id: fromChainId,
            name: 'Source Chain',
          } as any,
          transport: custom(window.ethereum),
        });

        const publicClient = createPublicClient({
          chain: {
            id: fromChainId,
            name: 'Source Chain',
          } as any,
          transport: http(),
        });

        const bridgeKit = new BridgeKit({
          apiKey: import.meta.env.VITE_CIRCLE_API_KEY,
        } as any);

        const amountInSmallestUnit = BigInt(Math.floor(parseFloat(amount) * 1_000_000));

        const result = await (bridgeKit as any).bridge({
          sourceChainId: fromChainId.toString(),
          destinationChainId: toChainId.toString(),
          amount: amountInSmallestUnit.toString(),
          token: 'USDC',
          destinationAddress: accounts[0],
        });

        const txHash = typeof result === 'string' ? result : (result as any)?.txHash || 'bridge-initiated';

        setState({
          isLoading: false,
          error: null,
          txHash,
          status: 'success',
        });

        return txHash;
      } catch (err: any) {
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
