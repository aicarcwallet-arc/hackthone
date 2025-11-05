import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useState, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { PYUSD_MINT_ADDRESS, PYUSD_DECIMALS } from '../config/solana';

export const useSolanaWallet = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);

  const getPYUSDBalance = useCallback(async (): Promise<number> => {
    if (!wallet.publicKey) return 0;

    try {
      const pyusdMint = new PublicKey(PYUSD_MINT_ADDRESS);
      const associatedToken = await getAssociatedTokenAddress(
        pyusdMint,
        wallet.publicKey
      );

      const account = await getAccount(connection, associatedToken);
      return Number(account.amount) / Math.pow(10, PYUSD_DECIMALS);
    } catch (error) {
      console.error('Error fetching PYUSD balance:', error);
      return 0;
    }
  }, [wallet.publicKey, connection]);

  const getAICBalance = useCallback(async (aicMint: PublicKey): Promise<number> => {
    if (!wallet.publicKey) return 0;

    try {
      const associatedToken = await getAssociatedTokenAddress(
        aicMint,
        wallet.publicKey
      );

      const account = await getAccount(connection, associatedToken);
      return Number(account.amount) / Math.pow(10, 6);
    } catch (error) {
      console.error('Error fetching AIC balance:', error);
      return 0;
    }
  }, [wallet.publicKey, connection]);

  const getSolBalance = useCallback(async (): Promise<number> => {
    if (!wallet.publicKey) return 0;

    try {
      const balance = await connection.getBalance(wallet.publicKey);
      return balance / 1e9;
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      return 0;
    }
  }, [wallet.publicKey, connection]);

  return {
    wallet,
    connection,
    loading,
    setLoading,
    getPYUSDBalance,
    getAICBalance,
    getSolBalance,
    isConnected: wallet.connected,
    publicKey: wallet.publicKey,
  };
};
