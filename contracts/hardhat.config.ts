import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { ETHERSCAN_API, INFURA_KEY, SEPOLIA_PK } from "./cred";

//

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  paths: {
    artifacts: "../frontend/src/artifacts",
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
      accounts: [SEPOLIA_PK],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API,
  },
};

export default config;
