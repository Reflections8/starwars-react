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

export function Game2() {
  const { openModal } = useModal();
  const { openDrawer, closeDrawer } = useDrawer();
  const { gameState } = useBattleships();

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
  const [socket, setSocket] = useState(null);

  // TODO: это основной useEffect который должен менять стэйт на клиенте получая сообщения по WS
  useEffect(() => {
    const mockServer = createMockServer();

    const newSocket = new WebSocket("ws://localhost:8080");

    newSocket.onopen = () => {
      newSocket.send(JSON.stringify({ type: "join" }));
    };

    console.log({ newSocket });

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);

      if (message.type === "joined") {
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

  return (
    <div className="game2">
      <GameHeader />
      <EnemyShips />
      <GameFields />
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
