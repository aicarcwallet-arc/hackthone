# Quick Deploy MockUSDC + Auto-Recharge (5 Minutes)

## Step 1: Deploy MockUSDC (2 minutes)

### Go to Remix:
```
https://remix.ethereum.org
```

### Copy & Paste This Contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockUSDC {
    string public name = "USD Coin (Mock)";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        _mint(msg.sender, 1_000_000 * 10**6); // 1M USDC to start
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
        return true;
    }

    function mint(address to, uint256 amount) public returns (bool) {
        _mint(to, amount);
        return true;
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function burn(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}
```

### Compile & Deploy:
1. Click **"Solidity Compiler"** tab (left sidebar)
2. Select compiler: **0.8.20+**
3. Click **"Compile MockUSDC.sol"**
4. Click **"Deploy & Run"** tab
5. Environment: **Injected Provider - MetaMask**
6. Network: **Arc Testnet** (in MetaMask)
7. Click **"Deploy"** (orange button)
8. Approve transaction in MetaMask

### Save Contract Address:
Copy the deployed contract address (starts with `0x...`)

**Example:** `0x1234...abcd`

---

## Step 2: Mint 5000 USDC to Treasury (1 minute)

### In Remix, Find Your Deployed Contract:
1. Look under **"Deployed Contracts"** at bottom left
2. Expand the contract (click the `>` arrow)
3. Find the **`mint`** function

### Mint to Treasury:
1. **to (address):** `0x0e8E0e9C8bb5E02F8c73e9f61CA66E56D1de8d77`
2. **amount (uint256):** `5000000000` (5000 USDC with 6 decimals)
3. Click **"transact"** (orange button)
4. Approve in MetaMask

✅ **Done! Treasury now has 5000 USDC**

---

## Step 3: Set Up Auto-Recharge (Optional - 2 minutes)

### Why Auto-Recharge?
Automatically refill treasury when balance drops below 1000 USDC.

### Deploy TreasuryAutoRecharge:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract TreasuryAutoRecharge {
    IERC20 public usdc;
    address public owner;
    address public treasuryWallet;

    uint256 public minimumBalance = 1000 * 10**6; // 1000 USDC
    uint256 public rechargeAmount = 5000 * 10**6; // 5000 USDC

    event TreasuryRecharged(address indexed treasury, uint256 amount, uint256 timestamp);
    event FundsDeposited(address indexed depositor, uint256 amount);

    constructor(address _usdc, address _treasuryWallet) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_treasuryWallet != address(0), "Invalid treasury address");

        usdc = IERC20(_usdc);
        treasuryWallet = _treasuryWallet;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function depositFunds(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit FundsDeposited(msg.sender, amount);
    }

    function checkAndRecharge() external returns (bool recharged) {
        uint256 treasuryBalance = usdc.balanceOf(treasuryWallet);

        if (treasuryBalance < minimumBalance) {
            uint256 contractBalance = usdc.balanceOf(address(this));
            require(contractBalance >= rechargeAmount, "Insufficient contract funds");

            require(usdc.transfer(treasuryWallet, rechargeAmount), "Recharge failed");
            emit TreasuryRecharged(treasuryWallet, rechargeAmount, block.timestamp);
            return true;
        }
        return false;
    }

    function getTreasuryStatus() external view returns (
        bool needsRecharge,
        uint256 treasuryBalance,
        uint256 contractBalance
    ) {
        treasuryBalance = usdc.balanceOf(treasuryWallet);
        contractBalance = usdc.balanceOf(address(this));
        needsRecharge = treasuryBalance < minimumBalance;
    }

    function updateThresholds(uint256 newMinimum, uint256 newRecharge) external onlyOwner {
        require(newMinimum > 0, "Minimum must be > 0");
        require(newRecharge > newMinimum, "Recharge must be > minimum");
        minimumBalance = newMinimum;
        rechargeAmount = newRecharge;
    }

    function getContractBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }
}
```

### Deploy Auto-Recharge:
1. Compile with **0.8.20+**
2. **Constructor Parameters:**
   - **_usdc:** `<YOUR_MOCKUSDC_ADDRESS_FROM_STEP_1>`
   - **_treasuryWallet:** `0x0e8E0e9C8bb5E02F8c73e9f61CA66E56D1de8d77`
3. Click **"Deploy"**

### Fund the Auto-Recharge Contract:
1. Go back to **MockUSDC** contract
2. Call **`mint`**:
   - **to:** `<AUTO_RECHARGE_CONTRACT_ADDRESS>`
   - **amount:** `50000000000` (50,000 USDC for 10 recharges)
3. Click **"transact"**

---

## Step 4: Test Auto-Recharge

### Check Treasury Status:
In **TreasuryAutoRecharge** contract:
1. Call **`getTreasuryStatus`**
2. Should show:
   - `needsRecharge: false` (treasury has 5000)
   - `treasuryBalance: 5000000000`
   - `contractBalance: 50000000000`

### Trigger Recharge (when treasury < 1000):
Call **`checkAndRecharge`** anytime to auto-refill!

---

## Step 5: Update Your App

Add to `.env`:

```bash
# MockUSDC Contract Address
VITE_MOCK_USDC_ADDRESS=0x...your_mockusdc_address...

# Auto-Recharge Contract (optional)
VITE_AUTO_RECHARGE_ADDRESS=0x...your_auto_recharge_address...

# Treasury Wallet
VITE_TREASURY_WALLET=0x0e8E0e9C8bb5E02F8c73e9f61CA66E56D1de8d77
```

---

## How It Works

### Normal Flow:
1. User earns AiC tokens
2. User swaps AiC → USDC
3. Treasury sends USDC from its 5000 balance

### Auto-Recharge Flow:
1. Treasury balance drops to 900 USDC (below 1000)
2. Someone calls `checkAndRecharge()` (can be automated)
3. Auto-recharge sends 5000 USDC to treasury
4. Treasury now has 5900 USDC
5. Continues serving users

---

## Monitoring

### Check Balances:
In Remix, call these functions:

**MockUSDC:**
- `balanceOf(treasuryAddress)` → Treasury balance
- `balanceOf(autoRechargeAddress)` → Auto-recharge reserve

**TreasuryAutoRecharge:**
- `getTreasuryStatus()` → Full status report

---

## Quick Reference

### Key Addresses:
- **Treasury:** `0x0e8E0e9C8bb5E02F8c73e9f61CA66E56D1de8d77`
- **MockUSDC:** `<deploy in step 1>`
- **Auto-Recharge:** `<deploy in step 3>`

### Key Amounts (with 6 decimals):
- 1 USDC = `1000000`
- 1000 USDC = `1000000000`
- 5000 USDC = `5000000000`
- 50000 USDC = `50000000000`

---

## Troubleshooting

### "Insufficient balance":
→ Mint more USDC to treasury or auto-recharge contract

### "Insufficient contract funds for recharge":
→ Mint more USDC to auto-recharge contract

### Auto-recharge not triggering:
→ Call `checkAndRecharge()` manually or set up a cron job

---

## Next Steps

1. ✅ Deploy MockUSDC
2. ✅ Mint 5000 to treasury
3. ✅ Deploy auto-recharge (optional)
4. ✅ Fund auto-recharge with 50k (optional)
5. ✅ Update `.env` file
6. ✅ Test the game!

**Total Setup Time: 5 minutes**
**Result: Unlimited testing with auto-refilling treasury** 🚀
