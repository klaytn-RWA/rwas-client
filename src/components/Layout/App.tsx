import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "../../styles/main.scss";
import PopupProvider from "../Popup/PopupProvider";
import Toast from "../Toast/toast";
import Admin from "./Admin/Admin";
import MultiSign from "./Admin/MultiSign";
import Borrow from "./Borrow";
import History from "./History/History";
import Lend from "./Lend";
import Lottery from "./Lottery/Lottery";
import Marketplace from "./Marketplace";
import NFTServices from "./NFTServices";
import Portfolio from "./Portfolio";

const router = createBrowserRouter([
  {
    element: (
      <PopupProvider>
        <Outlet />
      </PopupProvider>
    ),

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
      {
        path: "/lottery",
        element: <Lottery />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/admin/multi-sign",
        element: <MultiSign />,
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
          public: { http: ["https://public-en-baobab.klaytn.net"] },
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
        <RouterProvider router={router} fallbackElement={<></>} />
        {/* <Header /> */}
        <Toast />
        {/* <Router /> */}
        {/* Body */}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
export default App;
