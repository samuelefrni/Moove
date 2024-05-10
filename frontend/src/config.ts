import { http, createConfig } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { mainnet, sepolia, hardhat } from "viem/chains";

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  connectors: [
    injected(),
    walletConnect({ projectId: import.meta.env.PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
});
