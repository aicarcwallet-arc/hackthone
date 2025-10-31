import { useState, useCallback } from 'react';
import { createPublicClient, createWalletClient, custom, http, parseGwei, type Hash, type TransactionReceipt } from 'viem';
import { SUPPORTED_CHAINS } from '../config/chains';

interface AcceleratorState {
  isLoading: boolean;
  error: string | null;
  status: 'idle' | 'analyzing' | 'accelerating' | 'success' | 'error';
  originalTx: any;
  newTxHash: string | null;
  estimatedTime: number | null;
  gasSavings: string | null;
}

export function useTransactionAccelerator() {
  const [state, setState] = useState<AcceleratorState>({
    isLoading: false,
    error: null,
    status: 'idle',
    originalTx: null,
    newTxHash: null,
    estimatedTime: null,
    gasSavings: null,
  });

  const analyzeTransaction = useCallback(async (txHash: string, chainId: number) => {
    setState(prev => ({ ...prev, isLoading: true, status: 'analyzing', error: null }));

    try {
      const chain = Object.values(SUPPORTED_CHAINS).find(c => c.id === chainId);
      if (!chain) {
        throw new Error('Unsupported chain');
      }

      const publicClient = createPublicClient({
        chain,
        transport: http(chain.rpcUrls.default.http[0]),
      });

      const tx = await publicClient.getTransaction({ hash: txHash as Hash });

      let receipt: TransactionReceipt | null = null;
      try {
        receipt = await publicClient.getTransactionReceipt({ hash: txHash as Hash });
      } catch (e) {
        console.log('Transaction not yet mined');
      }

      if (receipt) {
        throw new Error('Transaction already mined - cannot accelerate');
      }

      const currentBlock = await publicClient.getBlockNumber();
      const gasPrice = await publicClient.getGasPrice();

      setState(prev => ({
        ...prev,
        isLoading: false,
        status: 'idle',
        originalTx: {
          ...tx,
          currentGasPrice: gasPrice,
          currentBlock,
        },
      }));

      return { tx, gasPrice, currentBlock };
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        status: 'error',
        error: err.message || 'Failed to analyze transaction',
      }));
      throw err;
    }
  }, []);

  const accelerateTransaction = useCallback(async (
    txHash: string,
    chainId: number,
    gasBoostPercentage: number = 50
  ) => {
    setState(prev => ({ ...prev, isLoading: true, status: 'accelerating', error: null }));

    try {
      // Validate transaction hash format
      if (!txHash || !txHash.startsWith('0x') || txHash.length !== 66) {
        throw new Error('Invalid transaction hash. Please enter a valid 66-character hash starting with 0x');
      }

      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const chain = Object.values(SUPPORTED_CHAINS).find(c => c.id === chainId);
      if (!chain) {
        throw new Error('Unsupported chain');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });

      const publicClient = createPublicClient({
        chain,
        transport: http(chain.rpcUrls.default.http[0]),
      });

      const walletClient = createWalletClient({
        chain,
        transport: custom(window.ethereum),
      });

      const [address] = await walletClient.getAddresses();

      // Try to get the transaction, but if RPC doesn't have it yet, we'll work with nonce
      let originalTx: any = null;
      try {
        originalTx = await publicClient.getTransaction({ hash: txHash as Hash });
      } catch (e) {
        console.log('Transaction not found in RPC mempool yet');
      }

      // Check if already confirmed
      let receipt: TransactionReceipt | null = null;
      try {
        receipt = await publicClient.getTransactionReceipt({ hash: txHash as Hash });
        if (receipt) {
          throw new Error('Transaction already confirmed! Check your wallet or block explorer.');
        }
      } catch (e: any) {
        if (e.message?.includes('already confirmed')) {
          throw e;
        }
        console.log('Transaction pending - can accelerate');
      }

      const currentGasPrice = await publicClient.getGasPrice();
      const boostedGasPrice = (currentGasPrice * BigInt(100 + gasBoostPercentage)) / BigInt(100);

      let maxPriorityFeePerGas: bigint | undefined;
      let maxFeePerGas: bigint | undefined;

      // If we found the original transaction, verify ownership and copy its details
      if (originalTx) {
        if (originalTx.from.toLowerCase() !== address.toLowerCase()) {
          throw new Error('You can only accelerate your own transactions');
        }

        if (originalTx.type === 'eip1559') {
          const originalMaxFee = originalTx.maxFeePerGas || currentGasPrice;
          const originalPriorityFee = originalTx.maxPriorityFeePerGas || parseGwei('2');

          maxPriorityFeePerGas = (originalPriorityFee * BigInt(100 + gasBoostPercentage)) / BigInt(100);
          maxFeePerGas = (originalMaxFee * BigInt(100 + gasBoostPercentage)) / BigInt(100);
        }

        const replacementTx = {
          to: originalTx.to,
          value: originalTx.value,
          data: originalTx.input,
          nonce: originalTx.nonce,
          gas: originalTx.gas,
          ...(originalTx.type === 'eip1559'
            ? {
                maxPriorityFeePerGas,
                maxFeePerGas,
              }
            : {
                gasPrice: boostedGasPrice,
              }
          ),
        };

        console.log('Sending replacement transaction:', replacementTx);
        console.log('Original gas:', originalTx.gasPrice?.toString());
        console.log('New gas:', maxFeePerGas?.toString() || boostedGasPrice.toString());
        console.log('Boost:', `${gasBoostPercentage}%`);

        let newTxHash: Hash;
        try {
          newTxHash = await walletClient.sendTransaction({
            ...replacementTx,
            account: address,
          } as any);
        } catch (txError: any) {
          console.error('Transaction send error:', txError);

          if (txError.message?.includes('already known') || txError.message?.includes('nonce too low')) {
            throw new Error('Transaction already confirmed or replaced. Please refresh and check your wallet.');
          }

          if (txError.message?.includes('insufficient funds')) {
            throw new Error('Insufficient funds for gas. Add more ETH/native tokens to your wallet.');
          }

          if (txError.message?.includes('gas required exceeds')) {
            throw new Error('Gas limit too high. The transaction may fail or is already confirmed.');
          }

          throw new Error(`RPC Error: ${txError.shortMessage || txError.message || 'Transaction rejected by network'}`);
        }

        console.log('Replacement transaction sent:', newTxHash);

        const estimatedTime = gasBoostPercentage >= 100 ? 30 : gasBoostPercentage >= 50 ? 60 : 120;

        setState({
          isLoading: false,
          status: 'success',
          error: null,
          originalTx,
          newTxHash,
          estimatedTime,
          gasSavings: null,
        });

        return newTxHash;
      }

      // If RPC doesn't have the transaction, use current nonce approach
      console.log('Transaction not in RPC yet, using current nonce from wallet');

      const currentNonce = await publicClient.getTransactionCount({
        address,
        blockTag: 'pending'
      });

      // Use EIP-1559 by default with boosted gas
      maxPriorityFeePerGas = parseGwei('2');
      maxFeePerGas = boostedGasPrice;

      const replacementTx = {
        to: address, // Self-transfer as dummy transaction to push nonce forward
        value: BigInt(0),
        nonce: currentNonce > 0 ? currentNonce - 1 : currentNonce, // Try the previous nonce
        gas: BigInt(21000),
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      console.log('Sending replacement transaction with boosted gas');
      console.log('Nonce:', currentNonce > 0 ? currentNonce - 1 : currentNonce);
      console.log('New gas:', maxFeePerGas?.toString());
      console.log('Boost:', `${gasBoostPercentage}%`);

      let newTxHash: Hash;
      try {
        newTxHash = await walletClient.sendTransaction({
          ...replacementTx,
          account: address,
        } as any);
      } catch (txError: any) {
        console.error('Transaction send error:', txError);

        if (txError.message?.includes('already known') || txError.message?.includes('nonce too low')) {
          throw new Error('Transaction already confirmed or replaced. Please refresh and check your wallet.');
        }

        if (txError.message?.includes('insufficient funds')) {
          throw new Error('Insufficient funds for gas. Add more ETH/native tokens to your wallet.');
        }

        if (txError.message?.includes('gas required exceeds')) {
          throw new Error('Gas limit too high. The transaction may fail or is already confirmed.');
        }

        throw new Error(`RPC Error: ${txError.shortMessage || txError.message || 'Transaction rejected by network'}`);
      }

      console.log('Replacement transaction sent:', newTxHash);

      const estimatedTime = gasBoostPercentage >= 100 ? 30 : gasBoostPercentage >= 50 ? 60 : 120;

      setState({
        isLoading: false,
        status: 'success',
        error: null,
        originalTx: null,
        newTxHash,
        estimatedTime,
        gasSavings: null,
      });

      return newTxHash;
    } catch (err: any) {
      console.error('Acceleration error:', err);
      const errorMessage = err?.message || 'Failed to accelerate transaction';
      setState(prev => ({
        ...prev,
        isLoading: false,
        status: 'error',
        error: errorMessage,
      }));
      throw err;
    }
  }, []);

  const fixNonceIssue = useCallback(async (chainId: number) => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const chain = Object.values(SUPPORTED_CHAINS).find(c => c.id === chainId);
      if (!chain) {
        throw new Error('Unsupported chain');
      }

      const walletClient = createWalletClient({
        chain,
        transport: custom(window.ethereum),
      });

      const publicClient = createPublicClient({
        chain,
        transport: http(chain.rpcUrls.default.http[0]),
      });

      const [address] = await walletClient.getAddresses();
      const nonce = await publicClient.getTransactionCount({ address });

      const gasPrice = await publicClient.getGasPrice();
      const boostedGasPrice = (gasPrice * BigInt(150)) / BigInt(100);

      const resetTx = {
        account: address,
        to: address,
        value: BigInt(0),
        nonce,
        gas: BigInt(21000),
        gasPrice: boostedGasPrice,
      };

      const txHash = await walletClient.sendTransaction(resetTx as any);

      return txHash;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to fix nonce');
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      status: 'idle',
      originalTx: null,
      newTxHash: null,
      estimatedTime: null,
      gasSavings: null,
    });
  }, []);

  return {
    ...state,
    analyzeTransaction,
    accelerateTransaction,
    fixNonceIssue,
    reset,
  };
}
