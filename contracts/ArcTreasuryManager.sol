// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Arc Treasury Manager
 * @notice Manages treasury balance, auto-refills, and gas sponsorship for Arc Mainnet
 * @dev Monitors balance 24/7, alerts when low, auto-refills from backup wallet
 */
contract ArcTreasuryManager {
    address public owner;
    address public backupWallet;
    address public operatorWallet;

    uint256 public minBalance = 50 ether;
    uint256 public refillAmount = 100 ether;
    uint256 public totalGasSpent;
    uint256 public totalFeesCollected;

    bool public autoRefillEnabled = true;

    event TreasuryLow(uint256 currentBalance, uint256 minRequired);
    event TreasuryRefilled(uint256 amount, address indexed from);
    event GasSponsored(address indexed user, uint256 gasUsed, uint256 gasCost);
    event FeeCollected(address indexed user, uint256 feeAmount);
    event EmergencyWithdraw(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyOperator() {
        require(msg.sender == operatorWallet || msg.sender == owner, "Not operator");
        _;
    }

    constructor(address _backupWallet, address _operatorWallet) payable {
        owner = msg.sender;
        backupWallet = _backupWallet;
        operatorWallet = _operatorWallet;
    }

    /**
     * @notice Check treasury balance and auto-refill if needed
     * @dev Called by Chainlink Automation or similar keeper service
     */
    function checkAndRefill() public onlyOperator {
        uint256 currentBalance = address(this).balance;

        if (currentBalance < minBalance && autoRefillEnabled) {
            emit TreasuryLow(currentBalance, minBalance);

            // Request refill from backup wallet
            // In production, this would trigger an off-chain process
            // or pull from a backup contract
        }
    }

    /**
     * @notice Manually refill treasury from backup wallet
     */
    function refillFromBackup() external payable {
        require(msg.sender == backupWallet || msg.sender == owner, "Not authorized");
        require(msg.value > 0, "Must send funds");

        emit TreasuryRefilled(msg.value, msg.sender);
    }

    /**
     * @notice Sponsor gas for user transaction (called by backend)
     * @param user Address of user whose gas is being sponsored
     * @param gasUsed Amount of gas used in the transaction
     * @param gasPrice Gas price in wei
     */
    function sponsorGas(address user, uint256 gasUsed, uint256 gasPrice) external onlyOperator {
        uint256 gasCost = gasUsed * gasPrice;
        require(address(this).balance >= gasCost, "Insufficient treasury balance");

        totalGasSpent += gasCost;

        emit GasSponsored(user, gasUsed, gasCost);

        // Check if refill needed after spending
        checkAndRefill();
    }

    /**
     * @notice Record conversion fee collected (for profit tracking)
     * @param user User who paid the fee
     * @param feeAmount Amount of fee collected in wei
     */
    function recordFeeCollected(address user, uint256 feeAmount) external onlyOperator {
        totalFeesCollected += feeAmount;
        emit FeeCollected(user, feeAmount);
    }

    /**
     * @notice Get current treasury health metrics
     */
    function getTreasuryHealth() external view returns (
        uint256 currentBalance,
        uint256 minimumBalance,
        bool needsRefill,
        uint256 totalSpent,
        uint256 totalCollected,
        int256 netProfit
    ) {
        currentBalance = address(this).balance;
        minimumBalance = minBalance;
        needsRefill = currentBalance < minBalance;
        totalSpent = totalGasSpent;
        totalCollected = totalFeesCollected;
        netProfit = int256(totalFeesCollected) - int256(totalGasSpent);
    }

    /**
     * @notice Update treasury parameters
     */
    function updateParameters(
        uint256 _minBalance,
        uint256 _refillAmount,
        bool _autoRefillEnabled
    ) external onlyOwner {
        minBalance = _minBalance;
        refillAmount = _refillAmount;
        autoRefillEnabled = _autoRefillEnabled;
    }

    /**
     * @notice Update wallets
     */
    function updateWallets(address _backupWallet, address _operatorWallet) external onlyOwner {
        if (_backupWallet != address(0)) backupWallet = _backupWallet;
        if (_operatorWallet != address(0)) operatorWallet = _operatorWallet;
    }

    /**
     * @notice Emergency withdraw (owner only)
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");

        emit EmergencyWithdraw(owner, amount);

        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");
    }

    /**
     * @notice Receive ETH deposits
     */
    receive() external payable {
        emit TreasuryRefilled(msg.value, msg.sender);
    }
}
