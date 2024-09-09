import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { HomeIcon } from "../../icons/Home";
import { MenuIcon } from "../../icons/Menu";
import "./styles/game1.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { HeaderCenterCredits } from "../../components/Header/components/HeaderCenter/HeaderCenterCredits.tsx";
import { useNavigate } from "react-router-dom";
import { ProofManager } from "../../components/ProofManager/ProofManager.tsx";
import { useLoader } from "../../context/LoaderContext.tsx";
import {Blaster, Character, UserMetrics, useUserData} from "../../UserDataService.tsx";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {SERVER_URL, VADER_SOCKET} from "../../main.tsx";

export function Game1() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { jwt } = useUserData();
  const navigate = useNavigate();
  const { setIsLoading } = useLoader();

  //const [initDataUnsafe] = useInitData();

  const [score, setScore] = useState(0);
  const [damage, setDamage] = useState(1);
  const [blasterCharge, setBlasterCharge] = useState(0);
  const [blasterChargeExt, setBlasterChargeExt] = useState(0);

  const [isUnityLoaded, setIsUnityLoaded] = useState(false);
  const { sendMessage, lastMessage, readyState } = useWebSocket(VADER_SOCKET, {
    share: false,
    shouldReconnect: () => true
  });

  useEffect(() => {
    setIsLoading!(true);
  }, []);

  useEffect(() => {
    if (isUnityLoaded) {
      if (jwt == null || jwt === "") {
        navigate("/");
        return;
      }
    }
  }, [isUnityLoaded]);

  useEffect(() => {
    const data = JSON.parse(lastMessage?.toString());
    switch (data.type)
    {
      case "pong":
        break;
      case "handshake":
      {
          sendMessageToUnity("ReceiveServerPublicKey", data.message.public_key);

          const score = parseInt(data.message.info.score);
          setScore(score);

          updateGameInfo(data.message.info);
          break;
      }
      case "shoot_response":
      {
        const score = parseInt(data.message.score);
        setScore(score);

        updateGameInfo(data.message);
        break;
      }
      case "spawn_drone":
      {
        sendMessageToUnity("SpawnDrone", "");
        break;
      }
      case "despawn_drone":
      {
        sendMessageToUnity("DeSpawnDrone", "");
        break;
      }
      case "change_drone_position":
      {
        sendMessageToUnity("ChangeDronePosition", "");
        break;
      }
    }
  }, [lastMessage]);

  const updateGameInfo = (data: any) => {
    const blaster: Blaster = data.blaster;
    const character: Character = data.character;
    setBlasterCharge(blaster.charge);

    // here calculate damage
    const needHealing = character.earned >= character.earn_required;
    const totalDamage = Math.round(
        ((blaster.damage || 0) + (blaster.damage || 0)) *
        (needHealing ? 0.1 : 1)
    );
    setDamage(totalDamage);

    const chargeFillField = calculateFilled(blaster.charge, blaster.max_charge);
    setBlasterChargeExt(chargeFillField);

    const info = { character: character.type, blaster: blaster.level, charge: blaster.charge};
    sendMessageToUnity("SetCustomization", JSON.stringify(info))
  };

  const calculateFilled = (currentAmmo: number, maxAmmo: number): number => {
    if (currentAmmo === 0) {return 0;}
    let filled = currentAmmo / maxAmmo;
    filled = Math.round(filled / 0.04) * 0.04;
    if (filled < 0.04) {
      filled = 0.04;
    }
    const segment = Math.round(filled * 25);
    return segment;
  };

  const sendMessageToUnity = (method: string, param: any) => {
    const message = JSON.stringify({ method, param });
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(message, "*");
    }
  };

  const handleLoadingFinish = useCallback((publicKey: ReactUnityEventParameter) => {
    setIsUnityLoaded(true);
    setIsLoading!(false);

    if (jwt != null && jwt !== "")
    {
      const request = {
        type: "handshake",
        message: {
          public_key: publicKey as string
        },
        jwt: jwt
      }
      sendMessage(JSON.stringify(request));
    }
    iframeRef.current?.focus();
  }, []);

  const handleShoot = useCallback((value: ReactUnityEventParameter) =>{
    const data = JSON.parse(value as string);
    if (jwt != null && jwt !== "")
    {
      const request = {
        type: "shoot",
        message: {
          type: parseInt(data.type),
          seqno: data.seqno
        },
        jwt: jwt
      }
      sendMessage(JSON.stringify(request));
    }
  }, []);

  // Обработчик сообщений, полученных из iFrame
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data: any = JSON.parse(event.data);
        switch (data.type) {
          case "multiple": {
            if (data.method === "LoadFinish")
              handleLoadingFinish(data.value);
            if (data.method === "Shoot")
              handleShoot(data.value);
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
        src="https://akronix.io/unity_vader"
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
