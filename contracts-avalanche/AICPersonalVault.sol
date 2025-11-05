// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AICPersonalVault is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public aicToken;
    address public user;
    address public manager;

    uint256 public totalAllocated;
    uint256 public totalMined;
    uint256 public totalRedeemed;

    bool public initialized;

    event TokensMined(address indexed user, uint256 amount, uint256 totalMined);
    event TokensRedeemed(address indexed user, uint256 amount);
    event VaultInitialized(address indexed user, uint256 allocation);

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call");
        _;
    }

    modifier onlyUser() {
        require(msg.sender == user, "Only user can call");
        _;
    }

    constructor() Ownable(msg.sender) {
        manager = msg.sender;
    }

    function initialize(
        address _aicToken,
        address _user,
        uint256 _allocation
    ) external onlyOwner {
        require(!initialized, "Already initialized");
        require(_user != address(0), "Invalid user address");
        require(_allocation > 0, "Allocation must be positive");

        aicToken = IERC20(_aicToken);
        user = _user;
        totalAllocated = _allocation;
        initialized = true;

        emit VaultInitialized(_user, _allocation);
    }

    function mineTokens(uint256 amount) external onlyManager {
        require(initialized, "Vault not initialized");
        require(totalMined + amount <= totalAllocated, "Exceeds allocation");

        totalMined += amount;
        emit TokensMined(user, amount, totalMined);
    }

    function redeemTokens(uint256 amount) external onlyUser {
        require(initialized, "Vault not initialized");
        require(amount > 0, "Amount must be positive");

        uint256 available = totalMined - totalRedeemed;
        require(amount <= available, "Insufficient mined tokens");

        totalRedeemed += amount;
        aicToken.safeTransfer(user, amount);

        emit TokensRedeemed(user, amount);
    }

    function getAvailableBalance() external view returns (uint256) {
        return totalMined - totalRedeemed;
    }

    function getLockedBalance() external view returns (uint256) {
        return totalAllocated - totalMined;
    }

    function getVaultInfo() external view returns (
        address _user,
        uint256 _totalAllocated,
        uint256 _totalMined,
        uint256 _totalRedeemed,
        uint256 _available,
        uint256 _locked
    ) {
        return (
            user,
            totalAllocated,
            totalMined,
            totalRedeemed,
            totalMined - totalRedeemed,
            totalAllocated - totalMined
        );
    }
}
