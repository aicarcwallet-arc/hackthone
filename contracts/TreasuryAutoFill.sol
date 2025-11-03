// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/**
 * @title TreasuryAutoFill
 * @notice Automatically maintains a 5000 USDC balance for treasury operations
 * @dev Refills treasury when balance drops below threshold
 */
contract TreasuryAutoFill {
    IERC20 public immutable usdc;
    address public owner;
    address public treasury;

    uint256 public constant TARGET_BALANCE = 5000 * 10**6; // 5000 USDC (6 decimals)
    uint256 public constant REFILL_THRESHOLD = 1000 * 10**6; // Refill when below 1000 USDC
    uint256 public constant REFILL_AMOUNT = 4000 * 10**6; // Top up with 4000 USDC

    uint256 public totalRefills;
    uint256 public totalRefillAmount;
    uint256 public lastRefillTime;

    event TreasuryRefilled(uint256 amount, uint256 newBalance, uint256 timestamp);
    event TreasurySet(address indexed oldTreasury, address indexed newTreasury);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event EmergencyWithdraw(address indexed token, uint256 amount, address indexed to);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _usdc, address _treasury) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_treasury != address(0), "Invalid treasury address");

        usdc = IERC20(_usdc);
        owner = msg.sender;
        treasury = _treasury;

        emit TreasurySet(address(0), _treasury);
        emit OwnershipTransferred(address(0), msg.sender);
    }

    /**
     * @notice Check treasury balance and refill if needed
     * @dev Anyone can call this to trigger a refill check
     */
    function checkAndRefill() external returns (bool refilled) {
        uint256 treasuryBalance = usdc.balanceOf(treasury);

        if (treasuryBalance < REFILL_THRESHOLD) {
            uint256 contractBalance = usdc.balanceOf(address(this));
            require(contractBalance >= REFILL_AMOUNT, "Insufficient contract balance");

            require(usdc.transfer(treasury, REFILL_AMOUNT), "Transfer failed");

            totalRefills++;
            totalRefillAmount += REFILL_AMOUNT;
            lastRefillTime = block.timestamp;

            uint256 newBalance = usdc.balanceOf(treasury);
            emit TreasuryRefilled(REFILL_AMOUNT, newBalance, block.timestamp);

            return true;
        }

        return false;
    }

    /**
     * @notice Get current treasury balance
     */
    function getTreasuryBalance() external view returns (uint256) {
        return usdc.balanceOf(treasury);
    }

    /**
     * @notice Get contract's USDC balance
     */
    function getContractBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    /**
     * @notice Check if treasury needs refilling
     */
    function needsRefill() external view returns (bool) {
        return usdc.balanceOf(treasury) < REFILL_THRESHOLD;
    }

    /**
     * @notice Get refill statistics
     */
    function getRefillStats() external view returns (
        uint256 _totalRefills,
        uint256 _totalAmount,
        uint256 _lastRefillTime,
        uint256 _currentTreasuryBalance,
        bool _needsRefill
    ) {
        return (
            totalRefills,
            totalRefillAmount,
            lastRefillTime,
            usdc.balanceOf(treasury),
            usdc.balanceOf(treasury) < REFILL_THRESHOLD
        );
    }

    /**
     * @notice Set new treasury address
     */
    function setTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid address");
        address oldTreasury = treasury;
        treasury = _newTreasury;
        emit TreasurySet(oldTreasury, _newTreasury);
    }

    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /**
     * @notice Emergency withdraw - owner only
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner).transfer(amount);
        } else {
            IERC20(token).transfer(owner, amount);
        }
        emit EmergencyWithdraw(token, amount, owner);
    }

    /**
     * @notice Deposit USDC into contract
     */
    function depositUSDC(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }

    /**
     * @notice View function to calculate how much to refill
     */
    function calculateRefillAmount() external view returns (uint256) {
        uint256 treasuryBalance = usdc.balanceOf(treasury);
        if (treasuryBalance >= REFILL_THRESHOLD) {
            return 0;
        }
        return REFILL_AMOUNT;
    }

    receive() external payable {}
}
