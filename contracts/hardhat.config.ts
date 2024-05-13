import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { ETHERSCAN_API, INFURA_KEY, SEPOLIA_PK } from "./cred";

//  The information you can see in the hardhat.config file will not be correct for the
//  compiler on your local enviroment. This is because the "cred" file was only present
//  in the distribution. This sensitive file will not be present in the GitHub repository
//  so before running any command:
//  Be sure to comment the import from "./cred" (line 3)
//  Be sure to comment from the "networks" (line 17) to "etherscan" (line 25) properties

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
