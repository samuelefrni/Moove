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
    event VehicleExpired(uint256 indexed idVehicle);

    struct Vehicle {
        uint256 id;
        string name;
        string model;
        uint256 priceVehicle;
        uint256 willEndAt;
    }

    address internal _owner;
    uint256 internal nextVehicleId;
    uint256[] internal allVehicle;

    mapping(uint256 => Vehicle) public detailsVehicle;
    mapping(uint256 => bool) public isAuctionVehicle;
    mapping(uint256 => bool) public availableVehicle;
    mapping(address => uint256[]) public purchasedVehiclesByAccount;
    mapping(address => uint256[]) public purchasedAuctionVehiclesByAccount;

    constructor(
        string memory _nameToken,
        string memory _symbolToken
    ) ERC721(_nameToken, _symbolToken) Ownable(msg.sender) {
        _owner = msg.sender;
        nextVehicleId = 0;
    }

    function addVehicle(
        string memory _name,
        string memory _model,
        uint256 _priceVehicle
    ) external onlyOwner {
        nextVehicleId++;
        uint256 _id = nextVehicleId;
        detailsVehicle[_id] = Vehicle({
            id: _id,
            name: _name,
            model: _model,
            priceVehicle: _priceVehicle,
            willEndAt: 0
        });
        allVehicle.push(_id);
        availableVehicle[_id] = true;
        _safeMint(msg.sender, _id);
        emit NFTVehicleCreated(_name, _model);
    }

    function addVehicleAuctions(
        string memory _name,
        string memory _model
    ) external onlyOwner {
        nextVehicleId++;
        uint256 _id = nextVehicleId;
        detailsVehicle[_id] = Vehicle({
            id: _id,
            name: _name,
            model: _model,
            priceVehicle: 0,
            willEndAt: 0
        });
        allVehicle.push(_id);
        isAuctionVehicle[_id] = true;
        availableVehicle[_id] = true;
        _safeMint(msg.sender, _id);
        emit NFTAuctionsVehicles(_name, _model);
    }

    function buyNFTVehicle(uint256 _idVehicle) external payable {
        require(_idVehicle <= nextVehicleId, "Vehicle doesn't found");

        uint256 priceVehicle = detailsVehicle[_idVehicle].priceVehicle;

        require(
            ownerOf(_idVehicle) == _owner,
            "The vehicle has already been taken by another user"
        );
        require(
            msg.value >= priceVehicle,
            "Doesn't have enough funds to buy this vehicle"
        );

        _approve(msg.sender, _idVehicle, ownerOf(_idVehicle));

        transferFrom(ownerOf(_idVehicle), msg.sender, _idVehicle);

        availableVehicle[_idVehicle] = false;
        detailsVehicle[_idVehicle].willEndAt = block.timestamp + 1 days;
        purchasedVehiclesByAccount[msg.sender].push(_idVehicle);

        emit NFTVehicleBuyed(_idVehicle, msg.sender);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public override {
        super.transferFrom(_from, _to, _tokenId);
        emit NFTVehicleTransferred(_tokenId, _from, _to);
    }

    function expiryCheck(uint256 _idVehicle) external onlyOwner {
        require(_idVehicle <= nextVehicleId, "Vehicle doesn't found");

        bool expired = false;

        if (block.timestamp > detailsVehicle[_idVehicle].willEndAt) {
            expired = true;
        }

        require(expired == true, "The subscription has not yet expired");

        _approve(msg.sender, _idVehicle, ownerOf(_idVehicle));

        transferFrom(ownerOf(_idVehicle), msg.sender, _idVehicle);

        availableVehicle[_idVehicle] = true;
        detailsVehicle[_idVehicle].willEndAt = 0;

        emit VehicleExpired(_idVehicle);
    }

    function availableVehicleIds() public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < allVehicle.length; i++) {
            if (
                availableVehicle[allVehicle[i]] &&
                isAuctionVehicle[allVehicle[i]] == false
            ) {
                count++;
            }
        }

        uint256[] memory availableVehicles = new uint256[](count);
        uint256 index = 0;

        for (uint i = 0; i < allVehicle.length; i++) {
            if (
                availableVehicle[allVehicle[i]] &&
                isAuctionVehicle[allVehicle[i]] == false
            ) {
                availableVehicles[index] = allVehicle[i];
                index++;
            }
        }

        return availableVehicles;
    }

    function availableAuctionVehicleIds()
        public
        view
        returns (uint256[] memory)
    {
        uint256 count = 0;
        for (uint i = 0; i < allVehicle.length; i++) {
            if (
                availableVehicle[allVehicle[i]] &&
                isAuctionVehicle[allVehicle[i]]
            ) {
                count++;
            }
        }

        uint256[] memory availableAuctionVehicles = new uint256[](count);
        uint256 index = 0;

        for (uint i = 0; i < allVehicle.length; i++) {
            if (
                availableVehicle[allVehicle[i]] &&
                isAuctionVehicle[allVehicle[i]]
            ) {
                availableAuctionVehicles[index] = allVehicle[i];
                index++;
            }
        }

        return availableAuctionVehicles;
    }

    function purchasedVehicleIds() public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < allVehicle.length; i++) {
            if (
                availableVehicle[allVehicle[i]] == false &&
                isAuctionVehicle[allVehicle[i]] == false
            ) {
                count++;
            }
        }

        uint256[] memory purchasedVehicle = new uint256[](count);
        uint256 index = 0;

        for (uint i = 0; i < allVehicle.length; i++) {
            if (
                availableVehicle[allVehicle[i]] == false &&
                isAuctionVehicle[allVehicle[i]] == false
            ) {
                purchasedVehicle[index] = allVehicle[i];
                index++;
            }
        }

        return purchasedVehicle;
    }

    function purchasedAuctionVehicleIds()
        public
        view
        returns (uint256[] memory)
    {
        uint256 count = 0;
        for (uint i = 0; i < allVehicle.length; i++) {
            if (
                availableVehicle[allVehicle[i]] == false &&
                isAuctionVehicle[allVehicle[i]]
            ) {
                count++;
            }
        }

        uint256[] memory purchasedAuctionVehicle = new uint256[](count);
        uint256 index = 0;

        for (uint i = 0; i < allVehicle.length; i++) {
            if (
                availableVehicle[allVehicle[i]] == false &&
                isAuctionVehicle[allVehicle[i]]
            ) {
                purchasedAuctionVehicle[index] = allVehicle[i];
                index++;
            }
        }

        return purchasedAuctionVehicle;
    }

    function purchasedVehiclesByAddress(
        address _account
    ) public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < allVehicle.length; i++) {
            if (
                availableVehicle[allVehicle[i]] == false &&
                ownerOf(allVehicle[i]) == _account &&
                isAuctionVehicle[allVehicle[i]] == false
            ) {
                count++;
            }
        }

        uint256[] memory purchasedVehicleByAddress = new uint256[](count);
        uint256 index = 0;

        for (uint i = 0; i < allVehicle.length; i++) {
            if (
                availableVehicle[allVehicle[i]] == false &&
                ownerOf(allVehicle[i]) == _account &&
                isAuctionVehicle[allVehicle[i]] == false
            ) {
                purchasedVehicleByAddress[index] = allVehicle[i];
                index++;
            }
        }

        return purchasedVehicleByAddress;
    }

    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp;
    }
}
