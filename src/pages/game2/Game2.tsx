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
import { Gameboard } from "./components/GameFields/gameboard";
import { GameFields } from "./components/GameFields/GameFields";
import { GameHeader } from "./components/GameHeader/GameHeader";
import createMockServer from "./mock-socket/mockServer";
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
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const { openModal } = useModal();
  const { openDrawer, closeDrawer } = useDrawer();
  // @ts-ignore
  const { gameState, userShips, setGameState, setUserShips } = useBattleships();
  const [userBoard, setUserBoard] = useState(new Gameboard());
  const [enemyBoard, setEnemyBoard] = useState(new Gameboard());
  const [myTurn, setMyTurn] = useState(true);
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

  const updateUserboard = () => {
    const newGameboard = new Gameboard();
    newGameboard.ships = userBoard.ships;
    newGameboard.hits = userBoard.hits;
    newGameboard.misses = userBoard.misses;
    setUserBoard(newGameboard);
  };
  const updateEnemyBoard = () => {
    const newGameboard = new Gameboard();
    newGameboard.ships = enemyBoard.ships;
    newGameboard.hits = enemyBoard.hits;
    newGameboard.misses = enemyBoard.misses;
    newGameboard.preHit = enemyBoard.preHit;
    setEnemyBoard(newGameboard);
  };

  const restartBoards = () => {
    setUserBoard(new Gameboard());
    setEnemyBoard(new Gameboard());
  };

  const playBeamAnimation = ({ row, column }: any, me: boolean) => {
    playBeamSound();
    const targetCell = document.getElementById(
      `${me ? "enemy" : "user"}Cell${row}-${column}`
    ) as HTMLElement;
    return new Promise<void>((resolve) => {
      const beam = document.createElement("div");
      beam.className = "beam-animation-" + (me ? "green" : "red");
      document.body.appendChild(beam);

      // Calculate the position of the target cell
      const targetRect = targetCell.getBoundingClientRect();
      const beamRect = beam.getBoundingClientRect();
      const startX = beamRect.left;
      const startY = beamRect.top;

      let targetX = targetRect.left + targetRect.width / 2;
      let targetY = targetRect.top + targetRect.height / 2;
      if (me) {
        targetX += 1;
        targetY += 7;
      } else {
        targetX -= 1;
        targetY -= 7;
      }

      const deltaX = targetX - startX;
      const deltaY = targetY - startY;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      beam.style.transform = `rotate(${angle}deg)`;

      setTimeout(() => {
        beam.style.left = `${targetX}px`;
        beam.style.top = `${targetY}px`;
        beam.style.width = "10px";
      }, 10);

      // Remove the beam after the animation completes
      beam.addEventListener("transitionend", () => {
        document.body.removeChild(beam);
        resolve();
      });
    });
  };

  const playBeamSound = () => {
    // @ts-ignore
    shotAudioRef.current.pause();
    // @ts-ignore
    shotAudioRef.current.currentTime = 0;
    // @ts-ignore
    shotAudioRef.current.play().catch();
  };

  const playSuccessShotAudio = () => {
    // @ts-ignore
    shotSuccessAudioRef.current.pause();
    // @ts-ignore
    shotSuccessAudioRef.current.currentTime = 0;
    // @ts-ignore
    shotSuccessAudioRef.current.play().catch();
  };

  const playKilledShopAudio = () => {
    // @ts-ignore
    shotKilledAudioRef.current.pause();
    // @ts-ignore
    shotKilledAudioRef.current.currentTime = 0;
    // @ts-ignore
    shotKilledAudioRef.current.play().catch();
  };

  const playMissedShotAudio = () => {
    // @ts-ignore
    shotMissAudioRef.current.pause();
    // @ts-ignore
    shotMissAudioRef.current.currentTime = 0;
    // @ts-ignore
    shotMissAudioRef.current.play().catch();
  };

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
      openModal!("battleshipsLost");
      restartBoards();
    }
    if (gameState?.status === "WON") {
      stopBackgroundAudio();
      openModal!("battleshipsWon");
      closeDrawer!();
      restartBoards();
    }
    if (gameState?.status === "NOT_STARTED") {
      restartBoards();
      setUserShips!([]);
      openModal!("shipsArrangement2");

      openModal!("seaBattle");
    }
    if (gameState?.status === "GIVE_UP") {
      socket && socket.send(JSON.stringify({ type: "giveUp", source: player }));
      stopBackgroundAudio();
    }
  }, [gameState?.status]);

  useEffect(() => {
    if (socket === null) return;
    socket.onmessage = (event) => {
      const { message, type, attack, isHit, isDead } = JSON.parse(event.data);
      if (type === "turn") {
        setMyTurn(message.player === player);
      }
      if (type === "updateBoard") {
        userBoard.updateUserBoard(message);
        updateUserboard();
      }
      if (type === "fireResult") {
        isHit
          ? isDead
            ? playKilledShopAudio()
            : playSuccessShotAudio()
          : playMissedShotAudio();
        enemyBoard.updateEnemyBoard(message);
        updateEnemyBoard();
      }
      if (type === "recieveFire") {
        console.log({ isDead });
        playBeamAnimation(attack, false).then(() => {
          userBoard.updateUserBoard(message);
          isHit
            ? isDead
              ? playKilledShopAudio()
              : playSuccessShotAudio()
            : playMissedShotAudio();
          updateUserboard();
        });
      }
      if (type === "gameOver") {
        setGameState!({ status: message.victory ? "WON" : "LOST" });
        restartBoards();
      }
    };
  }, [userBoard, enemyBoard, socket, player]);

  useEffect(() => {
    const mockServer = createMockServer();
    const newSocket = new WebSocket("ws://localhost:8080");
    newSocket.onopen = () => {
      newSocket.send(JSON.stringify({ type: "join" }));
    };
    newSocket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };
    setSocket(newSocket);

    return () => {
      newSocket.close();
      mockServer.stop();
    };
  }, [player]);

  useEffect(() => {
    if (userShips && userShips.length > 0) {
      timer.start();
      setGameState!({ status: "IN_PROGRESS" });
      socket &&
        socket.send(
          JSON.stringify({
            type: "shipsInit",
            message: userShips,
            source: player,
          })
        );
    }
  }, [JSON.stringify(userShips), socket]);

  const sendHit = (p: any) => {
    if (gameState?.status !== "IN_PROGRESS") return;
    playBeamAnimation(p, true).then(() => {
      socket &&
        socket.send(
          JSON.stringify({ type: "fire", message: p, source: player })
        );
    });
  };

  const audioBgRef = useRef(null);
  const shotAudioRef = useRef(null);
  const shotSuccessAudioRef = useRef(null);
  const shotMissAudioRef = useRef(null);
  const shotKilledAudioRef = useRef(null);

  useEffect(() => {
    if (gameState?.status === "IN_PROGRESS") {
      // @ts-ignore
      audioBgRef.current.play().catch();
    }
  }, [gameState?.status]);

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
          sendHit,
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
