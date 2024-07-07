/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { Header } from "../../components/Header/Header";
import { HeaderCenterShop } from "../../components/Header/components/HeaderCenter/HeaderCenterShop";
import { useDrawer } from "../../context/DrawerContext";
import { useLoader } from "../../context/LoaderContext";
import { useModal } from "../../context/ModalContext";
import { ExitIcon } from "../../icons/Exit";
import { GamesIcon } from "../../icons/Games";
import { MenuIcon } from "../../icons/Menu";
import { OptionsIcon } from "../../icons/Options";
import { BackgroundLayers } from "./components/BackgroundLayers";
import { MainLinks } from "./components/MainLinks";
import { Resources } from "./components/Resources";
import "./styles/home.css";
import { ProofManager } from "../../components/ProofManager/ProofManager.tsx";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useUserData } from "../../UserDataService.tsx";

export function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const {
    credits,
    tokens,
    tons,
    jwt,
    updateCredits,
    updateJwt,
    checkGun,
    setCheckGun,
  } = useUserData();
  const navigate = useNavigate();
  const [tonConnectUI] = useTonConnectUI();

  //const tonConnectModal = useTonConnectModal();
  const { openModal } = useModal();
  const { closeDrawer, openDrawer } = useDrawer();
  const { setIsLoading } = useLoader();

  // unity vars
  const [isUnityLoaded, setIsUnityLoaded] = useState(false);

  const sendMessageToUnity = (method: string, param: any) => {
    const message = JSON.stringify({ method, param });
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(message, "*");
    }
  };

  // отслеживание статуса токена и загрузки приложения
  useEffect(() => {
    if (isUnityLoaded) {
      setIsLoading!(false);
      const checkTonConnection = async () => {
        if (jwt == null || jwt == "") {
          if (tonConnectUI.connected) await tonConnectUI.disconnect();
          return;
        }

        sendMessageToUnity("OnUserTokenReceive", jwt);
      };

      checkTonConnection().catch(console.error);
    }
    return () => {};
  }, [isUnityLoaded, jwt]);

  useEffect(() => {
    if (checkGun) {
      sendMessageToUnity("RefreshUserConfig", "s");
      setCheckGun(false);
    }
  }, [checkGun]);

  const handleAuthTokenChange = (token: string | null) => {
    if (token != null) {
      updateJwt(token);
    }
  };

  const handleLoadingFinish = useCallback(() => {
    setIsUnityLoaded(true);
    iframeRef.current?.focus();
  }, []);

  const handleSetCredits = useCallback(
    (value: ReactUnityEventParameter) => {
      updateCredits(value as number);
    },
    [updateCredits]
  );

  // Обработчик сообщений, полученных из iFrame
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data: any = JSON.parse(event.data);
        switch (data.type) {
          case "single": {
            if (data.method === "LoadFinish") handleLoadingFinish();
            break;
          }
          case "multiple": {
            if (data.method === "SetCredits") handleSetCredits(data.value);
          }
        }
      } catch (error) {
        console.error("Failed to parse message data", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    setIsLoading!(true);
  }, []);

  async function openWalletDrawer() {
    // Синхронно закрываем текущий drawer
    closeDrawer!();

    // Делаем что-то асинхронное, в зависимости от ответа открываем resolved/rejected
    openDrawer!("connectWallet");
  }

  return (
    <>
      <ProofManager onValueChange={handleAuthTokenChange} />
      <BackgroundLayers />

      <Header
        leftIcon={<ExitIcon />}
        leftText={"Выход"}
        leftAction={() => {
          navigate("/auth");
        }}
        rightIcon={<MenuIcon />}
        rightText={"Меню"}
        rightAction={async () => {
          //@ts-ignore
          openDrawer("menu", "top");
        }}
        centerComponent={
          <HeaderCenterShop
            onClick={() => {
              // @ts-ignore
              openModal("shop");
            }}
          />
        }
      />

      <Resources credits={credits} woopy={tokens} ton={tons} />

      <MainLinks />

      <iframe
        ref={iframeRef}
        src="https://purpleguy.dev/main"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        id="mainWrapper"
        className="mainWrapper"
      ></iframe>

      <Header
        position={"bottom"}
        leftIcon={<GamesIcon />}
        leftText={"Игры"}
        leftAction={() => {
          //@ts-ignore
          if (!tonConnectUI.connected) {
            openWalletDrawer();
            return;
          }
          openModal!("chooseGame");
        }}
        rightIcon={<OptionsIcon />}
        rightText={"Опции"}
        rightAction={() => {
          //@ts-ignore
          openModal("settings");
        }}
      />
    </>
  );
}
