import { useState, useCallback } from 'react';
import { createPublicClient, http, formatUnits, type Address } from 'viem';
import { getTokenAddress } from '../config/tokens';

interface SwapState {
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
  status: 'idle' | 'swapping' | 'success' | 'error';
}

const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export function useSwap() {
  const [state, setState] = useState<SwapState>({
    isLoading: false,
    error: null,
    txHash: null,
    status: 'idle',
  });

  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({});

  const getBalance = useCallback(
    async (tokenSymbol: string, chainId: number, userAddress: Address) => {
      try {
        const tokenAddress = getTokenAddress(tokenSymbol, chainId);
        if (!tokenAddress) return '0';

        const publicClient = createPublicClient({
          chain: {
            id: chainId,
            name: 'Chain',
          } as any,
          transport: http(),
        });

        const balance = await publicClient.readContract({
          address: tokenAddress as Address,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [userAddress],
        });

        const decimals = await publicClient.readContract({
          address: tokenAddress as Address,
          abi: ERC20_ABI,
          functionName: 'decimals',
        });

        const formattedBalance = formatUnits(balance, decimals);
        setTokenBalances((prev) => ({
          ...prev,
          [`${tokenSymbol}-${chainId}`]: formattedBalance,
        }));

        return formattedBalance;
      } catch (err) {
        console.error('Failed to fetch balance:', err);
        return '0';
      }
    },
    []
  );

  const swapTokens = useCallback(
    async (
      fromToken: string,
      toToken: string,
      _amount: string,
      chainId: number,
      _slippage: number = 0.5
    ) => {
      setState({ isLoading: true, error: null, txHash: null, status: 'swapping' });

      try {
        if (!window.ethereum) {
          throw new Error('Please install MetaMask or another Web3 wallet');
        }

        const accounts = (await window.ethereum.request({
          method: 'eth_requestAccounts',
        })) as Address[];

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found. Please connect your wallet.');
        }

        const fromTokenAddress = getTokenAddress(fromToken, chainId);
        const toTokenAddress = getTokenAddress(toToken, chainId);

        if (!fromTokenAddress || !toTokenAddress) {
          throw new Error('Token not available on this chain');
        }

        setState({
          isLoading: false,
          error: 'Direct swaps require a DEX integration. For now, use bridge to transfer tokens between chains.',
          txHash: null,
          status: 'error',
        });

        return null;
      } catch (err: any) {
        const errorMessage = err?.message || 'Swap transaction failed';
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
    tokenBalances,
    swapTokens,
    getBalance,
    reset,
  };
}
