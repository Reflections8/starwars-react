import { useEffect, useState } from "react";
import { useTimer } from "react-use-precision-timer";
import { Header } from "../../components/Header/Header";
import { gameStates, useBattleships } from "../../context/BattleshipsContext";
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
import { enableDragDropTouch } from "../../mobileDrag";
import audioBg from "./audio/game.mp3";
import audioKilledShot from "./audio/shot-killed.mp3";
import audioMissedShot from "./audio/shot-missed.mp3";
import audioSuccessShot from "./audio/shot-success.mp3";
import audioShot from "./audio/shot.mp3";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSound } from "../../context/SeaContexts";
enableDragDropTouch();

const timerSeconds = 60;

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

  const { gameState, myBoardState, userBoard, enemyBoard, myTurn, jwt } =
    useBattleships();

  useEffect(() => {
    if (!jwt) {
      closeModal!();
      navigate("/");
      closeModal!();
      return;
    }
  }, [jwt]);

  const [timerValue, setTimerValue] = useState(timerSeconds * 1000);
  const timer = useTimer(
    { runOnce: true, startImmediately: false, delay: timerSeconds * 1000 },
    () => {}
  );

  useEffect(() => {
    timer.stop();
    if (gameState !== gameStates.PLAYING) return;
    timer.start();
  }, [myTurn, gameState]);

  useEffect(() => {
    let interval: any;
    interval = setInterval(() => {
      setTimerValue(timer.getRemainingTime());
    });
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (myBoardState.ships && myBoardState.ships.length > 0) {
      timer.start();
    }
  }, [JSON.stringify(myBoardState)]);

  return (
    <div className="game2">
      {/* AUDIO */}
      <audio
        ref={audioBgRef}
        src={audioBg}
        style={{ position: "absolute", opacity: "0", pointerEvents: "none" }}
      />
      <audio
        ref={shotAudioRef}
        src={audioShot}
        style={{ position: "absolute", opacity: "0", pointerEvents: "none" }}
      />
      <audio
        ref={shotSuccessAudioRef}
        src={audioSuccessShot}
        style={{ position: "absolute", opacity: "0", pointerEvents: "none" }}
      />
      <audio
        ref={shotMissAudioRef}
        src={audioMissedShot}
        style={{ position: "absolute", opacity: "0", pointerEvents: "none" }}
      />
      <audio
        ref={shotKilledAudioRef}
        src={audioKilledShot}
        style={{ position: "absolute", opacity: "0", pointerEvents: "none" }}
      />
      <div className="game2__gradientTop"></div>
      <div className="game2__gradientBottom"></div>
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
  );
}
