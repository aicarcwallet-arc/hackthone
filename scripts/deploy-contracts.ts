/**
 * Deploy AIC Token and Swap contracts to Arc Testnet
 *
 * This script deploys:
 * 1. AIC Token (ERC20)
 * 2. AIC/USDC Swap Contract (AMM)
 *
 * Usage:
 * Set PRIVATE_KEY in .env
 * Run: npx tsx scripts/deploy-contracts.ts
 */

import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const ARC_TESTNET_CHAIN = {
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
  blockExplorers: {
    default: { name: 'Arc Explorer', url: 'https://testnet.arcscan.app' },
  },
  testnet: true,
} as const;

// ABI for AIC Token
const AIC_TOKEN_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "address", "name": "minter", "type": "address"}],
    "name": "addMinter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "player", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "string", "name": "submissionId", "type": "string"}
    ],
    "name": "mintGameReward",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Compiled bytecode (you'll need to compile with solc or hardhat)
const AIC_TOKEN_BYTECODE = '0x'; // TODO: Add compiled bytecode

const USDC_ADDRESS_ARC_TESTNET = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // Arc Testnet USDC

async function main() {
  console.log('🚀 Deploying AIC Token System to Arc Testnet...\n');

  // Get private key from environment
  const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
  if (!privateKey) {
    throw new Error('PRIVATE_KEY not found in environment');
  }

  const account = privateKeyToAccount(privateKey);
  console.log('📝 Deploying from:', account.address);

  // Create clients
  const publicClient = createPublicClient({
    chain: ARC_TESTNET_CHAIN,
    transport: http('https://rpc.testnet.arc.network'),
  });

  const walletClient = createWalletClient({
    account,
    chain: ARC_TESTNET_CHAIN,
    transport: http('https://rpc.testnet.arc.network'),
  });

  // Check balance
  const balance = await publicClient.getBalance({ address: account.address });
  console.log('💰 USDC Balance:', formatEther(balance), 'USDC\n');

  if (balance === 0n) {
    console.log('❌ No USDC for gas! Get testnet USDC from https://faucet.circle.com');
    return;
  }

  console.log('⚠️  MANUAL DEPLOYMENT REQUIRED\n');
  console.log('Due to contract compilation requirements, please deploy manually using:');
  console.log('1. Remix IDE (https://remix.ethereum.org)');
  console.log('2. Hardhat');
  console.log('3. Foundry\n');

  console.log('📋 Deployment Steps:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('STEP 1: Deploy AIC Token');
  console.log('────────────────────────────');
  console.log('File: contracts/AICToken.sol');
  console.log('Network: Arc Testnet');
  console.log('Chain ID: 5042002');
  console.log('RPC: https://rpc.testnet.arc.network');
  console.log('Constructor args: none\n');

  console.log('STEP 2: Deploy AIC Converter');
  console.log('────────────────────────────');
  console.log('File: contracts/AICConverter.sol');
  console.log('Network: Arc Testnet');
  console.log('Constructor args:');
  console.log('  - _aicToken: <AIC_TOKEN_ADDRESS_FROM_STEP_1>');
  console.log('  - _usdcToken:', USDC_ADDRESS_ARC_TESTNET);
  console.log('Description: Converts AIC to USDC at 1:1 ratio\n');

  console.log('STEP 3: Setup Permissions');
  console.log('────────────────────────────');
  console.log('Call AICToken.addMinter(<YOUR_BACKEND_ADDRESS>)');
  console.log('This allows your game backend to mint rewards\n');

  console.log('STEP 4: Fund the Converter with USDC');
  console.log('────────────────────────────');
  console.log('1. Get USDC from Circle Faucet (https://faucet.circle.com)');
  console.log('2. Approve USDC to AICConverter contract');
  console.log('3. Call AICConverter.addLiquidity(usdcAmount)');
  console.log('   Example: addLiquidity(10000000000) = Add 10,000 USDC liquidity');
  console.log('   Note: USDC has 6 decimals, so 1 USDC = 1000000\n');

  console.log('📋 Save these addresses to your .env:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('VITE_AIC_TOKEN_ADDRESS=<your_aic_token_address>');
  console.log('VITE_AIC_CONVERTER_ADDRESS=<your_converter_address>');
  console.log('VITE_USDC_ADDRESS=' + USDC_ADDRESS_ARC_TESTNET);
  console.log('\n💡 How the System Works:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('1. Players earn AIC tokens by playing the vocabulary game');
  console.log('2. AIC tokens have 18 decimals (standard ERC20)');
  console.log('3. Players convert AIC → USDC at 1:1 VALUE ratio');
  console.log('4. Conversion: 1 AIC (1e18) = 1 USDC (1e6)');
  console.log('5. Players withdraw USDC via Bridge, Virtual Card, or Circle Bank');
  console.log('\n✅ After deployment, verify on: https://testnet.arcscan.app\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
