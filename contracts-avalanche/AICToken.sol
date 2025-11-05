// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AICToken is ERC20, Ownable {
    uint8 private _decimals = 6;

    constructor() ERC20("AI Compute Token", "AIC") Ownable(msg.sender) {
        _mint(msg.sender, 1000000000 * 10**_decimals);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
