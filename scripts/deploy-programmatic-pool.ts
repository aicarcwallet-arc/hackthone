import { createWalletClient, createPublicClient, http, parseEther, formatUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';

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
    default: {
      http: [
        'https://rpc.testnet.arc.network',
        'https://rpc.blockdaemon.testnet.arc.network',
        'https://rpc.drpc.testnet.arc.network',
        'https://rpc.quicknode.testnet.arc.network'
      ],
    },
    public: {
      http: [
        'https://rpc.testnet.arc.network',
        'https://rpc.blockdaemon.testnet.arc.network',
        'https://rpc.drpc.testnet.arc.network',
        'https://rpc.quicknode.testnet.arc.network'
      ],
    },
  },
  blockExplorers: {
    default: { name: 'Arc Explorer', url: 'https://testnet.arcscan.app' },
  },
});

const AIC_PROGRAMMATIC_POOL_BYTECODE = `0x60806040526000196006553480156200001757600080fd5b5060405162001d6538038062001d6583398101604081905262000040916200015e565b33600080546001600160a01b0319166001600160a01b03929092169190911790556001600160a01b0384166200008e5760405162461bcd60e51b8152600401620000859062000201565b60405180910390fd5b6001600160a01b038316620000b65760405162461bcd60e51b8152600401620000859062000201565b6001600160a01b038216620000de5760405162461bcd60e51b8152600401620000859062000201565b600180546001600160a01b03199081166001600160a01b03978816179091556002805482169586169590951790945560078054851693841693909317909255600880549093169116179055662386f26fc10000600381905560045562000243565b80516001600160a01b03811681146200015957600080fd5b919050565b600080600080608085870312156200017557600080fd5b620001808562000141565b9350620001906020860162000141565b9250620001a06040860162000141565b9150620001b06060860162000141565b905092959194509250565b600060208083528351808285015260005b81811015620001ea57858101830151858201604001528201620001cc565b81811115620001fd576000604083870101525b50601f01601f1916929092016040019392505050565b6020808252601490820152734d697373696e672076616c69642061646472657360601b604082015260600190565b611b1280620002536000396000f3fe608060405234801561001057600080fd5b50600436106101425760003560e01c806370a08231116100b85780639dc29fac1161007c5780639dc29fac146102c8578063a9059cbb146102db578063b6b55f25146102ee578063dd62ed3e14610301578063f2fde38b14610314578063f851a4401461032757600080fd5b806370a0823114610260578063715018a6146102895780638da5cb5b1461029357806395d89b41146102a45780639b19251a146102ac57600080fd5b8063313ce5671161010a578063313ce567146101d457806340c10f19146101e95780634000aea0146101fc57806342966c681461020f5780635c975abb1461022257806361d027b31461022f57600080fd5b806306fdde0314610147578063095ea7b31461016557806318160ddd1461018857806323b872dd1461019a5780632e1a7d4d146101ad575b600080fd5b61014f610337565b60405161015c919061166b565b60405180910390f35b6101786101733660046116e2565b6103c9565b604051901515815260200161015c565b6005545b60405190815260200161015c565b6101786101a836600461170c565b6103e0565b6101c06101bb366004611748565b610434565b604051901515815260200161015c565b60065460405160ff909116815260200161015c565b6101786101f73660046116e2565b6104f6565b61017861020a366004611761565b610589565b6101c061021d366004611748565b6105fb565b600a546101789060ff1681565b60095461024290600160a01b90046001600160a01b031681565b6040516001600160a01b03909116815260200161015c565b61018c61026e36600461180d565b6001600160a01b031660009081526003602052604090205490565b6102916106ad565b005b6000546001600160a01b0316610242565b61014f610712565b6101786102ba36600461180d565b60096020526000908152604090205460ff1681565b6101786102d63660046116e2565b610721565b6101786102e93660046116e2565b6107b3565b6101c06102fc366004611748565b6107c0565b61018c61030f366004611828565b61086e565b61029161032236600461180d565b610899565b6000546001600160a01b0316610242565b60078054610344906118ab565b80601f0160208091040260200160405190810160405280929190818152602001828054610370906118ab565b80156103bd5780601f10610392576101008083540402835291602001916103bd565b820191906000526020600020905b8154815290600101906020018083116103a057829003601f168201915b50505050508156;

const AIC_PROGRAMMATIC_POOL_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_aicToken", "type": "address"},
      {"internalType": "address", "name": "_usdcToken", "type": "address"},
      {"internalType": "address", "name": "_treasuryWallet", "type": "address"},
      {"internalType": "address", "name": "_cctpMessageTransmitter", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "aicAmountIn", "type": "uint256"}, {"internalType": "uint256", "name": "minUsdcOut", "type": "uint256"}],
    "name": "swapAICForUSDC",
    "outputs": [{"internalType": "uint256", "name": "usdcOut", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "usdcAmountIn", "type": "uint256"}, {"internalType": "uint256", "name": "minAicOut", "type": "uint256"}],
    "name": "swapUSDCForAIC",
    "outputs": [{"internalType": "uint256", "name": "aicOut", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

async function main() {
  console.log('🚀 Deploying AIC Programmatic Pool to Arc Testnet...\n');

  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('DEPLOYER_PRIVATE_KEY not found in .env');
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`);

  const publicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain: arcTestnet,
    transport: http(),
  });

  console.log('📍 Deployer Address:', account.address);

  const balance = await publicClient.getBalance({ address: account.address });
  console.log('💰 Balance:', formatUnits(balance, 6), 'USDC\n');

  if (balance < 10000n) {
    throw new Error('❌ Insufficient balance. Need at least 0.01 USDC for gas');
  }

  const AIC_TOKEN = '0x4B71cD610AfCCDf0B02d566dA0071C74444a8666';
  const USDC_TOKEN = '0x3600000000000000000000000000000000000000';
  const TREASURY_WALLET = '0x43909cce967be2ba4d44836a99b67040bf53f05a';
  const CCTP_TRANSMITTER = '0x0000000000000000000000000000000000000000';

  console.log('📋 Deployment Parameters:');
  console.log('   AIC Token:', AIC_TOKEN);
  console.log('   USDC Token:', USDC_TOKEN);
  console.log('   Treasury:', TREASURY_WALLET);
  console.log('   CCTP:', CCTP_TRANSMITTER);
  console.log('');

  const encodedConstructor = encodeFunctionData({
    abi: [{
      "inputs": [
        {"internalType": "address", "name": "_aicToken", "type": "address"},
        {"internalType": "address", "name": "_usdcToken", "type": "address"},
        {"internalType": "address", "name": "_treasuryWallet", "type": "address"},
        {"internalType": "address", "name": "_cctpMessageTransmitter", "type": "address"}
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    }],
    functionName: 'constructor' as any,
    args: [AIC_TOKEN, USDC_TOKEN, TREASURY_WALLET, CCTP_TRANSMITTER]
  });

  console.log('🔨 Deploying contract with 0.01 USDC gas...');

  const hash = await walletClient.deployContract({
    abi: AIC_PROGRAMMATIC_POOL_ABI,
    bytecode: AIC_PROGRAMMATIC_POOL_BYTECODE as `0x${string}`,
    args: [AIC_TOKEN, USDC_TOKEN, TREASURY_WALLET, CCTP_TRANSMITTER],
    gas: 5000000n,
  });

  console.log('📤 Transaction Hash:', hash);
  console.log('⏳ Waiting for confirmation...\n');

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (receipt.status === 'success' && receipt.contractAddress) {
    console.log('✅ Contract deployed successfully!\n');
    console.log('📍 Contract Address:', receipt.contractAddress);
    console.log('⛽ Gas Used:', receipt.gasUsed.toString());
    console.log('🔗 Explorer:', `https://testnet.arcscan.app/address/${receipt.contractAddress}`);
    console.log('\n📝 Add this to your .env file:');
    console.log(`VITE_AIC_PROGRAMMATIC_POOL_ADDRESS=${receipt.contractAddress}`);
  } else {
    console.log('❌ Deployment failed');
  }
}

function encodeFunctionData(params: any): `0x${string}` {
  return '0x';
}

main().catch(console.error);
