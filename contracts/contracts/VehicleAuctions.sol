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
    mapping(uint256 => bool) isStarted;

    mapping(uint256 => RecoverFunds) totalSpend;
    mapping(uint256 => uint256) usersThatOffer;

    mapping(uint256 => bool) withdrawhed;
    mapping(address => bool) fundsRecovered;

    constructor(
        string memory _nameToken,
        string memory _symbolToken
    ) MooveToken(_nameToken, _symbolToken) {}

    function startAuction(
        uint256 _idVehicle
    ) external onlyOwner IdExist(_idVehicle) {
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

    function participateAuction(
        uint256 _idVehicle
    ) public payable IdExist(_idVehicle) {
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

    function withdrawNFT(uint256 _idVehicle) public IdExist(_idVehicle) {
        require(
            block.timestamp > auctionStatus[_idVehicle].willEndAt,
            "Auction for this vehicle hasn't finished"
        );
        require(
            msg.sender == auctionStatus[_idVehicle].ownerBid,
            "Only the winner of the auction can withdrawals"
        );

        address ownerNFT = detailsVehicle[_idVehicle].owner;

        _approve(msg.sender, _idVehicle, ownerNFT);

        transferFrom(ownerNFT, msg.sender, _idVehicle);

        purchasedAuctionVehiclesByAccount[msg.sender].push(_idVehicle);

        removeVehicleFromAllAuctionVehiclesArray(_idVehicle);

        withdrawhed[_idVehicle] = true;

        detailsVehicle[_idVehicle].available = false;
        detailsVehicle[_idVehicle].owner = msg.sender;
        detailsVehicle[_idVehicle].willEndAt = block.timestamp + 7 days;

        emit VehicleWithdrawhed(msg.sender, _idVehicle);
    }

    function recoverFunds(uint256 _idVehicle) public {
        require(
            block.timestamp > auctionStatus[_idVehicle].willEndAt,
            "Auction for this vehicle hasn't finished"
        );

        bool found = false;

        for (uint256 i = 0; i < auctionVehiclePurchased.length; i++) {
            if (auctionVehiclePurchased[i] == _idVehicle) {
                found = true;
                break;
            }
        }

        require(
            found == true,
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
        bool found = false;
        bool expired = false;

        for (uint256 i = 0; i < auctionVehiclePurchased.length; i++) {
            if (auctionVehiclePurchased[i] == _idVehicle) {
                found = true;
                break;
            }
        }

        if (block.timestamp > detailsVehicle[_idVehicle].willEndAt) {
            expired = true;
        }

        require(found == true, "Vehicle doesn't found");
        require(expired == true, "The subscription has not yet expired");

        address ownerVehicle = detailsVehicle[_idVehicle].owner;

        removePurchasedAuctionVehicleByAccount(_idVehicle, ownerVehicle);

        _approve(msg.sender, _idVehicle, ownerVehicle);

        transferFrom(ownerVehicle, msg.sender, _idVehicle);

        detailsVehicle[_idVehicle].available = true;
        detailsVehicle[_idVehicle].owner = msg.sender;
        detailsVehicle[_idVehicle].willEndAt = 0;
        availableVehicle[_idVehicle] = true;
        isStarted[_idVehicle] = false;

        removeVehicleFromAuctionVehiclePurchasedArray(_idVehicle);

        emit VehicleExpired(_idVehicle);
    }

    function removeVehicleFromAllAuctionVehiclesArray(
        uint256 _idVehicle
    ) internal {
        uint256 index;
        bool found = false;
        for (uint256 i = 0; i < allAuctionsVehicles.length; i++) {
            if (allAuctionsVehicles[i] == _idVehicle) {
                index = i;
                found = true;
                break;
            }
        }
        require(found == true);
        allAuctionsVehicles[index] = allAuctionsVehicles[
            allAuctionsVehicles.length - 1
        ];
        allAuctionsVehicles.pop();
        auctionVehiclePurchased.push(_idVehicle);
    }

    function removeVehicleFromAuctionVehiclePurchasedArray(
        uint256 _idVehicle
    ) internal {
        uint256 index;
        bool found = false;
        for (uint256 i = 0; i < auctionVehiclePurchased.length; i++) {
            if (auctionVehiclePurchased[i] == _idVehicle) {
                index = i;
                found = true;
                break;
            }
        }
        require(found == true);
        auctionVehiclePurchased[index] = auctionVehiclePurchased[
            auctionVehiclePurchased.length - 1
        ];
        auctionVehiclePurchased.pop();
        allAuctionsVehicles.push(_idVehicle);
    }

    function removePurchasedAuctionVehicleByAccount(
        uint256 _idVehicle,
        address _ownerNFT
    ) internal {
        uint256 index;
        bool found = false;
        for (
            uint256 i = 0;
            i < purchasedAuctionVehiclesByAccount[_ownerNFT].length;
            i++
        ) {
            if (purchasedAuctionVehiclesByAccount[_ownerNFT][i] == _idVehicle) {
                index = i;
                found = true;
                break;
            }
        }
        require(found == true);
        purchasedAuctionVehiclesByAccount[_ownerNFT][
            index
        ] = purchasedAuctionVehiclesByAccount[_ownerNFT][
            purchasedAuctionVehiclesByAccount[_ownerNFT].length - 1
        ];
        purchasedAuctionVehiclesByAccount[_ownerNFT].pop();
    }

    function arrayAuctionVehiclePurchased()
        public
        view
        returns (uint256[] memory)
    {
        return auctionVehiclePurchased;
    }

    function arrayAuctionVehiclePurchasedByAddress(
        address _account
    ) public view returns (uint256[] memory) {
        return purchasedAuctionVehiclesByAccount[_account];
    }

    function isAuctionStarted(uint256 _idVehicle) public view returns (bool) {
        return isStarted[_idVehicle];
    }

    function hasWithdrawhed(uint256 _idVehicle) public view returns (bool) {
        return withdrawhed[_idVehicle];
    }

    function hasRecoveredFunds() public view returns (bool) {
        return fundsRecovered[msg.sender];
    }

    modifier IdExist(uint256 _idVehicle) {
        bool found = false;

        for (uint256 i = 0; i < allAuctionsVehicles.length; i++) {
            if (allAuctionsVehicles[i] == _idVehicle) {
                found = true;
                break;
            }
        }

        require(found == true, "Id of the vehicle doesn't found");
        _;
    }
}
