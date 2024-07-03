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
import { ProofApiService } from "../../ProofApiService.ts";
import { useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";

export function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = useNavigate();
  const [tonConnectUI] = useTonConnectUI();

  const tonConnectModal = useTonConnectModal();
  const { openModal } = useModal();
  const { openDrawer } = useDrawer();
  const { setIsLoading } = useLoader();

  // data vars
  const [token, setToken] = useState("");
  const [credits, setCredits] = useState(0);
  const [woopy, setWoopy] = useState(0);
  const [ton, setTon] = useState(0);

  // unity vars
  const [isUnityLoaded, setIsUnityLoaded] = useState(false);

  // повторное открытие окна TonConnect, если юзер закрывает его при не подключенном кошельке
  useEffect(() => {
    const checkTonConnection = async () => {
      setTimeout(async () => {
        if (
          tonConnectModal.state.status == "closed" &&
          ProofApiService.accessToken == null
        ) {
          if (tonConnectUI.connected) await tonConnectUI.disconnect();
          await tonConnectUI.openModal();
          return;
        }
      }, 5000);
    };

    checkTonConnection().catch(console.error);
  }, [tonConnectModal.state.status]);

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
        if (ProofApiService.accessToken == null) {
          if (token != "") {
            sendMessageToUnity("OnUserTokenReceive", token);
            return;
          }
          if (tonConnectUI.connected) await tonConnectUI.disconnect();
          await tonConnectUI.openModal();
          return;
        }

        sendMessageToUnity("OnUserTokenReceive", ProofApiService.accessToken);
      };

      checkTonConnection().catch(console.error);
    }
    return () => {};
  }, [isUnityLoaded, token, ProofApiService.accessToken]);

  const handleAuthTokenChange = (token: string | null) => {
    if (token != null) {
      setToken(token);
    }
  };

  const handleLoadingFinish = useCallback(() => {
    setIsUnityLoaded(true);
    iframeRef.current?.focus();
  }, []);

  const handleSetCredits = useCallback((value: ReactUnityEventParameter) => {
    setCredits(value as number);
  }, []);

  const handleSetWoopy = useCallback((value: ReactUnityEventParameter) => {
    setWoopy(value as number);
  }, []);

  const handleSetTon = useCallback((value: ReactUnityEventParameter) => {
    setTon(value as number);
  }, []);

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
            else if (data.method === "SetWoopy") handleSetWoopy(data.value);
            else if (data.method === "SetTon") handleSetTon(data.value);
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

      <Resources credits={credits} woopy={woopy} ton={ton} />

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
          openModal("chooseGame");
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
