// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AICPersonalVault.sol";

contract AICVaultFactory is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public aicToken;
    uint256 public defaultAllocation = 100000 * 10**6;

    mapping(address => address) public userVaults;
    address[] public allVaults;

    uint256 public totalVaultsCreated;
    uint256 public totalAICAllocated;

    event VaultCreated(address indexed user, address vaultAddress, uint256 allocation);
    event AllocationUpdated(uint256 oldAllocation, uint256 newAllocation);
    event FactoryFunded(uint256 amount);

    constructor(address _aicToken) Ownable(msg.sender) {
        require(_aicToken != address(0), "Invalid token address");
        aicToken = IERC20(_aicToken);
    }

    function createVault(address user) external onlyOwner returns (address) {
        require(user != address(0), "Invalid user address");
        require(userVaults[user] == address(0), "Vault already exists");

        uint256 factoryBalance = aicToken.balanceOf(address(this));
        require(factoryBalance >= defaultAllocation, "Insufficient factory balance");

        AICPersonalVault vault = new AICPersonalVault();

        aicToken.safeTransfer(address(vault), defaultAllocation);

        vault.initialize(address(aicToken), user, defaultAllocation);
        vault.transferOwnership(owner());

        userVaults[user] = address(vault);
        allVaults.push(address(vault));

        totalVaultsCreated++;
        totalAICAllocated += defaultAllocation;

        emit VaultCreated(user, address(vault), defaultAllocation);

        return address(vault);
    }

    function setDefaultAllocation(uint256 newAllocation) external onlyOwner {
        require(newAllocation > 0, "Allocation must be positive");
        uint256 oldAllocation = defaultAllocation;
        defaultAllocation = newAllocation;
        emit AllocationUpdated(oldAllocation, newAllocation);
    }

    function fundFactory(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be positive");
        aicToken.safeTransferFrom(msg.sender, address(this), amount);
        emit FactoryFunded(amount);
    }

    function getVault(address user) external view returns (address) {
        return userVaults[user];
    }

    function hasVault(address user) external view returns (bool) {
        return userVaults[user] != address(0);
    }

    function getFactoryBalance() external view returns (uint256) {
        return aicToken.balanceOf(address(this));
    }

    function getVaultsRemaining() external view returns (uint256) {
        uint256 balance = aicToken.balanceOf(address(this));
        return balance / defaultAllocation;
    }

    function getAllVaults() external view returns (address[] memory) {
        return allVaults;
    }

    function getFactoryStats() external view returns (
        uint256 _totalVaultsCreated,
        uint256 _totalAICAllocated,
        uint256 _factoryBalance,
        uint256 _vaultsRemaining,
        uint256 _defaultAllocation
    ) {
        uint256 balance = aicToken.balanceOf(address(this));
        return (
            totalVaultsCreated,
            totalAICAllocated,
            balance,
            balance / defaultAllocation,
            defaultAllocation
        );
    }

    function withdrawExcessTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be positive");
        uint256 balance = aicToken.balanceOf(address(this));
        require(amount <= balance, "Insufficient balance");

        aicToken.safeTransfer(owner(), amount);
    }
}
