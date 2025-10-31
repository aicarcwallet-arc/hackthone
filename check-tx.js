import https from 'https';

const txHash = process.argv[2] || '0xeb79cd7c44380a23f20fc12ce1f6773d6ba84d54cd56a09a4862d8516f9c5c69';

const data = JSON.stringify({
  jsonrpc: '2.0',
  method: 'eth_getTransactionReceipt',
  params: [txHash],
  id: 1
});

const options = {
  hostname: 'rpc.testnet.arc.network',
  port: 443,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const response = JSON.parse(body);
    if (response.result === null) {
      console.log('STATUS: PENDING - Transaction not yet mined');
    } else {
      console.log('STATUS:', response.result.status === '0x1' ? 'SUCCESS' : 'FAILED');
      console.log('Block:', parseInt(response.result.blockNumber, 16));
      console.log('Gas Used:', parseInt(response.result.gasUsed, 16));
      console.log('From:', response.result.from);
      console.log('To:', response.result.to);
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
