import { useEffect, useRef, useState } from "react";
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
enableDragDropTouch();

const timerSeconds = 60;

export function Game2() {
  //   const [socket, setSocket] = useState<null | WebSocket>(null);
  const { openModal } = useModal();
  const { openDrawer } = useDrawer();
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
    shotSuccessAudioRef,
    shotMissAudioRef,
    shotKilledAudioRef,
    shotAudioRef,
  } = useBattleships();
  //   const [userBoard, setUserBoard] = useState(new Gameboard(myShips));
  //   const [enemyBoard, setEnemyBoard] = useState(new Gameboard());
  //   const [myTurn, setMyTurn] = useState(true);
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
    timer.stop();
    if (gameState?.status !== "IN_PROGRESS") return;
    timer.start();
  }, [myTurn, gameState?.status]);

  useEffect(() => {
    let interval: any;
    interval = setInterval(() => {
      setTimerValue(timer.getRemainingTime());
    });
    return () => {
      clearInterval(interval);
    };
  }, []);

  //   const updateUserboard = () => {
  //     const newGameboard = new Gameboard(myShips);
  //     newGameboard.ships = myShips;
  //     newGameboard.hits = userBoard.hits;
  //     newGameboard.misses = userBoard.misses;
  //     setUserBoard(newGameboard);
  //   };
  //   const updateEnemyBoard = () => {
  //     const newGameboard = new Gameboard();
  //     newGameboard.ships = enemyBoard.ships;
  //     newGameboard.hits = enemyBoard.hits;
  //     newGameboard.misses = enemyBoard.misses;
  //     newGameboard.preHit = enemyBoard.preHit;
  //     setEnemyBoard(newGameboard);
  //   };

  const stopBackgroundAudio = () => {
    if (audioBgRef.current) {
      // @ts-ignore
      audioBgRef.current.pause();
      // @ts-ignore
      audioBgRef.current.currentTime = 0;
    }
  };

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
    if (gameState?.status === "LOST") {
      stopBackgroundAudio();
      setUserShips!([]);
      openModal!("battleshipsLost");
      restartBoards();
    }
    if (gameState?.status === "WON") {
      stopBackgroundAudio();
      setUserShips!([]);
      openModal!("battleshipsWon");
      restartBoards();
    }
    if (gameState?.status === "NOT_STARTED") {
      restartBoards();
      setUserShips!([]);
      openModal!("seaBattle");
    }
    if (gameState?.status === "GIVE_UP") {
      socket && socket.send(JSON.stringify({ type: "giveUp", source: player }));
      stopBackgroundAudio();
    }
  }, [gameState?.status]);

  useEffect(() => {
    if (userShips && userShips.length > 0) {
      timer.start();
      setGameState!({ status: "IN_PROGRESS" });
    }
  }, [JSON.stringify(userShips), socket]);

  const audioBgRef = useRef(null);

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
        leftText={"Правила"}
        leftAction={() => {
          openModal!("rules");
        }}
        rightIcon={<LeaveIcon />}
        rightText={"Сдаться"}
        rightAction={() => {
          openDrawer!("giveUp");
        }}
      />
    </div>
  );
}
