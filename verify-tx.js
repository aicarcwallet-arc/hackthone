import { createPublicClient, http } from 'viem';

const publicClient = createPublicClient({
  transport: http('https://rpc.testnet.arc.network')
});

const txHash = '0x38e6f3130887f686ed5b3c20e4e214b19889e688019c9913ba9d9d3ddb6ff787';

async function checkTx() {
  try {
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
    console.log('Transaction status:', receipt.status);
    console.log('Block number:', receipt.blockNumber);
    console.log('Logs:', receipt.logs.length);
    
    if (receipt.logs.length > 0) {
      console.log('\nFirst log:');
      console.log('  Address:', receipt.logs[0].address);
      console.log('  Topics:', receipt.logs[0].topics);
      console.log('  Data:', receipt.logs[0].data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkTx();
