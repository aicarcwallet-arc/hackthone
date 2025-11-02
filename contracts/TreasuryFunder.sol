// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Treasury Funder
 * @notice Gasless smart contract for funding the USDC treasury
 * @dev Allows anyone to contribute USDC to the treasury for game rewards
 *
 * KEY FEATURES:
 * - Accept USDC deposits from anyone
 * - Track contributor balances
 * - Emergency withdraw for contributors
 * - Treasury can pull funds as needed
 * - 100% transparent, all deposits on-chain
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract TreasuryFunder {
    IERC20 public immutable USDC;
    address public treasury;
    address public owner;

    // Track individual contributions
    mapping(address => uint256) public contributions;
    uint256 public totalContributions;

    // Track withdrawals to treasury
    uint256 public totalWithdrawnToTreasury;

    event ContributionReceived(address indexed contributor, uint256 amount);
    event FundsWithdrawnToTreasury(uint256 amount);
    event ContributorWithdrawal(address indexed contributor, uint256 amount);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    constructor(address _usdc, address _treasury) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_treasury != address(0), "Invalid treasury address");

        USDC = IERC20(_usdc);
        treasury = _treasury;
        owner = msg.sender;
    }

    /**
     * @notice Anyone can contribute USDC to fund game rewards
     * @param amount Amount of USDC to contribute (6 decimals)
     */
    function contribute(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        require(
            USDC.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );

        contributions[msg.sender] += amount;
        totalContributions += amount;

        emit ContributionReceived(msg.sender, amount);
    }

    /**
     * @notice Treasury pulls funds for game rewards
     * @param amount Amount to withdraw to treasury
     */
    function withdrawToTreasury(uint256 amount) external {
        require(msg.sender == treasury || msg.sender == owner, "Only treasury or owner");
        require(amount > 0, "Amount must be greater than 0");

        uint256 availableBalance = USDC.balanceOf(address(this));
        require(availableBalance >= amount, "Insufficient balance");

        require(
            USDC.transfer(treasury, amount),
            "USDC transfer failed"
        );

        totalWithdrawnToTreasury += amount;

        emit FundsWithdrawnToTreasury(amount);
    }

    /**
     * @notice Auto-fund treasury when balance is low
     * @param threshold Minimum treasury balance to maintain
     */
    function autoFundTreasury(uint256 threshold) external {
        require(msg.sender == treasury || msg.sender == owner, "Only treasury or owner");

        uint256 treasuryBalance = USDC.balanceOf(treasury);

        if (treasuryBalance < threshold) {
            uint256 needed = threshold - treasuryBalance;
            uint256 available = USDC.balanceOf(address(this));
            uint256 toTransfer = needed > available ? available : needed;

            if (toTransfer > 0) {
                require(
                    USDC.transfer(treasury, toTransfer),
                    "USDC transfer failed"
                );

                totalWithdrawnToTreasury += toTransfer;
                emit FundsWithdrawnToTreasury(toTransfer);
            }
        }
    }

    /**
     * @notice Contributors can withdraw their contribution if needed
     * @param amount Amount to withdraw
     */
    function withdrawContribution(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(contributions[msg.sender] >= amount, "Insufficient contribution balance");

        contributions[msg.sender] -= amount;
        totalContributions -= amount;

        require(
            USDC.transfer(msg.sender, amount),
            "USDC transfer failed"
        );

        emit ContributorWithdrawal(msg.sender, amount);
    }

    /**
     * @notice Update treasury address
     */
    function updateTreasury(address newTreasury) external {
        require(msg.sender == owner, "Only owner");
        require(newTreasury != address(0), "Invalid address");

        address oldTreasury = treasury;
        treasury = newTreasury;

        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    /**
     * @notice Get available USDC in contract
     */
    function getAvailableBalance() external view returns (uint256) {
        return USDC.balanceOf(address(this));
    }

    /**
     * @notice Get contributor's balance
     */
    function getContributorBalance(address contributor) external view returns (uint256) {
        return contributions[contributor];
    }

    /**
     * @notice Get total stats
     */
    function getStats() external view returns (
        uint256 _totalContributions,
        uint256 _totalWithdrawn,
        uint256 _availableBalance
    ) {
        return (
            totalContributions,
            totalWithdrawnToTreasury,
            USDC.balanceOf(address(this))
        );
    }
}
