// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAICToken {
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IProgrammaticPool {
    function swapAICForUSDC(uint256 aicAmountIn, uint256 minUsdcOut) external returns (uint256);
    function getAICToUSDCQuote(uint256 aicAmount) external view returns (uint256);
}

/**
 * @title TreasuryAutoFill - ZERO CAPITAL LAUNCH
 * @notice Self-funding treasury using AIC mint/burn + programmatic pool
 * @dev NO UPFRONT CAPITAL NEEDED - Mints AIC, swaps for USDC automatically!
 *
 * GENIUS ZERO-CAPITAL STRATEGY:
 * 1. Treasury checks its own balance
 * 2. When low, mints new AIC tokens (controlled inflation)
 * 3. Swaps AIC for USDC via programmatic pool
 * 4. Uses USDC to pay gas fees
 * 5. Burns excess AIC to stabilize supply
 *
 * Launch with $0 - Treasury funds itself from DAY 1!
 */
contract TreasuryAutoFill {
    IAICToken public aicToken;
    IERC20 public immutable usdc;
    IProgrammaticPool public programmaticPool;
    address public owner;
    address public treasury;

    uint256 public constant TARGET_BALANCE = 5000 * 10**6; // 5000 USDC (6 decimals)
    uint256 public constant REFILL_THRESHOLD = 1000 * 10**6; // Refill when below 1000 USDC
    uint256 public constant REFILL_AMOUNT = 4000 * 10**6; // Top up with 4000 USDC
    uint256 public constant MAX_DAILY_MINT = 50000 * 10**18; // 50k AIC max per day

    uint256 public totalRefills;
    uint256 public totalRefillAmount;
    uint256 public lastRefillTime;

    // ZERO CAPITAL TRACKING
    uint256 public totalAICMinted;
    uint256 public totalAICBurned;
    uint256 public lastMintDay;
    uint256 public todayMintAmount;

    event TreasuryRefilled(uint256 amount, uint256 newBalance, uint256 timestamp);
    event TreasurySet(address indexed oldTreasury, address indexed newTreasury);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event EmergencyWithdraw(address indexed token, uint256 amount, address indexed to);
    event ZeroCapitalMint(uint256 aicMinted, uint256 usdcReceived, uint256 timestamp);
    event AICBurnedForStability(uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(
        address _aicToken,
        address _usdc,
        address _programmaticPool,
        address _treasury
    ) {
        require(_aicToken != address(0), "Invalid AIC address");
        require(_usdc != address(0), "Invalid USDC address");
        require(_programmaticPool != address(0), "Invalid pool address");
        require(_treasury != address(0), "Invalid treasury address");

        aicToken = IAICToken(_aicToken);
        usdc = IERC20(_usdc);
        programmaticPool = IProgrammaticPool(_programmaticPool);
        owner = msg.sender;
        treasury = _treasury;
        lastMintDay = block.timestamp / 1 days;

        emit TreasurySet(address(0), _treasury);
        emit OwnershipTransferred(address(0), msg.sender);
    }

    /**
     * @notice ZERO CAPITAL AUTO-FILL - Mints AIC, swaps for USDC, funds treasury!
     * @dev Anyone can call this to trigger a refill check
     */
    function checkAndRefill() external returns (bool refilled) {
        uint256 treasuryBalance = usdc.balanceOf(treasury);

        if (treasuryBalance >= REFILL_THRESHOLD) {
            return false;
        }

        // Calculate USDC needed
        uint256 usdcNeeded = REFILL_AMOUNT;

        // Calculate AIC to mint (1:1 ratio + 5% buffer for slippage)
        uint256 aicToMint = (usdcNeeded * 10**18) / 10**6; // Convert decimals
        aicToMint = (aicToMint * 105) / 100; // 5% slippage buffer

        // Check daily mint limit (prevent excessive inflation)
        uint256 currentDay = block.timestamp / 1 days;
        if (currentDay > lastMintDay) {
            lastMintDay = currentDay;
            todayMintAmount = 0;
        }
        require(todayMintAmount + aicToMint <= MAX_DAILY_MINT, "Daily mint limit reached");

        // STEP 1: Mint AIC to this contract (ZERO CAPITAL!)
        aicToken.mint(address(this), aicToMint);
        totalAICMinted += aicToMint;
        todayMintAmount += aicToMint;

        // STEP 2: Get swap quote from programmatic pool
        uint256 expectedUSDC = programmaticPool.getAICToUSDCQuote(aicToMint);
        uint256 minUSDC = (expectedUSDC * 95) / 100; // 5% slippage tolerance

        // STEP 3: Approve pool to spend AIC
        aicToken.transfer(address(programmaticPool), aicToMint);

        // STEP 4: Swap AIC for USDC
        uint256 usdcReceived = programmaticPool.swapAICForUSDC(aicToMint, minUSDC);

        // STEP 5: Transfer USDC to treasury
        require(usdc.transfer(treasury, usdcReceived), "Transfer failed");

        totalRefills++;
        totalRefillAmount += usdcReceived;
        lastRefillTime = block.timestamp;

        emit ZeroCapitalMint(aicToMint, usdcReceived, block.timestamp);
        emit TreasuryRefilled(usdcReceived, usdc.balanceOf(treasury), block.timestamp);

        return true;
    }

    /**
     * @notice Get current treasury balance
     */
    function getTreasuryBalance() external view returns (uint256) {
        return usdc.balanceOf(treasury);
    }

    /**
     * @notice Get contract's USDC balance
     */
    function getContractBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    /**
     * @notice Check if treasury needs refilling
     */
    function needsRefill() external view returns (bool) {
        return usdc.balanceOf(treasury) < REFILL_THRESHOLD;
    }

    /**
     * @notice Get refill statistics
     */
    function getRefillStats() external view returns (
        uint256 _totalRefills,
        uint256 _totalAmount,
        uint256 _lastRefillTime,
        uint256 _currentTreasuryBalance,
        bool _needsRefill
    ) {
        return (
            totalRefills,
            totalRefillAmount,
            lastRefillTime,
            usdc.balanceOf(treasury),
            usdc.balanceOf(treasury) < REFILL_THRESHOLD
        );
    }

    /**
     * @notice Set new treasury address
     */
    function setTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid address");
        address oldTreasury = treasury;
        treasury = _newTreasury;
        emit TreasurySet(oldTreasury, _newTreasury);
    }

    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /**
     * @notice Emergency withdraw - owner only
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner).transfer(amount);
        } else {
            IERC20(token).transfer(owner, amount);
        }
        emit EmergencyWithdraw(token, amount, owner);
    }

    /**
     * @notice Burn excess AIC to control inflation
     * @dev Call after collecting fees to reduce supply
     */
    function burnExcessAIC(uint256 amount) external onlyOwner {
        require(aicToken.balanceOf(address(this)) >= amount, "Insufficient AIC");
        aicToken.burn(amount);
        totalAICBurned += amount;
        emit AICBurnedForStability(amount);
    }

    /**
     * @notice Get zero-capital funding statistics
     */
    function getZeroCapitalStats() external view returns (
        uint256 _totalAICMinted,
        uint256 _totalAICBurned,
        uint256 _netInflation,
        uint256 _todaysMintUsed,
        uint256 _dailyMintRemaining
    ) {
        uint256 netInflation = totalAICMinted > totalAICBurned ? totalAICMinted - totalAICBurned : 0;
        uint256 dailyRemaining = MAX_DAILY_MINT > todayMintAmount ? MAX_DAILY_MINT - todayMintAmount : 0;

        return (
            totalAICMinted,
            totalAICBurned,
            netInflation,
            todayMintAmount,
            dailyRemaining
        );
    }

    /**
     * @notice Deposit USDC into contract (optional - not needed for zero-capital!)
     */
    function depositUSDC(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }

    /**
     * @notice View function to calculate how much to refill
     */
    function calculateRefillAmount() external view returns (uint256) {
        uint256 treasuryBalance = usdc.balanceOf(treasury);
        if (treasuryBalance >= REFILL_THRESHOLD) {
            return 0;
        }
        return REFILL_AMOUNT;
    }

    receive() external payable {}
}
