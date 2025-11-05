import { createWalletClient, createPublicClient, http, formatUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { avalanche } from 'viem/chains';
import * as fs from 'fs';
import * as path from 'path';

const AVALANCHE_RPC = 'https://api.avax.network/ext/bc/C/rpc';

const FACTORY_ABI = [
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "createVault",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getVault",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "hasVault",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const VAULT_ABI = [
  {
    "inputs": [],
    "name": "getVaultInfo",
    "outputs": [
      {"name": "_user", "type": "address"},
      {"name": "_totalAllocated", "type": "uint256"},
      {"name": "_totalMined", "type": "uint256"},
      {"name": "_totalRedeemed", "type": "uint256"},
      {"name": "_available", "type": "uint256"},
      {"name": "_locked", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function main() {
  console.log('\n🏗️  CREATE PERSONAL MINING VAULT\n');
  console.log('═══════════════════════════════════════════\n');

  const userAddress = process.argv[2];
  if (!userAddress) {
    throw new Error('Usage: tsx create-vault.ts <USER_ADDRESS>');
  }

  const deploymentPath = path.join(__dirname, 'deployment-avalanche.json');
  if (!fs.existsSync(deploymentPath)) {
    throw new Error('deployment-avalanche.json not found. Deploy contracts first.');
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const factoryAddress = deployment.contracts.vaultFactory as `0x${string}`;

  const privateKey = process.env.AVALANCHE_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('AVALANCHE_PRIVATE_KEY not set');
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`);

  const walletClient = createWalletClient({
    account,
    chain: avalanche,
    transport: http(AVALANCHE_RPC)
  });

  const publicClient = createPublicClient({
    chain: avalanche,
    transport: http(AVALANCHE_RPC)
  });

  console.log('📍 Manager:', account.address);
  console.log('👤 User:', userAddress);
  console.log('🏭 Factory:', factoryAddress, '\n');

  const hasVault = await publicClient.readContract({
    address: factoryAddress,
    abi: FACTORY_ABI,
    functionName: 'hasVault',
    args: [userAddress as `0x${string}`]
  }) as boolean;

  if (hasVault) {
    const existingVault = await publicClient.readContract({
      address: factoryAddress,
      abi: FACTORY_ABI,
      functionName: 'getVault',
      args: [userAddress as `0x${string}`]
    }) as `0x${string}`;

    console.log('⚠️  User already has a vault:', existingVault);
    console.log(`   View on Snowtrace: https://snowtrace.io/address/${existingVault}\n`);
    return;
  }

  console.log('Creating vault...');
  const createHash = await walletClient.writeContract({
    address: factoryAddress,
    abi: FACTORY_ABI,
    functionName: 'createVault',
    args: [userAddress as `0x${string}`]
  });

  console.log('   Transaction:', createHash);
  console.log('   Waiting for confirmation...');

  const receipt = await publicClient.waitForTransactionReceipt({ hash: createHash });
  console.log('   ✅ Vault created!\n');

  const vaultAddress = await publicClient.readContract({
    address: factoryAddress,
    abi: FACTORY_ABI,
    functionName: 'getVault',
    args: [userAddress as `0x${string}`]
  }) as `0x${string}`;

  const vaultInfo = await publicClient.readContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'getVaultInfo'
  }) as [string, bigint, bigint, bigint, bigint, bigint];

  console.log('═══════════════════════════════════════════\n');
  console.log('🎉 VAULT CREATED SUCCESSFULLY!\n');
  console.log('Vault Details:');
  console.log('─────────────────────────────────────────');
  console.log('Vault Address:      ', vaultAddress);
  console.log('User:               ', vaultInfo[0]);
  console.log('Total Allocated:    ', formatUnits(vaultInfo[1], 6), 'AIC');
  console.log('Total Mined:        ', formatUnits(vaultInfo[2], 6), 'AIC');
  console.log('Total Redeemed:     ', formatUnits(vaultInfo[3], 6), 'AIC');
  console.log('Available:          ', formatUnits(vaultInfo[4], 6), 'AIC');
  console.log('Locked:             ', formatUnits(vaultInfo[5], 6), 'AIC');
  console.log('─────────────────────────────────────────\n');

  console.log('Snowtrace:');
  console.log(`https://snowtrace.io/address/${vaultAddress}\n`);

  console.log('Next Steps:');
  console.log('1. User mines vocabulary words');
  console.log('2. Manager calls mineTokens() to credit user');
  console.log('3. User calls redeemTokens() to withdraw\n');
}

main().catch((error) => {
  console.error('❌ Vault creation failed:', error);
  process.exit(1);
});
