import { http, createConfig } from "wagmi";
import { hardhat, mainnet, sepolia } from "viem/chains";

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
});
