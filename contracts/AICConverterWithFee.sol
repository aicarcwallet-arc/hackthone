// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title AIC Converter With Fee
 * @notice Converts AIC tokens to USDC with 0.5% fee for treasury sustainability
 * @dev Fee covers gas costs, making system self-sustaining
 */
contract AICConverterWithFee {
    IERC20 public aicToken;
    IERC20 public usdcToken;
    address public treasuryManager;
    address public owner;

    uint256 public constant FEE_PERCENTAGE = 50; // 0.5% = 50 basis points
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public constant CONVERSION_RATE = 1e18; // 1:1 conversion

    uint256 public totalConverted;
    uint256 public totalFeesCollected;
    uint256 public totalUsers;

    mapping(address => uint256) public userConversions;
    mapping(address => uint256) public userFeespaid;

    event Converted(address indexed user, uint256 aicAmount, uint256 usdcReceived, uint256 fee);
    event FeeCollected(uint256 amount);
    event TreasuryUpdated(address indexed newTreasury);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(
        address _aicToken,
        address _usdcToken,
        address _treasuryManager
    ) {
        aicToken = IERC20(_aicToken);
        usdcToken = IERC20(_usdcToken);
        treasuryManager = _treasuryManager;
        owner = msg.sender;
    }

    /**
     * @notice Convert AIC tokens to USDC with 0.5% fee
     * @param aicAmount Amount of AIC tokens to convert
     * @return usdcAmount Amount of USDC user receives (after fee)
     */
    function convertAICtoUSDC(uint256 aicAmount) external returns (uint256 usdcAmount) {
        require(aicAmount > 0, "Amount must be > 0");

        // Calculate fee (0.5%)
        uint256 fee = (aicAmount * FEE_PERCENTAGE) / FEE_DENOMINATOR;
        uint256 amountAfterFee = aicAmount - fee;

        // Calculate USDC to receive (1:1 ratio)
        usdcAmount = amountAfterFee;

        // Check contract has enough USDC
        require(usdcToken.balanceOf(address(this)) >= usdcAmount, "Insufficient USDC in pool");

        // Transfer AIC from user
        require(aicToken.transferFrom(msg.sender, address(this), aicAmount), "AIC transfer failed");

        // Transfer USDC to user (minus fee)
        require(usdcToken.transfer(msg.sender, usdcAmount), "USDC transfer failed");

        // Track user stats
        if (userConversions[msg.sender] == 0) {
            totalUsers++;
        }
        userConversions[msg.sender] += aicAmount;
        userFeespaid[msg.sender] += fee;

        // Track global stats
        totalConverted += aicAmount;
        totalFeesCollected += fee;

        emit Converted(msg.sender, aicAmount, usdcAmount, fee);
        emit FeeCollected(fee);

        return usdcAmount;
    }

    /**
     * @notice Calculate conversion output with fee
     * @param aicAmount Amount of AIC to convert
     * @return usdcAmount USDC user will receive
     * @return fee Fee amount in AIC
     */
    function calculateConversion(uint256 aicAmount) external pure returns (uint256 usdcAmount, uint256 fee) {
        fee = (aicAmount * FEE_PERCENTAGE) / FEE_DENOMINATOR;
        usdcAmount = aicAmount - fee;
        return (usdcAmount, fee);
    }

    /**
     * @notice Get user conversion statistics
     */
    function getUserStats(address user) external view returns (
        uint256 totalConvertedByUser,
        uint256 totalFeesPaid,
        uint256 conversionCount
    ) {
        return (
            userConversions[user],
            userFeespaid[user],
            userConversions[user] > 0 ? 1 : 0
        );
    }

    /**
     * @notice Get global conversion statistics
     */
    function getGlobalStats() external view returns (
        uint256 totalAICConverted,
        uint256 totalFeesInAIC,
        uint256 totalUniqueUsers,
        uint256 averageConversionSize
    ) {
        return (
            totalConverted,
            totalFeesCollected,
            totalUsers,
            totalUsers > 0 ? totalConverted / totalUsers : 0
        );
    }

    /**
     * @notice Get profitability metrics for treasury
     */
    function getProfitabilityMetrics() external view returns (
        uint256 feesCollectedUSD,
        uint256 feePercentage,
        uint256 totalVolumeUSD
    ) {
        return (
            totalFeesCollected / 1e18, // Convert to human readable
            FEE_PERCENTAGE,
            totalConverted / 1e18
        );
    }

    /**
     * @notice Update treasury manager address
     */
    function updateTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid address");
        treasuryManager = _newTreasury;
        emit TreasuryUpdated(_newTreasury);
    }

    /**
     * @notice Owner can add USDC liquidity to pool
     */
    function addLiquidity(uint256 amount) external onlyOwner {
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }

    /**
     * @notice Emergency withdraw (owner only)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner, amount), "Transfer failed");
    }
}
