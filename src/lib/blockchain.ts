import { createPublicClient, createWalletClient, custom, http, type Address, parseUnits, formatUnits } from 'viem';
import { ARC_TESTNET_CHAIN_ID } from '../config/chains';

const AIC_TOKEN_ADDRESS = '0x4B71cD610AfCCDf0B02d566dA0071C74444a8666' as const;

const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export function getArcPublicClient() {
  return createPublicClient({
    chain: {
      id: ARC_TESTNET_CHAIN_ID,
      name: 'Arc Testnet',
      network: 'arc-testnet',
      nativeCurrency: {
        decimals: 6,
        name: 'USDC',
        symbol: 'USDC',
      },
      rpcUrls: {
        default: { http: ['https://rpc.testnet.arc.network'] },
        public: { http: ['https://rpc.testnet.arc.network'] },
      },
    },
    transport: http('https://rpc.testnet.arc.network'),
  });
}

export async function getArcWalletClient() {
  if (!window.ethereum) {
    throw new Error('No wallet provider found');
  }

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  }) as Address[];

  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts found');
  }

  return createWalletClient({
    account: accounts[0],
    chain: {
      id: ARC_TESTNET_CHAIN_ID,
      name: 'Arc Testnet',
      network: 'arc-testnet',
      nativeCurrency: {
        decimals: 6,
        name: 'USDC',
        symbol: 'USDC',
      },
      rpcUrls: {
        default: { http: ['https://rpc.testnet.arc.network'] },
        public: { http: ['https://rpc.testnet.arc.network'] },
      },
    },
    transport: custom(window.ethereum),
  });
}

export async function switchToArcNetwork() {
  if (!window.ethereum) {
    throw new Error('No wallet provider found. Please install MetaMask.');
  }

  const chainIdHex = `0x${ARC_TESTNET_CHAIN_ID.toString(16).toUpperCase()}`;
  console.log(`Switching to Arc Testnet (Chain ID: ${ARC_TESTNET_CHAIN_ID}, Hex: ${chainIdHex})`);

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
    console.log('Successfully switched to Arc Testnet');
  } catch (switchError: any) {
    console.log('Switch error:', switchError.code, switchError.message);

    // Chain not added to wallet, try adding it
    if (switchError.code === 4902) {
      console.log('Arc Testnet not found in wallet, adding it...');
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainIdHex,
              chainName: 'Arc Testnet',
              nativeCurrency: {
                name: 'USDC',
                symbol: 'USDC',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.testnet.arc.network'],
              blockExplorerUrls: ['https://testnet.arcscan.app'],
            },
          ],
        });
        console.log('Successfully added Arc Testnet to wallet');
      } catch (addError: any) {
        console.error('Failed to add Arc Testnet:', addError);
        throw new Error(`Failed to add Arc Testnet: ${addError.message}`);
      }
    } else if (switchError.code === 4001) {
      // User rejected the request
      throw new Error('You rejected the network switch request');
    } else {
      throw new Error(`Failed to switch network: ${switchError.message}`);
    }
  }
}

export async function getAICBalance(address: Address): Promise<string> {
  const publicClient = getArcPublicClient();

  try {
    const balance = await publicClient.readContract({
      address: AIC_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    const decimals = await publicClient.readContract({
      address: AIC_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'decimals',
    });

    return formatUnits(balance, decimals);
  } catch (error) {
    console.error('Failed to get AIC balance:', error);
    return '0';
  }
}

export async function sendAICReward(
  recipientAddress: Address,
  amount: number
): Promise<string> {
  const walletClient = await getArcWalletClient();
  const publicClient = getArcPublicClient();

  const decimals = await publicClient.readContract({
    address: AIC_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  const amountInWei = parseUnits(amount.toString(), decimals);

  const hash = await walletClient.writeContract({
    address: AIC_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [recipientAddress, amountInWei],
  });

  await publicClient.waitForTransactionReceipt({ hash });

  return hash;
}

export async function waitForTransaction(hash: `0x${string}`): Promise<boolean> {
  const publicClient = getArcPublicClient();

  try {
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 1,
    });

    return receipt.status === 'success';
  } catch (error) {
    console.error('Transaction failed:', error);
    return false;
  }
}

export function getExplorerUrl(txHash: string): string {
  return `https://testnet.arcscan.app/tx/${txHash}`;
}

export function getAddressExplorerUrl(address: string): string {
  return `https://testnet.arcscan.app/address/${address}`;
}

export async function getCurrentChainId(): Promise<number> {
  if (!window.ethereum) {
    throw new Error('No wallet provider found');
  }

  const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
  return parseInt(chainId, 16);
}

export async function isOnArcNetwork(): Promise<boolean> {
  try {
    const chainId = await getCurrentChainId();
    console.log('Current MetaMask Chain ID:', chainId);
    console.log('Expected Arc Testnet Chain ID:', ARC_TESTNET_CHAIN_ID);
    return chainId === ARC_TESTNET_CHAIN_ID;
  } catch {
    return false;
  }
}
