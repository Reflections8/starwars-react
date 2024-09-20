/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Gameboard } from "../pages/game2/components/GameFields/gameboard";

type BattleshipsProviderProps = {
  children: ReactNode;
};

type BattleshipsContextProps = {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  userShips: any[];
  setUserShips: (ships: any[]) => void;
  socket: WebSocket | null; // Добавлено для доступа к сокету
  sendMessage: (obj: { type: string; message: object }) => void;
} & any;

type GameState = {
  status: "WON" | "LOST" | "IN_PROGRESS" | "NOT_STARTED" | string;
};

const BattleshipsContext = createContext<Partial<BattleshipsContextProps>>({});

export function BattleshipsProvider({ children }: BattleshipsProviderProps) {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({ status: "NOT_STARTED" });
  const [userShips, setUserShips] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [jwt, setJwt] = useState<string>(
    localStorage.getItem("auth_jwt") || ""
  );

  const [roomName, setRoomName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [messages, setMessages] = useState([]);

  const [createdRoom, setCreatedRoom] = useState({ name: "" });
  const [joinedRoom, setJoinedRoom] = useState({ name: "" });
  const [myShips, setMyShips] = useState([]);
  const [myHits, setMyHits] = useState([]);
  const [shipsPlaced, setShipsPlaced] = useState(false);
  const [searchingDuel, setSearchingDuel] = useState(true);

  const gameStateLocal = {
    turn: "",
    players: { I: "", II: "" },
    boards: {
      I: { misses: [], ships: [] },
      II: { misses: [], ships: [] },
    },
  };

  const clearFunction = (ws: WebSocket) => {
    console.error("Отсутствует токен авторизации");
    setJwt("");
    ws.close();
    navigate("/");
  };

  // Инициализация WebSocket
  useEffect(() => {
    if (!jwt) {
      navigate("/");
      return;
    }

    const ws = new WebSocket("wss://socket.akronix.io/shipBattle");
    console.log({ ws });
    socketRef.current = ws;
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket подключен");
    };

    ws.onerror = (error) => {
      console.error("Ошибка WebSocket:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket соединение закрыто", event);
      if (event.code !== 1000) {
        console.error(
          "Код закрытия WebSocket:",
          event.code,
          "Причина:",
          event.reason || "Неизвестная причина"
        );
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      socketRef.current = null; // Обнуляем ссылку на сокет
    };
  }, [jwt]);

  const [gameStarted, setGameStarted] = useState(false);

  const [userBoard, setUserBoard] = useState(new Gameboard(myShips));
  const [enemyBoard, setEnemyBoard] = useState(new Gameboard());
  const [myTurn, setMyTurn] = useState(true);

  const [myMisses, setMyMisses] = useState([]);
  const [enemyMisses, setEnemyMisses] = useState([]);
  const [isHit, setIsHit] = useState(false);

  const updateUserboard = () => {
    const newGameboard = new Gameboard(myShips);
    newGameboard.ships = myShips;
    newGameboard.hits = userBoard.hits;
    newGameboard.misses = enemyMisses;
    setUserBoard(newGameboard);
  };
  const updateEnemyBoard = () => {
    const newGameboard = new Gameboard();
    newGameboard.ships = enemyBoard.ships;
    newGameboard.hits = myHits;
    newGameboard.misses = myMisses;
    newGameboard.preHit = enemyBoard.preHit;
    setEnemyBoard(newGameboard);
  };

  const restartBoards = () => {
    setUserBoard(new Gameboard());
    setEnemyBoard(new Gameboard());
  };

  useEffect(() => {
    updateUserboard();
  }, [shipsPlaced]);

  const playBeamAnimation = ({ row, column }: any, me: boolean) => {
    //  playBeamSound();
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

  // Обработка сообщений WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const response = JSON.parse(event.data);
      const parsedMessage = JSON.parse(response?.message);

      console.log("Сообщение от сервера:", response.type, parsedMessage);

      switch (response.type) {
        case "create_room":
          setRoomName(response.message.room_name);
          setCreatedRoom({ name: parsedMessage?.room_name });
          break;
        case "start_placement_phase":
          setOpponentName(response.message.opponent_name);
          setJoinedRoom({ name: parsedMessage?.room_name });
          setRoomName(parsedMessage?.room_name);
          break;
        case "ships_placed":
          break;
        case "round_start":
          setGameStarted(true);
          // @ts-ignore
          const parsedShips =
            parsedMessage?.ships?.map((ship) => {
              return {
                length: ship.length,
                vertical: ship.vertical,
                pos: ship.head,
              };
            }) || [];

          if (!gameStateLocal.players.I) gameStateLocal.players.I = "I";

          gameStateLocal.boards.I.misses = [];
          gameStateLocal.boards.I.ships = parsedShips.map((shipPos: any) => ({
            length: shipPos.length,
            vertical: shipPos.vertical,
            head: { row: shipPos.pos.row, column: shipPos.pos.column },
            cells: [],
          }));

          setMyShips(parsedShips);
          setShipsPlaced(true);
          setMyTurn(parsedMessage.can_fire);
          break;
        case "fire_result":
          // @ts-ignore

          const fireResultParsedShips =
            parsedMessage?.field_view?.player_board?.ships?.map((ship) => {
              return {
                length: ship.length,
                vertical: ship.vertical,
                pos: ship.head,
              };
            }) || [];

          setMyShips(fireResultParsedShips);
          setMyMisses(parsedMessage?.field_view?.opponent_board?.misses);
          setMyHits(parsedMessage?.field_view?.opponent_board?.ships);
          setMyTurn(parsedMessage.can_fire);
          setIsHit(parsedMessage.is_hit);
          enemyBoard.updateEnemyBoard(parsedMessage.field_view.opponent_board);
          updateEnemyBoard();

          break;
        case "enemy_fire_result":
          playBeamAnimation(parsedMessage.fire_target, false);
          // @ts-ignore
          const enemyFireResultParsedShips =
            parsedMessage?.field_view?.player_board?.ships?.map((ship) => {
              return {
                length: ship.length,
                vertical: ship.vertical,
                pos: ship.head,
              };
            }) || [];

          setMyShips(enemyFireResultParsedShips);
          setEnemyMisses(parsedMessage?.field_view?.player_board?.misses);
          setMyTurn(parsedMessage.can_fire);
          setIsHit(parsedMessage.is_hit);
          userBoard.updateUserBoard(parsedMessage.field_view.player_board);
          updateUserboard();
          break;
        case "game_over":
          setGameState({ status: parsedMessage.my_win ? "WON" : "LOST" });

          break;
        default:
          console.log("Неизвестный тип сообщения");
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, userBoard, enemyBoard]);

  const sendMessage = (obj: { type: string; message: object }) => {
    const firstClient = document.location.href.includes("5173");
    const secondClient = document.location.href.includes("5174");
    const secondJWT =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiVVFBaXFIZkg5NnpHSUMzOG9OUnMxQVdIUnluM3JzalQxek9pQVlmalE0TktOX1BwIiwiZXhwIjoxNzI2OTE1MjQyLCJpc3MiOiJBa3Jvbml4IEF1dGgifQ.96N5LMUaufEMXhsLSkHqOntGO6TBNApeEbr9OGdid2U";

    const messageWithToken = {
      type: obj?.type,
      message: JSON.stringify(obj.message),
      jwt: secondClient ? secondJWT : jwt,
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(messageWithToken));

      if (obj.type === "join_room") {
        const messageWithAnotherToken = {
          type: obj?.type,
          message: JSON.stringify(obj.message),
          jwt: !secondClient ? secondJWT : jwt,
        };
        //   socketRef.current.send(JSON.stringify(messageWithAnotherToken));
      }
    }
  };

  return (
    <BattleshipsContext.Provider
      value={{
        gameState,
        setGameState,
        userShips,
        setUserShips,
        socket,
        sendMessage,
        messages,
        roomName,
        opponentName,
        setMessages,
        setRoomName,
        setOpponentName,
        searchingDuel,
        setSearchingDuel,
        createdRoom,
        setCreatedRoom,
        joinedRoom,
        setJoinedRoom,
        myShips,
        shipsPlaced,
        setShipsPlaced,

        gameStarted,
        setGameStarted,

        userBoard,
        updateUserboard,
        enemyBoard,
        updateEnemyBoard,
        restartBoards,

        myTurn,
        setMyTurn,
      }}
    >
      {children}
    </BattleshipsContext.Provider>
  );
}

export const useBattleships = () => useContext(BattleshipsContext);
