import { createPublicClient, http, keccak256, toHex, getAddress } from 'viem';

const publicClient = createPublicClient({
  transport: http('https://rpc.testnet.arc.network')
});

const AIC_TOKEN = '0x4B71cD610AfCCDf0B02d566dA0071C74444a8666';
const MINTER_WALLET = getAddress('0xbee25f8b980a5b41dde0f83c6fb4a1c87e99c9d3');

const ABI = [
  {"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}
];

const MINTER_ROLE = keccak256(toHex('MINTER_ROLE'));

async function checkRole() {
  const hasRole = await publicClient.readContract({
    address: AIC_TOKEN,
    abi: ABI,
    functionName: 'hasRole',
    args: [MINTER_ROLE, MINTER_WALLET]
  });
  
  console.log('Minter wallet:', MINTER_WALLET);
  console.log('Has MINTER_ROLE:', hasRole);
}

checkRole();
