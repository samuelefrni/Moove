// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MooveToken.sol";

contract VehicleAuctions is MooveToken {
    event AcutionStarted(
        uint256 indexed blockTimeStamp,
        uint256 indexed idVehicle
    );
    event AuctionFinished(
        uint256 indexed blockTimeStamp,
        uint256 indexed idVehicle
    );

    struct Status {
        bool startedAt;
        bool willEndAt;
    }

    mapping(uint256 => Status) public auctionStatus;

    constructor(
        string memory _nameToken,
        string memory _symbolToken
    ) MooveToken(_nameToken, _symbolToken) {}
}
