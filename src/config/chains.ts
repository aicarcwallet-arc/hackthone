const getInfuraRpcUrl = (network: string): string => {
  const infuraKey = import.meta.env.VITE_INFURA_API_KEY;
  if (!infuraKey) {
    return '';
  }
  return `https://${network}.infura.io/v3/${infuraKey}`;
};

export const ARC_TESTNET_CHAIN_ID = 5042002;
export const ARC_MAINNET_CHAIN_ID = 1042; // Update this when Arc Mainnet launches

// Automatically detect which network to use
export const isArcMainnet = () => {
  // Check if mainnet env var is set
  const useMainnet = import.meta.env.VITE_USE_ARC_MAINNET === 'true';
  return useMainnet;
};

export const getActiveArcChainId = () => {
  return isArcMainnet() ? ARC_MAINNET_CHAIN_ID : ARC_TESTNET_CHAIN_ID;
};

export const getActiveArcExplorerUrl = () => {
  return isArcMainnet()
    ? 'https://arcscan.app' // Mainnet explorer (update when available)
    : 'https://testnet.arcscan.app'; // Testnet explorer
};

export const SUPPORTED_CHAINS = {
  ARC_TESTNET: {
    id: ARC_TESTNET_CHAIN_ID,
    name: 'Arc Testnet',
    network: 'arc-testnet',
    nativeCurrency: {
      // NOTE: MetaMask requires 18 decimals for nativeCurrency per EIP-1193
      // Arc actually uses 6-decimal USDC for gas. All transaction code uses 6 decimals.
      // This is just for wallet display compatibility.
      decimals: 18,
      name: 'USDC',
      symbol: 'USDC',
    },
    rpcUrls: {
      default: {
        http: [
          'https://rpc.testnet.arc.network',
          'https://rpc.blockdaemon.testnet.arc.network',
          'https://rpc.drpc.testnet.arc.network',
          'https://rpc.quicknode.testnet.arc.network'
        ]
      },
      public: {
        http: [
          'https://rpc.testnet.arc.network',
          'https://rpc.blockdaemon.testnet.arc.network',
          'https://rpc.drpc.testnet.arc.network',
          'https://rpc.quicknode.testnet.arc.network'
        ]
      },
    },
    blockExplorers: {
      default: { name: 'Arc Explorer', url: 'https://testnet.arcscan.app' },
    },
    testnet: true,
  },
  ETHEREUM_SEPOLIA: {
    id: 11155111,
    name: 'Ethereum Sepolia',
    network: 'sepolia',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: [
          getInfuraRpcUrl('sepolia') || 'https://rpc.sepolia.org',
          'https://rpc.sepolia.org'
        ]
      },
      public: {
        http: [
          getInfuraRpcUrl('sepolia') || 'https://rpc.sepolia.org',
          'https://rpc.sepolia.org'
        ]
      },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
    },
    testnet: true,
  },
  ARBITRUM_SEPOLIA: {
    id: 421614,
    name: 'Arbitrum Sepolia',
    network: 'arbitrum-sepolia',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: [
          getInfuraRpcUrl('arbitrum-sepolia') || 'https://sepolia-rollup.arbitrum.io/rpc',
          'https://sepolia-rollup.arbitrum.io/rpc'
        ]
      },
      public: {
        http: [
          getInfuraRpcUrl('arbitrum-sepolia') || 'https://sepolia-rollup.arbitrum.io/rpc',
          'https://sepolia-rollup.arbitrum.io/rpc'
        ]
      },
    },
    blockExplorers: {
      default: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io' },
    },
    testnet: true,
  },
  BASE_SEPOLIA: {
    id: 84532,
    name: 'Base Sepolia',
    network: 'base-sepolia',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: [
          getInfuraRpcUrl('base-sepolia') || 'https://sepolia.base.org',
          'https://sepolia.base.org'
        ]
      },
      public: {
        http: [
          getInfuraRpcUrl('base-sepolia') || 'https://sepolia.base.org',
          'https://sepolia.base.org'
        ]
      },
    },
    blockExplorers: {
      default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
    },
    testnet: true,
  },
  OPTIMISM_SEPOLIA: {
    id: 11155420,
    name: 'Optimism Sepolia',
    network: 'optimism-sepolia',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: [
          getInfuraRpcUrl('optimism-sepolia') || 'https://sepolia.optimism.io',
          'https://sepolia.optimism.io'
        ]
      },
      public: {
        http: [
          getInfuraRpcUrl('optimism-sepolia') || 'https://sepolia.optimism.io',
          'https://sepolia.optimism.io'
        ]
      },
    },
    blockExplorers: {
      default: { name: 'Optimistic Etherscan', url: 'https://sepolia-optimism.etherscan.io' },
    },
    testnet: true,
  },
  POLYGON_AMOY: {
    id: 80002,
    name: 'Polygon Amoy',
    network: 'polygon-amoy',
    nativeCurrency: {
      decimals: 18,
      name: 'MATIC',
      symbol: 'MATIC',
    },
    rpcUrls: {
      default: {
        http: [
          getInfuraRpcUrl('polygon-amoy') || 'https://rpc-amoy.polygon.technology',
          'https://rpc-amoy.polygon.technology'
        ]
      },
      public: {
        http: [
          getInfuraRpcUrl('polygon-amoy') || 'https://rpc-amoy.polygon.technology',
          'https://rpc-amoy.polygon.technology'
        ]
      },
    },
    blockExplorers: {
      default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
    },
    testnet: true,
  },
  AVALANCHE_FUJI: {
    id: 43113,
    name: 'Avalanche Fuji',
    network: 'avalanche-fuji',
    nativeCurrency: {
      decimals: 18,
      name: 'AVAX',
      symbol: 'AVAX',
    },
    rpcUrls: {
      default: {
        http: [
          getInfuraRpcUrl('avalanche-fuji') || 'https://api.avax-test.network/ext/bc/C/rpc',
          'https://api.avax-test.network/ext/bc/C/rpc'
        ]
      },
      public: {
        http: [
          getInfuraRpcUrl('avalanche-fuji') || 'https://api.avax-test.network/ext/bc/C/rpc',
          'https://api.avax-test.network/ext/bc/C/rpc'
        ]
      },
    },
    blockExplorers: {
      default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io' },
    },
    testnet: true,
  },
} as const;

export const CHAIN_OPTIONS = Object.entries(SUPPORTED_CHAINS).map(([key, chain]) => ({
  value: chain.id,
  label: chain.name,
  key,
}));

// Bridge-supported chains (Arc Testnet NOT supported by Circle CCTP yet)
export const BRIDGE_CHAIN_OPTIONS = CHAIN_OPTIONS.filter(
  (option) => option.value !== ARC_TESTNET_CHAIN_ID
);
