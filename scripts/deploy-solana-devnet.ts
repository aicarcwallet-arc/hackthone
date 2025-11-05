import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AICSolanaToken } from '../src/lib/solana-aic-token';
import { PYUSDSwapPool } from '../src/lib/solana-pyusd-swap';
import * as fs from 'fs';
import * as path from 'path';

const DEVNET_RPC = clusterApiUrl('devnet');

async function requestAirdrop(connection: Connection, publicKey: any, amount: number) {
  console.log(`Requesting ${amount} SOL airdrop...`);
  const signature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(signature);
  console.log(`Airdrop successful: ${amount} SOL`);
}

async function main() {
  console.log('🚀 Deploying AIC Token System on Solana Devnet\n');

  const connection = new Connection(DEVNET_RPC, 'confirmed');

  let deployerKeypair: Keypair;
  const keypairPath = path.join(__dirname, '../.solana-deployer-keypair.json');

  if (fs.existsSync(keypairPath)) {
    console.log('📂 Loading existing deployer keypair...');
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
    deployerKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
  } else {
    console.log('🔑 Generating new deployer keypair...');
    deployerKeypair = Keypair.generate();
    fs.writeFileSync(
      keypairPath,
      JSON.stringify(Array.from(deployerKeypair.secretKey))
    );
    console.log('✅ Deployer keypair saved to .solana-deployer-keypair.json');
  }

  console.log(`\n📍 Deployer Address: ${deployerKeypair.publicKey.toBase58()}`);

  const balance = await connection.getBalance(deployerKeypair.publicKey);
  console.log(`💰 Current Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

  if (balance < 0.5 * LAMPORTS_PER_SOL) {
    await requestAirdrop(connection, deployerKeypair.publicKey, 2);
  }

  console.log('\n📦 Step 1: Creating AIC Token...');
  const aicToken = new AICSolanaToken();
  const { mint: aicMint } = await aicToken.createToken(deployerKeypair);
  console.log(`✅ AIC Token Created: ${aicMint.toBase58()}`);

  console.log('\n💰 Step 2: Minting initial AIC supply...');
  await aicToken.mintTokens(
    aicMint,
    deployerKeypair.publicKey,
    deployerKeypair,
    10_000_000
  );
  console.log('✅ Minted 10,000,000 AIC tokens');

  console.log('\n🏊 Step 3: Creating PYUSD Swap Pool...');
  const swapPool = new PYUSDSwapPool();

  console.log('⚠️  Note: This demo uses simulated PYUSD on devnet');
  console.log('   For mainnet, you would use real PYUSD tokens');

  await swapPool.initializePool(
    deployerKeypair,
    aicMint,
    5_000_000,
    500,
    0.3
  );

  console.log('✅ Swap Pool Created');
  console.log('   - AIC Reserve: 5,000,000');
  console.log('   - PYUSD Reserve: 500 (simulated)');
  console.log('   - Swap Fee: 0.3%');

  const poolInfo = swapPool.getPoolInfo();
  console.log('\n📊 Pool Information:');
  console.log(`   - AIC Price: $${poolInfo.aicPrice.toFixed(6)}`);
  console.log(`   - PYUSD Price: ${poolInfo.pyusdPrice.toFixed(6)} AIC`);

  console.log('\n💾 Saving deployment information...');

  const deploymentInfo = {
    network: 'devnet',
    timestamp: new Date().toISOString(),
    deployer: deployerKeypair.publicKey.toBase58(),
    aicTokenMint: aicMint.toBase58(),
    poolAuthority: deployerKeypair.publicKey.toBase58(),
    initialSupply: 10_000_000,
    poolReserves: {
      aic: 5_000_000,
      pyusd: 500,
    },
    swapFee: 0.3,
  };

  const deploymentPath = path.join(__dirname, '../solana-deployment.json');
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

  console.log('\n✅ Deployment information saved to solana-deployment.json');

  console.log('\n📝 Environment Variables to Add:');
  console.log('================================');
  console.log(`VITE_SOLANA_NETWORK=devnet`);
  console.log(`VITE_SOLANA_RPC_URL=${DEVNET_RPC}`);
  console.log(`VITE_AIC_TOKEN_MINT=${aicMint.toBase58()}`);
  console.log(`VITE_POOL_AUTHORITY=${deployerKeypair.publicKey.toBase58()}`);

  console.log('\n🎉 Deployment Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Add the environment variables above to your .env file');
  console.log('2. Test the swap functionality on devnet');
  console.log('3. Integrate with Circle wallet for PYUSD payouts');
  console.log('4. Once tested, prepare for mainnet deployment');

  console.log('\n⚠️  IMPORTANT: Keep .solana-deployer-keypair.json secure!');
  console.log('   This file controls the AIC token mint authority');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  });
