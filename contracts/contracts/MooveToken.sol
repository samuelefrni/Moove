// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MooveToken is ERC721, Ownable {
    event NFTVehicleCreated(string indexed name, string indexed model);
    event NFTVehicleBuyed(uint256 indexed idVehicle, address indexed owner);
    event NFTVehicleTransferred(
        uint256 idVehicle,
        address indexed from,
        address indexed to
    );
    event NFTAuctionsVehicles(string indexed name, string indexed model);

    struct Vehicle {
        uint256 id;
        string name;
        string model;
        uint256 priceVehicle;
        bool available;
        address owner;
    }

    address private _owner;

    mapping(uint256 => Vehicle) public detailsVehicle;
    mapping(uint256 => bool) public availableVehicle;

    uint256[] public allVehicle;
    uint256[] public auctionsVehicles;

    constructor(
        string memory _nameToken,
        string memory _symbolToken
    ) ERC721(_nameToken, _symbolToken) Ownable(msg.sender) {
        _owner = msg.sender;
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
            owner: msg.sender
        });
        availableVehicle[_id] = true;
        allVehicle.push(_id);
        _safeMint(msg.sender, _id);
        emit NFTVehicleCreated(_name, _model);
    }

    function addVehicleAuctions(
        uint256 _id,
        string memory _name,
        string memory _model
    ) external onlyOwner {
        detailsVehicle[_id] = Vehicle({
            id: _id,
            name: _name,
            model: _model,
            priceVehicle: 0,
            available: true,
            owner: msg.sender
        });
        availableVehicle[_id] = true;
        auctionsVehicles.push(_id);
        _safeMint(msg.sender, _id);
        emit NFTAuctionsVehicles(_name, _model);
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
            detailsVehicle[_idVehicle].owner == _owner,
            "The vehicle has already been taken by another user"
        );
        require(
            msg.value >= priceVehicle,
            "Doesn't have enough funds to buy this vehicle"
        );

        _approve(msg.sender, _idVehicle, ownerVehicle);

        transferFrom(ownerVehicle, msg.sender, _idVehicle);

        detailsVehicle[_idVehicle].available = false;
        availableVehicle[_idVehicle] = false;
        emit NFTVehicleBuyed(_idVehicle, msg.sender);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public override {
        super.transferFrom(_from, _to, _tokenId);
        detailsVehicle[_tokenId].owner = _to;
        emit NFTVehicleTransferred(_tokenId, _from, _to);
    }
}
