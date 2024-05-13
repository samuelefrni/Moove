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
5. Compile contracts: `npx hardhat compile`
6. Run tests: `npx hardhat test`
7. Run: `npx hardhat node` to run a blockchain on your local enviroment
8. Add the localhost network on your Metamask wallet and import an account from the local blockchain
9. While the node is still running, deploy the smart contracts on your local blockchain
10. Run: `npx hardhat run .\ignition\modules\deploy.ts --network localhost`
11. Navigate to the frontend folder
12. Create a `.env.local` file on the frontend folder
13. Create two variables on the `.env.local` file
14. The first variable `VITE_PROJECT_ID=YOUR_PROJECT_ID` is about the id for the WalletConnect
15. The second variable `VITE_CONTRACT_ADDRESS=CONTRACT_ADDRESS` is about the address of the contract
16. Install the dependencies of the frontend folder: `npm install`
17. Run the app with: `npm run dev`
18. Connect your wallet on the localhost network!

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
