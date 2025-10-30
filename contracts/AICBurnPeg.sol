// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IAICToken {
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
    function decimals() external view returns (uint8);
}

/**
 * @title AICBurnPeg
 * @dev Algorithmic pegging through USDC burning mechanism
 *
 * BURN USDC → MINT AIC (Creates scarcity-based value)
 * - Users burn USDC permanently (send to dead address)
 * - AIC is minted 1:1 with burned USDC
 * - Deflationary mechanism: USDC supply decreases = AIC gains value
 * - Perfect for Arc Network where USDC is native gas token
 */
contract AICBurnPeg is Ownable, ReentrancyGuard {

    IAICToken public aicToken;
    IERC20 public usdcToken;

    // Dead address for burning (0x000000000000000000000000000000000000dEaD)
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    // Tracking
    uint256 public totalUSDCBurned; // Total USDC removed from circulation
    uint256 public totalAICMinted;  // Total AIC minted through burning

    // Burn ratio (adjustable for future)
    uint256 public burnRatio = 10000; // 100% = 10000 (1 USDC burned = 1 AIC minted)
    uint256 public constant BP_DENOMINATOR = 10000;

    // Burn fee (goes to protocol treasury)
    uint256 public burnFee = 50; // 0.5% fee (in basis points)
    address public treasury;

    // Circuit breakers
    bool public burningPaused = false;
    uint256 public minBurnAmount = 1 * 10**6; // Min 1 USDC
    uint256 public maxBurnAmount = 100000 * 10**6; // Max 100k USDC per tx
    uint256 public dailyBurnLimit = 1000000 * 10**6; // 1M USDC per day
    uint256 public lastResetTime;
    uint256 public dailyBurnedAmount;

    // Bonus multipliers for large burns (incentivize burning)
    uint256 public constant TIER1_THRESHOLD = 1000 * 10**6;   // 1,000 USDC
    uint256 public constant TIER2_THRESHOLD = 10000 * 10**6;  // 10,000 USDC
    uint256 public constant TIER3_THRESHOLD = 100000 * 10**6; // 100,000 USDC

    uint256 public constant TIER1_BONUS = 10100; // 1% bonus = 101%
    uint256 public constant TIER2_BONUS = 10300; // 3% bonus = 103%
    uint256 public constant TIER3_BONUS = 10500; // 5% bonus = 105%

    // Events
    event USDCBurned(
        address indexed user,
        uint256 usdcAmount,
        uint256 aicMinted,
        uint256 burnedToDeadAddress,
        uint256 fee
    );
    event BurnRatioUpdated(uint256 oldRatio, uint256 newRatio);
    event BurnFeeUpdated(uint256 oldFee, uint256 newFee);
    event BurningPaused(bool paused);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    constructor(
        address _aicToken,
        address _usdcToken,
        address _treasury
    ) Ownable(msg.sender) {
        require(_aicToken != address(0), "Invalid AIC address");
        require(_usdcToken != address(0), "Invalid USDC address");
        require(_treasury != address(0), "Invalid treasury address");

        aicToken = IAICToken(_aicToken);
        usdcToken = IERC20(_usdcToken);
        treasury = _treasury;
        lastResetTime = block.timestamp;
    }

    /**
     * @dev Burn USDC to mint AIC (1:1 ratio with bonuses)
     * USDC is sent to dead address (permanently removed from circulation)
     * This creates deflationary pressure and backs AIC value
     *
     * @param usdcAmount Amount of USDC to burn
     * @return aicAmount Amount of AIC minted (includes bonus)
     */
    function burnUSDCForAIC(uint256 usdcAmount) external nonReentrant returns (uint256 aicAmount) {
        require(!burningPaused, "Burning is paused");
        require(usdcAmount >= minBurnAmount, "Amount below minimum");
        require(usdcAmount <= maxBurnAmount, "Amount exceeds maximum");

        // Reset daily limits if needed
        _resetDailyLimits();

        // Check daily burn limit
        require(dailyBurnedAmount + usdcAmount <= dailyBurnLimit, "Daily burn limit exceeded");

        // Calculate fee (goes to treasury for protocol sustainability)
        uint256 fee = (usdcAmount * burnFee) / BP_DENOMINATOR;
        uint256 usdcToBurn = usdcAmount - fee;

        // Calculate AIC to mint (1:1 with burned USDC)
        uint256 baseAIC = (usdcToBurn * burnRatio) / BP_DENOMINATOR;

        // Apply bonus multiplier based on burn amount
        uint256 multiplier = _getBurnMultiplier(usdcAmount);
        aicAmount = (baseAIC * multiplier) / BP_DENOMINATOR;

        // Transfer USDC from user
        require(
            usdcToken.transferFrom(msg.sender, address(this), usdcAmount),
            "USDC transfer failed"
        );

        // Send fee to treasury
        if (fee > 0) {
            require(
                usdcToken.transfer(treasury, fee),
                "Fee transfer failed"
            );
        }

        // BURN USDC - Send to dead address (permanently removed)
        require(
            usdcToken.transfer(BURN_ADDRESS, usdcToBurn),
            "USDC burn failed"
        );

        // Mint AIC to user
        aicToken.mint(msg.sender, aicAmount);

        // Update tracking
        totalUSDCBurned += usdcToBurn;
        totalAICMinted += aicAmount;
        dailyBurnedAmount += usdcAmount;

        emit USDCBurned(msg.sender, usdcAmount, aicAmount, usdcToBurn, fee);

        return aicAmount;
    }

    /**
     * @dev Get burn quote - shows how much AIC will be minted
     * @param usdcAmount Amount of USDC to burn
     * @return aicAmount AIC that will be minted
     * @return fee Protocol fee
     * @return bonus Bonus percentage (e.g., 103 = 3% bonus)
     */
    function getBurnQuote(uint256 usdcAmount) external view returns (
        uint256 aicAmount,
        uint256 fee,
        uint256 bonus
    ) {
        fee = (usdcAmount * burnFee) / BP_DENOMINATOR;
        uint256 usdcToBurn = usdcAmount - fee;
        uint256 baseAIC = (usdcToBurn * burnRatio) / BP_DENOMINATOR;

        uint256 multiplier = _getBurnMultiplier(usdcAmount);
        aicAmount = (baseAIC * multiplier) / BP_DENOMINATOR;
        bonus = ((multiplier - BP_DENOMINATOR) * 100) / BP_DENOMINATOR; // Convert to percentage
    }

    /**
     * @dev Get burn multiplier based on amount (incentivize large burns)
     */
    function _getBurnMultiplier(uint256 amount) internal pure returns (uint256) {
        if (amount >= TIER3_THRESHOLD) return TIER3_BONUS; // 5% bonus
        if (amount >= TIER2_THRESHOLD) return TIER2_BONUS; // 3% bonus
        if (amount >= TIER1_THRESHOLD) return TIER1_BONUS; // 1% bonus
        return BP_DENOMINATOR; // No bonus
    }

    /**
     * @dev Get total USDC burned (verifiable on-chain)
     */
    function getTotalBurned() external view returns (uint256) {
        return usdcToken.balanceOf(BURN_ADDRESS);
    }

    /**
     * @dev Get burn statistics
     */
    function getBurnStats() external view returns (
        uint256 totalBurned,
        uint256 totalMinted,
        uint256 burnedInDeadAddress,
        uint256 burnToMintRatio
    ) {
        totalBurned = totalUSDCBurned;
        totalMinted = totalAICMinted;
        burnedInDeadAddress = usdcToken.balanceOf(BURN_ADDRESS);
        burnToMintRatio = totalMinted > 0 ? (totalBurned * 10000) / totalMinted : 0;
    }

    /**
     * @dev Check if burn is allowed
     */
    function canBurn(uint256 usdcAmount) external view returns (bool, string memory reason) {
        if (burningPaused) return (false, "Burning is paused");
        if (usdcAmount < minBurnAmount) return (false, "Below minimum");
        if (usdcAmount > maxBurnAmount) return (false, "Exceeds maximum");

        uint256 currentTime = block.timestamp;
        uint256 currentDailyAmount = dailyBurnedAmount;

        // Reset if 24 hours passed
        if (currentTime >= lastResetTime + 1 days) {
            currentDailyAmount = 0;
        }

        if (currentDailyAmount + usdcAmount > dailyBurnLimit) {
            return (false, "Daily limit exceeded");
        }

        return (true, "Can burn");
    }

    /**
     * @dev Get remaining daily burn capacity
     */
    function getRemainingDailyCapacity() external view returns (uint256) {
        uint256 currentTime = block.timestamp;
        uint256 currentDailyAmount = dailyBurnedAmount;

        // Reset if 24 hours passed
        if (currentTime >= lastResetTime + 1 days) {
            currentDailyAmount = 0;
        }

        if (currentDailyAmount >= dailyBurnLimit) return 0;
        return dailyBurnLimit - currentDailyAmount;
    }

    // Admin Functions

    /**
     * @dev Update burn ratio (owner only)
     * Allows adjusting how much AIC is minted per USDC burned
     */
    function updateBurnRatio(uint256 newRatio) external onlyOwner {
        require(newRatio >= 5000 && newRatio <= 20000, "Ratio must be 50-200%");
        uint256 oldRatio = burnRatio;
        burnRatio = newRatio;
        emit BurnRatioUpdated(oldRatio, newRatio);
    }

    /**
     * @dev Update burn fee (owner only)
     */
    function updateBurnFee(uint256 newFee) external onlyOwner {
        require(newFee <= 500, "Fee too high"); // Max 5%
        uint256 oldFee = burnFee;
        burnFee = newFee;
        emit BurnFeeUpdated(oldFee, newFee);
    }

    /**
     * @dev Update burn limits
     */
    function updateBurnLimits(
        uint256 _minBurn,
        uint256 _maxBurn,
        uint256 _dailyLimit
    ) external onlyOwner {
        require(_minBurn <= _maxBurn, "Invalid limits");
        minBurnAmount = _minBurn;
        maxBurnAmount = _maxBurn;
        dailyBurnLimit = _dailyLimit;
    }

    /**
     * @dev Pause/unpause burning
     */
    function setBurningPaused(bool paused) external onlyOwner {
        burningPaused = paused;
        emit BurningPaused(paused);
    }

    /**
     * @dev Update treasury address
     */
    function updateTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    /**
     * @dev Emergency withdrawal (only fees, not burned USDC)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner(), amount), "Transfer failed");
        emit EmergencyWithdraw(token, amount);
    }

    /**
     * @dev Reset daily limits if 24 hours passed
     */
    function _resetDailyLimits() internal {
        if (block.timestamp >= lastResetTime + 1 days) {
            dailyBurnedAmount = 0;
            lastResetTime = block.timestamp;
        }
    }
}
