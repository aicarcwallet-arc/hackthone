import { createWalletClient, createPublicClient, http, parseUnits, formatUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { avalanche } from 'viem/chains';
import * as fs from 'fs';
import * as path from 'path';

const AVALANCHE_RPC = 'https://api.avax.network/ext/bc/C/rpc';

async function main() {
  console.log('\n🏔️  AVALANCHE AIC MINING SYSTEM DEPLOYMENT\n');
  console.log('═══════════════════════════════════════════\n');

  const privateKey = process.env.AVALANCHE_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('AVALANCHE_PRIVATE_KEY not set in environment');
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

  console.log('📍 Deployer Address:', account.address);

  const balance = await publicClient.getBalance({ address: account.address });
  console.log('💰 AVAX Balance:', formatUnits(balance, 18), 'AVAX\n');

  if (balance < parseUnits('0.1', 18)) {
    throw new Error('Insufficient AVAX balance. Need at least 0.1 AVAX for deployment.');
  }

  console.log('Step 1: Deploying AICToken...');

  const aicTokenBytecode = await getContractBytecode('AICToken');
  const aicTokenHash = await walletClient.deployContract({
    abi: [],
    bytecode: aicTokenBytecode as `0x${string}`,
    args: []
  });

  console.log('   Transaction:', aicTokenHash);
  console.log('   Waiting for confirmation...');

  const aicTokenReceipt = await publicClient.waitForTransactionReceipt({
    hash: aicTokenHash
  });
  const aicTokenAddress = aicTokenReceipt.contractAddress;

  console.log('   ✅ AICToken deployed:', aicTokenAddress);
  console.log('   Gas Used:', aicTokenReceipt.gasUsed.toString(), '\n');

  console.log('Step 2: Deploying AICVaultFactory...');

  const factoryBytecode = await getContractBytecode('AICVaultFactory');
  const factoryHash = await walletClient.deployContract({
    abi: [],
    bytecode: factoryBytecode as `0x${string}`,
    args: [aicTokenAddress]
  });

  console.log('   Transaction:', factoryHash);
  console.log('   Waiting for confirmation...');

  const factoryReceipt = await publicClient.waitForTransactionReceipt({
    hash: factoryHash
  });
  const factoryAddress = factoryReceipt.contractAddress;

  console.log('   ✅ AICVaultFactory deployed:', factoryAddress);
  console.log('   Gas Used:', factoryReceipt.gasUsed.toString(), '\n');

  console.log('═══════════════════════════════════════════\n');
  console.log('🎉 DEPLOYMENT COMPLETE!\n');
  console.log('Contract Addresses:');
  console.log('─────────────────────────────────────────');
  console.log('AICToken:        ', aicTokenAddress);
  console.log('VaultFactory:    ', factoryAddress);
  console.log('─────────────────────────────────────────\n');

  console.log('Next Steps:');
  console.log('1. Fund factory with AIC tokens');
  console.log('2. Create test vault for a user');
  console.log('3. Verify contracts on Snowtrace\n');

  console.log('Snowtrace Links:');
  console.log(`AICToken: https://snowtrace.io/address/${aicTokenAddress}`);
  console.log(`Factory:  https://snowtrace.io/address/${factoryAddress}\n`);

  const deploymentInfo = {
    network: 'Avalanche C-Chain',
    chainId: 43114,
    timestamp: new Date().toISOString(),
    deployer: account.address,
    contracts: {
      aicToken: aicTokenAddress,
      vaultFactory: factoryAddress
    },
    transactions: {
      aicToken: aicTokenHash,
      vaultFactory: factoryHash
    }
  };

  const outputPath = path.join(__dirname, 'deployment-avalanche.json');
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log('📝 Deployment info saved to:', outputPath, '\n');
}

async function getContractBytecode(contractName: string): Promise<string> {
  console.log(`   Note: Compile ${contractName}.sol with Remix or Hardhat first`);
  console.log(`   Then paste bytecode when prompted\n`);
  throw new Error('Contract compilation not implemented. Use Remix for now.');
}

main().catch((error) => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});
