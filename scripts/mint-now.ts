import { createWalletClient, createPublicClient, http, parseUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const ARC_TESTNET = {
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: { decimals: 6, name: 'USDC', symbol: 'USDC' },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
    public: { http: ['https://rpc.testnet.arc.network'] },
  },
};

const AIC_TOKEN_ADDRESS = '0x4B71cD610AfCCDf0B02d566dA0071C74444a8666';
const MINTER_PRIVATE_KEY = '0x90e5340c08b03769795bdf15a0cf5f2f9f32090c650275ac9399bf7541819e61';
const WALLET_TO_MINT = '0x996a7ac2e9f37173f2b2131fa720f04fdacbb0cd';

const AIC_TOKEN_ABI = [{
  inputs: [
    { internalType: "address", name: "player", type: "address" },
    { internalType: "uint256", name: "amount", type: "uint256" },
    { internalType: "string", name: "submissionId", type: "string" },
  ],
  name: "mintGameReward",
  outputs: [{ internalType: "bool", name: "", type: "bool" }],
  stateMutability: "nonpayable",
  type: "function",
}];

async function mintTokens() {
  console.log('🪙 Minting 3184 AIC tokens...');
  console.log('Wallet:', WALLET_TO_MINT);

  const account = privateKeyToAccount(MINTER_PRIVATE_KEY as `0x${string}`);

  const walletClient = createWalletClient({
    account,
    chain: ARC_TESTNET,
    transport: http('https://rpc.testnet.arc.network'),
  });

  const publicClient = createPublicClient({
    chain: ARC_TESTNET,
    transport: http('https://rpc.testnet.arc.network'),
  });

  const amountToMint = parseUnits('3184', 6);
  const submissionId = `direct-mint-${Date.now()}`;

  console.log('Amount to mint:', amountToMint.toString());
  console.log('Submission ID:', submissionId);

  try {
    console.log('\n⏳ Getting gas price...');
    const gasPrice = await publicClient.request({
      method: 'eth_gasPrice' as any,
    });

    const gasPriceWithBuffer = BigInt(gasPrice as string) * BigInt(120) / BigInt(100);
    console.log('Gas price:', gasPriceWithBuffer.toString());

    console.log('\n📝 Sending transaction...');
    const txHash = await walletClient.writeContract({
      address: AIC_TOKEN_ADDRESS as `0x${string}`,
      abi: AIC_TOKEN_ABI,
      functionName: 'mintGameReward',
      args: [WALLET_TO_MINT, amountToMint, submissionId],
      gasPrice: gasPriceWithBuffer,
      gas: BigInt(100000),
    });

    console.log('✅ Transaction sent!');
    console.log('TX Hash:', txHash);
    console.log('View on explorer:', `https://testnet.arcscan.com/tx/${txHash}`);

    console.log('\n⏳ Waiting for confirmation...');
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: 1,
      timeout: 30000,
    });

    if (receipt.status === 'success') {
      console.log('\n🎉 SUCCESS! Tokens minted!');
      console.log('Transaction confirmed in block:', receipt.blockNumber);
      console.log('\n✅ You now have 3184 AIC tokens in your wallet!');
      console.log('Go to your app and check Convert/Bridge pages.');
    } else {
      console.log('\n❌ Transaction failed');
      console.log('Receipt:', receipt);
    }

  } catch (error: any) {
    console.error('\n❌ Error:', error.message || error);
    throw error;
  }
}

mintTokens()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
