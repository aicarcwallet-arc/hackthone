// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Linea Treasury Manager
 * @notice Manages treasury balance and gas sponsorship for Linea Mainnet
 * @dev Handles ETH for gas fees on Linea network
 */
contract LineaTreasuryManager {
    address public owner;
    address public backupWallet;
    address public operatorWallet;

    uint256 public minBalance = 30 ether;
    uint256 public refillAmount = 50 ether;
    uint256 public totalGasSpent;
    uint256 public totalBridgeVolume;

    bool public autoRefillEnabled = true;

    event TreasuryLow(uint256 currentBalance, uint256 minRequired);
    event TreasuryRefilled(uint256 amount, address indexed from);
    event GasSponsored(address indexed user, uint256 gasUsed, uint256 gasCost);
    event BridgeProcessed(address indexed user, uint256 usdcAmount);
    event CardLoadSponsored(address indexed user, uint256 gasCost);

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
     * @notice Check treasury balance and alert if low
     */
    function checkAndRefill() public onlyOperator {
        uint256 currentBalance = address(this).balance;

        if (currentBalance < minBalance && autoRefillEnabled) {
            emit TreasuryLow(currentBalance, minBalance);
        }
    }

    /**
     * @notice Sponsor gas for bridge transaction
     */
    function sponsorBridgeGas(address user, uint256 gasUsed, uint256 gasPrice, uint256 usdcAmount) external onlyOperator {
        uint256 gasCost = gasUsed * gasPrice;
        require(address(this).balance >= gasCost, "Insufficient treasury");

        totalGasSpent += gasCost;
        totalBridgeVolume += usdcAmount;

        emit GasSponsored(user, gasUsed, gasCost);
        emit BridgeProcessed(user, usdcAmount);

        checkAndRefill();
    }

    /**
     * @notice Sponsor gas for MetaMask Card loading
     */
    function sponsorCardLoad(address user, uint256 gasCost) external onlyOperator {
        require(address(this).balance >= gasCost, "Insufficient treasury");

        totalGasSpent += gasCost;

        emit CardLoadSponsored(user, gasCost);
        checkAndRefill();
    }

    /**
     * @notice Get treasury metrics
     */
    function getTreasuryMetrics() external view returns (
        uint256 currentBalance,
        uint256 minimumBalance,
        bool needsRefill,
        uint256 totalSpent,
        uint256 bridgeVolume,
        uint256 avgGasPerBridge
    ) {
        currentBalance = address(this).balance;
        minimumBalance = minBalance;
        needsRefill = currentBalance < minBalance;
        totalSpent = totalGasSpent;
        bridgeVolume = totalBridgeVolume;
        avgGasPerBridge = totalBridgeVolume > 0 ? totalGasSpent / (totalBridgeVolume / 1e18) : 0;
    }

    /**
     * @notice Refill treasury
     */
    function refill() external payable {
        require(msg.sender == backupWallet || msg.sender == owner, "Not authorized");
        require(msg.value > 0, "Must send funds");

        emit TreasuryRefilled(msg.value, msg.sender);
    }

    /**
     * @notice Update parameters
     */
    function updateParameters(uint256 _minBalance, uint256 _refillAmount) external onlyOwner {
        minBalance = _minBalance;
        refillAmount = _refillAmount;
    }

    /**
     * @notice Emergency withdraw
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");

        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");
    }

    receive() external payable {
        emit TreasuryRefilled(msg.value, msg.sender);
    }
}
