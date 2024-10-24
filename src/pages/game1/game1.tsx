import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import useWebSocket from "react-use-websocket";
import { Footer } from "../../components/Footer/Footer";
import { HeaderCenterCredits } from "../../components/Header/components/HeaderCenter/HeaderCenterCredits.tsx";
import { Header } from "../../components/Header/Header";
import { ProofManager } from "../../components/ProofManager/ProofManager.tsx";
import { useDrawer } from "../../context/DrawerContext.tsx";
import { useLoader } from "../../context/LoaderContext.tsx";
import { HomeIcon } from "../../icons/Home";
import { MenuIcon } from "../../icons/Menu";
import { VADER_SOCKET } from "../../main.tsx";
import {
  Blaster,
  Character,
  CharactersData,
  useUserData,
} from "../../UserDataService.tsx";
import "./styles/game1.css";
import { useModal } from "../../context/ModalContext.tsx";

import bgSound from "../game1/audio/bgg.mp3";

export function Game1() {
  const { jwt, soundSetting, game1State, setGame1State } = useUserData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setIsLoading } = useLoader();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bgRef = useRef<HTMLAudioElement>(null);

  const [score, setScore] = useState(0);
  const [damage, setDamage] = useState(1);
  const [blasterCharge, setBlasterCharge] = useState(0);
  const [blasterChargeExt, setBlasterChargeExt] = useState(0);
  const [blasterLevel, setBlasterLevel] = useState(0);

  const [publicKey, setPublicKey] = useState("");
  const [isUnityLoaded, setIsUnityLoaded] = useState(false);
  const { sendMessage, lastMessage } = useWebSocket(VADER_SOCKET, {});

  useEffect(() => {
    if (game1State == true) {
      if (bgRef.current && soundSetting) {
        bgRef.current.loop = true;
        bgRef.current.play();
      }
      sendMessageToUnity("LangInit", t("audio.vader"));
      sendMessageToUnity(
        "SetQuality",
        localStorage.getItem("graphic_setting") ?? "80".toString()
      );
      setGame1State(false);
    }
  }, [game1State]);

  useEffect(() => {
    const pageLoader = document.querySelector(".pageLoader");
    pageLoader?.classList.add("loadingModalBg--Hidden");
    setIsLoading!(true);
  }, []);

  useEffect(() => {
    if (isUnityLoaded) {
      if (jwt == null || jwt === "") {
        navigate("/");
        return;
      }

      if (publicKey !== "") {
        const request = {
          type: "handshake",
          message: JSON.stringify({
            public_key: publicKey as string,
          }),
          jwt: jwt,
        };
        sendMessage(JSON.stringify(request));

        const interval = setInterval(() => {
          const request = {
            type: "ping",
            message: "",
            jwt: jwt,
          };
          sendMessage(JSON.stringify(request));
        }, 5000);

        return () => {
          clearInterval(interval);
        };
      }
    }
  }, [isUnityLoaded, publicKey]);

  useEffect(() => {
    if (lastMessage == null) return;
    const response: string = lastMessage.data.toString();

    const data = JSON.parse(response);

    switch (data.type) {
      case "pong":
        break;
      case "handshake": {
        const message = JSON.parse(data.message);
        sendMessageToUnity("ReceiveServerPublicKey", message.public_key);

        const score = parseInt(message.info.score);
        setScore(score | 0);

        updateGameInfo(message.info);
        break;
      }
      case "shoot_response": {
        const message = JSON.parse(data.message);
        const score = parseInt(message.score);
        setScore(score);

        updateGameInfo(message);
        break;
      }
      case "spawn_drone": {
        sendMessageToUnity("SpawnDrone", "");
        break;
      }
      case "despawn_drone": {
        sendMessageToUnity("DeSpawnDrone", "");
        break;
      }
      case "change_drone_position": {
        sendMessageToUnity("ChangeDronePosition", "");
        break;
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (!isUnityLoaded) return;

    if (soundSetting) {
      sendMessageToUnity("EnableGameSounds", "s");
    } else sendMessageToUnity("DisableGameSounds", "s");
  }, [soundSetting, isUnityLoaded]);

  const updateGameInfo = (data: any) => {
    const blaster: Blaster = data.blaster;
    const character: Character = data.character;

    // here calculate damage
    const needHealing = character.earned >= character.earn_required;
    const totalDamage = Math.round(
      ((blaster.damage || 0) +
        (CharactersData[character.type - 1].damage || 0)) *
        (needHealing ? 0.1 : 1)
    );
    setDamage(totalDamage);

    const chargeFillField = calculateFilled(blaster.charge, blaster.max_charge);
    setBlasterChargeExt(blaster.charge);
    setBlasterCharge(chargeFillField);
    setBlasterLevel(blaster.level);
    const info =
      character.type.toString() +
      ":" +
      blaster.level.toString() +
      ":" +
      blaster.charge.toString();
    sendMessageToUnity("SetCustomization", info);
  };

  const calculateFilled = (currentAmmo: number, maxAmmo: number): number => {
    if (currentAmmo === 0) {
      return 0;
    }
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

  const { openModal } = useModal();

  const handleLoadingFinish = useCallback(
    (publicKey: ReactUnityEventParameter) => {
      setIsUnityLoaded(true);
      setIsLoading!(false);
      openModal!("currentStat");
      setPublicKey(publicKey as string);
      iframeRef.current?.focus();
    },
    []
  );

  const handleStartGame = () => {
    setGame1State(true);
  };

  const handleShoot = (
    value: ReactUnityEventParameter,
    token: string | null
  ) => {
    const data = JSON.parse(value as string);

    if (token != null && token !== "") {
      const request = {
        type: "shoot",
        message: JSON.stringify({
          type: parseInt(data.type),
          seqno: data.seqno,
        }),
        jwt: token,
      };

      sendMessage(JSON.stringify(request));
    }
  };

  // Обработчик сообщений, полученных из iFrame
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data: any = JSON.parse(event.data);
        switch (data.type) {
          case "multiple": {
            if (data.method === "LoadFinish") handleLoadingFinish(data.value);
            if (data.method === "Shoot") handleShoot(data.value, jwt);
            if (data.method === "StartGame") handleStartGame();
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
  }, [jwt]);

  async function handleReturn() {
    navigate("/");
  }

  const handleAuthTokenChange = () => {};

  const { openDrawer } = useDrawer();

  return (
    <>
      <ProofManager onValueChange={handleAuthTokenChange} />
      <Header
        leftIcon={<HomeIcon />}
        leftText={"Домой"}
        leftAction={handleReturn}
        rightIcon={<MenuIcon />}
        rightText={"Меню"}
        rightAction={() => {
          openDrawer!("menu", "top");
        }}
        centerComponent={<HeaderCenterCredits credits={score} />}
      />
      <div className="topLinearGradient" />
      <div className="bottomLinearGradient" />
      <iframe
        ref={iframeRef}
        src="https://game.akronix.io/new/unity_vader_28/"
        style={{
          userSelect: "none",
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        autoFocus={true}
        id="mainWrapper"
        className="mainWrapper"
      >
        <audio ref={bgRef} src={bgSound} autoPlay={false} autoFocus={false} />
      </iframe>
      <Footer
        power={damage}
        clip={blasterChargeExt}
        charges={blasterCharge}
        // @ts-ignore
        weaponLevel={blasterLevel}
      />
      )
    </>
  );
}
