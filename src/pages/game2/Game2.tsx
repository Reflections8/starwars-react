import { useEffect, useState } from "react";
import { useTimer } from "react-use-precision-timer";
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
let jwtFromStorage = localStorage.getItem("auth_jwt") ?? "";
if (document.location.href.includes("5174")) {
  jwtFromStorage =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiVVFBaXFIZkg5NnpHSUMzOG9OUnMxQVdIUnluM3JzalQxek9pQVlmalE0TktOX1BwIiwiZXhwIjoxNzI2OTE1MjQyLCJpc3MiOiJBa3Jvbml4IEF1dGgifQ.96N5LMUaufEMXhsLSkHqOntGO6TBNApeEbr9OGdid2U";
}

export function Game2() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [jwt] = useState<string>(jwtFromStorage);

  //   const [socket, setSocket] = useState<null | WebSocket>(null);
  const { openModal, closeModal } = useModal();
  const { openDrawer, closeDrawer } = useDrawer();

  useEffect(() => {
    if (!jwt) {
      closeModal!();
      navigate("/");
      closeModal!();
      return;
    }
  }, [jwt]);

  const {
    audioBgRef,
    shotAudioRef,
    shotSuccessAudioRef,
    shotMissAudioRef,
    shotKilledAudioRef,
    stopBackgroundAudio,
  } = useSound();

  // @ts-ignore
  const {
    socket,
    gameState,
    userShips,
    setGameState,
    setUserShips,
    userBoard,
    enemyBoard,
    updateUserboard,
    updateEnemyBoard,
    restartBoards,
    myTurn,
    approveGame,
  } = useBattleships();
  const [player] = useState("player1");

  const [timerValue, setTimerValue] = useState(timerSeconds * 1000);
  const timer = useTimer(
    { runOnce: true, startImmediately: false, delay: timerSeconds * 1000 },
    () => {
      myTurn &&
        socket &&
        socket.send(JSON.stringify({ type: "timeOut", source: player }));
    }
  );

  useEffect(() => {
    if (!approveGame) {
      closeDrawer!();
    } else {
      openDrawer!("opponentFound", "bottom", JSON.stringify(approveGame));
    }
  }, [JSON.stringify(approveGame)]);

  useEffect(() => {
    timer.stop();
    if (gameState !== "IN_PROGRESS") return;
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
    let timer;
    if (myTurn) return;
    timer = setTimeout(() => {
      const hit = userBoard.getRandomHitPlace();
      socket &&
        socket.send(
          JSON.stringify({
            type: "fire",
            message: hit,
            source: "mock",
          })
        );
    }, 2500);
    return () => {
      clearTimeout(timer);
    };
  }, [myTurn, userBoard]);

  useEffect(() => {
    if (!jwt) return;
    if (gameState === "LOST") {
      stopBackgroundAudio();
      setUserShips!([]);
      openModal!("battleshipsLost");
      restartBoards();
    }
    if (gameState === "WON") {
      stopBackgroundAudio();
      setUserShips!([]);
      openModal!("battleshipsWon");
      restartBoards();
    }
    if (gameState === "NOT_STARTED") {
      restartBoards();
      setUserShips!([]);
      openModal!("seaBattle");
    }
    if (gameState === "GIVE_UP") {
      socket && socket.send(JSON.stringify({ type: "giveUp", source: player }));
      stopBackgroundAudio();
    }
  }, [gameState, jwt]);

  useEffect(() => {
    if (userShips && userShips.length > 0) {
      timer.start();
      setGameState!("IN_PROGRESS");
    }
  }, [JSON.stringify(userShips), socket]);

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
          updateEnemyBoard,
          updateUserboard,
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
