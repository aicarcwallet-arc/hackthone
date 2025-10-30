import { useState, useEffect } from 'react';
import { createPublicClient, createWalletClient, custom, http, formatUnits, parseUnits } from 'viem';
import { SUPPORTED_CHAINS } from '../config/chains';
import { AIC_TOKEN_ADDRESS, AIC_SWAP_ADDRESS, USDC_ADDRESS, AIC_TOKEN_ABI, AIC_SWAP_ABI, ERC20_ABI } from '../config/contracts';

export function useAICToken(walletAddress?: string) {
  const [aicBalance, setAicBalance] = useState<string>('0');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [aicPrice, setAicPrice] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const publicClient = createPublicClient({
    chain: SUPPORTED_CHAINS.ARC_TESTNET,
    transport: http('https://rpc.testnet.arc.network'),
  });

  useEffect(() => {
    if (walletAddress && AIC_TOKEN_ADDRESS && USDC_ADDRESS) {
      fetchBalances();
      fetchPrice();
    }
  }, [walletAddress]);

  const fetchBalances = async () => {
    if (!walletAddress || !AIC_TOKEN_ADDRESS) return;

    try {
      const [aic, usdc] = await Promise.all([
        publicClient.readContract({
          address: AIC_TOKEN_ADDRESS,
          abi: AIC_TOKEN_ABI,
          functionName: 'balanceOf',
          args: [walletAddress as `0x${string}`],
        }),
        publicClient.readContract({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [walletAddress as `0x${string}`],
        }),
      ]);

      setAicBalance(formatUnits(aic as bigint, 6));
      setUsdcBalance(formatUnits(usdc as bigint, 6));
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

      const quote = await publicClient.readContract({
        address: AIC_SWAP_ADDRESS,
        abi: AIC_SWAP_ABI,
        functionName: 'getAICToUSDCQuote',
        args: [amountIn],
      }) as bigint;

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

      const quote = await publicClient.readContract({
        address: AIC_SWAP_ADDRESS,
        abi: AIC_SWAP_ABI,
        functionName: 'getUSDCToAICQuote',
        args: [amountIn],
      }) as bigint;

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
    if (!AIC_SWAP_ADDRESS) return '0';

    try {
      const amount = parseUnits(amountIn, 6);

      const quote = await publicClient.readContract({
        address: AIC_SWAP_ADDRESS,
        abi: AIC_SWAP_ABI,
        functionName: direction === 'AIC_TO_USDC' ? 'getAICToUSDCQuote' : 'getUSDCToAICQuote',
        args: [amount],
      }) as bigint;

      return formatUnits(quote, 6);
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
    swapAICForUSDC,
    swapUSDCForAIC,
    getSwapQuote,
    refreshBalances: fetchBalances,
    refreshPrice: fetchPrice,
  };
}
