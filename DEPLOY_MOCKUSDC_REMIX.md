# Deploy MockUSDC via Remix IDE

## Quick Deploy (5 minutes)

### **Step 1: Get Testnet USDC for Gas**

1. Go to: https://faucet.circle.com
2. Select **"Arc Testnet"** from network dropdown
3. Paste your wallet: `0x0e8E0e9C8bb5E02F8c73e9f61CA66E56D1de8d77`
4. Click "Request USDC"
5. Wait for confirmation (instant)

### **Step 2: Open Remix IDE**

1. Go to: https://remix.ethereum.org
2. Create new file: `MockUSDC.sol`
3. Copy the contract code below

### **MockUSDC Contract:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockUSDC {
    string public name = "Mock USD Coin";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public minters;

    address public owner;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner, "Not minter");
        _;
    }

    constructor() {
        owner = msg.sender;
        minters[msg.sender] = true;

        // Mint initial supply to owner (1 million USDC)
        uint256 initialSupply = 1_000_000 * 10**decimals;
        balanceOf[owner] = initialSupply;
        totalSupply = initialSupply;
        emit Transfer(address(0), owner, initialSupply);
    }

    function addMinter(address _minter) external onlyOwner {
        minters[_minter] = true;
        emit MinterAdded(_minter);
    }

    function removeMinter(address _minter) external onlyOwner {
        minters[_minter] = false;
        emit MinterRemoved(_minter);
    }

    function mint(address _to, uint256 _amount) external onlyMinter returns (bool) {
        require(_to != address(0), "Invalid address");

        balanceOf[_to] += _amount;
        totalSupply += _amount;

        emit Transfer(address(0), _to, _amount);
        return true;
    }

    function transfer(address _to, uint256 _amount) external returns (bool) {
        require(_to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= _amount, "Insufficient balance");

        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    function approve(address _spender, uint256 _amount) external returns (bool) {
        allowance[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _amount) external returns (bool) {
        require(_to != address(0), "Invalid address");
        require(balanceOf[_from] >= _amount, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _amount, "Insufficient allowance");

        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;
        allowance[_from][msg.sender] -= _amount;

        emit Transfer(_from, _to, _amount);
        return true;
    }
}
```

### **Step 3: Compile in Remix**

1. Click "Solidity Compiler" (left sidebar)
2. Select compiler version: `0.8.20` or higher
3. Click "Compile MockUSDC.sol"
4. Should compile successfully ✅

### **Step 4: Deploy to Arc Testnet**

1. Click "Deploy & Run Transactions" (left sidebar)
2. Environment: Select **"Injected Provider - MetaMask"**
3. MetaMask will popup:
   - Network: **Arc Testnet**
   - If not, add Arc Testnet to MetaMask:
     ```
     Network Name: Arc Testnet
     RPC URL: https://rpc.testnet.arc.network
     Chain ID: 5042002
     Symbol: USDC
     Explorer: https://testnet.arcscan.app
     ```
4. Click **"Deploy"** button (orange)
5. Confirm transaction in MetaMask
6. Wait 5-10 seconds
7. Copy deployed contract address (appears under "Deployed Contracts")

### **Step 5: Add Treasury as Minter**

1. Under "Deployed Contracts", expand MockUSDC
2. Find `addMinter` function
3. Paste treasury address: `0x0e8E0e9C8bb5E02F8c73e9f61CA66E56D1de8d77`
4. Click "transact"
5. Confirm in MetaMask
6. Done! ✅

### **Step 6: Update .env File**

Copy the deployed MockUSDC address and update your `.env`:

```bash
# Replace with your deployed MockUSDC address
VITE_MOCK_USDC_ADDRESS=0x...your_deployed_address...
```

### **Step 7: Test Minting**

Open your browser console and test:

```javascript
// In your app, test minting
const mockUsdcAddress = "0x..."; // Your deployed address
const treasuryAddress = "0x0e8E0e9C8bb5E02F8c73e9f61CA66E56D1de8d77";

// Mint 100 USDC to treasury
const abi = [{
  "inputs": [
    {"internalType": "address", "name": "_to", "type": "address"},
    {"internalType": "uint256", "name": "_amount", "type": "uint256"}
  ],
  "name": "mint",
  "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
  "stateMutability": "nonpayable",
  "type": "function"
}];

// Use viem or ethers to call mint
// Amount: 100 USDC = 100 * 10^6 = 100000000
```

## What You Get:

✅ **Full Control**: Mint unlimited test USDC
✅ **Fast Testing**: No waiting for faucets
✅ **Production-Ready**: Same interface as real USDC
✅ **Multi-Minter**: Add your treasury wallet as minter

## Next: CCTP V2 Setup

After MockUSDC is deployed, we'll setup CCTP V2 for production cross-chain transfers!

---

**Need help? Check the contract address and make sure you're on Arc Testnet!**
