import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./routes/index.tsx";
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";

export const PROJECT_CONTRACT_ADDRESS =
  "0:5CE1280FFDD7B96B6A11CD7486355E30061A05B3DCCDEAC3F556FDA941C5592F";

export const SERVER_URL = "wss://socket.purpleguy.dev/menu";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TonConnectUIProvider
      manifestUrl="https://purpleguy.dev/tonconnect/connect.json"
      uiPreferences={{ theme: THEME.DARK }}
      restoreConnection={true}
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: "safepalwallet",
            name: "SafePal",
            imageUrl:
              "https://s.pvcliping.com/web/public_image/SafePal_x288.png",
            tondns: "",
            aboutUrl: "https://www.safepal.com",
            universalLink: "https://link.safepal.io/ton-connect",
            deepLink: "safepal-tc://",
            jsBridgeKey: "safepalwallet",
            bridgeUrl: "https://ton-bridge.safepal.com/tonbridge/v1/bridge",
            platforms: ["ios", "android", "chrome", "firefox"],
          },
          {
            appName: "bitgetTonWallet",
            name: "Bitget Wallet",
            imageUrl:
              "https://raw.githubusercontent.com/bitkeepwallet/download/main/logo/png/bitget%20wallet_logo_iOS.png",
            aboutUrl: "https://web3.bitget.com",
            deepLink: "bitkeep://",
            jsBridgeKey: "bitgetTonWallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android", "chrome"],
            universalLink: "https://bkcode.vip/ton-connect",
          },
          {
            appName: "tonwallet",
            name: "TON Wallet",
            imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
            aboutUrl:
              "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
            universalLink: "https://wallet.ton.org/ton-connect",
            jsBridgeKey: "tonwallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["chrome", "android"],
          },
          {
            appName: "nicegramWallet",
            name: "Nicegram Wallet",
            imageUrl: "https://static.nicegram.app/icon.png",
            aboutUrl: "https://nicegram.app",
            universalLink: "https://nicegram.app/tc",
            deepLink: "nicegram-tc://",
            jsBridgeKey: "nicegramWallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android"],
          },
        ],
      }}
    >
      <RouterProvider router={router} />
    </TonConnectUIProvider>
  </React.StrictMode>
);

// calculate document height
document.addEventListener("DOMContentLoaded", () => {
  const documentHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
  };
  window.addEventListener("resize", documentHeight);
  documentHeight();
});
