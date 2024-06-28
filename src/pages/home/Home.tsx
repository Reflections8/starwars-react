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

export function Home() {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);
  const [woopy, setWoopy] = useState(0);
  const [ton, setTon] = useState(0);
  const [devicePixelRatio, setDevicePixelRatio] = useState(
    window.devicePixelRatio
  );

  //   const [initDataUnsafe] = useInitData();

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

  useEffect(
    function () {
      // A function which will update the device pixel ratio of the Unity
      // Application to match the device pixel ratio of the browser.
      const updateDevicePixelRatio = function () {
        setDevicePixelRatio(window.devicePixelRatio);
      };
      // A media matcher which watches for changes in the device pixel ratio.
      const mediaMatcher = window.matchMedia(
        `screen and (resolution: ${devicePixelRatio}dppx)`
      );

      // Adding an event listener to the media matcher which will update the
      // device pixel ratio of the Unity Application when the device pixel
      // ratio changes.
      mediaMatcher.addEventListener("change", updateDevicePixelRatio);
      return function () {
        // Removing the event listener when the component unmounts.
        mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
      };
    },
    [devicePixelRatio]
  );

  useEffect(() => {
    if (isLoaded && isUnityLoaded) {
      sendMessage(
        "GameManager",
        "OnUserWalletReceive",
        "UQAiqHfH96zGIC38oNRs1AWHRyn3rsjT1zOiAYfjQ4NKN_Pp"
      );
    }
    return () => {};
  }, [isLoaded, isUnityLoaded]);

  const { openModal } = useModal();
  const { openDrawer } = useDrawer();

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
    localStorage.clear();
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
          await unload();
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
