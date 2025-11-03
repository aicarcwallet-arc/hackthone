import { createPublicClient, http, formatUnits } from 'viem';
import { defineChain } from 'viem';

const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: { decimals: 6, name: 'USDC', symbol: 'USDC' },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
    public: { http: ['https://rpc.testnet.arc.network'] },
  },
});

const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
});

const TREASURY = '0x43909cce967be2ba4d44836a99b67040bf53f05a';

publicClient.getBalance({ address: TREASURY as any }).then(balance => {
  console.log('💰 Treasury Wallet Balance:', formatUnits(balance, 6), 'USDC');
  console.log('📍 Address:', TREASURY);
  console.log('🔗 Explorer: https://testnet.arcscan.app/address/' + TREASURY);
});
