// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface ILineaTreasuryManager {
    function sponsorBridgeGas(address user, uint256 gasUsed, uint256 gasPrice, uint256 usdcAmount) external;
}

/**
 * @title Linea Bridge Receiver
 * @notice Receives bridged USDC on Linea and distributes to users (gasless)
 * @dev Works with Arc to Linea bridge - sponsored by Linea treasury
 */
contract LineaBridgeReceiver {
    IERC20 public usdcToken;
    ILineaTreasuryManager public treasuryManager;
    address public owner;
    address public operator;

    mapping(bytes32 => bool) public completedTransfers;
    mapping(address => uint256) public userReceived;

    uint256 public totalReceived;
    uint256 public totalUsers;

    event USDCReceived(
        bytes32 indexed transferId,
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );

    event CardLoadReady(
        address indexed user,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyOperator() {
        require(msg.sender == operator || msg.sender == owner, "Not operator");
        _;
    }

    constructor(
        address _usdcToken,
        address _treasuryManager,
        address _operator
    ) {
        usdcToken = IERC20(_usdcToken);
        treasuryManager = ILineaTreasuryManager(_treasuryManager);
        owner = msg.sender;
        operator = _operator;
    }

    /**
     * @notice Release bridged USDC to user on Linea (gasless)
     * @param transferId Transfer ID from Arc bridge
     * @param user User address on Linea
     * @param amount Amount of USDC to release
     */
    function releaseBridgedUSDC(
        bytes32 transferId,
        address user,
        uint256 amount
    ) external onlyOperator {
        require(!completedTransfers[transferId], "Already completed");
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Invalid amount");

        // Mark as completed
        completedTransfers[transferId] = true;

        // Transfer USDC to user (gasless - treasury sponsors)
        require(usdcToken.transfer(user, amount), "USDC transfer failed");

        // Update stats
        if (userReceived[user] == 0) {
            totalUsers++;
        }
        userReceived[user] += amount;
        totalReceived += amount;

        // Sponsor gas from treasury
        uint256 gasUsed = gasleft();
        treasuryManager.sponsorBridgeGas(user, gasUsed, tx.gasprice, amount);

        emit USDCReceived(transferId, user, amount, block.timestamp);
        emit CardLoadReady(user, amount);
    }

    /**
     * @notice Batch release multiple transfers (gas optimization)
     */
    function batchRelease(
        bytes32[] calldata transferIds,
        address[] calldata users,
        uint256[] calldata amounts
    ) external onlyOperator {
        require(transferIds.length == users.length && users.length == amounts.length, "Array length mismatch");

        for (uint256 i = 0; i < transferIds.length; i++) {
            if (!completedTransfers[transferIds[i]]) {
                completedTransfers[transferIds[i]] = true;

                require(usdcToken.transfer(users[i], amounts[i]), "USDC transfer failed");

                if (userReceived[users[i]] == 0) {
                    totalUsers++;
                }
                userReceived[users[i]] += amounts[i];
                totalReceived += amounts[i];

                emit USDCReceived(transferIds[i], users[i], amounts[i], block.timestamp);
                emit CardLoadReady(users[i], amounts[i]);
            }
        }

        // Sponsor batch gas
        uint256 gasUsed = gasleft();
        treasuryManager.sponsorBridgeGas(msg.sender, gasUsed, tx.gasprice, 0);
    }

    /**
     * @notice Check if transfer is completed
     */
    function isTransferCompleted(bytes32 transferId) external view returns (bool) {
        return completedTransfers[transferId];
    }

    /**
     * @notice Get user statistics on Linea
     */
    function getUserStats(address user) external view returns (
        uint256 totalReceivedByUser,
        bool hasReceived
    ) {
        return (
            userReceived[user],
            userReceived[user] > 0
        );
    }

    /**
     * @notice Get global statistics
     */
    function getGlobalStats() external view returns (
        uint256 totalVolumeUSD,
        uint256 uniqueUsers,
        uint256 avgPerUser
    ) {
        return (
            totalReceived / 1e6,
            totalUsers,
            totalUsers > 0 ? totalReceived / totalUsers / 1e6 : 0
        );
    }

    /**
     * @notice Update operator
     */
    function updateOperator(address _newOperator) external onlyOwner {
        require(_newOperator != address(0), "Invalid address");
        operator = _newOperator;
    }

    /**
     * @notice Owner can add USDC liquidity
     */
    function addLiquidity(uint256 amount) external {
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }

    /**
     * @notice Emergency withdraw
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= usdcToken.balanceOf(address(this)), "Insufficient balance");
        require(usdcToken.transfer(owner, amount), "Transfer failed");
    }
}
