// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/token/ERC721/ERC721.sol";
import "@openzeppelin/access/Ownable.sol";

contract MooveToken is ERC721, Ownable {
    constructor() ERC721("MooveToken", "MT") Ownable(msg.sender) {}
}
