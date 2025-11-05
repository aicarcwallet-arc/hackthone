// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AICPersonalVault.sol";

/**
 * @title AICVaultFactory
 * @dev Factory to create personal vaults for users
 *
 * WORKFLOW:
 * 1. User signs up on platform
 * 2. Backend calls createVault(userAddress)
 * 3. Factory deploys new AICPersonalVault
 * 4. Factory funds vault with 100,000 AIC
 * 5. User sees their personal vault on blockchain
 * 6. User plays game → Unlocks tokens from their vault
 *
 * SCALING:
 * - Deploy vaults on-demand as users sign up
 * - Each vault is independent
 * - No central treasury to manage
 * - Transparent and verifiable
 */
contract AICVaultFactory is Ownable {

    IERC20 public immutable aicToken;

    // Default allocation per vault (100,000 AIC with 6 decimals)
    uint256 public defaultAllocation = 100_000_000000; // 100,000 AIC

    // Unlock manager (backend wallet)
    address public unlockManager;

    // Track all created vaults
    mapping(address => address) public userVaults; // user => vault
    address[] public allVaults;

    // Statistics
    uint256 public totalVaultsCreated;
    uint256 public totalAICAllocated;

    // Events
    event VaultCreated(
        address indexed user,
        address indexed vault,
        uint256 allocation
    );
    event VaultFunded(address indexed vault, uint256 amount);
    event DefaultAllocationUpdated(uint256 newAllocation);
    event UnlockManagerUpdated(address indexed newManager);

    constructor(
        address _aicToken,
        address _unlockManager
    ) Ownable(msg.sender) {
        require(_aicToken != address(0), "Invalid token");
        require(_unlockManager != address(0), "Invalid manager");

        aicToken = IERC20(_aicToken);
        unlockManager = _unlockManager;
    }

    /**
     * @dev Create personal vault for user
     * @param user User's wallet address
     * @return vault Address of created vault
     */
    function createVault(address user) external onlyOwner returns (address) {
        require(user != address(0), "Invalid user");
        require(userVaults[user] == address(0), "Vault already exists");

        // Deploy new personal vault
        AICPersonalVault vault = new AICPersonalVault(
            address(aicToken),
            user,
            defaultAllocation,
            unlockManager
        );

        address vaultAddress = address(vault);

        // Record vault
        userVaults[user] = vaultAddress;
        allVaults.push(vaultAddress);
        totalVaultsCreated++;

        emit VaultCreated(user, vaultAddress, defaultAllocation);

        // Fund vault with AIC tokens
        _fundVault(vaultAddress, defaultAllocation);

        return vaultAddress;
    }

    /**
     * @dev Create vault with custom allocation
     */
    function createVaultWithAllocation(
        address user,
        uint256 allocation
    ) external onlyOwner returns (address) {
        require(user != address(0), "Invalid user");
        require(allocation > 0, "Invalid allocation");
        require(userVaults[user] == address(0), "Vault already exists");

        // Deploy new personal vault
        AICPersonalVault vault = new AICPersonalVault(
            address(aicToken),
            user,
            allocation,
            unlockManager
        );

        address vaultAddress = address(vault);

        // Record vault
        userVaults[user] = vaultAddress;
        allVaults.push(vaultAddress);
        totalVaultsCreated++;

        emit VaultCreated(user, vaultAddress, allocation);

        // Fund vault
        _fundVault(vaultAddress, allocation);

        return vaultAddress;
    }

    /**
     * @dev Batch create vaults for multiple users
     */
    function batchCreateVaults(
        address[] calldata users
    ) external onlyOwner returns (address[] memory) {
        address[] memory vaults = new address[](users.length);

        for (uint256 i = 0; i < users.length; i++) {
            if (users[i] != address(0) && userVaults[users[i]] == address(0)) {
                // Deploy vault
                AICPersonalVault vault = new AICPersonalVault(
                    address(aicToken),
                    users[i],
                    defaultAllocation,
                    unlockManager
                );

                address vaultAddress = address(vault);
                vaults[i] = vaultAddress;

                // Record
                userVaults[users[i]] = vaultAddress;
                allVaults.push(vaultAddress);
                totalVaultsCreated++;

                emit VaultCreated(users[i], vaultAddress, defaultAllocation);

                // Fund
                _fundVault(vaultAddress, defaultAllocation);
            }
        }

        return vaults;
    }

    /**
     * @dev Internal function to fund vault
     */
    function _fundVault(address vault, uint256 amount) private {
        require(
            aicToken.transfer(vault, amount),
            "Transfer failed"
        );

        totalAICAllocated += amount;
        emit VaultFunded(vault, amount);
    }

    /**
     * @dev Get user's vault address
     */
    function getUserVault(address user) external view returns (address) {
        return userVaults[user];
    }

    /**
     * @dev Check if user has vault
     */
    function hasVault(address user) external view returns (bool) {
        return userVaults[user] != address(0);
    }

    /**
     * @dev Get vault statistics for user
     */
    function getUserVaultStats(address user) external view returns (
        bool exists,
        address vaultAddress,
        uint256 allocated,
        uint256 unlocked,
        uint256 claimed,
        uint256 locked,
        uint256 availableToClaim
    ) {
        vaultAddress = userVaults[user];
        exists = vaultAddress != address(0);

        if (exists) {
            AICPersonalVault vault = AICPersonalVault(vaultAddress);
            (
                allocated,
                unlocked,
                claimed,
                locked,
                availableToClaim,
            ) = vault.getVaultStats();
        }
    }

    /**
     * @dev Get factory statistics
     */
    function getFactoryStats() external view returns (
        uint256 vaultsCreated,
        uint256 totalAllocated,
        uint256 factoryBalance
    ) {
        vaultsCreated = totalVaultsCreated;
        totalAllocated = totalAICAllocated;
        factoryBalance = aicToken.balanceOf(address(this));
    }

    /**
     * @dev Update default allocation amount
     */
    function updateDefaultAllocation(uint256 newAllocation) external onlyOwner {
        require(newAllocation > 0, "Invalid allocation");
        defaultAllocation = newAllocation;
        emit DefaultAllocationUpdated(newAllocation);
    }

    /**
     * @dev Update unlock manager
     */
    function updateUnlockManager(address newManager) external onlyOwner {
        require(newManager != address(0), "Invalid manager");
        unlockManager = newManager;
        emit UnlockManagerUpdated(newManager);
    }

    /**
     * @dev Get total vaults count
     */
    function getTotalVaults() external view returns (uint256) {
        return allVaults.length;
    }

    /**
     * @dev Get vault at index
     */
    function getVaultAtIndex(uint256 index) external view returns (address) {
        require(index < allVaults.length, "Index out of bounds");
        return allVaults[index];
    }

    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(
            aicToken.transfer(owner(), amount),
            "Transfer failed"
        );
    }

    /**
     * @dev Fund factory with AIC tokens for future vault creation
     */
    function fundFactory(uint256 amount) external {
        require(
            aicToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
    }
}
