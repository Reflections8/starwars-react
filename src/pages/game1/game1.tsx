import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { HomeIcon } from "../../icons/Home";
import { MenuIcon } from "../../icons/Menu";
import "./styles/game1.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { HeaderCenterCredits } from "../../components/Header/components/HeaderCenter/HeaderCenterCredits.tsx";
import { useNavigate } from "react-router-dom";
import { ProofApiService } from "../../ProofApiService.ts";
import { ProofManager } from "../../components/ProofManager/ProofManager.tsx";
import { useLoader } from "../../context/LoaderContext.tsx";

export function Game1() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = useNavigate();
  const { setIsLoading } = useLoader();

  //const [initDataUnsafe] = useInitData();

  const [score, setScore] = useState(0);
  const [damage, setDamage] = useState(1);
  const [blasterCharge, setBlasterCharge] = useState(0);
  const [blasterChargeExt, setBlasterChargeExt] = useState(0);

  const [isUnityLoaded, setIsUnityLoaded] = useState(false);

  // перевод юзера на главную страницу если у него нету токена доступа
  useEffect(() => {
    if (isUnityLoaded) {
      if (ProofApiService.accessToken == null) {
        navigate("/");
        return;
      }
      sendMessageToUnity("OnUserTokenReceive", ProofApiService.accessToken);
    }
  }, [isUnityLoaded]);

  const sendMessageToUnity = (method: string, param: any) => {
    const message = JSON.stringify({ method, param });
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(message, "*");
    }
  };

  useEffect(() => {
    setIsLoading!(true);
  }, []);

  const handleLoadingFinish = useCallback(() => {
    setIsUnityLoaded(true);
    setIsLoading!(false);
    iframeRef.current?.focus();
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
            if (data.method === "SetBlasterCharge")
              handleSetBlasterCharge(data.value);
            else if (data.method === "SetBlasterChargeExt")
              handleSetBlasterChargeExt(data.value);
            else if (data.method === "SetScore") handleSetScore(data.value);
            else if (data.method === "SetDamage")
              handleSetBlasterDamage(data.value);
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

  async function handleReturn() {
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

      <iframe
        ref={iframeRef}
        src="https://purpleguy.dev/vader"
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

      <Footer power={damage} clip={blasterChargeExt} charges={blasterCharge} />
    </>
  );
}
