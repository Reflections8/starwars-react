/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useExpand } from "@vkruglikov/react-telegram-web-app";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProofApiService } from "../../ProofApiService.ts";
import { useUserData } from "../../UserDataService.tsx";
import { Header } from "../../components/Header/Header";
import { HeaderCenterShop } from "../../components/Header/components/HeaderCenter/HeaderCenterShop";
import { getMe } from "../../components/Modals/SeaBattle/service/sea-battle.service.ts";
import { ProofManager } from "../../components/ProofManager/ProofManager.tsx";
import { useBackgroundVideo } from "../../context/BackgroundVideoContext.tsx";
import { useDrawer } from "../../context/DrawerContext";
import { useLoader } from "../../context/LoaderContext";
import { useModal } from "../../context/ModalContext";
import { ExitIcon } from "../../icons/Exit";
import { GamesIcon } from "../../icons/Games";
import { MenuIcon } from "../../icons/Menu";
import { OptionsIcon } from "../../icons/Options";
import bgSound from "../home/audio/main_bg.mp3";
import highlightBook from "../home/video/currency.svg";
import { BackgroundLayers } from "./components/BackgroundLayers";
import { BinksBackgroundVideo } from "./components/BinksBackgroundVideo.tsx";
import { MainLinks } from "./components/MainLinks";
import { Resources } from "./components/Resources";
import bookImg from "./img/book.svg";
import "./styles/home.css";

