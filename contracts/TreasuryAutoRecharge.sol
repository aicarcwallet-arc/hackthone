// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title TreasuryAutoRecharge
 * @notice Automatically recharges treasury wallet when USDC balance falls below threshold
 * @dev Can be funded by owner and automatically transfers USDC to treasury when needed
 */
contract TreasuryAutoRecharge is Ownable {
    IERC20 public usdc;
    address public treasuryWallet;

    // Minimum balance threshold - when treasury drops below this, it gets recharged
    uint256 public minimumBalance = 1000 * 10**6; // 1000 USDC (6 decimals)

    // Amount to recharge when balance is low
    uint256 public rechargeAmount = 5000 * 10**6; // 5000 USDC (6 decimals)

    // Events
    event TreasuryRecharged(address indexed treasury, uint256 amount, uint256 timestamp);
    event FundsDeposited(address indexed depositor, uint256 amount);
    event ThresholdUpdated(uint256 newMinimum, uint256 newRecharge);
    event TreasuryWalletUpdated(address indexed newTreasury);
    event EmergencyWithdrawal(address indexed to, uint256 amount);

    constructor(address _usdc, address _treasuryWallet) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_treasuryWallet != address(0), "Invalid treasury address");

        usdc = IERC20(_usdc);
        treasuryWallet = _treasuryWallet;
    }

    /**
     * @notice Deposit USDC into the auto-recharge contract
     * @param amount Amount of USDC to deposit (6 decimals)
     */
    function depositFunds(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        emit FundsDeposited(msg.sender, amount);
    }

    /**
     * @notice Check if treasury needs recharging and recharge if necessary
     * @dev Can be called by anyone (keeper, cron job, or user)
     */
    function checkAndRecharge() external returns (bool recharged) {
        uint256 treasuryBalance = usdc.balanceOf(treasuryWallet);

        // Check if treasury is below minimum threshold
        if (treasuryBalance < minimumBalance) {
            uint256 contractBalance = usdc.balanceOf(address(this));

            // Only recharge if contract has enough funds
            require(contractBalance >= rechargeAmount, "Insufficient contract funds for recharge");

            // Transfer funds to treasury
            require(usdc.transfer(treasuryWallet, rechargeAmount), "Recharge transfer failed");

            emit TreasuryRecharged(treasuryWallet, rechargeAmount, block.timestamp);
            return true;
        }

        return false;
    }

    /**
     * @notice Get treasury balance status
     * @return needsRecharge Whether treasury balance is below threshold
     * @return treasuryBalance Current treasury USDC balance
     * @return contractBalance Current contract USDC balance
     */
    function getTreasuryStatus() external view returns (
        bool needsRecharge,
        uint256 treasuryBalance,
        uint256 contractBalance
    ) {
        treasuryBalance = usdc.balanceOf(treasuryWallet);
        contractBalance = usdc.balanceOf(address(this));
        needsRecharge = treasuryBalance < minimumBalance;
    }

    /**
     * @notice Update recharge thresholds
     * @param newMinimum New minimum balance threshold (6 decimals)
     * @param newRecharge New recharge amount (6 decimals)
     */
    function updateThresholds(uint256 newMinimum, uint256 newRecharge) external onlyOwner {
        require(newMinimum > 0, "Minimum must be greater than 0");
        require(newRecharge > newMinimum, "Recharge amount must be greater than minimum");

        minimumBalance = newMinimum;
        rechargeAmount = newRecharge;

        emit ThresholdUpdated(newMinimum, newRecharge);
    }

    /**
     * @notice Update treasury wallet address
     * @param newTreasury New treasury wallet address
     */
    function updateTreasuryWallet(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        treasuryWallet = newTreasury;

        emit TreasuryWalletUpdated(newTreasury);
    }

    /**
     * @notice Emergency withdrawal function (owner only)
     * @param to Address to withdraw funds to
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(amount > 0 && amount <= usdc.balanceOf(address(this)), "Invalid amount");

        require(usdc.transfer(to, amount), "Withdrawal failed");

        emit EmergencyWithdrawal(to, amount);
    }

    /**
     * @notice Get contract USDC balance
     */
    function getContractBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }
}
