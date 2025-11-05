import { Connection, clusterApiUrl, Cluster } from '@solana/web3.js';

const getEnv = (key: string, defaultValue: string = '') => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

export const SOLANA_NETWORK = (getEnv('VITE_SOLANA_NETWORK', 'devnet')) as Cluster;

export const SOLANA_RPC_URL = getEnv('VITE_SOLANA_RPC_URL') || clusterApiUrl(SOLANA_NETWORK);

export const PYUSD_MINT_ADDRESS = getEnv('VITE_PYUSD_MINT_ADDRESS') ||
  (SOLANA_NETWORK === 'mainnet-beta'
    ? '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo'
    : 'CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM');

export const AIC_TOKEN_DECIMALS = 6;
export const PYUSD_DECIMALS = 6;

export const getConnection = () => {
  return new Connection(SOLANA_RPC_URL, 'confirmed');
};

export const PROGRAM_IDS = {
  aicToken: getEnv('VITE_AIC_TOKEN_PROGRAM_ID'),
  pyusdSwap: getEnv('VITE_PYUSD_SWAP_PROGRAM_ID'),
  payoutManager: getEnv('VITE_PAYOUT_MANAGER_PROGRAM_ID'),
};
