// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AICPersonalVault
 * @dev Personal token vault for individual users
 *
 * CONCEPT: Each user gets their own vault pre-loaded with 100,000 AIC
 *
 * USER PSYCHOLOGY:
 * - User signs up → Sees 100,000 AIC locked in their personal vault
 * - "I have 100K AIC waiting for me on the blockchain!"
 * - Plays game → Unlocks tokens from THEIR OWN vault
 * - Transparent: Can verify on blockchain explorer
 * - Motivation: "I want to unlock all my tokens!"
 *
 * BENEFITS:
 * 1. No central treasury to manage/refill
 * 2. Each user has dedicated contract
 * 3. Visible on blockchain (builds trust)
 * 4. Game-like: "Unlock your treasure!"
 * 5. Scalable: Deploy new vaults as needed
 */
contract AICPersonalVault is Ownable {

    IERC20 public immutable aicToken;

    // The user who owns this vault
    address public immutable vaultOwner;

    // Total tokens allocated to this vault
    uint256 public immutable totalAllocation;

    // Amount unlocked so far
    uint256 public totalUnlocked;

    // Amount claimed/withdrawn so far
    uint256 public totalClaimed;

    // Authorized unlock manager (backend)
    address public unlockManager;

    // Track individual unlock events
    struct UnlockEvent {
        uint256 amount;
        uint256 timestamp;
        string reason; // "game_reward", "bonus", etc.
    }

    UnlockEvent[] public unlockHistory;

    // Events
    event TokensUnlocked(uint256 amount, uint256 totalUnlocked, string reason);
    event TokensClaimed(address indexed to, uint256 amount);
    event UnlockManagerUpdated(address indexed newManager);

    /**
     * @dev Constructor - called when vault is created for user
     * @param _aicToken AIC token contract address
     * @param _vaultOwner User's wallet address
     * @param _totalAllocation Total AIC tokens allocated (e.g., 100,000)
     * @param _unlockManager Backend wallet authorized to unlock tokens
     */
    constructor(
        address _aicToken,
        address _vaultOwner,
        uint256 _totalAllocation,
        address _unlockManager
    ) Ownable(msg.sender) {
        require(_aicToken != address(0), "Invalid token");
        require(_vaultOwner != address(0), "Invalid owner");
        require(_totalAllocation > 0, "Invalid allocation");
        require(_unlockManager != address(0), "Invalid manager");

        aicToken = IERC20(_aicToken);
        vaultOwner = _vaultOwner;
        totalAllocation = _totalAllocation;
        unlockManager = _unlockManager;
    }

    /**
     * @dev Unlock tokens as user earns them through gameplay
     * Can only be called by authorized unlock manager (backend)
     */
    function unlockTokens(uint256 amount, string calldata reason) external {
        require(msg.sender == unlockManager, "Not authorized");
        require(amount > 0, "Amount must be positive");
        require(totalUnlocked + amount <= totalAllocation, "Exceeds allocation");

        totalUnlocked += amount;

        unlockHistory.push(UnlockEvent({
            amount: amount,
            timestamp: block.timestamp,
            reason: reason
        }));

        emit TokensUnlocked(amount, totalUnlocked, reason);
    }

    /**
     * @dev Claim unlocked tokens
     * Can be called by vault owner or unlock manager
     */
    function claimTokens() external returns (uint256) {
        require(
            msg.sender == vaultOwner || msg.sender == unlockManager,
            "Not authorized"
        );

        uint256 availableToClaim = totalUnlocked - totalClaimed;
        require(availableToClaim > 0, "No tokens to claim");

        totalClaimed += availableToClaim;

        require(
            aicToken.transfer(vaultOwner, availableToClaim),
            "Transfer failed"
        );

        emit TokensClaimed(vaultOwner, availableToClaim);
        return availableToClaim;
    }

    /**
     * @dev Claim specific amount
     */
    function claimAmount(uint256 amount) external returns (bool) {
        require(
            msg.sender == vaultOwner || msg.sender == unlockManager,
            "Not authorized"
        );
        require(amount > 0, "Amount must be positive");

        uint256 availableToClaim = totalUnlocked - totalClaimed;
        require(availableToClaim >= amount, "Insufficient unlocked tokens");

        totalClaimed += amount;

        require(
            aicToken.transfer(vaultOwner, amount),
            "Transfer failed"
        );

        emit TokensClaimed(vaultOwner, amount);
        return true;
    }

    /**
     * @dev Get vault statistics
     */
    function getVaultStats() external view returns (
        uint256 allocated,
        uint256 unlocked,
        uint256 claimed,
        uint256 locked,
        uint256 availableToClaim,
        uint256 balance
    ) {
        allocated = totalAllocation;
        unlocked = totalUnlocked;
        claimed = totalClaimed;
        locked = totalAllocation - totalUnlocked;
        availableToClaim = totalUnlocked - totalClaimed;
        balance = aicToken.balanceOf(address(this));
    }

    /**
     * @dev Get unlock history count
     */
    function getUnlockHistoryCount() external view returns (uint256) {
        return unlockHistory.length;
    }

    /**
     * @dev Update unlock manager (owner only)
     */
    function updateUnlockManager(address newManager) external onlyOwner {
        require(newManager != address(0), "Invalid manager");
        unlockManager = newManager;
        emit UnlockManagerUpdated(newManager);
    }

    /**
     * @dev Get current locked amount
     */
    function getLockedAmount() external view returns (uint256) {
        return totalAllocation - totalUnlocked;
    }

    /**
     * @dev Get available to claim
     */
    function getAvailableToClaim() external view returns (uint256) {
        return totalUnlocked - totalClaimed;
    }

    /**
     * @dev Check vault balance matches expected
     */
    function getContractBalance() external view returns (uint256) {
        return aicToken.balanceOf(address(this));
    }

    /**
     * @dev Emergency withdraw (owner only, in case of migration)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = aicToken.balanceOf(address(this));
        require(balance > 0, "No balance");
        require(
            aicToken.transfer(owner(), balance),
            "Transfer failed"
        );
    }
}
