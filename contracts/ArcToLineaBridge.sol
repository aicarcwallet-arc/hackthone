// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface ITreasuryManager {
    function sponsorGas(address user, uint256 gasUsed, uint256 gasPrice) external;
}

/**
 * @title Arc to Linea Bridge
 * @notice Bridge USDC from Arc Mainnet to Linea for MetaMask Card cashouts
 * @dev Gasless UX - treasury sponsors all gas fees
 */
contract ArcToLineaBridge {
    IERC20 public usdcToken;
    ITreasuryManager public treasuryManager;
    address public owner;
    address public operator;

    uint256 public bridgeFee = 0; // No bridge fee initially
    uint256 public minBridgeAmount = 10 * 1e6; // 10 USDC minimum
    uint256 public maxBridgeAmount = 10000 * 1e6; // 10,000 USDC maximum

    uint256 public totalBridged;
    uint256 public totalTransactions;

    mapping(bytes32 => bool) public processedTransfers;
    mapping(address => uint256) public userBridgeVolume;
    mapping(address => uint256) public userBridgeCount;

    event BridgeInitiated(
        bytes32 indexed transferId,
        address indexed user,
        uint256 amount,
        uint256 timestamp,
        string lineaAddress
    );

    event BridgeCompleted(
        bytes32 indexed transferId,
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );

    event GasSponsored(address indexed user, uint256 gasCost);

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
        treasuryManager = ITreasuryManager(_treasuryManager);
        owner = msg.sender;
        operator = _operator;
    }

    /**
     * @notice Bridge USDC from Arc to Linea (gasless for user)
     * @param amount Amount of USDC to bridge
     * @param lineaAddress User's address on Linea network
     * @return transferId Unique transfer identifier
     */
    function bridgeToLinea(uint256 amount, string calldata lineaAddress) external returns (bytes32 transferId) {
        require(amount >= minBridgeAmount, "Amount below minimum");
        require(amount <= maxBridgeAmount, "Amount above maximum");
        require(bytes(lineaAddress).length > 0, "Invalid Linea address");

        // Generate unique transfer ID
        transferId = keccak256(abi.encodePacked(
            msg.sender,
            amount,
            block.timestamp,
            totalTransactions
        ));

        require(!processedTransfers[transferId], "Transfer already processed");

        // Lock USDC in bridge contract
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");

        // Mark as processed
        processedTransfers[transferId] = true;

        // Update stats
        totalBridged += amount;
        totalTransactions++;
        userBridgeVolume[msg.sender] += amount;
        userBridgeCount[msg.sender]++;

        // Record gas sponsorship (called by backend)
        uint256 gasUsed = gasleft();
        treasuryManager.sponsorGas(msg.sender, gasUsed, tx.gasprice);

        emit BridgeInitiated(transferId, msg.sender, amount, block.timestamp, lineaAddress);
        emit GasSponsored(msg.sender, gasUsed * tx.gasprice);

        return transferId;
    }

    /**
     * @notice Confirm bridge completion (called by oracle/operator)
     * @param transferId Unique transfer identifier
     * @param user User address
     * @param amount Amount bridged
     */
    function confirmBridgeCompletion(
        bytes32 transferId,
        address user,
        uint256 amount
    ) external onlyOperator {
        require(processedTransfers[transferId], "Transfer not found");

        emit BridgeCompleted(transferId, user, amount, block.timestamp);
    }

    /**
     * @notice Get bridge status
     */
    function getBridgeStatus(bytes32 transferId) external view returns (bool processed) {
        return processedTransfers[transferId];
    }

    /**
     * @notice Get user bridge statistics
     */
    function getUserBridgeStats(address user) external view returns (
        uint256 totalVolume,
        uint256 transactionCount,
        uint256 averageAmount
    ) {
        return (
            userBridgeVolume[user],
            userBridgeCount[user],
            userBridgeCount[user] > 0 ? userBridgeVolume[user] / userBridgeCount[user] : 0
        );
    }

    /**
     * @notice Get global bridge statistics
     */
    function getGlobalStats() external view returns (
        uint256 totalVolumeUSD,
        uint256 totalTxCount,
        uint256 avgBridgeAmount
    ) {
        return (
            totalBridged / 1e6, // Convert to human readable
            totalTransactions,
            totalTransactions > 0 ? totalBridged / totalTransactions / 1e6 : 0
        );
    }

    /**
     * @notice Update bridge parameters
     */
    function updateParameters(
        uint256 _minAmount,
        uint256 _maxAmount,
        uint256 _bridgeFee
    ) external onlyOwner {
        minBridgeAmount = _minAmount;
        maxBridgeAmount = _maxAmount;
        bridgeFee = _bridgeFee;
    }

    /**
     * @notice Update operator address
     */
    function updateOperator(address _newOperator) external onlyOwner {
        require(_newOperator != address(0), "Invalid address");
        operator = _newOperator;
    }

    /**
     * @notice Emergency withdraw locked USDC
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= usdcToken.balanceOf(address(this)), "Insufficient balance");
        require(usdcToken.transfer(owner, amount), "Transfer failed");
    }
}
