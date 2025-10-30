import { useState, useCallback } from 'react';
import { type Address, createWalletClient, custom, parseUnits } from 'viem';
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
          throw new Error('Please install MetaMask');
        }

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        }) as string[];

        if (!accounts || accounts.length === 0) {
          throw new Error('No wallet connected');
        }

        const walletClient = createWalletClient({
          account: accounts[0] as Address,
          transport: custom(window.ethereum),
        });

        const bridgeKit = new BridgeKit({
          signer: walletClient as any,
        });

        const amountInUnits = parseUnits(amount, 6);

        const result = await bridgeKit.bridge({
          amount: amountInUnits.toString(),
          sourceChain: fromChainId,
          destinationChain: toChainId,
          tokenAddress: tokenAddress,
          recipientAddress: accounts[0] as Address,
        });

        setState({
          isLoading: false,
          error: null,
          txHash: result.transactionHash || result.hash || 'pending',
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
