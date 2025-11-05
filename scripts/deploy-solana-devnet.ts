import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { AICSolanaToken } from '../src/lib/solana-aic-token';
import { PYUSDSwapPool } from '../src/lib/solana-pyusd-swap';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEVNET_RPC = clusterApiUrl('devnet');

async function requestAirdrop(connection: Connection, publicKey: PublicKey, amount: number) {
  console.log(`Requesting ${amount} SOL airdrop...`);
  try {
    const signature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
    const latestBlockhash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...latestBlockhash
    });
    console.log(`✅ Airdrop successful: ${amount} SOL`);
  } catch (error) {
    console.log('⚠️  Airdrop failed (rate limit?), continuing with existing balance...');
  }
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

  console.log('\n💰 Step 2: Minting initial AIC supply for treasury...');
  await aicToken.mintTokens(
    aicMint,
    deployerKeypair.publicKey,
    deployerKeypair,
    100_000_000
  );
  console.log('✅ Minted 100,000,000 AIC tokens to treasury');
  console.log('   (This will be used for swap pool and user rewards!)');

  console.log('\n🏊 Step 3: Creating PYUSD Swap Pool...');
  const swapPool = new PYUSDSwapPool();

  console.log('⚠️  Note: Using devnet PYUSD (testnet only)');
  console.log('   For mainnet, you would use real PYUSD tokens\n');

  await swapPool.initializePool(
    deployerKeypair,
    aicMint,
    10_000_000,
    1000,
    0.3
  );

  console.log('✅ Swap Pool Created Successfully!');
  console.log('   - AIC Reserve: 10,000,000');
  console.log('   - PYUSD Reserve: 1,000 (simulated)');
  console.log('   - Swap Fee: 0.3%');

  const poolInfo = swapPool.getPoolInfo();
  console.log(`\n📊 Pool Information:`);
  console.log(`   - AIC Price: $${poolInfo.aicPrice.toFixed(6)} PYUSD`);
  console.log(`   - PYUSD Price: ${poolInfo.pyusdPrice.toFixed(2)} AIC`);
  console.log(`   - Each user can get 1,000,000 AIC tokens!`);

  console.log('\n💾 Saving deployment information...');

  const deploymentInfo = {
    network: 'devnet',
    timestamp: new Date().toISOString(),
    deployer: deployerKeypair.publicKey.toBase58(),
    aicTokenMint: aicMint.toBase58(),
    poolAuthority: deployerKeypair.publicKey.toBase58(),
    deployerSecretKey: Array.from(deployerKeypair.secretKey),
    initialSupply: 100_000_000,
    poolReserves: {
      aic: 10_000_000,
      pyusd: 1000,
    },
    swapFee: 0.3,
    perUserAllocation: 1_000_000,
  };

  const deploymentPath = path.join(__dirname, '../solana-deployment.json');
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

  console.log('✅ Deployment information saved to solana-deployment.json');

  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('🎉 DEPLOYMENT COMPLETE!');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('📝 Add these to your .env file:');
  console.log('─────────────────────────────────────────────────────');
  console.log(`VITE_SOLANA_NETWORK=devnet`);
  console.log(`VITE_SOLANA_RPC_URL=${DEVNET_RPC}`);
  console.log(`VITE_AIC_TOKEN_MINT=${aicMint.toBase58()}`);
  console.log(`VITE_POOL_AUTHORITY=${deployerKeypair.publicKey.toBase58()}`);

  console.log('\n\n🎮 Next Steps:');
  console.log('─────────────────────────────────────────────────────');
  console.log('1. Update your .env file with the variables above');
  console.log('2. Run: npm run dev');
  console.log('3. Visit: http://localhost:5173/solana.html');
  console.log('4. Connect your Phantom wallet (switch to devnet!)');
  console.log('5. Each new user will automatically get 1,000,000 AIC!');

  console.log('\n\n💡 Important Notes:');
  console.log('─────────────────────────────────────────────────────');
  console.log('• Keep .solana-deployer-keypair.json SECRET!');
  console.log('• This keypair controls the AIC token mint');
  console.log('• Install Phantom wallet and switch to devnet');
  console.log('• Get free devnet SOL from: https://solfaucet.com/');
  console.log('• Each user gets 1M AIC on first connection!');

  console.log('\n\n🚀 Ready to test! Good luck!');
  console.log('═══════════════════════════════════════════════════════\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  });
