/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../UserDataService.tsx";
import { Header } from "../../components/Header/Header";
import { HeaderCenterShop } from "../../components/Header/components/HeaderCenter/HeaderCenterShop";
import { Info } from "../../components/Header/components/Info/Info.tsx";
import { useBackgroundVideo } from "../../context/BackgroundVideoContext.tsx";
import { useDrawer } from "../../context/DrawerContext";
import { useLoader } from "../../context/LoaderContext";
import { useModal } from "../../context/ModalContext";
import { ExitIcon } from "../../icons/Exit";
import { GamesIcon } from "../../icons/Games";
import { MenuIcon } from "../../icons/Menu";
import { OptionsIcon } from "../../icons/Options";
import { BackgroundLayers } from "./components/BackgroundLayers";
import { BinksBackgroundVideo } from "./components/BinksBackgroundVideo.tsx";
import { MainLinks } from "./components/MainLinks";
import { Resources } from "./components/Resources";
import bookImg from "./img/book.svg";
import "./styles/home.css";
import { ProofManager } from "../../components/ProofManager/ProofManager.tsx";

export function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const {
    credits,
    tokens,
    tons,
    updateJwt,
    jwt,
    activeCharacter,
    higherBlaster,
    soundSetting,
    updateUserInfo,
  } = useUserData();
  const navigate = useNavigate();
  const [tonConnectUI] = useTonConnectUI();

  //const tonConnectModal = useTonConnectModal();
  const { openModal } = useModal();
  const { closeDrawer, openDrawer } = useDrawer();
  const { setIsLoading } = useLoader();

  const { readyState, activeVideo, setActiveVideo } = useBackgroundVideo();

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
    setIsLoading!(true);
    if (isUnityLoaded) {
      setIsLoading!(false);
    }

    if (activeCharacter != null && higherBlaster != null) {
      const json = JSON.stringify({
        blaster: higherBlaster.level,
        character: activeCharacter.type,
      });
      sendMessageToUnity("OnUserModelInitReceive", json);
    }
    return () => {};
  }, [isUnityLoaded, activeCharacter, higherBlaster]);

  useEffect(() => {
    if (!isUnityLoaded) return;
    if (soundSetting) {
      sendMessageToUnity("EnableGameSounds", "s");
    } else sendMessageToUnity("DisableGameSounds", "s");
  }, [soundSetting, isUnityLoaded]);

  // @ts-ignore
  const handleAuthTokenChange = (token: string | null) => {
    if (token != null) {
      updateJwt(token);
    }
  };

  const handleLoadingFinish = useCallback(() => {
    setIsUnityLoaded(true);
    if (jwt !== null && jwt !== "") updateUserInfo(jwt);
    iframeRef.current?.focus();
  }, []);

  // Обработчик сообщений, полученных из iFrame
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data: any = JSON.parse(event.data);
        switch (data.type) {
          case "multiple": {
            if (data.method === "LoadFinish") handleLoadingFinish();
            break;
          }
        }
      } catch (error) {
        console.error("Failed to parse message dats", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Всплывашка при заходе на страницу
  //   useEffect(() => {
  //     openModal!("welcome");
  //   }, []);

  // TODO: всплывшка с бинксом при заходе на страницу
  //useEffect(() => {
  //  openModal!("binks");
  //}, []);

  async function openWalletDrawer() {
    closeDrawer!();
    openDrawer!("connectWallet");
  }

  const [canQuit] = useState(false);
  return (
    <>
      <ProofManager onValueChange={handleAuthTokenChange} />
      <BackgroundLayers />

      <Header
        onlyRight={!canQuit}
        leftIcon={<ExitIcon />}
        leftText={"Выход"}
        leftAction={() => {
          navigate("/auth");
        }}
        rightIcon={<MenuIcon />}
        rightText={"Меню"}
        rightAction={async () => {
          openDrawer!("menu", "top");
        }}
        centerComponent={
          <HeaderCenterShop
            onClick={() => {
              openModal!("shop");
            }}
          />
        }
      />

      {activeVideo === "2" ? (
        <img
          style={{
            position: "absolute",
            zIndex: "1000",
            top: "31%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "10px",
          }}
          onClick={() => {
            setActiveVideo!("3");
          }}
          src={bookImg}
          alt="book"
        />
      ) : null}

      <BinksBackgroundVideo readyState={readyState} activeVideo={activeVideo} />

      <Resources credits={credits} akron={tokens} ton={tons} />
      <MainLinks />

      <iframe
        ref={iframeRef}
        src="https://akronix.io/unity_main/"
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
        leftIcon={<GamesIcon className={`highlighterParent games`} />}
        leftText={"Игры"}
        leftClassName={"games"}
        leftAction={() => {
          if (!tonConnectUI.connected) {
            openWalletDrawer();
            return;
          }
          openModal!("chooseGame");
        }}
        rightIcon={<OptionsIcon />}
        rightText={"Опции"}
        rightAction={() => {
          openModal!("settings");
        }}
        centerComponent={<Info />}
      />
    </>
  );
}