export function Home() {
  const { t, i18n } = useTranslation();
  // const iframeRef = useRef<HTMLIFrameElement>(null);

  const {
    credits,
    tokens,
    tons,
    updateJwt,
    jwt,
    activeCharacter,
    higherBlaster,
    soundSetting,
    sessionsCount,
    characters,
    updateUserInfo,
    resetUserData,
    userDataDefined,
    homeState,
    setHomeState,
    iframeRefHome,
  } = useUserData();
  const [tonConnectUI] = useTonConnectUI();
  const [isExpanded, expand] = useExpand();

  //const tonConnectModal = useTonConnectModal();
  const { openModal } = useModal();
  const { closeDrawer, openDrawer } = useDrawer();
  const { setIsLoading, sessionInteracted, tutorialClicked } = useLoader();

  const {
    setReadyState,
    activeVideo,
    setActiveVideo,
    readyState,
    repeatCount,
  } = useBackgroundVideo();

  // unity vars
  const [isUnityLoaded, setIsUnityLoaded] = useState(false);

  const sendMessageToUnity = (method: string, param: any) => {
    const message = JSON.stringify({ method, param });
    if (iframeRefHome.current) {
      iframeRefHome.current.contentWindow?.postMessage(message, "*");
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
  }, [isUnityLoaded, activeCharacter, higherBlaster, characters.length]);

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
    iframeRefHome.current?.focus();
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

  const unityBgMusicRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (unityBgMusicRef.current) {
      if (homeState == true) {
        unityBgMusicRef.current.volume = 0.15;
        unityBgMusicRef.current.loop = true;
        unityBgMusicRef.current.play();
        setHomeState(false);
        return;
      }

      if (activeVideo) {
        unityBgMusicRef.current.pause();
        setHomeState(false);
      }
    }
  }, [activeVideo, homeState]);

  // TODO: всплывшка с бинксом при заходе на страницу
  useEffect(() => {
    //  console.log({
    //    sessionsCount,
    //    hasNFT: characters.length,
    //    jwt,
    //    tonConnectUI: tonConnectUI.connected,
    //  });

    //  console.log({ userDataDefined });

    if (userDataDefined) {
      if (!localStorage.getItem("auth_jwt") || !tonConnectUI.connected) {
        if (!tutorialClicked) {
          openModal!("binks");
        }
        setIsLoading!(false);
      }

      if (jwt) {
        if (sessionsCount === null) return;
        if (characters.length && sessionsCount !== null && sessionsCount! > 2) {
          if (!sessionInteracted) {
            openModal!("welcome");
          }
          setReadyState!(false);
          setActiveVideo!(null);
          return;
        }

        if (
          !characters.length &&
          sessionsCount !== null &&
          sessionsCount! > 2
        ) {
          if (!tutorialClicked) {
            openModal!("binksBack");
          }
          return;
        }

        if (
          characters.length &&
          sessionsCount !== null &&
          sessionsCount! <= 2
        ) {
          if (!tutorialClicked) {
            openModal!("binks");
          }
          setIsLoading!(false);
          return;
        }

        if (
          !characters.length &&
          sessionsCount !== null &&
          sessionsCount! <= 2
        ) {
          if (!tutorialClicked) {
            openModal!("binks");
          }
          setIsLoading!(false);
          return;
        }
      } else setIsLoading!(false);
    } else setIsLoading!(false);
  }, [i18n.language, sessionsCount, characters.length, jwt, userDataDefined]);

  async function openWalletDrawer() {
    closeDrawer!();
    openDrawer!("connectWallet");
  }

  const [canQuit, setCanQuit] = useState(false);

  useEffect(() => {
    if (jwt && tonConnectUI.connected) {
      getMe().then((res) => {
        localStorage.setItem("username", res.username);
      });
      setCanQuit(true);
    } else {
      // ProofApiService.reset();
      // tonConnectUI.disconnect();
      // resetUserData();
      // updateJwt(null);
      // setCanQuit(false);
    }
  }, [jwt, tonConnectUI.connected, userDataDefined]);

  useEffect(() => {
    if (!localStorage.getItem("language")) {
      localStorage.setItem("language", "ru");
    }

    if (!localStorage.getItem("sound_setting")) {
      localStorage.setItem("sound_setting", "on");
    }
    if (isExpanded != undefined && !isExpanded) expand();
  }, []);

  useEffect(() => {
    if (userDataDefined) {
      const pageLoader = document.querySelector(".pageLoader");
      setTimeout(() => {
        pageLoader?.classList.add("loadingModalBg--Hidden");
      }, 100);
    }
  }, [userDataDefined]);

  return (
    <>
      <ProofManager onValueChange={handleAuthTokenChange} />
      <BackgroundLayers />

      <Header
        onlyRight={!canQuit}
        leftIcon={<ExitIcon />}
        leftText={t("homePage.exit")}
        leftAction={() => {
          ProofApiService.reset();
          tonConnectUI.disconnect();
          resetUserData();
          updateJwt(null);
          setCanQuit(false);
        }}
        rightIcon={<MenuIcon />}
        rightText={t("homePage.menu")}
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

      {activeVideo === "1" ? (
        <div
          style={{
            position: "absolute",
            zIndex: "1000",
            top: "31%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "10px",
          }}
        >
          <img src={highlightBook} className={`highlighter book`} />
          <img
            className="highlighterParent book"
            onClick={() => {
              setActiveVideo!("2");
            }}
            src={bookImg}
            alt="book"
          />
        </div>
      ) : null}

      <BinksBackgroundVideo
        readyState={readyState}
        setReadyState={setReadyState}
        activeVideo={activeVideo}
        setActiveVideo={setActiveVideo}
        repeatCount={repeatCount!}
        sessionsCount={sessionsCount!}
      />

      <Resources credits={credits} akron={tokens} ton={tons} />
      <MainLinks />

      {jwt && tonConnectUI.connected && characters.length ? (
        <>
          <iframe
            ref={iframeRefHome}
            src="https://game.akronix.io/new/unity_main_2/"
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
          <audio ref={unityBgMusicRef} src={bgSound} autoFocus={true} />
        </>
      ) : null}

      <Header
        position={"bottom"}
        leftIcon={<GamesIcon className={`highlighterParent games`} />}
        leftText={t("homePage.games")}
        leftClassName={"games"}
        leftAction={() => {
          if (!tonConnectUI.connected) {
            openWalletDrawer();
            return;
          }
          openModal!("chooseGame");
        }}
        rightIcon={<OptionsIcon className={`highlighterParent options`} />}
        rightText={t("homePage.options")}
        rightClassName={"options"}
        rightAction={() => {
          openModal!("settings");
        }}
      />
    </>
  );
}
