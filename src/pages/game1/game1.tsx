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

import bgSound from "../game1/audio/bg.mp3";
import vader_breath from "../game1/audio/vader_breath.mp3";
import vader_speak_en from "../game1/audio/vader_speak_en.wav";
import vader_speak_ru from "../game1/audio/vader_speak_ru.wav";
import vader_slice_bullet_1 from "../game1/audio/vader_slice_bullet_1.mp3";
import vader_slice_bullet_2 from "../game1/audio/vader_slice_bullet_2.wav";
import vader_slice_bullet_3 from "../game1/audio/vader_slice_bullet_3.mp3";
import vader_slice_bullet_4 from "../game1/audio/vader_slice_bullet_4.wav";

import sword_sway_1 from "../game1/audio/sword_sway_1.mp3";
import sword_sway_2 from "../game1/audio/sword_sway_2.mp3";
import sword_unholster from "../game1/audio/sword_unholster.mp3";

import gun_holster from "../game1/audio/gun_holster.mp3";

export function Game1() {
  const { jwt, soundSetting, game1State } = useUserData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setIsLoading } = useLoader();

  //const [initDataUnsafe] = useInitData();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bgRef = useRef<HTMLAudioElement>(null);
  const vaderTalkAudioRef = useRef<HTMLAudioElement>(null);
  const swordAudioRef = useRef<HTMLAudioElement>(null);
  const playerAudioRef = useRef<HTMLAudioElement>(null);

  const [score, setScore] = useState(0);
  const [damage, setDamage] = useState(1);
  const [blasterCharge, setBlasterCharge] = useState(0);
  const [blasterChargeExt, setBlasterChargeExt] = useState(0);
  const [blasterLevel, setBlasterLevel] = useState(0);

  const [publicKey, setPublicKey] = useState("");
  const [isUnityLoaded, setIsUnityLoaded] = useState(false);
  const { sendMessage, lastMessage } = useWebSocket(VADER_SOCKET, {});

  useEffect(() => {
    console.log({ game1State });
  }, [game1State]);

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
      if (bgRef.current) {
        bgRef.current.loop = true;
        bgRef.current.play();
        bgRef.current.playbackRate = 0.8;
        bgRef.current.volume = 0.14;
      }
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

  const handlePlayAudio = (value: ReactUnityEventParameter) => {
    try {
      const data = value as string;
      switch (data) {
        case "vader_speak": {
          if (!vaderTalkAudioRef.current) return;
          let lang = t("audio.vader");
          const options_en = [vader_speak_en];

          const options_ru = [vader_speak_ru];

          const randomIndex = Math.floor(Math.random() * options_en.length);

          vaderTalkAudioRef.current.src =
            lang == "en" ? options_en[randomIndex] : options_ru[randomIndex];
          vaderTalkAudioRef.current.volume = 1;
          vaderTalkAudioRef.current.play();
          break;
        }
        case "vader_breath": {
          if (!vaderTalkAudioRef.current) return;
          vaderTalkAudioRef.current.src = vader_breath;
          vaderTalkAudioRef.current.volume = 0.4;
          vaderTalkAudioRef.current.play();
          break;
        }
        case "vader_slice_bullet": {
          if (!vaderTalkAudioRef.current) return;
          const options = [
            vader_slice_bullet_1,
            vader_slice_bullet_2,
            vader_slice_bullet_3,
            vader_slice_bullet_4,
          ];
          const randomIndex = Math.floor(Math.random() * options.length);
          vaderTalkAudioRef.current.src = options[randomIndex];
          vaderTalkAudioRef.current.volume = 0.5;
          vaderTalkAudioRef.current.play();

          if (!swordAudioRef.current) return;

          const options1 = [sword_sway_1, sword_sway_2];
          const randomIndex1 = Math.floor(Math.random() * options1.length);
          swordAudioRef.current.src = options1[randomIndex1];
          swordAudioRef.current.volume = 0.8;
          swordAudioRef.current.play();
          break;
        }
        case "sword_unholster": {
          if (!swordAudioRef.current) return;
          swordAudioRef.current.src = sword_unholster;
          swordAudioRef.current.volume = 0.3;
          swordAudioRef.current.play();
          break;
        }
        case "sword_sway": {
          if (!swordAudioRef.current) return;
          const options = [sword_sway_1, sword_sway_2];
          const randomIndex = Math.floor(Math.random() * options.length);
          swordAudioRef.current.src = options[randomIndex];
          swordAudioRef.current.volume = 0.3;
          swordAudioRef.current.play();
          break;
        }
        case "gun_holster": {
          if (!playerAudioRef.current) return;
          playerAudioRef.current.src = gun_holster;
          playerAudioRef.current.volume = 0.5;
          playerAudioRef.current.play();
          break;
        }
      }
    } catch (e) {
      console.log(e);
    }
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
            if (data.method === "PlayAudio") handlePlayAudio(data.value);
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

      <audio ref={bgRef} src={bgSound} autoFocus={true} />
      <audio ref={vaderTalkAudioRef} autoFocus={true} />
      <audio ref={swordAudioRef} autoFocus={true} />
      <audio ref={playerAudioRef} autoFocus={true} />
      <iframe
        ref={iframeRef}
        src="https://game.akronix.io/new/unity_vader_2/"
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
