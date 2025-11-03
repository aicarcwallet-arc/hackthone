import { config } from 'dotenv';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
config();

const CIRCLE_API_KEY = process.env.VITE_CIRCLE_API_KEY;
const ENTITY_SECRET = process.env.CIRCLE_ENTITY_SECRET;

if (!CIRCLE_API_KEY || CIRCLE_API_KEY === 'TEST_API_KEY:your_key_here') {
  console.error('❌ CIRCLE_API_KEY not configured in .env');
  process.exit(1);
}

if (!ENTITY_SECRET || ENTITY_SECRET === 'not-configured') {
  console.error('❌ CIRCLE_ENTITY_SECRET not configured in .env');
  process.exit(1);
}

async function createWallet() {
  try {
    console.log('🔄 Initializing Circle SDK...\n');

    const circleClient = initiateDeveloperControlledWalletsClient({
      apiKey: CIRCLE_API_KEY!,
      entitySecret: ENTITY_SECRET!
    });

    console.log('🔄 Step 1: Creating wallet set...\n');

    const walletSetResponse = await circleClient.createWalletSet({
      name: 'AIC Token Wallets'
    });

    const walletSetId = walletSetResponse.data?.walletSet?.id;
    console.log('✅ Wallet set created:', walletSetId);

    console.log('\n🔄 Step 2: Creating wallet...\n');

    const response = await circleClient.createWallets({
      blockchains: ['ETH-SEPOLIA', 'MATIC-AMOY'],
      count: 1,
      walletSetId: walletSetId
    });

    if (response.data?.wallets && response.data.wallets.length > 0) {
      const wallet = response.data.wallets[0];

      console.log('✅ Wallet created successfully!\n');
      console.log('Wallet ID:', wallet.id);
      console.log('Address:', wallet.address);
      console.log('\n📝 Add this to your .env file:');
      console.log(`CIRCLE_WALLET_ID=${wallet.id}`);
    } else {
      console.error('❌ No wallet in response:', JSON.stringify(response, null, 2));
      process.exit(1);
    }

  } catch (error: any) {
    console.error('❌ Error creating wallet:', error.message || error);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

createWallet();
