<div align="center"><img src="./frontend/src/assets/fav/m-logo-letter-leaves-green-eco-icon-vector-23508485.png" width="150px"></div>
<br />
<div align="center">
  <h1 align="center">Moove</h1>

  <p align="center">
    <br />
    <a href="https://sepolia.etherscan.io/address/0x9F722162594d186FA6f71AC0996D6873d498A12f"><strong>Contracts on the blockchain</strong></a>
    <br />
    <br />
    <a href="./frontend/src/assets/pdf/Progetto Finale Blockchain di Samuele Furnari.pdf">Presentation IT</a>
  </p>
</div>

## Introduction

Welcome to the Moove project! This repository contains the implementation of a decentralized platform for the sale and management of Non-Fungible Tokens (NFTs) specifically tailored for Moove, a company providing shared micro-mobility services in various European cities. Moove aims to enhance its shared mobility experience by leveraging NFTs to manage its fleet of vehicles.

## About my choice

As you can see, to manage this project i choose to separete it in two folder:

1. **Contracts**: This folder contains the smart contracts that handle all the logic of the project. The `MooveToken.sol` contract manages the Moove tokens, while the `VehicleAuctions.sol` contract handles vehicle auctions. With these contracts, the owner can add new vehicles to sell, and users can purchase them. All smart contracts were developed using Hardhat, a popular Ethereum development framework.

2. **Frontend**: This folder contains the frontend code for the Moove platform. It provides a user interface for interacting with the smart contracts, allowing users to browse available vehicles, place bids in auctions, and manage their Moove tokens. The frontend is built using React, a popular JavaScript library for building user interfaces, and it connects to the Ethereum blockchain using WAGMI, a Web3 library for interacting with Ethereum smart contracts.

## Contracts

### MooveToken.sol

The `MooveToken` smart contract, written in Solidity, is the core of the Moove platform, enabling the management and transactions of NFTs representing vehicles. This contract uses the ERC-721 standard for Non-Fungible Tokens (NFTs) and extends functionalities provided by OpenZeppelin’s `ERC721` and `Ownable` contracts.

The contract allows for the creation and management of NFTs through the `addVehicle` and `addVehicleAuctions` functions. The `addVehicle` function allows the contract owner to add new vehicles to the platform. Each vehicle is represented as an NFT with a unique ID, name, model, price, and availability status. Similarly, the `addVehicleAuctions` function adds vehicles specifically for auctions without a predefined price.

The `buyNFTVehicle` function enables users to purchase available vehicles. It verifies the existence of the vehicle, checks if the vehicle is still owned by the platform, and ensures the buyer has sufficient funds. Upon a successful purchase, ownership is transferred to the buyer, and the vehicle’s availability status is updated.

The contract handles transfers and ownership through the `transferFrom` function, which overrides the `transferFrom` function of ERC-721 to update vehicle owner details and emit an event. Additionally, the `expiryCheck` function verifies if a vehicle’s subscription has expired. If expired, the vehicle is reclaimed from the current owner and made available again.

Several events, such as `NFTVehicleCreated`, `NFTVehicleBuyed`, `NFTVehicleTransferred`, `NFTAuctionsVehicles`, and `VehicleExpired`, are emitted at various points to log significant actions and state changes, facilitating better traceability and transparency.

### VehicleAuctions.sol

The `VehicleAuctions` extends the `MooveToken` smart contract to manage vehicle auctions. It includes events to track auction actions like start, bids, and vehicle withdrawals. Two structs, `Status` and `RecoverFunds`, manage auction status and bid records. Mappings track auction data, bids, and fund recovery statuses. The contract's constructor initializes the token name and symbol.

The `startAuction` function begins an auction for a vehicle, setting its status and marking it as started. The `participateAuction` function allows users to place bids, checking if the auction is active and if the bid is higher than the current winning bid. The `withdrawNFT` function lets the auction winner withdraw the vehicle, transferring ownership and updating its status. The `recoverFunds` function enables non-winning participants to recover their funds after the auction ends and the winner withdraws the vehicle.

The `expiryCheckAuction` function allows the contract owner to reclaim a vehicle after its subscription expires, making it available for auction again. Utility functions manage auction processes, including removing vehicles from auction lists and retrieving auction data. The `IdExist` modifier ensures the vehicle ID exists in the auction list.

Overall, the `VehicleAuctions` contract enhances `MooveToken` by adding vehicle auction functionalities, ensuring transparent and fair auction processes, supporting auction management, bid participation, vehicle withdrawal, and fund recovery, while maintaining detailed records and emitting key action events.

## Frontend

### Pages

Below you'll find all the available navigation pages.

