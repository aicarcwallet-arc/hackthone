// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AICToken
 * @dev AI Cognitive Token - Earned through vocabulary game performance
 * Designed for Arc blockchain with USDC integration
 */
contract AICToken is ERC20, Ownable {

    // Authorized minters (game validators)
    mapping(address => bool) public minters;

    // Total tokens minted through gameplay
    uint256 public totalGameRewards;

    // Events
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event GameRewardMinted(address indexed player, uint256 amount, string submissionId);

    constructor() ERC20("AI Cognitive Token", "AIC") Ownable(msg.sender) {
        // No initial supply - all AIC minted programmatically!
        // Either: 1) Game rewards 2) USDC burn/lock
    }

    /**
     * @dev Add authorized minter (game validator)
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid minter address");
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    /**
     * @dev Remove authorized minter
     */
    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    /**
     * @dev Mint game rewards to player
     * Can only be called by authorized minters (game validators)
     */
    function mintGameReward(
        address player,
        uint256 amount,
        string memory submissionId
    ) external returns (bool) {
        require(minters[msg.sender], "Not authorized minter");
        require(player != address(0), "Invalid player address");
        require(amount > 0, "Amount must be positive");

        _mint(player, amount);
        totalGameRewards += amount;

        emit GameRewardMinted(player, amount, submissionId);
        return true;
    }

    /**
     * @dev Burn tokens (for swap mechanism)
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Burn tokens from specific address (for vault redemption)
     * Can only be called by authorized minters (including vault)
     */
    function burn(address from, uint256 amount) external {
        require(minters[msg.sender], "Not authorized to burn");
        _burn(from, amount);
    }

    /**
     * @dev Programmable mint - called by bridge/burn contracts
     * Enables USDC → AIC minting (like TON USDC)
     */
    function mint(address to, uint256 amount) external {
        require(minters[msg.sender], "Not authorized to mint");
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be positive");
        _mint(to, amount);
    }

    /**
     * @dev Get token decimals (6 decimals to match USDC on Arc)
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
