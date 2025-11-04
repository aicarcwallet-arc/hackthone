import { registerEntitySecretCiphertext, initiateCircleDevControlledWallet } from '@circle-fin/developer-controlled-wallets';
import { randomBytes } from 'crypto';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

config();

async function setupCircleWalletComplete() {
  try {
    console.log('\n🔵 Circle Programmable Wallet Setup\n');
    console.log('━'.repeat(60));

    const apiKey = process.env.VITE_CIRCLE_API_KEY;

    if (!apiKey || apiKey === 'TEST_API_KEY:63d81c0488a9afc5625b320b468631fa:2c5fdfd00a58ced8a41e7c718c663395') {
      console.error('❌ Valid CIRCLE_API_KEY not configured');
      console.error('\n📝 Get your API key from: https://console.circle.com/');
      process.exit(1);
    }

    console.log('✅ API Key found:', apiKey.substring(0, 30) + '...\n');

    // Step 1: Generate Entity Secret
    console.log('📝 Step 1: Generating Entity Secret...');
    const entitySecret = randomBytes(32).toString('hex');
    console.log('✅ Entity Secret generated:', entitySecret.substring(0, 16) + '...');

    // Step 2: Register Entity Secret
    console.log('\n📝 Step 2: Registering Entity Secret with Circle...');

    const registerResponse = await registerEntitySecretCiphertext({
      apiKey,
      entitySecret,
    });

    console.log('✅ Registration Status:', registerResponse.data);

    // Save recovery file if provided
    if (registerResponse.data?.recoveryFile) {
      const recoveryFilePath = path.join(process.cwd(), 'circle_recovery.dat');
      fs.writeFileSync(recoveryFilePath, registerResponse.data.recoveryFile);
      console.log('✅ Recovery file saved to:', recoveryFilePath);
      console.log('⚠️  CRITICAL: Back up this file securely!\n');
    }

    // Step 3: Create Wallet
    console.log('📝 Step 3: Creating Circle Programmable Wallet...');

    const walletResponse = await fetch('https://api.circle.com/v1/w3s/developer/wallets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        idempotencyKey: randomBytes(16).toString('hex'),
        blockchains: ['ARB-SEPOLIA', 'MATIC-AMOY', 'ETH-SEPOLIA'],
        count: 1,
        walletSetId: randomBytes(16).toString('hex'),
      }),
    });

    const walletData = await walletResponse.json();

    if (!walletResponse.ok) {
      console.error('❌ Wallet creation failed:', walletData);
      throw new Error(`Wallet creation failed: ${JSON.stringify(walletData)}`);
    }

    const walletId = walletData.data?.wallets?.[0]?.id;
    const walletAddress = walletData.data?.wallets?.[0]?.address;

    if (!walletId) {
      console.error('❌ No wallet ID returned:', walletData);
      throw new Error('No wallet ID in response');
    }

    console.log('✅ Wallet created!');
    console.log('   Wallet ID:', walletId);
    console.log('   Address:', walletAddress || 'Pending initialization');

    // Step 4: Update .env file
    console.log('\n📝 Step 4: Updating .env file...');

    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf-8');

    // Update CIRCLE_ENTITY_SECRET
    if (envContent.includes('CIRCLE_ENTITY_SECRET=')) {
      envContent = envContent.replace(
        /CIRCLE_ENTITY_SECRET=.*/,
        `CIRCLE_ENTITY_SECRET=${entitySecret}`
      );
    } else {
      envContent += `\nCIRCLE_ENTITY_SECRET=${entitySecret}`;
    }

    // Update CIRCLE_WALLET_ID
    if (envContent.includes('CIRCLE_WALLET_ID=')) {
      envContent = envContent.replace(
        /CIRCLE_WALLET_ID=.*/,
        `CIRCLE_WALLET_ID=${walletId}`
      );
    } else {
      envContent += `\nCIRCLE_WALLET_ID=${walletId}`;
    }

    // Add wallet address if needed
    if (!envContent.includes('CIRCLE_WALLET_ADDRESS=')) {
      envContent += `\nCIRCLE_WALLET_ADDRESS=${walletAddress || 'pending'}`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated!\n');

    // Step 5: Update Supabase secrets
    console.log('📝 Step 5: Supabase Secrets Setup...');
    console.log('\n⚠️  IMPORTANT: Update Supabase secrets manually:');
    console.log('\n1. Go to: https://supabase.com/dashboard/project/kujoudvjmhuypxyntrkm/settings/secrets');
    console.log('\n2. Add these secrets:');
    console.log(`   CIRCLE_ENTITY_SECRET = ${entitySecret}`);
    console.log(`   CIRCLE_WALLET_ID = ${walletId}`);
    console.log(`   VITE_CIRCLE_API_KEY = ${apiKey.substring(0, 30)}...`);

    console.log('\n━'.repeat(60));
    console.log('✅ SETUP COMPLETE!');
    console.log('━'.repeat(60));
    console.log('\n📋 Summary:');
    console.log(`   Entity Secret: ${entitySecret.substring(0, 16)}...`);
    console.log(`   Wallet ID: ${walletId}`);
    console.log(`   Wallet Address: ${walletAddress || 'Pending'}`);
    console.log('\n🎉 You can now test instant USDC withdrawals!\n');

  } catch (error: any) {
    console.error('\n❌ Setup failed:', error.message);
    if (error.response) {
      console.error('Response:', await error.response.text());
    }
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

setupCircleWalletComplete();
