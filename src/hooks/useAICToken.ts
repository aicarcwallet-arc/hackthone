import { useState, useEffect } from 'react';
import { createPublicClient, createWalletClient, custom, http, formatUnits, parseUnits } from 'viem';
import { SUPPORTED_CHAINS } from '../config/chains';
import { AIC_TOKEN_ADDRESS, AIC_SWAP_ADDRESS, USDC_ADDRESS, AIC_TOKEN_ABI, AIC_SWAP_ABI, ERC20_ABI } from '../config/contracts';
import { supabase } from '../lib/supabase';

export function useAICToken(walletAddress?: string) {
  const [aicBalance, setAicBalance] = useState<string>('0');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [aicPrice, setAicPrice] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [dbBalance, setDbBalance] = useState<number>(0);

  const publicClient = createPublicClient({
    chain: SUPPORTED_CHAINS.ARC_TESTNET,
    transport: http('https://rpc.testnet.arc.network'),
  });

  useEffect(() => {
    if (walletAddress) {
      fetchBalances();
      fetchDatabaseBalance();
      if (AIC_TOKEN_ADDRESS && USDC_ADDRESS) {
        fetchPrice();
      }
    }
  }, [walletAddress]);

  const fetchDatabaseBalance = async () => {
    if (!walletAddress) return;

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('total_aic_earned')
        .eq('wallet_address', walletAddress.toLowerCase())
        .maybeSingle();

      if (userData) {
        const earnedBalance = parseFloat(userData.total_aic_earned || '0');
        setDbBalance(earnedBalance);
        setAicBalance(earnedBalance.toFixed(2));
      }
    } catch (error) {
      console.error('Error fetching database balance:', error);
    }
  };

  const fetchBalances = async () => {
    if (!walletAddress) return;

    try {
      await fetchDatabaseBalance();

      if (AIC_TOKEN_ADDRESS && USDC_ADDRESS) {
        const usdc = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [walletAddress as `0x${string}`],
        });

        setUsdcBalance(formatUnits(usdc as bigint, 6));
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const fetchPrice = async () => {
    if (!AIC_SWAP_ADDRESS) return;

    try {
      const price = await publicClient.readContract({
        address: AIC_SWAP_ADDRESS,
        abi: AIC_SWAP_ABI,
        functionName: 'getAICPrice',
      });

      setAicPrice(formatUnits(price as bigint, 6));
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  const swapAICForUSDC = async (aicAmount: string) => {
    if (!window.ethereum || !walletAddress || !AIC_TOKEN_ADDRESS || !AIC_SWAP_ADDRESS) {
      throw new Error('Wallet not connected or contracts not deployed');
    }

    setLoading(true);

    try {
      const walletClient = createWalletClient({
        account: walletAddress as `0x${string}`,
        chain: SUPPORTED_CHAINS.ARC_TESTNET,
        transport: custom(window.ethereum),
      });

      const amountIn = parseUnits(aicAmount, 6);

      // Calculate quote locally: 1:1 peg minus 0.3% fee
      const fee = amountIn * 3n / 1000n;
      const quote = amountIn - fee;

      const minOut = (quote * 95n) / 100n;

      const allowance = await publicClient.readContract({
        address: AIC_TOKEN_ADDRESS,
        abi: AIC_TOKEN_ABI,
        functionName: 'allowance',
        args: [walletAddress as `0x${string}`, AIC_SWAP_ADDRESS],
      }) as bigint;

      if (allowance < amountIn) {
        const approveHash = await walletClient.writeContract({
          address: AIC_TOKEN_ADDRESS,
          abi: AIC_TOKEN_ABI,
          functionName: 'approve',
          args: [AIC_SWAP_ADDRESS, amountIn],
        });

        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      const swapHash = await walletClient.writeContract({
        address: AIC_SWAP_ADDRESS,
        abi: AIC_SWAP_ABI,
        functionName: 'swapAICForUSDC',
        args: [amountIn, minOut],
      });

      await publicClient.waitForTransactionReceipt({ hash: swapHash });

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', walletAddress.toLowerCase())
        .maybeSingle();

      if (userData) {
        await supabase.from('token_transactions').insert({
          user_id: userData.id,
          transaction_type: 'swap',
          amount: parseFloat(aicAmount),
          from_token: 'AIC',
          to_token: 'USDC',
          tx_hash: swapHash,
          chain_id: SUPPORTED_CHAINS.ARC_TESTNET.id,
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
        });
      }

      await fetchBalances();
      await fetchPrice();

      return swapHash;
    } catch (error: any) {
      console.error('Swap error:', error);
      throw new Error(error.message || 'Swap failed');
    } finally {
      setLoading(false);
    }
  };

  const swapUSDCForAIC = async (usdcAmount: string) => {
    if (!window.ethereum || !walletAddress || !USDC_ADDRESS || !AIC_SWAP_ADDRESS) {
      throw new Error('Wallet not connected or contracts not deployed');
    }

    setLoading(true);

    try {
      const walletClient = createWalletClient({
        account: walletAddress as `0x${string}`,
        chain: SUPPORTED_CHAINS.ARC_TESTNET,
        transport: custom(window.ethereum),
      });

      const amountIn = parseUnits(usdcAmount, 6);

      // Calculate quote locally: 1:1 peg minus 0.3% fee
      const fee = amountIn * 3n / 1000n;
      const quote = amountIn - fee;

      const minOut = (quote * 95n) / 100n;

      const allowance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [walletAddress as `0x${string}`, AIC_SWAP_ADDRESS],
      }) as bigint;

      if (allowance < amountIn) {
        const approveHash = await walletClient.writeContract({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [AIC_SWAP_ADDRESS, amountIn],
        });

        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      const swapHash = await walletClient.writeContract({
        address: AIC_SWAP_ADDRESS,
        abi: AIC_SWAP_ABI,
        functionName: 'swapUSDCForAIC',
        args: [amountIn, minOut],
      });

      await publicClient.waitForTransactionReceipt({ hash: swapHash });

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', walletAddress.toLowerCase())
        .maybeSingle();

      if (userData) {
        await supabase.from('token_transactions').insert({
          user_id: userData.id,
          transaction_type: 'swap',
          amount: parseFloat(usdcAmount),
          from_token: 'USDC',
          to_token: 'AIC',
          tx_hash: swapHash,
          chain_id: SUPPORTED_CHAINS.ARC_TESTNET.id,
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
        });
      }

      await fetchBalances();
      await fetchPrice();

      return swapHash;
    } catch (error: any) {
      console.error('Swap error:', error);
      throw new Error(error.message || 'Swap failed');
    } finally {
      setLoading(false);
    }
  };

  const getSwapQuote = async (amountIn: string, direction: 'AIC_TO_USDC' | 'USDC_TO_AIC') => {
    if (!amountIn || parseFloat(amountIn) <= 0) return '0';

    try {
      // AIC is pegged 1:1 with USDC, so calculate locally
      // Apply 0.3% swap fee
      const inputAmount = parseFloat(amountIn);
      const fee = inputAmount * 0.003;
      const outputAmount = inputAmount - fee;

      return outputAmount.toFixed(6);
    } catch (error) {
      console.error('Quote error:', error);
      return '0';
    }
  };

  return {
    aicBalance,
    usdcBalance,
    aicPrice,
    loading,
    dbBalance,
    swapAICForUSDC,
    swapUSDCForAIC,
    getSwapQuote,
    refreshBalances: fetchBalances,
    refreshPrice: fetchPrice,
  };
}
