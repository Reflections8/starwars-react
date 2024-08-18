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

export function Game2() {
  const { openModal } = useModal();
  const { openDrawer, closeDrawer } = useDrawer();
  const { gameState, userShips } = useBattleships();

  const [userBoard, setUserBoard] = useState(new Gameboard());
  const [enemyBoard, setEnemyBoard] = useState(new Gameboard());

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

  // TODO: это useEffect чтобы затестить модалки победы/поражения, потом перенести в основной
  useEffect(() => {
    if (gameState?.status === "LOST") {
      // TODO: END GAME
      openModal!("battleshipsLost");
    }

    if (gameState?.status === "WON") {
      // TODO: END GAME
      openModal!("battleshipsWon");
      closeDrawer!();
    }
  }, [gameState?.status]);

  // TODO: моковый стэйт, заменить на нужный, либо брать из BattleshipsContext
  const [messages, setMessages] = useState([]);
  const [player, setPlayer] = useState(null);
  const [socket, setSocket] = useState<null | WebSocket>(null);

  // TODO: это основной useEffect который должен менять стэйт на клиенте получая сообщения по WS
  useEffect(() => {
    const mockServer = createMockServer();

    const newSocket = new WebSocket("ws://localhost:8080");

    newSocket.onopen = () => {
      newSocket.send(JSON.stringify({ type: "join" }));
    };

    newSocket.onmessage = (event) => {
      const { message, type } = JSON.parse(event.data);
      //setMessages((prevMessages) => [...prevMessages, message]);

      if (type === "updateBoard") {
        userBoard.updateUserBoard(message);
        updateUserboard();
      }
      if (type === "fireResult") {
        enemyBoard.updateEnemyBoard(message);
        updateEnemyBoard();
      }
      if (type === "joined") {
        setPlayer(message.player);
      }
    };

    newSocket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    setSocket(newSocket);

    // Генерация случайных сообщений от второго клиента
    const generateRandomMessages = () => {
      if (player === "player1") {
        const randomMessage = {
          type: "move",
          player: "player2",
          move: [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
          ],
        };
        mockServer.emit("message", JSON.stringify(randomMessage));
      }
    };

    const intervalId = setInterval(generateRandomMessages, 5000);

    return () => {
      newSocket.close();
      mockServer.stop();
      clearInterval(intervalId);
    };
  }, [player]);

  useEffect(() => {
    if (userShips && userShips.length > 0) {
      socket &&
        socket.send(JSON.stringify({ type: "shipsInit", message: userShips }));
    } else {
      openModal!("shipsArrangement2");
    }
  }, [JSON.stringify(userShips), socket]);

  const sendHit = (p: any) => {
    socket &&
      socket.send(
        JSON.stringify({ type: "fire", message: p, source: "player1" })
      );
  };

  return (
    <div className="game2">
      <GameHeader />
      <EnemyShips />
      <GameFields
        {...{
          enemyBoard,
          userBoard,
          updateEnemyBoard,
          updateUserboard,
          sendHit,
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
