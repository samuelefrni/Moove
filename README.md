<div align="center"><img src="./frontend/src/assets/fav/m-logo-letter-leaves-green-eco-icon-vector-23508485.png" width="150px"></div>
<br />
<div align="center">
  <h1 align="center">Moove</h1>

  <p align="center">
    <br />
    <a href="https://sepolia.etherscan.io/address/0x6e255909129930283806e40ca7bd798678338247"><strong>Contracts on the blockchain</strong></a>
    <br />
    <br />
    <a href="./assets">Presentation IT</a>
  </p>
</div>

## Introduction

Welcome to the Moove project! This repository contains the implementation of a decentralized platform for the sale and management of Non-Fungible Tokens (NFTs) specifically tailored for Moove, a company providing shared micro-mobility services in various European cities. Moove aims to enhance its shared mobility experience by leveraging NFTs to manage its fleet of vehicles.

## About my choice

As you can see, to manage this project i choose to separete it in two folder:

1. **Contracts**: This folder contains the smart contracts that handle all the logic of the project. The `MooveToken.sol` contract manages the Moove tokens, while the `VehicleAuctions.sol` contract handles vehicle auctions. With these contracts, the owner can add new vehicles to sell, and users can purchase them. All smart contracts were developed using Hardhat, a popular Ethereum development framework.

2. **Frontend**: This folder contains the frontend code for the Moove platform. It provides a user interface for interacting with the smart contracts, allowing users to browse available vehicles, place bids in auctions, and manage their Moove tokens. The frontend is built using React, a popular JavaScript library for building user interfaces, and it connects to the Ethereum blockchain using WAGMI, a Web3 library for interacting with Ethereum smart contracts.

## Installation

To install and test this project locally, follow these steps:

1. Clone this repository: `git clone https://github.com/samuelefrni/Moove`
2. Navigate to the contracts folder
3. Install the dependencies of the contracts folder: `npm install`
4. Go to `hardhat.config.ts` and follow the instruction before compile contracts
5. Compile contracts: `npx hardhat compile`
6. Run tests: `npx hardhat test`
7. Run: `npx hardhat node` to run a blockchain on your local enviroment
8. Add the localhost network on your Metamask wallet and import an account from the list that will show up after running the `npx hardhat node`
9.  While the node is still running, deploy the smart contract on your local enviroment: `npx hardhat run .\ignition\modules\deploy.ts --network localhost`
10. Navigate to the frontend folder
11. Create a `.env.local` file on the frontend folder
12. Create two variables on the `.env.local` file: `VITE_PROJECT_ID=YOUR_PROJECT_KEY` and `VITE_CONTRACT_ADDRESS=CONTRACT_ADDRESS`
13. Install the dependencies of the frontend folder: `npm install`
14. Run the app with: `npm run dev`
15. Connect your wallet on the localhost network!

## About testing

## About deployment

**_Before running the "npx hardhat compile"_**

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Author

- **Samuele Furnari**
  - Email: samuelefurnari9@gmail.com
  - GitHub: [samuelefrni](https://github.com/samuelefrni)
  - LinkedIn: [Samuele Furnari](https://www.linkedin.com/in/samuele-furnari-a37567220/)
