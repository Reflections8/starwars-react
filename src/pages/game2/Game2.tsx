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
import createMockServer from "./mock-socket/mockServer";
import { Gameboard } from "./components/GameFields/gameboard";
let lastEnemyHit = { row: 0, column: -1 };

export function Game2() {
  const { openModal } = useModal();
  const { openDrawer, closeDrawer } = useDrawer();
  const { gameState, userShips } = useBattleships();

  const [userBoard, setUserBoard] = useState(new Gameboard());
  const [enemyBoard, setEnemyBoard] = useState(new Gameboard());
  const [myTurn, setMyTurn] = useState(true);
  const [player, setPlayer] = useState("player1");

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

  useEffect(() => {
    let timer;
    if (myTurn) return;
    timer = setTimeout(() => {
      if (lastEnemyHit.column <= 9) {
        lastEnemyHit.column++;
      } else {
        lastEnemyHit.column = 0;
        lastEnemyHit.row++;
      }
      socket &&
        socket.send(
          JSON.stringify({
            type: "fire",
            message: lastEnemyHit,
            source: "mock",
          })
        );
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [myTurn]);

  useEffect(() => {
    if (gameState?.status === "LOST") openModal!("battleshipsLost");
    if (gameState?.status === "WON") {
      openModal!("battleshipsWon");
      closeDrawer!();
    }
  }, [gameState?.status]);

  const [socket, setSocket] = useState<null | WebSocket>(null);

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
        setMyTurn(false);
        enemyBoard.updateEnemyBoard(message);
        updateEnemyBoard();
      }
      if (type === "recieveFire") {
        setMyTurn(true);
        userBoard.updateUserBoard(message);
        console.log(message);
        updateUserboard();
      }
      if (type === "joined") {
        setPlayer(message.player);
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
      socket &&
        socket.send(
          JSON.stringify({
            type: "shipsInit",
            message: userShips,
            source: player,
          })
        );
    } else {
      openModal!("shipsArrangement2");
    }
  }, [JSON.stringify(userShips), socket]);

  const sendHit = (p: any) =>
    socket &&
    socket.send(JSON.stringify({ type: "fire", message: p, source: player }));

  return (
    <div className="game2">
      <GameHeader myTurn={myTurn} />
      <EnemyShips ships={enemyBoard.getShipsRemain()} />
      <GameFields
        {...{
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
