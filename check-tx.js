import { createPublicClient, http } from 'viem';

const publicClient = createPublicClient({
  transport: http('https://rpc.testnet.arc.network')
});

const AIC_TOKEN = '0x4B71cD610AfCCDf0B02d566dA0071C74444a8666';
const WALLET = '0x996a7ac2e9f37173f2b2131fa720f04fdacbb0cd';

const ABI = [{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

async function checkBalance() {
  const balance = await publicClient.readContract({
    address: AIC_TOKEN,
    abi: ABI,
    functionName: 'balanceOf',
    args: [WALLET]
  });
  
  console.log('On-chain AIC balance:', (Number(balance) / 1e6).toFixed(2), 'AIC');
}

checkBalance();
