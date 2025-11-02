// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract AICConverter {
    IERC20 public immutable aicToken;
    IERC20 public immutable usdcToken;
    address public owner;

    uint256 public totalAICConverted;
    uint256 public totalUSDCDistributed;

    mapping(address => uint256) public userConversions;

    event Converted(address indexed user, uint256 aicAmount, uint256 usdcAmount);
    event LiquidityAdded(address indexed provider, uint256 amount);
    event LiquidityRemoved(address indexed provider, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _aicToken, address _usdcToken) {
        require(_aicToken != address(0), "Invalid AIC address");
        require(_usdcToken != address(0), "Invalid USDC address");

        aicToken = IERC20(_aicToken);
        usdcToken = IERC20(_usdcToken);
        owner = msg.sender;
    }

    /**
     * @notice Convert AIC tokens to USDC at 1:1 ratio
     * @param aicAmount Amount of AIC tokens to convert (18 decimals)
     * @dev Converts AIC (18 decimals) to USDC (6 decimals) at 1:1 value ratio
     */
    function convertAICToUSDC(uint256 aicAmount) external {
        require(aicAmount > 0, "Amount must be greater than 0");

        // Calculate USDC amount (convert from 18 decimals to 6 decimals, maintaining 1:1 value)
        uint256 usdcAmount = aicAmount / 1e12; // 18 decimals to 6 decimals

        require(usdcAmount > 0, "Amount too small");
        require(usdcToken.balanceOf(address(this)) >= usdcAmount, "Insufficient USDC liquidity");

        // Transfer AIC from user to this contract (burns it from circulation)
        require(
            aicToken.transferFrom(msg.sender, address(this), aicAmount),
            "AIC transfer failed"
        );

        // Transfer USDC to user
        require(
            usdcToken.transfer(msg.sender, usdcAmount),
            "USDC transfer failed"
        );

        // Update stats
        totalAICConverted += aicAmount;
        totalUSDCDistributed += usdcAmount;
        userConversions[msg.sender] += usdcAmount;

        emit Converted(msg.sender, aicAmount, usdcAmount);
    }

    /**
     * @notice Get conversion quote
     * @param aicAmount Amount of AIC to convert
     * @return usdcAmount Amount of USDC user will receive
     */
    function getConversionQuote(uint256 aicAmount) external pure returns (uint256 usdcAmount) {
        return aicAmount / 1e12; // 18 decimals to 6 decimals
    }

    /**
     * @notice Check available USDC liquidity
     */
    function getAvailableLiquidity() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }

    /**
     * @notice Get user's total conversions
     */
    function getUserConversions(address user) external view returns (uint256) {
        return userConversions[user];
    }

    /**
     * @notice Get contract stats
     */
    function getStats() external view returns (
        uint256 _totalAICConverted,
        uint256 _totalUSDCDistributed,
        uint256 _availableLiquidity
    ) {
        return (
            totalAICConverted,
            totalUSDCDistributed,
            usdcToken.balanceOf(address(this))
        );
    }

    /**
     * @notice Owner adds USDC liquidity to fund conversions
     */
    function addLiquidity(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(
            usdcToken.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );
        emit LiquidityAdded(msg.sender, amount);
    }

    /**
     * @notice Owner removes USDC liquidity
     */
    function removeLiquidity(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(
            usdcToken.transfer(msg.sender, amount),
            "USDC transfer failed"
        );
        emit LiquidityRemoved(msg.sender, amount);
    }

    /**
     * @notice Owner can withdraw accumulated AIC tokens
     */
    function withdrawAIC(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(
            aicToken.transfer(msg.sender, amount),
            "AIC transfer failed"
        );
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
     * @notice Emergency withdraw for owner
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 usdcBalance = usdcToken.balanceOf(address(this));
        uint256 aicBalance = aicToken.balanceOf(address(this));

        if (usdcBalance > 0) {
            usdcToken.transfer(owner, usdcBalance);
        }

        if (aicBalance > 0) {
            aicToken.transfer(owner, aicBalance);
        }
    }
}
