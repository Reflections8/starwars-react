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
import { playBeamAnimation, useSound } from "./SeaContexts";
import { useDrawer } from "./DrawerContext";

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

type GameState = "WON" | "LOST" | "IN_PROGRESS" | "NOT_STARTED" | string;

let jwtToUse = localStorage.getItem("auth_jwt") || "";
if (document.location.href.includes("5174"))
  jwtToUse =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiVVFBaXFIZkg5NnpHSUMzOG9OUnMxQVdIUnluM3JzalQxek9pQVlmalE0TktOX1BwIiwiZXhwIjoxNzI2OTE1MjQyLCJpc3MiOiJBa3Jvbml4IEF1dGgifQ.96N5LMUaufEMXhsLSkHqOntGO6TBNApeEbr9OGdid2U";

const BattleshipsContext = createContext<Partial<BattleshipsContextProps>>({});

export function BattleshipsProvider({ children }: BattleshipsProviderProps) {
  const navigate = useNavigate();
  const { blastIt, setIsAudioStart } = useSound();

  const [approveGame, setApproveGame] = useState<any>(null);
  const [gameState, setGameState] = useState("NOT_STARTED");
  const [userShips, setUserShips] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [jwt] = useState<string>(jwtToUse);

  const [roomName, setRoomName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [messages, setMessages] = useState([]);

  const [createdRoom, setCreatedRoom] = useState({ name: "" });
  const [joinedRoom, setJoinedRoom] = useState("");
  const [myShips, setMyShips] = useState([]);
  const [myHits, setMyHits] = useState([]);
  const [shipsPlaced, setShipsPlaced] = useState(false);
  const [searchingDuel, setSearchingDuel] = useState(false);

  useEffect(() => {
    if (!jwt) {
      navigate("/");
      return;
    }
    const ws = new WebSocket("wss://socket.akronix.io/shipBattle");
    socketRef.current = ws;
    setSocket(ws);
    ws.onopen = () =>
      ws.send(JSON.stringify({ type: "handshake", message: "zdarova", jwt }));
    ws.onclose = (event) => {
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
      if (ws.readyState === WebSocket.OPEN) ws.close();
      socketRef.current = null; // Обнуляем ссылку на сокет
    };
  }, [jwt]);

  const [gameStarted, setGameStarted] = useState(false);
  const [userBoard, setUserBoard] = useState(new Gameboard(myShips));
  const [enemyBoard, setEnemyBoard] = useState(new Gameboard());
  const [myTurn, setMyTurn] = useState(true);

  const [myMisses, setMyMisses] = useState([]);
  const [enemyMisses, setEnemyMisses] = useState([]);
  const userDeadShips = useRef([]);
  const enemyDeadShips = useRef([]);

  useEffect(() => {
    const newGameboard = new Gameboard(myShips);
    newGameboard.ships = myShips;
    newGameboard.hits = userBoard.hits;
    newGameboard.misses = enemyMisses;
    setUserBoard(newGameboard);
  }, [shipsPlaced, JSON.stringify([myShips, userBoard.hits, enemyMisses])]);

  useEffect(() => {
    const newGameboard = new Gameboard();
    newGameboard.ships = enemyBoard.ships;
    newGameboard.hits = myHits;
    newGameboard.misses = myMisses;
    newGameboard.preHit = enemyBoard.preHit;
    setEnemyBoard(newGameboard);
  }, [JSON.stringify([enemyBoard.ships, myHits, myMisses, enemyBoard.preHit])]);

  const restartBoards = () => {
    userDeadShips.current = [];
    enemyDeadShips.current = [];
    setUserBoard(new Gameboard());
    setEnemyBoard(new Gameboard());
  };

  // Обработка сообщений WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const response = JSON.parse(event.data);
      const parsedMessage = JSON.parse(response?.message);

      console.log("Сообщение от сервера:", response.type, parsedMessage);

      switch (response.type) {
        case "start_approve_phase": {
          setApproveGame(parsedMessage);
          break;
        }
        case "create_room":
          setRoomName(response.message.room_name);
          setCreatedRoom({ name: parsedMessage?.room_name });
          break;
        case "start_placement_phase":
          setOpponentName(response.message.opponent_name);

          setJoinedRoom(parsedMessage?.room_name);
          setRoomName(parsedMessage?.room_name);
          break;
        case "ships_placed":
          break;
        case "round_start":
          setGameStarted(true);
          setIsAudioStart(true);
          // @ts-ignore
          const parsedShips =
            parsedMessage?.ships?.map((ship: any) => {
              return {
                length: ship.length,
                vertical: ship.vertical,
                pos: ship.head,
              };
            }) || [];

          setMyShips(parsedShips);
          setShipsPlaced(true);
          setMyTurn(parsedMessage.can_fire);
          break;
        case "fire_result":
          const prevDeadEList = enemyDeadShips.current.filter(
            //@ts-ignore
            (ship) => ship.is_dead
          );
          const newDeadEList =
            parsedMessage.field_view.opponent_board.ships.filter(
              //@ts-ignore
              (ship) => ship.is_dead
            );

          let isHit = "fail";
          if (parsedMessage.is_hit) {
            if (prevDeadEList.length < newDeadEList.length) isHit = "dead";
            else isHit = "success";
          }
          enemyDeadShips.current =
            parsedMessage.field_view.opponent_board.ships;
          playBeamAnimation(parsedMessage.fire_target, true, isHit, blastIt);
          // @ts-ignore
          const fireResultParsedShips =
            parsedMessage?.field_view?.player_board?.ships?.map((ship: any) => {
              return {
                length: ship.length,
                vertical: ship.vertical,
                pos: ship.head,
              };
            }) || [];

          setMyShips(fireResultParsedShips);
          setMyMisses(parsedMessage?.field_view?.opponent_board?.misses);
          setMyHits(
            parsedMessage?.field_view?.opponent_board?.ships
              .map((ship: any) => ship.cells)
              .flat()
          );
          setMyTurn(parsedMessage.can_fire);
          enemyBoard.updateEnemyBoard(parsedMessage.field_view.opponent_board);
          break;
        case "enemy_fire_result":
          const prevDeadList = userDeadShips.current.filter(
            //@ts-ignore
            (ship) => ship.is_dead
          );
          const newDeadList =
            parsedMessage.field_view.player_board.ships.filter(
              //@ts-ignore
              (ship) => ship.is_dead
            );

          let isEHit = "fail";
          if (parsedMessage.is_hit) {
            if (prevDeadList.length < newDeadList.length) isEHit = "dead";
            else isEHit = "success";
          }
          userDeadShips.current = parsedMessage.field_view.player_board.ships;
          playBeamAnimation(parsedMessage.fire_target, false, isEHit, blastIt);
          // @ts-ignore
          const enemyFireResultParsedShips =
            parsedMessage?.field_view?.player_board?.ships?.map((ship: any) => {
              return {
                length: ship.length,
                vertical: ship.vertical,
                pos: ship.head,
              };
            }) || [];

          setMyShips(enemyFireResultParsedShips);
          setEnemyMisses(parsedMessage?.field_view?.player_board?.misses);
          setMyTurn(parsedMessage.can_fire);
          userBoard.updateUserBoard(parsedMessage.field_view.player_board);
          break;
        case "game_over":
          // TODO: завершать игру и показывать модалки только когда анимация последнего выстрела закончится и поле закрасится
          setTimeout(() => {
            setJoinedRoom("");
            setIsAudioStart(false);
            setGameState(parsedMessage.my_win ? "WON" : "LOST");
            restartBoards();
          }, 1500);
          break;
        default:
          console.log("Неизвестный тип сообщения");
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, userBoard, enemyBoard]);

  useEffect(() => {
    if (!socket) return;

    const interval = setInterval(() => {
      sendMessage({
        type: "ping",
        message: "braat",
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [socket]);

  const sendMessage = (obj: { type: string; message: any }) => {
    const messageWithToken = {
      type: obj?.type,
      message: JSON.stringify(obj.message),
      jwt,
    };
    if (!(socketRef.current && socketRef.current.readyState === WebSocket.OPEN))
      return;
    socketRef.current.send(JSON.stringify(messageWithToken));
  };

  const handleApproveGame = () => {
    if (!approveGame) return;
    sendMessage({
      type: "accept_battle",
      message: { room_name: approveGame.room_name },
    });
    setApproveGame(null);
  };
  const handleDeclineGame = () => {
    if (!approveGame) return;
    sendMessage({
      type: "deny_battle",
      message: { room_name: approveGame.room_name },
    });
    setApproveGame(null);
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
        enemyBoard,
        restartBoards,
        myTurn,
        setMyTurn,
        approveGame,
        handleApproveGame,
        handleDeclineGame,
      }}
    >
      {children}
    </BattleshipsContext.Provider>
  );
}

export const useBattleships = () => useContext(BattleshipsContext);
