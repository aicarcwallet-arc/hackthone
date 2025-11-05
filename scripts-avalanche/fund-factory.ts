import { createWalletClient, createPublicClient, http, parseUnits, formatUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { avalanche } from 'viem/chains';
import * as fs from 'fs';
import * as path from 'path';

const AVALANCHE_RPC = 'https://api.avax.network/ext/bc/C/rpc';

const AIC_TOKEN_ABI = [
  {
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const FACTORY_ABI = [
  {
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "fundFactory",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFactoryStats",
    "outputs": [
      {"name": "_totalVaultsCreated", "type": "uint256"},
      {"name": "_totalAICAllocated", "type": "uint256"},
      {"name": "_factoryBalance", "type": "uint256"},
      {"name": "_vaultsRemaining", "type": "uint256"},
      {"name": "_defaultAllocation", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function main() {
  console.log('\n💰 FUNDING AVALANCHE VAULT FACTORY\n');
  console.log('═══════════════════════════════════════════\n');

  const deploymentPath = path.join(__dirname, 'deployment-avalanche.json');
  if (!fs.existsSync(deploymentPath)) {
    throw new Error('deployment-avalanche.json not found. Deploy contracts first.');
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const aicTokenAddress = deployment.contracts.aicToken as `0x${string}`;
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

  console.log('📍 Your Address:', account.address);
  console.log('🪙  AICToken:', aicTokenAddress);
  console.log('🏭 Factory:', factoryAddress, '\n');

  const balance = await publicClient.readContract({
    address: aicTokenAddress,
    abi: AIC_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [account.address]
  }) as bigint;

  console.log('💎 Your AIC Balance:', formatUnits(balance, 6), 'AIC\n');

  const amountToFund = parseUnits('10000000', 6);
  const vaultsCanCreate = Number(amountToFund) / Number(parseUnits('100000', 6));

  console.log(`Funding factory with: ${formatUnits(amountToFund, 6)} AIC`);
  console.log(`This will allow: ${vaultsCanCreate} vaults to be created\n`);

  if (balance < amountToFund) {
    throw new Error('Insufficient AIC balance');
  }

  console.log('Step 1: Approving factory to spend AIC...');
  const approveHash = await walletClient.writeContract({
    address: aicTokenAddress,
    abi: AIC_TOKEN_ABI,
    functionName: 'approve',
    args: [factoryAddress, amountToFund]
  });

  console.log('   Transaction:', approveHash);
  await publicClient.waitForTransactionReceipt({ hash: approveHash });
  console.log('   ✅ Approved\n');

  console.log('Step 2: Funding factory...');
  const fundHash = await walletClient.writeContract({
    address: factoryAddress,
    abi: FACTORY_ABI,
    functionName: 'fundFactory',
    args: [amountToFund]
  });

  console.log('   Transaction:', fundHash);
  await publicClient.waitForTransactionReceipt({ hash: fundHash });
  console.log('   ✅ Factory funded\n');

  const stats = await publicClient.readContract({
    address: factoryAddress,
    abi: FACTORY_ABI,
    functionName: 'getFactoryStats'
  }) as [bigint, bigint, bigint, bigint, bigint];

  console.log('═══════════════════════════════════════════\n');
  console.log('🎉 FACTORY FUNDED SUCCESSFULLY!\n');
  console.log('Factory Statistics:');
  console.log('─────────────────────────────────────────');
  console.log('Total Vaults Created:   ', stats[0].toString());
  console.log('Total AIC Allocated:    ', formatUnits(stats[1], 6), 'AIC');
  console.log('Factory Balance:        ', formatUnits(stats[2], 6), 'AIC');
  console.log('Vaults Remaining:       ', stats[3].toString());
  console.log('Default Allocation:     ', formatUnits(stats[4], 6), 'AIC');
  console.log('─────────────────────────────────────────\n');

  console.log('✅ Ready to create user vaults!\n');
}

main().catch((error) => {
  console.error('❌ Funding failed:', error);
  process.exit(1);
});