- `Home`: This is the landing page of the Moove platform. It provides an overview of the service, highlighting key features and recent updates.
- `Account`: The account page allows users to manage their personal information and view their subscription.
- `Vehicle`: This page is dedicated at the vehicles available on the Moove platform. Users can browse through the different vehicles, view detailed information about each one, including specifications, availability status, and price. It also allows users to purchase the vehicle.
- `Sale`: The sale page list all the vehicles available on the Moove platform. Users can select a vehicle and be redirected to the dedicated page.
- `Auction`: The auction page list all the available auctions vehicles on the Move platform. Users can select a vehicle and be redirected to the dedicated page to make a bid.

## Importance of Wallet Provider

To ensure the smooth functioning of the Moove project, it's crucial for users to have a compatible wallet provider installed. A wallet provider, such as MetaMask browser extension, plays a pivotal role in connecting users to the Ethereum blockchain and enabling secure transactions. Here's why having a wallet provider is essential:

1. Secure Transactions: Wallet providers, like MetaMask, act as a secure bridge between the user and the Ethereum blockchain. They manage private keys and provide a secure environment for signing transactions, ensuring the safety of users' funds.

2. User Authentication: Wallet providers serve as a means of user authentication. By connecting their Ethereum wallet to the dApp, users can securely access their accounts and perform transactions without the need for additional login credentials.

3. WalletConnect for Mobile Compatibility: The integration of WalletConnect extends compatibility to mobile devices. Users can connect their mobile wallets to the dApp, allowing for a broader user base and enhancing accessibility.

4. Transaction Confirmation: Wallet providers prompt users to confirm transactions, adding an additional layer of security. Users can review and approve transactions before they are broadcasted to the Ethereum network, preventing unauthorized actions.

5. Balance Display: The dApp displays the user's Ethereum balance within the application, providing transparency and allowing users to monitor their funds directly from the interface.

6. Intuitive User Experience: Wallet providers offer a familiar and intuitive user experience. Users who are already accustomed to using MetaMask or similar wallets will find it seamless to connect and interact with the E-Commerce DApp.

To fully experience the features of the dApp and participate in token transactions, users are encouraged to install a compatible wallet provider. MetaMask is a popular choice due to its widespread use and easy integration as a browser extension.

## Installation

To install and test this project locally, follow these steps:

1. Clone this repository: `git clone https://github.com/samuelefrni/Moove`
2. Navigate to the contracts folder
3. Install the dependencies of the contracts folder: `npm install`
4. Go to `hardhat.config.ts` and follow the instruction before compile contracts
5. Compile contracts: `npx hardhat compile` and after run tests: `npx hardhat test`
6. Run: `npx hardhat node` to run a blockchain on your local enviroment
7. Add the localhost network on your wallet and import the first account from the local blockchain list
8. While the node is still running, open another terminal, navigate to the contracts folder and deploy the smart contracts
9. To deploy the smart contracts run: `npx hardhat run .\ignition\modules\deploy.ts --network localhost`
10. Look at the deployed address that should show up in the terminal and save it
11. Always remember to not close the terminal where the blockchain is running
12. Navigate to the frontend folder
13. Create a `.env.local` file on the frontend folder and in it create two variables
14. The first variable `VITE_PROJECT_ID=YOUR_PROJECT_ID` is about the id for the WalletConnect
15. The second variable `VITE_CONTRACT_ADDRESS=CONTRACT_ADDRESS` is about the address of the contract
16. `The second variable is crucial` for the purpose of the project, in it you should add the deployed address of the contract
17. Install the dependencies of the frontend folder: `npm install`
18. Run the app with: `npm run dev` and connect your wallet!

### Important

A blockchain, from a logical point of view, is nothing more than a "finite state machine", which in technical jargon refers to a system that can exist in a finite number of possible states and changes state only in the presence of a specific predictable event. In our case, only one `transaction` can change the state of the blockchain. When we go to write a smart contract in our local project, we will have to remember to manually mark the `nonce` property, this is because being local we will be the ones to mark the transaction number, starting from 1. This step is essential to ensure that in our local blockchain state changes occur.

<img src="./frontend/src/assets/Screenshot 2024-05-17 152551.png" width="auto">

**_Example: in the Account page before adding a vehicle mark the nonce property_**

## Implementing a Keeper

A Keeper is an autonomous agent responsible for performing certain tasks on the blockchain based on predefined conditions. By integrating a Keeper into the Moove platform, we can automate various processes, reducing the need for manual intervention and ensuring continuous operation. One of these processes can be the autonomous refueling of the vehicle that has expired the subscription time, in this way the administration will not have to restock the vehicles manually but at the end of the subscription they will be avaible automatically.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Author

- **Samuele Furnari**
  - Email: samuelefurnari9@gmail.com
  - GitHub: [samuelefrni](https://github.com/samuelefrni)
  - LinkedIn: [Samuele Furnari](https://www.linkedin.com/in/samuele-furnari-a37567220/)
