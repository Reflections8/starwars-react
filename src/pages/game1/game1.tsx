import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { HomeIcon } from "../../icons/Home";
import { MenuIcon } from "../../icons/Menu";
import "./styles/game1.css";
import { useCallback, useEffect, useState } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { HeaderCenterCredits } from "../../components/Header/components/HeaderCenter/HeaderCenterCredits.tsx";
import { useUnityContext } from "react-unity-webgl/distribution/hooks/use-unity-context";
import { Unity } from "react-unity-webgl/distribution/components/unity-component";
import { useNavigate } from "react-router-dom";
import { ProofApiService } from "../../ProofApiService.ts";
import { ProofManager } from "../../components/ProofManager/ProofManager.tsx";

export function Game1() {
  const navigate = useNavigate();
  const [devicePixelRatio, setDevicePixelRatio] = useState(
    window.devicePixelRatio
  );

  //const [initDataUnsafe] = useInitData();

  const [score, setScore] = useState(0);
  const [damage, setDamage] = useState(1);
  const [blasterCharge, setBlasterCharge] = useState(0);
  const [blasterChargeExt, setBlasterChargeExt] = useState(0);

  const [isUnityLoaded, setIsUnityLoaded] = useState(false);

  const {
    unityProvider,
    loadingProgression,
    isLoaded,
    sendMessage,
    addEventListener,
    removeEventListener,
    unload,
  } = useUnityContext({
    loaderUrl: "build/Build_Ios.loader.js",
    dataUrl: "build/Build_Ios.data.gz",
    frameworkUrl: "build/Build_Ios.framework.js.gz",
    codeUrl: "build/Build_Ios.wasm.gz",
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

  // перевод юзера на главную страницу если у него нету токена доступа
  useEffect(() => {
    if (isLoaded && isUnityLoaded) {
      if (ProofApiService.accessToken == null) {
        navigate("/");
        return;
      }

      sendMessage(
        "GameManager",
        "OnUserTokenReceive",
        ProofApiService.accessToken
      );
    }
  }, [isLoaded, isUnityLoaded]);

  // для очистки памяти при выходе из страницы
  useEffect(() => {
    return () => {
      const unloadGame = async () => {
        await unload();
      };
      unloadGame().catch(console.error);
    };
  }, []);

  const handleLoadingFinish = useCallback(() => {
    setIsUnityLoaded(true);
  }, []);

  const handleSetScore = useCallback((score: ReactUnityEventParameter) => {
    setScore(score as number);
  }, []);

  const handleSetBlasterCharge = useCallback(
    (score: ReactUnityEventParameter) => {
      setBlasterCharge(score as number);
    },
    []
  );

  const handleSetBlasterChargeExt = useCallback(
    (score: ReactUnityEventParameter) => {
      setBlasterChargeExt(score as number);
    },
    []
  );

  const handleSetBlasterDamage = useCallback(
    (score: ReactUnityEventParameter) => {
      setDamage(score as number);
    },
    []
  );

  useEffect(() => {
    addEventListener("LoadFinish", handleLoadingFinish);
    addEventListener("SetBlasterCharge", handleSetBlasterCharge);
    addEventListener("SetBlasterChargeExt", handleSetBlasterChargeExt);
    addEventListener("SetScore", handleSetScore);
    addEventListener("SetDamage", handleSetBlasterDamage);
    return () => {
      removeEventListener("SetBlasterCharge", handleSetBlasterCharge);
      removeEventListener("SetBlasterChargeExt", handleSetBlasterChargeExt);
      removeEventListener("SetScore", handleSetScore);
      removeEventListener("SetDamage", handleSetBlasterDamage);
      removeEventListener("LoadFinish", handleLoadingFinish);
    };
  }, [
    addEventListener,
    removeEventListener,
    handleLoadingFinish,
    handleSetScore,
    handleSetBlasterCharge,
    handleSetBlasterChargeExt,
    handleSetBlasterDamage,
  ]);

  async function handleReturn() {
    await unload();
    navigate("/");
  }

  const handleAuthTokenChange = () => {};

  return (
    <>
      <ProofManager onValueChange={handleAuthTokenChange} />
      <Header
        leftIcon={<HomeIcon />}
        leftText={"Домой"}
        leftAction={handleReturn}
        rightIcon={<MenuIcon />}
        rightText={"Меню"}
        centerComponent={<HeaderCenterCredits credits={score} />}
      />

      {!isLoaded && (
        <p style={{ visibility: !isLoaded ? "visible" : "hidden" }}>
          Loading Application... {Math.round(loadingProgression * 100)}%
        </p>
      )}
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

      <Footer power={damage} clip={blasterChargeExt} charges={blasterCharge} />
    </>
  );
}
