import { Connection, clusterApiUrl, Cluster } from '@solana/web3.js';

export const SOLANA_NETWORK = (import.meta.env.VITE_SOLANA_NETWORK || 'devnet') as Cluster;

export const SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK);

export const PYUSD_MINT_ADDRESS = import.meta.env.VITE_PYUSD_MINT_ADDRESS ||
  (SOLANA_NETWORK === 'mainnet-beta'
    ? '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo'
    : 'CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM');

export const AIC_TOKEN_DECIMALS = 6;
export const PYUSD_DECIMALS = 6;

export const getConnection = () => {
  return new Connection(SOLANA_RPC_URL, 'confirmed');
};

export const PROGRAM_IDS = {
  aicToken: import.meta.env.VITE_AIC_TOKEN_PROGRAM_ID || '',
  pyusdSwap: import.meta.env.VITE_PYUSD_SWAP_PROGRAM_ID || '',
  payoutManager: import.meta.env.VITE_PAYOUT_MANAGER_PROGRAM_ID || '',
};
