// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MooveToken is ERC721, Ownable {
    address s_owner;

    struct Vehicle {
        uint256 id;
        string name;
        string model;
        uint256 priceVehicle;
        bool available;
        address owner;
    }

    mapping(uint256 => Vehicle) public detailsVehicle;
    mapping(uint256 => bool) public availableVehicle;

    uint256[] public allVehicle;

    constructor(
        string memory _nameToken,
        string memory _symbolToken
    ) ERC721(_nameToken, _symbolToken) Ownable(msg.sender) {
        s_owner = msg.sender;
    }

    function addVehicle(
        uint256 _id,
        string memory _name,
        string memory _model,
        uint256 _priceVehicle
    ) external onlyOwner {
        detailsVehicle[_id] = Vehicle({
            id: _id,
            name: _name,
            model: _model,
            priceVehicle: _priceVehicle,
            available: true,
            owner: address(this)
        });
        availableVehicle[_id] = true;
        allVehicle.push(_id);
        _safeMint(address(this), _id);
    }

    function buyNFTVehicle(uint256 _idVehicle) external payable {
        bool found = false;
        uint256 indexVehicle;

        for (uint i = 0; i < allVehicle.length; i++) {
            if (allVehicle[i] == _idVehicle) {
                found = true;
                indexVehicle = i;
                break;
            }
        }

        uint256 priceVehicle = detailsVehicle[_idVehicle].priceVehicle;
        address ownerVehicle = detailsVehicle[_idVehicle].owner;

        require(found == true, "Vehicle doesn't found");
        require(
            msg.value >= priceVehicle,
            "Doesn't have enough funds to buy this vehicle"
        );

        transferFrom(ownerVehicle, msg.sender, _idVehicle);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public override {
        super.transferFrom(_from, _to, _tokenId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) external pure returns (bytes4) {
        return
            bytes4(
                keccak256("onERC721Received(address,address,uint256,bytes)")
            );
    }
}
