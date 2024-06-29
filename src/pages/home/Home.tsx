/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Unity } from "react-unity-webgl/distribution/components/unity-component";
import { useUnityContext } from "react-unity-webgl/distribution/hooks/use-unity-context";
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
  const navigate = useNavigate();
  const [tonConnectUI] = useTonConnectUI();
  const tonConnectModal = useTonConnectModal();
  const { openModal } = useModal();
  const { openDrawer } = useDrawer();

  // data vars
  const [token, setToken] = useState("");
  const [credits, setCredits] = useState(0);
  const [woopy, setWoopy] = useState(0);
  const [ton, setTon] = useState(0);
  const [devicePixelRatio, setDevicePixelRatio] = useState(
    window.devicePixelRatio
  );

  // unity vars
  const [isUnityLoaded, setIsUnityLoaded] = useState(false);
  const {
    unityProvider,
    isLoaded,
    sendMessage,
    addEventListener,
    removeEventListener,
    unload,
  } = useUnityContext({
    loaderUrl: "build/main/Build_Main.loader.js",
    dataUrl: "build/main/Build_Main.data.gz",
    frameworkUrl: "build/main/Build_Main.framework.js.gz",
    codeUrl: "build/main/Build_Main.wasm.gz",
  });

  // авторегулирование DPI
  useEffect(
    function () {
      const updateDevicePixelRatio = function () {
        setDevicePixelRatio(window.devicePixelRatio);
      };
      const mediaMatcher = window.matchMedia(
        `screen and (resolution: ${devicePixelRatio}dppx)`
      );

      mediaMatcher.addEventListener("change", updateDevicePixelRatio);
      return function () {
        mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
      };
    },
    [devicePixelRatio]
  );

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

  // отслеживание статуса токена и загрузки приложения
  useEffect(() => {
    if (isLoaded && isUnityLoaded) {
      const checkTonConnection = async () => {
        if (ProofApiService.accessToken == null) {
          if (token != "") {
            sendMessage("GameManager", "OnUserTokenReceive", token);
            return;
          }
          if (tonConnectUI.connected) await tonConnectUI.disconnect();
          await tonConnectUI.openModal();
          return;
        }

        sendMessage(
          "GameManager",
          "OnUserTokenReceive",
          ProofApiService.accessToken
        );
      };

      checkTonConnection().catch(console.error);
    }
    return () => {};
  }, [isLoaded, isUnityLoaded, token, ProofApiService.accessToken]);

  // для очистки памяти при выходе из страницы
  useEffect(() => {
    return () => {
      const unloadGame = async () => {
        await unload();
      }
      unloadGame().catch(console.error);
    }
  }, []);

  const handleAuthTokenChange = (token: string | null) => {
    if (token != null) {
      setToken(token);
    }
  };

  const handleLoadingFinish = useCallback(() => {
    setIsUnityLoaded(true);
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

  useEffect(() => {
    addEventListener("LoadFinish", handleLoadingFinish);
    addEventListener("SetCredits", handleSetCredits);
    addEventListener("SetWoopy", handleSetWoopy);
    addEventListener("SetTon", handleSetTon);
    return () => {
      removeEventListener("LoadFinish", handleLoadingFinish);
      removeEventListener("SetCredits", handleSetCredits);
      removeEventListener("SetWoopy", handleSetWoopy);
      removeEventListener("SetTon", handleSetTon);
    };
  }, [
    addEventListener,
    removeEventListener,
    handleLoadingFinish,
    handleSetCredits,
    handleSetWoopy,
    handleSetTon,
  ]);

  const { setIsLoading } = useLoader();
  useEffect(() => {
    setIsLoading!(true);
    setTimeout(() => {
      setIsLoading!(false);
    }, 3000);

    return () => {
      setIsLoading!(true);
      setTimeout(() => {
        setIsLoading!(false);
      }, 3000);
    };
  }, []);

  return (
    <>
      <ProofManager onValueChange={handleAuthTokenChange} />
      <BackgroundLayers />

      <Header
        leftIcon={<ExitIcon />}
        leftText={"Выход"}
        leftAction={async () => {
          await unload();
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

      <Unity
        unityProvider={unityProvider}
        style={{
          visibility: isLoaded ? "visible" : "hidden",
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
        devicePixelRatio={devicePixelRatio}
        className="mainWrapper"
      />

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
