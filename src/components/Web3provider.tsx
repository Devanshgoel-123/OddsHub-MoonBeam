import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, baseSepolia,hardhat, moonbaseAlpha} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";

export const config = createConfig(
  getDefaultConfig({
    chains: [hardhat,moonbaseAlpha],
    transports: {
      [hardhat.id]:http(
        "http://127.0.0.1:8545/"
      ),
      // [moonbaseAlpha.id]:http(
      //   "https://rpc.api.moonbase.moonbeam.network"
      // )
    },
    walletConnectProjectId: "c0d339ed8343fed3a39dd6795c2244b8",
    appName: "BaseForeCast",
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }:{ children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
