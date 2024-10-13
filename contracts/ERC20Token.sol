// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MyToken is ERC20, ERC20Permit {
    address public owner;
    uint256 public purchaseRate;    // Количество токенов за 1 ETH
    uint256 public transferFeeRate; // Процент комиссии за перевод (например, 2 означает 2%)

    constructor(uint256 rate, uint256 feeRate)
    ERC20("MyToken", "MTK")
    ERC20Permit("MyToken") {
        require(feeRate <= 100, "Fee rate should be less than or equal to 100");
        owner = msg.sender;
        purchaseRate = rate;
        transferFeeRate = feeRate;
    }

    function buyToken() public payable {
        require(msg.value > 0, "Send ETH to buy tokens");
        uint256 amountToBuy = msg.value * purchaseRate;
        _mint(msg.sender, amountToBuy);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        uint256 fee = (amount * transferFeeRate) / 100;
        uint256 amountAfterFee = amount - fee;
        _transfer(_msgSender(), owner, fee); // перевести комиссию владельцу
        return super.transfer(recipient, amountAfterFee);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        uint256 fee = (amount * transferFeeRate) / 100;
        uint256 amountAfterFee = amount - fee;
        _transfer(sender, owner, fee); // перевести комиссию владельцу
        return super.transferFrom(sender, recipient, amountAfterFee);
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == owner, "Only owner can mint tokens");
        _mint(to, amount);
    }

}
