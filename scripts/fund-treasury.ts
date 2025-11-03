import { createWalletClient, createPublicClient, http, parseUnits, formatUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';
import { config } from 'dotenv';

config();

const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: {
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
    public: { http: ['https://rpc.testnet.arc.network'] },
  },
});

const USDC_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

async function main() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('DEPLOYER_PRIVATE_KEY not found');
  }

  const account = privateKeyToAccount(privateKey as any);

  const publicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain: arcTestnet,
    transport: http(),
  });

  const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';
  const TREASURY_ADDRESS = '0x43909cce967be2ba4d44836a99b67040bf53f05a';

  console.log('💰 Funding Treasury Wallet...\n');
  console.log('From:', account.address);
  console.log('To:', TREASURY_ADDRESS);

  const balance = await publicClient.getBalance({ address: account.address });
  console.log('Current Balance:', formatUnits(balance, 6), 'USDC\n');

  const amount = parseUnits('5000', 6);

  console.log('📤 Sending 5,000 USDC to treasury...');

  const hash = await walletClient.sendTransaction({
    to: TREASURY_ADDRESS as any,
    value: amount,
  });

  console.log('Transaction Hash:', hash);
  console.log('⏳ Waiting for confirmation...\n');

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (receipt.status === 'success') {
    console.log('✅ Transfer successful!');
    console.log('🔗 Explorer:', `https://testnet.arcscan.app/tx/${hash}`);

    const newBalance = await publicClient.getBalance({ address: TREASURY_ADDRESS });
    console.log('\n💰 Treasury Balance:', formatUnits(newBalance, 6), 'USDC');
  } else {
    console.log('❌ Transfer failed');
  }
}

main().catch(console.error);
