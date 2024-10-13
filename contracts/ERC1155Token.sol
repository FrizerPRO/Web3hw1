// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract ERC1155WithMetadata is ERC1155URIStorage {
    uint256 private _tokenIds;

    constructor() ERC1155("https://example.com/api/token/{id}.json") {}

    uint256 public constant TOKEN_PRICE = 0.01 ether; // Цена за один токен

    function buyToken(string memory tokenURI, uint256 amount) external payable {
        require(msg.value >= amount * TOKEN_PRICE, "Insufficient payment for tokens");

        _tokenIds += 1;
        uint256 newItemId = _tokenIds;

        _mint(msg.sender, newItemId, amount, "");
        _setURI(newItemId, tokenURI);
    }

}
