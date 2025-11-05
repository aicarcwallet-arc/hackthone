// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AICRewardPool
 * @dev Pre-funded pool of AIC tokens for game rewards
 *
 * BENEFITS:
 * 1. Tokens are already on-chain (no minting needed)
 * 2. Faster claims (just transfer from pool)
 * 3. Visible supply on explorer
 * 4. Gas efficient (transfer cheaper than mint)
 * 5. Can pre-fund with 1M+ AIC tokens
 *
 * USAGE:
 * 1. Deploy contract
 * 2. Transfer AIC tokens to this contract (e.g., 1,000,000 AIC)
 * 3. Authorize backend wallet as distributor
 * 4. Users claim rewards from this pool
 */
contract AICRewardPool is Ownable, ReentrancyGuard {

    IERC20 public immutable aicToken;

    // Authorized distributors (backend wallets)
    mapping(address => bool) public distributors;

    // Track claims per user
    mapping(address => uint256) public totalClaimed;

    // Statistics
    uint256 public totalDistributed;
    uint256 public totalUsers;

    // Events
    event DistributorAdded(address indexed distributor);
    event DistributorRemoved(address indexed distributor);
    event RewardClaimed(
        address indexed user,
        uint256 amount,
        string submissionId
    );
    event PoolFunded(address indexed funder, uint256 amount);
    event EmergencyWithdraw(address indexed to, uint256 amount);

    constructor(address _aicToken) Ownable(msg.sender) {
        require(_aicToken != address(0), "Invalid AIC token address");
        aicToken = IERC20(_aicToken);
    }

    /**
     * @dev Add authorized distributor (backend wallet)
     */
    function addDistributor(address distributor) external onlyOwner {
        require(distributor != address(0), "Invalid distributor");
        require(!distributors[distributor], "Already distributor");
        distributors[distributor] = true;
        emit DistributorAdded(distributor);
    }

    /**
     * @dev Remove distributor
     */
    function removeDistributor(address distributor) external onlyOwner {
        require(distributors[distributor], "Not a distributor");
        distributors[distributor] = false;
        emit DistributorRemoved(distributor);
    }

    /**
     * @dev Distribute reward to user
     * Called by backend after game validation
     */
    function distributeReward(
        address user,
        uint256 amount,
        string calldata submissionId
    ) external nonReentrant returns (bool) {
        require(distributors[msg.sender], "Not authorized distributor");
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be positive");

        uint256 poolBalance = aicToken.balanceOf(address(this));
        require(poolBalance >= amount, "Insufficient pool balance");

        // Track first-time user
        if (totalClaimed[user] == 0) {
            totalUsers++;
        }

        // Update statistics
        totalClaimed[user] += amount;
        totalDistributed += amount;

        // Transfer from pool to user
        require(
            aicToken.transfer(user, amount),
            "Transfer failed"
        );

        emit RewardClaimed(user, amount, submissionId);
        return true;
    }

    /**
     * @dev Batch distribute (gas efficient for multiple users)
     */
    function batchDistribute(
        address[] calldata users,
        uint256[] calldata amounts,
        string[] calldata submissionIds
    ) external nonReentrant returns (bool) {
        require(distributors[msg.sender], "Not authorized distributor");
        require(
            users.length == amounts.length &&
            users.length == submissionIds.length,
            "Array length mismatch"
        );

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        uint256 poolBalance = aicToken.balanceOf(address(this));
        require(poolBalance >= totalAmount, "Insufficient pool balance");

        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            uint256 amount = amounts[i];

            require(user != address(0), "Invalid user address");
            require(amount > 0, "Amount must be positive");

            if (totalClaimed[user] == 0) {
                totalUsers++;
            }

            totalClaimed[user] += amount;
            totalDistributed += amount;

            require(
                aicToken.transfer(user, amount),
                "Transfer failed"
            );

            emit RewardClaimed(user, amount, submissionIds[i]);
        }

        return true;
    }

    /**
     * @dev Fund the pool with AIC tokens
     * Anyone can fund, but usually owner
     */
    function fundPool(uint256 amount) external returns (bool) {
        require(amount > 0, "Amount must be positive");

        require(
            aicToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        emit PoolFunded(msg.sender, amount);
        return true;
    }

    /**
     * @dev Get current pool balance
     */
    function getPoolBalance() external view returns (uint256) {
        return aicToken.balanceOf(address(this));
    }

    /**
     * @dev Get user statistics
     */
    function getUserStats(address user) external view returns (
        uint256 claimed,
        bool hasClaimedBefore
    ) {
        claimed = totalClaimed[user];
        hasClaimedBefore = claimed > 0;
    }

    /**
     * @dev Get pool statistics
     */
    function getPoolStats() external view returns (
        uint256 currentBalance,
        uint256 distributed,
        uint256 users
    ) {
        currentBalance = aicToken.balanceOf(address(this));
        distributed = totalDistributed;
        users = totalUsers;
    }

    /**
     * @dev Emergency withdraw (owner only)
     * In case of contract migration or emergency
     */
    function emergencyWithdraw(
        address to,
        uint256 amount
    ) external onlyOwner {
        require(to != address(0), "Invalid address");

        uint256 balance = aicToken.balanceOf(address(this));
        require(balance >= amount, "Insufficient balance");

        require(
            aicToken.transfer(to, amount),
            "Transfer failed"
        );

        emit EmergencyWithdraw(to, amount);
    }

    /**
     * @dev Check if address is distributor
     */
    function isDistributor(address account) external view returns (bool) {
        return distributors[account];
    }
}
