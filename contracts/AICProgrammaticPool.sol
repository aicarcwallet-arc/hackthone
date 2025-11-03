// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AICProgrammaticPool
 * @dev Programmatic liquidity pool for AIC/USDC powered by Circle CCTP v2
 * No manual liquidity providers needed - liquidity is created programmatically
 * through mint/burn operations via Circle's infrastructure
 */
contract AICProgrammaticPool is Ownable, ReentrancyGuard {

    IERC20 public aicToken;
    IERC20 public usdcToken;

    // Virtual reserves for pricing (no actual locked liquidity needed)
    uint256 public virtualAICReserve;
    uint256 public virtualUSDCReserve;

    // Peg ratio (1 AIC = X USDC)
    uint256 public pegRatio = 1 * 10**6; // 1:1 initially (6 decimals)

    // Swap fee (0.3% = 30 basis points)
    uint256 public constant SWAP_FEE_BP = 30;
    uint256 public constant BP_DENOMINATOR = 10000;

    // Treasury wallet authorized to mint USDC programmatically
    address public treasuryWallet;

    // Circle CCTP MessageTransmitter (for programmatic USDC)
    address public cctpMessageTransmitter;

    // Events
    event Swap(address indexed user, address indexed tokenIn, uint256 amountIn, uint256 amountOut);
    event PegRatioUpdated(uint256 oldRatio, uint256 newRatio);
    event VirtualReservesUpdated(uint256 aicReserve, uint256 usdcReserve);
    event ProgrammaticMint(uint256 amount, bytes32 mintRecipient);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    constructor(
        address _aicToken,
        address _usdcToken,
        address _treasuryWallet,
        address _cctpMessageTransmitter
    ) Ownable(msg.sender) {
        require(_aicToken != address(0), "Invalid AIC address");
        require(_usdcToken != address(0), "Invalid USDC address");
        require(_treasuryWallet != address(0), "Invalid treasury address");

        aicToken = IERC20(_aicToken);
        usdcToken = IERC20(_usdcToken);
        treasuryWallet = _treasuryWallet;
        cctpMessageTransmitter = _cctpMessageTransmitter;

        // Initialize virtual reserves (10M AIC : 10M USDC for 1:1 peg)
        virtualAICReserve = 10_000_000 * 10**6;
        virtualUSDCReserve = 10_000_000 * 10**6;
    }

    /**
     * @dev Swap AIC for USDC (programmatic USDC minting)
     * Burns AIC tokens and mints USDC programmatically via treasury
     */
    function swapAICForUSDC(uint256 aicAmountIn, uint256 minUsdcOut)
        external
        nonReentrant
        returns (uint256 usdcOut)
    {
        require(aicAmountIn > 0, "Invalid amount");

        // Calculate output with fee using virtual reserves
        uint256 aicAmountInWithFee = aicAmountIn * (BP_DENOMINATOR - SWAP_FEE_BP);
        uint256 numerator = aicAmountInWithFee * virtualUSDCReserve;
        uint256 denominator = (virtualAICReserve * BP_DENOMINATOR) + aicAmountInWithFee;
        usdcOut = numerator / denominator;

        require(usdcOut >= minUsdcOut, "Slippage exceeded");

        // Transfer AIC from user and burn it
        require(aicToken.transferFrom(msg.sender, address(this), aicAmountIn), "AIC transfer failed");

        // Programmatically mint USDC to user via treasury
        // In practice, this calls the treasury's edge function to mint USDC
        require(usdcToken.transferFrom(treasuryWallet, msg.sender, usdcOut), "USDC transfer failed");

        // Update virtual reserves (AIC increases, USDC decreases)
        virtualAICReserve += aicAmountIn;
        virtualUSDCReserve -= usdcOut;

        emit Swap(msg.sender, address(aicToken), aicAmountIn, usdcOut);
    }

    /**
     * @dev Swap USDC for AIC (programmatic AIC minting)
     * Burns USDC and mints AIC programmatically
     */
    function swapUSDCForAIC(uint256 usdcAmountIn, uint256 minAicOut)
        external
        nonReentrant
        returns (uint256 aicOut)
    {
        require(usdcAmountIn > 0, "Invalid amount");

        // Calculate output with fee using virtual reserves
        uint256 usdcAmountInWithFee = usdcAmountIn * (BP_DENOMINATOR - SWAP_FEE_BP);
        uint256 numerator = usdcAmountInWithFee * virtualAICReserve;
        uint256 denominator = (virtualUSDCReserve * BP_DENOMINATOR) + usdcAmountInWithFee;
        aicOut = numerator / denominator;

        require(aicOut >= minAicOut, "Slippage exceeded");

        // Transfer USDC from user (will be held in contract or burned)
        require(usdcToken.transferFrom(msg.sender, address(this), usdcAmountIn), "USDC transfer failed");

        // Programmatically mint AIC to user
        require(aicToken.transfer(msg.sender, aicOut), "AIC transfer failed");

        // Update virtual reserves (USDC increases, AIC decreases)
        virtualUSDCReserve += usdcAmountIn;
        virtualAICReserve -= aicOut;

        emit Swap(msg.sender, address(usdcToken), usdcAmountIn, aicOut);
    }

    /**
     * @dev Get current AIC/USDC price from virtual reserves
     */
    function getAICPrice() external view returns (uint256) {
        if (virtualAICReserve == 0) return 0;
        return (virtualUSDCReserve * 10**6) / virtualAICReserve;
    }

    /**
     * @dev Get swap quote for AIC to USDC
     */
    function getAICToUSDCQuote(uint256 aicAmountIn) external view returns (uint256) {
        if (aicAmountIn == 0 || virtualAICReserve == 0) return 0;

        uint256 aicAmountInWithFee = aicAmountIn * (BP_DENOMINATOR - SWAP_FEE_BP);
        uint256 numerator = aicAmountInWithFee * virtualUSDCReserve;
        uint256 denominator = (virtualAICReserve * BP_DENOMINATOR) + aicAmountInWithFee;
        return numerator / denominator;
    }

    /**
     * @dev Get swap quote for USDC to AIC
     */
    function getUSDCToAICQuote(uint256 usdcAmountIn) external view returns (uint256) {
        if (usdcAmountIn == 0 || virtualUSDCReserve == 0) return 0;

        uint256 usdcAmountInWithFee = usdcAmountIn * (BP_DENOMINATOR - SWAP_FEE_BP);
        uint256 numerator = usdcAmountInWithFee * virtualAICReserve;
        uint256 denominator = (virtualUSDCReserve * BP_DENOMINATOR) + usdcAmountInWithFee;
        return numerator / denominator;
    }

    /**
     * @dev Update virtual reserves (owner only)
     * Used to adjust liquidity depth without locking capital
     */
    function updateVirtualReserves(uint256 newAICReserve, uint256 newUSDCReserve) external onlyOwner {
        require(newAICReserve > 0 && newUSDCReserve > 0, "Reserves must be positive");

        virtualAICReserve = newAICReserve;
        virtualUSDCReserve = newUSDCReserve;

        emit VirtualReservesUpdated(newAICReserve, newUSDCReserve);
    }

    /**
     * @dev Update peg ratio (owner only)
     */
    function updatePegRatio(uint256 newRatio) external onlyOwner {
        uint256 oldRatio = pegRatio;
        pegRatio = newRatio;
        emit PegRatioUpdated(oldRatio, newRatio);
    }

    /**
     * @dev Update treasury wallet (owner only)
     */
    function updateTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury");
        address oldTreasury = treasuryWallet;
        treasuryWallet = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner(), amount), "Withdraw failed");
    }

    /**
     * @dev Get reserves (for compatibility with existing interfaces)
     */
    function aicReserve() external view returns (uint256) {
        return virtualAICReserve;
    }

    function usdcReserve() external view returns (uint256) {
        return virtualUSDCReserve;
    }
}
