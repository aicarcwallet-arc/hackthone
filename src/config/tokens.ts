import { ARC_TESTNET_CHAIN_ID } from './chains';

export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  addresses: Record<number, string>;
  logo?: string;
}

export const TOKENS: Record<string, Token> = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    addresses: {
      [ARC_TESTNET_CHAIN_ID]: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      421614: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
      84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      11155420: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
      80002: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
      43113: '0x5425890298aed601595a70AB815c96711a31Bc65',
    },
  },
  AIC: {
    symbol: 'AIC',
    name: 'AI Cognitive Token',
    decimals: 6,
    addresses: {
      [ARC_TESTNET_CHAIN_ID]: '0x4B71cD610AfCCDf0B02d566dA0071C74444a8666',
    },
  },
};

export const TOKEN_OPTIONS = Object.values(TOKENS).map((token) => ({
  value: token.symbol,
  label: `${token.name} (${token.symbol})`,
  symbol: token.symbol,
}));

export function getTokenAddress(symbol: string, chainId: number): string | undefined {
  return TOKENS[symbol]?.addresses[chainId];
}

export function getAvailableTokensForChain(chainId: number): Token[] {
  return Object.values(TOKENS).filter((token) => token.addresses[chainId]);
}
