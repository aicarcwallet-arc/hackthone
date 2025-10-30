// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AICSwap
 * @dev Automated Market Maker for AIC/USDC with programmatic pegging
 * Implements constant product formula (x * y = k) with price stability
 */
contract AICSwap is Ownable, ReentrancyGuard {

    IERC20 public aicToken;
    IERC20 public usdcToken;

    // Liquidity tracking
    uint256 public aicReserve;
    uint256 public usdcReserve;
    uint256 public totalLiquidity;

    // LP token tracking
    mapping(address => uint256) public liquidityProvided;

    // Swap fee (0.3% = 30 basis points)
    uint256 public constant SWAP_FEE_BP = 30;
    uint256 public constant BP_DENOMINATOR = 10000;

    // Price peg target (1 AIC = X USDC)
    uint256 public targetPegRatio = 1 * 10**6; // 1:1 initially (6 decimals)

    // Events
    event LiquidityAdded(address indexed provider, uint256 aicAmount, uint256 usdcAmount, uint256 liquidity);
    event LiquidityRemoved(address indexed provider, uint256 aicAmount, uint256 usdcAmount, uint256 liquidity);
    event Swap(address indexed user, address indexed tokenIn, uint256 amountIn, uint256 amountOut);
    event PegRatioUpdated(uint256 oldRatio, uint256 newRatio);

    constructor(address _aicToken, address _usdcToken) Ownable(msg.sender) {
        require(_aicToken != address(0), "Invalid AIC address");
        require(_usdcToken != address(0), "Invalid USDC address");

        aicToken = IERC20(_aicToken);
        usdcToken = IERC20(_usdcToken);
    }

    /**
     * @dev Add liquidity to the pool
     */
    function addLiquidity(
        uint256 aicAmount,
        uint256 usdcAmount
    ) external nonReentrant returns (uint256 liquidity) {
        require(aicAmount > 0 && usdcAmount > 0, "Invalid amounts");

        // Transfer tokens to contract
        require(aicToken.transferFrom(msg.sender, address(this), aicAmount), "AIC transfer failed");
        require(usdcToken.transferFrom(msg.sender, address(this), usdcAmount), "USDC transfer failed");

        // Calculate liquidity tokens to mint
        if (totalLiquidity == 0) {
            // Initial liquidity
            liquidity = sqrt(aicAmount * usdcAmount);
        } else {
            // Proportional liquidity
            uint256 aicLiquidity = (aicAmount * totalLiquidity) / aicReserve;
            uint256 usdcLiquidity = (usdcAmount * totalLiquidity) / usdcReserve;
            liquidity = min(aicLiquidity, usdcLiquidity);
        }

        require(liquidity > 0, "Insufficient liquidity minted");

        // Update reserves and liquidity
        aicReserve += aicAmount;
        usdcReserve += usdcAmount;
        totalLiquidity += liquidity;
        liquidityProvided[msg.sender] += liquidity;

        emit LiquidityAdded(msg.sender, aicAmount, usdcAmount, liquidity);
    }

    /**
     * @dev Remove liquidity from the pool
     */
    function removeLiquidity(uint256 liquidity) external nonReentrant returns (uint256 aicAmount, uint256 usdcAmount) {
        require(liquidity > 0, "Invalid liquidity");
        require(liquidityProvided[msg.sender] >= liquidity, "Insufficient liquidity");

        // Calculate token amounts
        aicAmount = (liquidity * aicReserve) / totalLiquidity;
        usdcAmount = (liquidity * usdcReserve) / totalLiquidity;

        require(aicAmount > 0 && usdcAmount > 0, "Insufficient output");

        // Update state
        liquidityProvided[msg.sender] -= liquidity;
        totalLiquidity -= liquidity;
        aicReserve -= aicAmount;
        usdcReserve -= usdcAmount;

        // Transfer tokens
        require(aicToken.transfer(msg.sender, aicAmount), "AIC transfer failed");
        require(usdcToken.transfer(msg.sender, usdcAmount), "USDC transfer failed");

        emit LiquidityRemoved(msg.sender, aicAmount, usdcAmount, liquidity);
    }

    /**
     * @dev Swap AIC for USDC
     */
    function swapAICForUSDC(uint256 aicAmountIn, uint256 minUsdcOut) external nonReentrant returns (uint256 usdcOut) {
        require(aicAmountIn > 0, "Invalid amount");
        require(aicReserve > 0 && usdcReserve > 0, "Insufficient liquidity");

        // Calculate output with fee
        uint256 aicAmountInWithFee = aicAmountIn * (BP_DENOMINATOR - SWAP_FEE_BP);
        uint256 numerator = aicAmountInWithFee * usdcReserve;
        uint256 denominator = (aicReserve * BP_DENOMINATOR) + aicAmountInWithFee;
        usdcOut = numerator / denominator;

        require(usdcOut >= minUsdcOut, "Slippage exceeded");
        require(usdcOut < usdcReserve, "Insufficient USDC reserve");

        // Transfer tokens
        require(aicToken.transferFrom(msg.sender, address(this), aicAmountIn), "AIC transfer failed");
        require(usdcToken.transfer(msg.sender, usdcOut), "USDC transfer failed");

        // Update reserves
        aicReserve += aicAmountIn;
        usdcReserve -= usdcOut;

        emit Swap(msg.sender, address(aicToken), aicAmountIn, usdcOut);
    }

    /**
     * @dev Swap USDC for AIC
     */
    function swapUSDCForAIC(uint256 usdcAmountIn, uint256 minAicOut) external nonReentrant returns (uint256 aicOut) {
        require(usdcAmountIn > 0, "Invalid amount");
        require(aicReserve > 0 && usdcReserve > 0, "Insufficient liquidity");

        // Calculate output with fee
        uint256 usdcAmountInWithFee = usdcAmountIn * (BP_DENOMINATOR - SWAP_FEE_BP);
        uint256 numerator = usdcAmountInWithFee * aicReserve;
        uint256 denominator = (usdcReserve * BP_DENOMINATOR) + usdcAmountInWithFee;
        aicOut = numerator / denominator;

        require(aicOut >= minAicOut, "Slippage exceeded");
        require(aicOut < aicReserve, "Insufficient AIC reserve");

        // Transfer tokens
        require(usdcToken.transferFrom(msg.sender, address(this), usdcAmountIn), "USDC transfer failed");
        require(aicToken.transfer(msg.sender, aicOut), "AIC transfer failed");

        // Update reserves
        usdcReserve += usdcAmountIn;
        aicReserve -= aicOut;

        emit Swap(msg.sender, address(usdcToken), usdcAmountIn, aicOut);
    }

    /**
     * @dev Get current AIC/USDC price
     */
    function getAICPrice() external view returns (uint256) {
        if (aicReserve == 0) return 0;
        return (usdcReserve * 10**6) / aicReserve;
    }

    /**
     * @dev Get swap quote for AIC to USDC
     */
    function getAICToUSDCQuote(uint256 aicAmountIn) external view returns (uint256) {
        if (aicAmountIn == 0 || aicReserve == 0) return 0;

        uint256 aicAmountInWithFee = aicAmountIn * (BP_DENOMINATOR - SWAP_FEE_BP);
        uint256 numerator = aicAmountInWithFee * usdcReserve;
        uint256 denominator = (aicReserve * BP_DENOMINATOR) + aicAmountInWithFee;
        return numerator / denominator;
    }

    /**
     * @dev Get swap quote for USDC to AIC
     */
    function getUSDCToAICQuote(uint256 usdcAmountIn) external view returns (uint256) {
        if (usdcAmountIn == 0 || usdcReserve == 0) return 0;

        uint256 usdcAmountInWithFee = usdcAmountIn * (BP_DENOMINATOR - SWAP_FEE_BP);
        uint256 numerator = usdcAmountInWithFee * aicReserve;
        uint256 denominator = (usdcReserve * BP_DENOMINATOR) + usdcAmountInWithFee;
        return numerator / denominator;
    }

    /**
     * @dev Update peg ratio (owner only)
     */
    function updatePegRatio(uint256 newRatio) external onlyOwner {
        uint256 oldRatio = targetPegRatio;
        targetPegRatio = newRatio;
        emit PegRatioUpdated(oldRatio, newRatio);
    }

    // Helper functions
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
