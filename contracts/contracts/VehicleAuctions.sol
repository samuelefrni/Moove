// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MooveToken.sol";

contract VehicleAuctions is MooveToken {
    event AuctionDetails(
        uint256 indexed blockTimeStarted,
        uint256 indexed blockTimeWillEnd,
        uint256 indexed idVehicle
    );
    event AuctionOffer(address indexed signer, uint256 indexed bid);
    event VehicleWithdrawhed(address indexed owner, uint256 indexed idVehicle);

    struct Status {
        uint256 startedAt;
        uint256 willEndAt;
        uint256 winningBid;
        address ownerBid;
    }

    struct RecoverFunds {
        uint256[] totalAmount;
        address[] sender;
    }

    mapping(uint256 => Status) public auctionStatus;
    mapping(uint256 => bool) public isStarted;
    mapping(uint256 => bool) public withdrawhed;
    mapping(address => bool) public fundsRecovered;
    mapping(uint256 => RecoverFunds) internal totalSpend;
    mapping(uint256 => uint256) internal usersThatOffer;

    constructor(
        string memory _nameToken,
        string memory _symbolToken
    ) MooveToken(_nameToken, _symbolToken) {}

    function startAuction(uint256 _idVehicle) external onlyOwner {
        require(
            isAuctionVehicle[_idVehicle] && availableVehicle[_idVehicle],
            "Vehicle doesn't found"
        );

        auctionStatus[_idVehicle] = Status({
            startedAt: block.timestamp,
            willEndAt: block.timestamp + 1 days,
            winningBid: 0,
            ownerBid: address(0)
        });

        isStarted[_idVehicle] = true;

        emit AuctionDetails(
            block.timestamp,
            block.timestamp + 1 days,
            _idVehicle
        );
    }

    function participateAuction(uint256 _idVehicle) public payable {
        require(isAuctionVehicle[_idVehicle], "Vehicle doesn't found");
        if (isStarted[_idVehicle] == false) {
            revert("The auction hasn't started yet");
        } else if (block.timestamp > auctionStatus[_idVehicle].willEndAt) {
            revert("The auction has been closed");
        }

        require(
            msg.value > auctionStatus[_idVehicle].winningBid,
            "The ether value you send has be greater than the winning bid"
        );

        auctionStatus[_idVehicle].winningBid = msg.value;
        auctionStatus[_idVehicle].ownerBid = msg.sender;

        usersThatOffer[_idVehicle] += 1;
        totalSpend[_idVehicle].totalAmount.push(msg.value);
        totalSpend[_idVehicle].sender.push(msg.sender);

        emit AuctionOffer(msg.sender, msg.value);
    }

    function withdrawNFT(uint256 _idVehicle) public {
        require(isAuctionVehicle[_idVehicle], "Vehicle doesn't found");
        require(
            block.timestamp > auctionStatus[_idVehicle].willEndAt,
            "Auction for this vehicle hasn't finished"
        );
        require(
            msg.sender == auctionStatus[_idVehicle].ownerBid,
            "Only the winner of the auction can withdrawals"
        );

        _approve(msg.sender, _idVehicle, ownerOf(_idVehicle));

        transferFrom(ownerOf(_idVehicle), msg.sender, _idVehicle);

        purchasedAuctionVehiclesByAccount[msg.sender].push(_idVehicle);

        withdrawhed[_idVehicle] = true;
        availableVehicle[_idVehicle] = false;
        detailsVehicle[_idVehicle].willEndAt = block.timestamp + 7 days;

        emit VehicleWithdrawhed(msg.sender, _idVehicle);
    }

    function recoverFunds(uint256 _idVehicle) public {
        require(
            block.timestamp > auctionStatus[_idVehicle].willEndAt,
            "Auction for this vehicle hasn't finished"
        );

        require(fundsRecovered[msg.sender] != true, "Funds already recovered");

        require(
            withdrawhed[_idVehicle],
            "Please wait until the winner collects the vehicle"
        );

        require(
            msg.sender != auctionStatus[_idVehicle].ownerBid,
            "Winner of the auction can't recover funds"
        );

        require(fundsRecovered[msg.sender] == false, "Funds already recovered");

        uint256 allUsers = usersThatOffer[_idVehicle];

        for (uint i = 0; i < allUsers; i++) {
            if (totalSpend[_idVehicle].sender[i] == msg.sender) {
                payable(totalSpend[_idVehicle].sender[i]).transfer(
                    totalSpend[_idVehicle].totalAmount[i]
                );
            }
        }

        fundsRecovered[msg.sender] = true;
    }

    function expiryCheckAuction(uint256 _idVehicle) external onlyOwner {
        bool expired = false;

        require(isAuctionVehicle[_idVehicle], "Vehicle doesn't found");

        if (block.timestamp > detailsVehicle[_idVehicle].willEndAt) {
            expired = true;
        }

        require(expired == true, "The subscription has not yet expired");

        _approve(msg.sender, _idVehicle, ownerOf(_idVehicle));

        transferFrom(ownerOf(_idVehicle), msg.sender, _idVehicle);

        detailsVehicle[_idVehicle].willEndAt = 0;
        availableVehicle[_idVehicle] = true;
        isStarted[_idVehicle] = false;

        emit VehicleExpired(_idVehicle);
    }

    function purchasedAuctionVehiclesByAddress(
        address _account
    ) public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < allVehicle.length; i++) {
            if (
                availableVehicle[allVehicle[i]] == false &&
                ownerOf(allVehicle[i]) == _account &&
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
                ownerOf(allVehicle[i]) == _account &&
                isAuctionVehicle[allVehicle[i]]
            ) {
                purchasedAuctionVehicle[index] = allVehicle[i];
                index++;
            }
        }

        return purchasedAuctionVehicle;
    }
}
