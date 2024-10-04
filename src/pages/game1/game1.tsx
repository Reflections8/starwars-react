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
import {
  Blaster,
  Character,
  CharactersData,
  useUserData,
} from "../../UserDataService.tsx";
import useWebSocket from "react-use-websocket";
import { VADER_SOCKET } from "../../main.tsx";

export function Game1() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { jwt, soundSetting } = useUserData();
  const navigate = useNavigate();
  const { setIsLoading } = useLoader();

  //const [initDataUnsafe] = useInitData();

  const [score, setScore] = useState(0);
  const [damage, setDamage] = useState(1);
  const [blasterCharge, setBlasterCharge] = useState(0);
  const [blasterChargeExt, setBlasterChargeExt] = useState(0);
  const [blasterLevel, setBlasterLevel] = useState(0);

  const [publicKey, setPublicKey] = useState("");
  const [isUnityLoaded, setIsUnityLoaded] = useState(false);
  const { sendMessage, lastMessage } = useWebSocket(VADER_SOCKET, {});

  useEffect(() => {
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
    const message = JSON.parse(data.message);
    switch (data.type) {
      case "pong":
        break;
      case "handshake": {
        sendMessageToUnity("ReceiveServerPublicKey", message.public_key);

        const score = parseInt(message.info.score);
        setScore(score | 0);

        updateGameInfo(message.info);
        break;
      }
      case "shoot_response": {
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
    const info = {
      character: character.type,
      blaster: blaster.level,
      charge: blaster.charge,
    };

    sendMessageToUnity("SetCustomization", JSON.stringify(info));
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

    console.log(message);
  };

  const handleLoadingFinish = useCallback(
    (publicKey: ReactUnityEventParameter) => {
      setIsUnityLoaded(true);
      setIsLoading!(false);
      setPublicKey(publicKey as string);
      iframeRef.current?.focus();
    },
    []
  );

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
        src="https://game.akronix.io/unity_vader/"
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

      <Footer
        power={damage}
        clip={blasterChargeExt}
        charges={blasterCharge}
        // @ts-ignore
        weaponLevel={blasterLevel}
      />
    </>
  );
}
