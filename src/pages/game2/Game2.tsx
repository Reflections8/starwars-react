import { useEffect, useState } from "react";
import { Header } from "../../components/Header/Header";
import { useBattleships } from "../../context/BattleshipsContext";
import { useDrawer } from "../../context/DrawerContext";
import { useModal } from "../../context/ModalContext";
import { LeaveIcon } from "../../icons/Leave";
import { RulesIcon } from "../../icons/Rules";
import { EnemyShips } from "./components/EnemyShips/EnemyShips";
import { GameBet } from "./components/GameBet/GameBet";

import { GameFields } from "./components/GameFields/GameFields";
import { GameHeader } from "./components/GameHeader/GameHeader";

import "./styles/game2.css";
//@ts-ignore
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSound } from "../../context/SeaContexts";
//@ts-ignore
import { enableDragDropTouch } from "../../mobileDrag";
import { LoadingModal } from "../../ui/Modal/LoadingModal";
import { useUserData } from "../../UserDataService";
import audioBg from "./audio/game.mp3";
import audioKilledShot from "./audio/shot-killed.mp3";
import audioMissedShot from "./audio/shot-missed.mp3";
import audioSuccessShot from "./audio/shot-success.mp3";
import audioShot from "./audio/shot.mp3";
import { getMe } from "../../components/Modals/SeaBattle/service/sea-battle.service";
enableDragDropTouch();

const timerSeconds = 30;

export function Game2() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const { openDrawer } = useDrawer();

  const {
    audioBgRef,
    shotAudioRef,
    shotSuccessAudioRef,
    shotMissAudioRef,
    shotKilledAudioRef,
  } = useSound();

  const { jwt: userDataJwt } = useUserData();

  const {
    myBoardState,
    enemyBoardState,
    userBoard,
    enemyBoard,
    myTurn,
    handshakeTimer,
    setHandshakeTimer,
  } = useBattleships();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const pageLoader = document.querySelector(".pageLoader");
    pageLoader?.classList.add("loadingModalBg--Hidden");
  }, []);

  useEffect(() => {
    if (!userDataJwt) {
      closeModal!();
      navigate("/");
      closeModal!();
      return;
    }
    getMe().then((res) => {
      localStorage.setItem("username", res.username);
    });
    openModal!("seaBattle");
    setIsLoading(false);
  }, [userDataJwt]);

  const [timerValue, setTimerValue] = useState(timerSeconds * 1000);

  const resetTimer = (v: number) => {
    setTimerValue(0);
    setTimeout(() => {
      setTimerValue(v);
    }, 10);
  };

  useEffect(() => {
    resetTimer(timerSeconds * 1000);
  }, [myTurn]);

  useEffect(() => {
    if (myBoardState.ships && myBoardState.ships.length > 0)
      resetTimer(timerSeconds * 1000);
  }, [JSON.stringify(myBoardState), JSON.stringify(enemyBoardState)]);

  useEffect(() => {
    if (handshakeTimer.state === 5 || handshakeTimer.state === 6) {
      setTimeout(() => {
        resetTimer(handshakeTimer.time * 1000);
        setHandshakeTimer({ time: 0, state: 0 });
      }, 200);
    }
  }, [handshakeTimer]);

  return (
    <>
      {isLoading ? (
        <LoadingModal isOpen={isLoading} />
      ) : (
        <div className="game2">
          {/* AUDIO */}
          <audio
            ref={audioBgRef}
            src={audioBg}
            style={{
              position: "absolute",
              opacity: "0",
              pointerEvents: "none",
            }}
          />
          <audio
            ref={shotAudioRef}
            src={audioShot}
            style={{
              position: "absolute",
              opacity: "0",
              pointerEvents: "none",
            }}
          />
          <audio
            ref={shotSuccessAudioRef}
            src={audioSuccessShot}
            style={{
              position: "absolute",
              opacity: "0",
              pointerEvents: "none",
            }}
          />
          <audio
            ref={shotMissAudioRef}
            src={audioMissedShot}
            style={{
              position: "absolute",
              opacity: "0",
              pointerEvents: "none",
            }}
          />
          <audio
            ref={shotKilledAudioRef}
            src={audioKilledShot}
            style={{
              position: "absolute",
              opacity: "0",
              pointerEvents: "none",
            }}
          />
          <div className="game2__gradientTop"></div>
          <div className="game2__gradientBottom"></div>
          <div id={"beam-animation-green"} className="beam-animation-green" />
          <div id={"beam-animation-red"} className="beam-animation-red" />
          <GameHeader myTurn={myTurn} />
          <EnemyShips ships={enemyBoard.getShipsRemain()} />
          <GameFields
            {...{
              timerValue,
              enemyBoard,
              userBoard,
              myTurn,
            }}
          />
          <GameBet />

          <Header
            position={"bottom"}
            leftIcon={<RulesIcon />}
            leftText={t("battleships.rules")}
            leftAction={() => {
              openModal!("rules");
            }}
            rightIcon={<LeaveIcon />}
            rightText={t("battleships.giveUp")}
            rightAction={() => {
              openDrawer!("giveUp");
            }}
          />
        </div>
      )}
    </>
  );
}
