import { useEffect, useState } from "react";
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

import { useTimer } from "react-use-precision-timer";
const timerSeconds = 60;

export function Game2() {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const { openModal } = useModal();
  const { openDrawer, closeDrawer } = useDrawer();
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
    timer.start();
  }, [myTurn]);

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
    if (gameState?.status === "LOST") openModal!("battleshipsLost");
    if (gameState?.status === "WON") {
      openModal!("battleshipsWon");
      closeDrawer!();
    }
    if (gameState?.status === "NOT_STARTED") {
      restartBoards();
      setUserShips!([]);
      openModal!("shipsArrangement2");
    }
    if (gameState?.status === "GIVE_UP") {
      socket && socket.send(JSON.stringify({ type: "giveUp", source: player }));
    }
  }, [gameState?.status]);

  useEffect(() => {
    if (socket === null) return;
    socket.onmessage = (event) => {
      const { message, type } = JSON.parse(event.data);
      if (type === "turn") {
        setMyTurn(message.player === player);
      }
      if (type === "updateBoard") {
        userBoard.updateUserBoard(message);
        updateUserboard();
      }
      if (type === "fireResult") {
        enemyBoard.updateEnemyBoard(message);
        updateEnemyBoard();
      }
      if (type === "recieveFire") {
        userBoard.updateUserBoard(message);
        updateUserboard();
      }
      if (type === "gameOver") {
        setGameState!({ status: message.victory ? "WON" : "LOST" });
        restartBoards();
      }
    };
  }, [userBoard, enemyBoard, socket, player]);

  // TODO: это основной useEffect который должен менять стэйт на клиенте получая сообщения по WS
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

  const sendHit = (p: any) =>
    socket &&
    socket.send(JSON.stringify({ type: "fire", message: p, source: player }));

  return (
    <div className="game2">
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
          openModal!("seaBattle", -1);
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
