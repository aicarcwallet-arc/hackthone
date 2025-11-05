export const AVALANCHE_NETWORKS = {
  fuji: {
    chainId: 43113,
    chainIdHex: '0xa869',
    name: 'Avalanche Fuji Testnet',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorer: 'https://testnet.snowtrace.io',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18
    },
    faucet: 'https://faucet.avax.network/',
    isTestnet: true
  },
  mainnet: {
    chainId: 43114,
    chainIdHex: '0xa86a',
    name: 'Avalanche C-Chain',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18
    },
    faucet: null,
    isTestnet: false
  }
} as const;

export type NetworkType = keyof typeof AVALANCHE_NETWORKS;

export const CURRENT_NETWORK: NetworkType = (import.meta.env.VITE_AVALANCHE_NETWORK as NetworkType) || 'fuji';

export const getNetworkConfig = (network: NetworkType = CURRENT_NETWORK) => {
  return AVALANCHE_NETWORKS[network];
};

export const getCurrentNetwork = () => {
  return getNetworkConfig(CURRENT_NETWORK);
};

export const isTestnet = () => {
  return getCurrentNetwork().isTestnet;
};

export const switchToMainnet = () => {
  console.warn('To switch to mainnet:');
  console.warn('1. Update .env: VITE_AVALANCHE_NETWORK=mainnet');
  console.warn('2. Rebuild the app');
  console.warn('3. Redeploy contracts to mainnet');
};
