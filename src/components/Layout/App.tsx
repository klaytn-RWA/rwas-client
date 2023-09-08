import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import "../../styles/main.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PopupProvider from "../Popup/PopupProvider";
import Toast from "../Toast/toast";
import Borrow from "./Borrow";
import History from "./History/History";
import Lend from "./Lend";
import Marketplace from "./Marketplace";
import NFTServices from "./NFTServices";
import Portfolio from "./Portfolio";

const router = createBrowserRouter([
  {
    children: [
      {
        path: "/",
        element: <Portfolio />,
      },
      {
        path: "/borrow",
        element: <Borrow />,
      },
      {
        path: "/lend",
        element: <Lend />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/marketplace",
        element: <Marketplace />,
      },
      {
        path: "/nft-service",
        element: <NFTServices />,
      },
    ],
  },
]);

const App: React.FC = () => {
  const { chains, publicClient } = configureChains(
    [
      {
        id: 1001,
        name: "Klaytn BaoBab",
        network: "klaytn",
        nativeCurrency: {
          decimals: 18,
          name: "Klaytn",
          symbol: "KLAY",
        },
        rpcUrls: {
          public: { http: ["https://klaytn-baobab.blockpi.network/v1/rpc/public"] },
          default: { http: ["https://api.baobab.klaytn.net:8651"] },
        },
        blockExplorers: {
          default: { name: "KlaytnFinder", url: "https://baobab.klaytnfinder.io/txs" },
        },
        testnet: true,
      },
    ],
    [
      alchemyProvider({
        apiKey: import.meta.env.VITE_ALCHEMY_KEY!,
      }),
      publicProvider(),
    ],
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID!,
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <PopupProvider>
          <RouterProvider router={router} fallbackElement={<></>} />
          {/* <Header /> */}
          <Toast />
          {/* <Router /> */}
        </PopupProvider>
        {/* Body */}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
export default App;
