// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AIC Collateral Vault
 * @notice Maintains 1:1 peg between AIC token and USDC through collateralization
 * @dev Developer locks USDC → Users can always redeem AIC for USDC
 *
 * KEY CONCEPT:
 * - Developer launches AIC token
 * - Developer deposits USDC as collateral (backing)
 * - AIC tokens are minted as rewards (pegged 1:1 with USDC)
 * - Users can ALWAYS redeem AIC → USDC through this vault
 * - Fully automated, no manual funding needed!
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IAICToken {
    function burn(address from, uint256 amount) external;
    function totalSupply() external view returns (uint256);
}

contract AICCollateralVault {
    IERC20 public immutable USDC;
    IAICToken public immutable AIC;

    address public developer;
    uint256 public totalCollateral;
    uint256 public totalRedeemed;

    // Peg ratio: 1 AIC = 1 USDC (with 6 decimals for USDC)
    uint256 public constant PEG_RATIO = 1e6; // 1 USDC (6 decimals)
    uint256 public constant TOKEN_DECIMALS = 1e6; // AIC uses 6 decimals

    event CollateralDeposited(address indexed developer, uint256 amount);
    event TokensRedeemed(address indexed user, uint256 aicAmount, uint256 usdcAmount);
    event CollateralWithdrawn(address indexed developer, uint256 amount);

    constructor(address _usdc, address _aic) {
        USDC = IERC20(_usdc);
        AIC = IAICToken(_aic);
        developer = msg.sender;
    }

    /**
     * @notice Developer deposits USDC as collateral to back AIC tokens
     * @param amount Amount of USDC to deposit (6 decimals)
     */
    function depositCollateral(uint256 amount) external {
        require(msg.sender == developer, "Only developer can deposit");
        require(amount > 0, "Amount must be greater than 0");

        require(
            USDC.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );

        totalCollateral += amount;

        emit CollateralDeposited(msg.sender, amount);
    }

    /**
     * @notice Users redeem AIC tokens for USDC at 1:1 ratio
     * @param aicAmount Amount of AIC tokens to redeem
     */
    function redeemAICforUSDC(uint256 aicAmount) external {
        require(aicAmount > 0, "Amount must be greater than 0");

        // Calculate USDC to send (1:1 ratio)
        uint256 usdcAmount = aicAmount; // Both are 6 decimals

        // Check if vault has enough USDC
        require(
            USDC.balanceOf(address(this)) >= usdcAmount,
            "Insufficient USDC in vault"
        );

        // Burn AIC tokens from user
        AIC.burn(msg.sender, aicAmount);

        // Send USDC to user
        require(
            USDC.transfer(msg.sender, usdcAmount),
            "USDC transfer failed"
        );

        totalRedeemed += usdcAmount;

        emit TokensRedeemed(msg.sender, aicAmount, usdcAmount);
    }

    /**
     * @notice Developer withdraws excess collateral (only if overcollateralized)
     * @param amount Amount of USDC to withdraw
     */
    function withdrawExcessCollateral(uint256 amount) external {
        require(msg.sender == developer, "Only developer can withdraw");

        uint256 aicSupply = AIC.totalSupply();
        uint256 requiredCollateral = aicSupply; // 1:1 ratio
        uint256 currentCollateral = USDC.balanceOf(address(this));

        require(
            currentCollateral >= requiredCollateral + amount,
            "Insufficient excess collateral"
        );

        require(
            USDC.transfer(developer, amount),
            "USDC transfer failed"
        );

        emit CollateralWithdrawn(developer, amount);
    }

    /**
     * @notice Get collateralization ratio
     * @return Ratio in basis points (10000 = 100%)
     */
    function getCollateralizationRatio() external view returns (uint256) {
        uint256 aicSupply = AIC.totalSupply();
        if (aicSupply == 0) return 0;

        uint256 currentCollateral = USDC.balanceOf(address(this));
        return (currentCollateral * 10000) / aicSupply;
    }

    /**
     * @notice Check if vault is properly collateralized
     */
    function isFullyCollateralized() external view returns (bool) {
        uint256 aicSupply = AIC.totalSupply();
        uint256 currentCollateral = USDC.balanceOf(address(this));
        return currentCollateral >= aicSupply;
    }

    /**
     * @notice Get available USDC for redemption
     */
    function getAvailableUSDC() external view returns (uint256) {
        return USDC.balanceOf(address(this));
    }
}
