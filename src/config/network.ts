/**
 * Network Configuration
 *
 * Easily switch between testnet and mainnet by changing one variable
 */

export type NetworkEnvironment = 'testnet' | 'mainnet';

// 🔧 CHANGE THIS WHEN ARC MAINNET LAUNCHES
export const CURRENT_NETWORK: NetworkEnvironment = 'testnet';

interface NetworkConfig {
  chainId: number;
  chainIdHex: string;
  rpcUrl: string;
  explorerUrl: string;
  name: string;
  usdcAddress: `0x${string}`;
  // Add contract addresses when deployed
  aicTokenAddress?: `0x${string}`;
  aicSwapAddress?: `0x${string}`;
  treasuryAddress?: `0x${string}`;
}

const TESTNET_CONFIG: NetworkConfig = {
  chainId: 5042002,
  chainIdHex: '0x4CEF52',
  rpcUrl: 'https://rpc.testnet.arc.network',
  explorerUrl: 'https://testnet.arcscan.app',
  name: 'Arc Testnet',
  usdcAddress: '0x3600000000000000000000000000000000000000',
  treasuryAddress: '0x43909cce967BE2a4448336a0ad95A99b7040BF05',
};

const MAINNET_CONFIG: NetworkConfig = {
  chainId: 999999, // 🔧 UPDATE when Arc announces mainnet chain ID
  chainIdHex: '0xF4240', // 🔧 UPDATE when Arc announces
  rpcUrl: 'https://rpc.arc.network', // 🔧 CONFIRM when mainnet launches
  explorerUrl: 'https://arcscan.app', // 🔧 CONFIRM when mainnet launches
  name: 'Arc Mainnet',
  usdcAddress: '0x0000000000000000000000000000000000000000', // 🔧 UPDATE with real USDC address
  // 🔧 ADD these when you deploy to mainnet:
  // aicTokenAddress: '0x...',
  // aicSwapAddress: '0x...',
  // treasuryAddress: '0x...',
};

export const NETWORK_CONFIG = CURRENT_NETWORK === 'mainnet' ? MAINNET_CONFIG : TESTNET_CONFIG;

// Export individual values for convenience
export const {
  chainId: ARC_CHAIN_ID,
  chainIdHex: ARC_CHAIN_ID_HEX,
  rpcUrl: ARC_RPC_URL,
  explorerUrl: ARC_EXPLORER_URL,
  name: ARC_NETWORK_NAME,
  usdcAddress: USDC_ADDRESS,
  aicTokenAddress: AIC_TOKEN_ADDRESS,
  aicSwapAddress: AIC_SWAP_ADDRESS,
  treasuryAddress: TREASURY_ADDRESS,
} = NETWORK_CONFIG;

// Helper functions
export function getExplorerTxUrl(txHash: string): string {
  return `${ARC_EXPLORER_URL}/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `${ARC_EXPLORER_URL}/address/${address}`;
}

export function isMainnet(): boolean {
  return CURRENT_NETWORK === 'mainnet';
}

export function isTestnet(): boolean {
  return CURRENT_NETWORK === 'testnet';
}

// MetaMask network config
export function getMetaMaskNetworkConfig() {
  return {
    chainId: ARC_CHAIN_ID_HEX,
    chainName: ARC_NETWORK_NAME,
    nativeCurrency: {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
    },
    rpcUrls: [ARC_RPC_URL],
    blockExplorerUrls: [ARC_EXPLORER_URL],
  };
}

// Log current network on import
console.log(`🌐 Running on ${ARC_NETWORK_NAME} (Chain ID: ${ARC_CHAIN_ID})`);
console.log(`📍 USDC Address: ${USDC_ADDRESS}`);
console.log(`🔗 Explorer: ${ARC_EXPLORER_URL}`);

if (isMainnet() && (!AIC_TOKEN_ADDRESS || !AIC_SWAP_ADDRESS)) {
  console.warn('⚠️ WARNING: Running on mainnet but contract addresses not configured!');
}
