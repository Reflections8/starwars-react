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
import { Gameboard as ArrangementBoard } from "../components/Modals/ShipsArrangement2/gameboard";
import { playBeamAnimation, useSound } from "./SeaContexts";

import { Room } from "../components/Modals/SeaBattle/types/types";
import {
  fetchRooms,
  getMe,
} from "../components/Modals/SeaBattle/service/sea-battle.service";
import { BetTypeEnum } from "../components/Modals/SeaBattle/types/enum";

type BattleshipsProviderProps = {
  children: ReactNode;
};

type BattleshipsContextProps = any;

let jwtToUse = localStorage.getItem("auth_jwt") || "";
if (document.location.href.includes("5174"))
  jwtToUse =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiVVFBaXFIZkg5NnpHSUMzOG9OUnMxQVdIUnluM3JzalQxek9pQVlmalE0TktOX1BwIiwiZXhwIjoxNzI2OTE1MjQyLCJpc3MiOiJBa3Jvbml4IEF1dGgifQ.96N5LMUaufEMXhsLSkHqOntGO6TBNApeEbr9OGdid2U";

const BattleshipsContext = createContext<Partial<BattleshipsContextProps>>({});

export const gameStates = {
  NOT_STARTED: 0,
  APPROVE: 1,
  PLACEMENT: 2,
  PLAYING: 3,

  ACCEPT_RECIEVED: 10,
  DENY_RECIEVED: 11,
  GAME_CANCELED: 12,
  PLAYER_LEFT: 13,
};

export function BattleshipsProvider({ children }: BattleshipsProviderProps) {
  const navigate = useNavigate();
  const { blastIt, stopBackgroundAudio } = useSound();

  const socketRef = useRef<WebSocket | null>(null);
  const userDeadShips = useRef([]);
  const enemyDeadShips = useRef([]);

  const [approveGame, setApproveGame] = useState<any>(null);
  const [gameState, setGameState] = useState(gameStates.NOT_STARTED);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [jwt] = useState<string>(jwtToUse);
  const [isInitial, setIsInitial] = useState(true);
  const [roomName, setRoomName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeCurrency, setActiveCurrency] = useState("credits");
  const [me, setMe] = useState(null);
  const [createdRoom, setCreatedRoom] = useState({ name: "" });
  const [searchingDuel, setSearchingDuel] = useState(false);
  const [gameboard, setGameboard] = useState(new ArrangementBoard());
  const [userBoard, setUserBoard] = useState(new Gameboard());
  const [enemyBoard, setEnemyBoard] = useState(new Gameboard());
  const [myTurn, setMyTurn] = useState(true);
  const [blockedState, setBlockedState] = useState(false);
  const [myBoardState, setMyBoardState] = useState({
    hits: [],
    misses: [],
    ships: [],
  });
  const [enemyBoardState, setEnemyBoardState] = useState({
    hits: [],
    misses: [],
    ships: [],
    preHit: null,
  });
  const [betAmount, setBetAmount] = useState(null);
  const [betType, setBetType] = useState(null);

  const restartBoards = () => {
    userDeadShips.current = [];
    enemyDeadShips.current = [];
    setUserBoard(new Gameboard());
    setEnemyBoard(new Gameboard());
    setMyBoardState({
      hits: [],
      misses: [],
      ships: [],
    });
    setGameboard(new ArrangementBoard());
    setEnemyBoardState({
      hits: [],
      misses: [],
      ships: [],
      preHit: null,
    });
  };

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

  const getHeadFromCells = (cells: { row: number; column: number }[]) =>
    cells.reduce(({ row: tlr, column: tlc }, { row, column }) => {
      if (row < tlr || (row === tlr && column < tlc)) return { row, column };
      return { row: tlr, column: tlc };
    }, cells[0]);

  const updateBoardState = (board: any, isMe: boolean) => {
    if (!board) return { hits: [], misses: [], ships: [] };

    const hits = board.ships.map((ship: any) => ship.cells).flat();
    const misses = board.misses;
    const shipsToAdd = board.ships.filter((s: any) => {
      if (isMe) return true;
      else return s.is_dead;
    });

    const ships =
      shipsToAdd.map((ship: any) => {
        return {
          ship: { length: ship.length, vertical: ship.vertical },
          pos: ship.head ?? getHeadFromCells(ship.cells),
        };
      }) || [];
    return { hits, misses, ships };
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

  const handleDeclineMyRooms = () => {
    if (rooms.length === 0) return;
    if (!me) return;
    //@ts-ignore
    const myRooms = rooms.filter((room) => room.creator.username === me);
    myRooms.forEach((room) => {
      sendMessage({
        type: "give_up",
        message: { room_name: room.room_name },
      });
    });
  };

  async function loadRooms() {
    const res = await fetchRooms();
    if (res) {
      const filtered = res?.rooms?.filter((room: Room) => {
        return (
          room.bet_type ===
          BetTypeEnum[activeCurrency as keyof typeof BetTypeEnum]
        );
      });
      setRooms(filtered || []);
    }
  }

  const resetArrangementGameboard = () => {
    const newGameboard = new ArrangementBoard();
    setGameboard(newGameboard);
  };

  useEffect(() => {
    if (gameState === gameStates.NOT_STARTED) resetArrangementGameboard();
  }, [gameState]);

  useEffect(() => {
    if (!socket) return;

    const interval = setInterval(() => {
      sendMessage({
        type: "ping",
        message: "braat",
      });
    }, 5000);

    const handleMessage = (event: MessageEvent) => {
      const response = JSON.parse(event.data);
      const parsedMessage = JSON.parse(response?.message);

      console.log("Сообщение от сервера:", response.type, parsedMessage);

      switch (response.type) {
        case "start_approve_phase":
          setGameState(gameStates.APPROVE);
          setRoomName(parsedMessage?.opponent_name);

          setApproveGame(parsedMessage);
          break;

        case "accept_received":
          setGameState(gameStates.ACCEPT_RECIEVED);
          break;

        case "deny_received":
          setGameState(gameStates.DENY_RECIEVED);
          break;

        case "game_canceled":
          setGameState(gameStates.GAME_CANCELED);
          break;

        case "player_left":
          setGameState(gameStates.PLAYER_LEFT);
          break;

        case "create_room":
          setRoomName(response.message.room_name);
          setCreatedRoom({ name: parsedMessage?.room_name });
          break;

        case "start_placement_phase":
          setGameState(gameStates.PLACEMENT);
          setOpponentName(parsedMessage.opponent_name);
          setRoomName(parsedMessage?.room_name);
          setBetAmount(parsedMessage.bet_amount);
          setBetType(parsedMessage.bet_type);
          break;

        case "ships_placed":
          break;

        case "round_start":
          setGameState(gameStates.PLAYING);
          setIsInitial(false);
          setMyTurn(parsedMessage.can_fire);
          break;

        case "fire_result":
          setGameState(gameStates.PLAYING);
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
          parsedMessage.fire_target &&
            playBeamAnimation(parsedMessage.fire_target, true, isHit, blastIt);
          setEnemyBoardState(
            //@ts-ignore
            updateBoardState(parsedMessage.field_view.opponent_board, false)
          );
          setMyBoardState(
            //@ts-ignore
            updateBoardState(parsedMessage.field_view.player_board, true)
          );
          setMyTurn(parsedMessage.can_fire);
          break;
        case "enemy_fire_result":
          setGameState(gameStates.PLAYING);
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
          parsedMessage.fire_target &&
            playBeamAnimation(
              parsedMessage.fire_target,
              false,
              isEHit,
              blastIt
            );
          setEnemyBoardState(
            //@ts-ignore
            updateBoardState(parsedMessage.field_view.opponent_board, false)
          );
          setMyBoardState(
            //@ts-ignore
            updateBoardState(parsedMessage.field_view.player_board, true)
          );
          setMyTurn(parsedMessage.can_fire);
          break;

        case "game_over":
          setIsInitial(true);
          setTimeout(() => {
            stopBackgroundAudio();
            restartBoards();
          }, 1500);
          break;

        default:
          console.log("Неизвестный тип сообщения");
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
      clearInterval(interval);
    };
  }, [socket]);

  useEffect(() => {
    if (rooms.length === 0) {
      setSearchingDuel(false);
      return;
    }
    if (!me) return;
    //@ts-ignore
    const myRooms = rooms.filter((room) => room.creator.username === me);
    setSearchingDuel(myRooms.length > 0);
  }, [JSON.stringify(rooms), me]);

  const createWebSocket = () => {
    const ws = new WebSocket("wss://socket.akronix.io/shipBattle");
    socketRef.current = ws;

    ws.onopen = () =>
      ws.send(JSON.stringify({ type: "handshake", message: "zdarova", jwt }));

    ws.onclose = () => {
      setTimeout(() => {
        if (
          !socketRef.current ||
          socketRef.current.readyState === WebSocket.CLOSED
        ) {
          createWebSocket();
        }
      }, 1000);

      // TODO: это переоткрывает только если код ошибки не 1000
      // if (event.code !== 1000) {
      //   console.error(
      //     "Код закрытия WebSocket:",
      //     event.code,
      //     "Причина:",
      //     event.reason || "Неизвестная причина"
      //   );
      //   // Попробовать переподключиться через 1 секунду
      //   setTimeout(() => {
      //     if (
      //       !socketRef.current ||
      //       socketRef.current.readyState === WebSocket.CLOSED
      //     ) {
      //       createWebSocket();
      //     }
      //   }, 1000);
      // }
    };

    socketRef.current = ws;
    setSocket(ws);
  };

  useEffect(() => {
    if (!jwt) {
      navigate("/");
      return;
    }
    getMe().then((res) => {
      setMe(res.username);
    });

    createWebSocket();

    return () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.close();
      }
      socketRef.current = null; // Обнуляем ссылку на сокет
    };
  }, [jwt]);

  useEffect(() => {
    const newGameboard = new Gameboard();
    const { ships, hits, misses } = myBoardState;
    newGameboard.ships = ships;
    newGameboard.hits = hits;
    newGameboard.misses = misses;
    setUserBoard(newGameboard);
  }, [JSON.stringify(myBoardState)]);

  useEffect(() => {
    const newGameboard = new Gameboard();
    const { ships, hits, misses, preHit } = enemyBoardState;
    newGameboard.ships = ships;
    newGameboard.hits = hits;
    newGameboard.misses = misses;
    newGameboard.preHit = preHit;
    setEnemyBoard(newGameboard);
  }, [JSON.stringify(enemyBoardState)]);

  useEffect(() => {
    loadRooms();
    let timer = setInterval(() => {
      loadRooms();
    }, 2000);
    return () => {
      timer && clearInterval(timer);
    };
  }, [activeCurrency]);

  const [handshakeTimer, setHandshakeTimer] = useState<any>({
    time: 0,
    state: 0,
  });

  const changePreHit = (data: any) => {
    const newEnemyBoard = new Gameboard();
    newEnemyBoard.ships = enemyBoard.ships;
    newEnemyBoard.hits = enemyBoard.hits;
    newEnemyBoard.misses = enemyBoard.misses;
    newEnemyBoard.preHit = data;
    setEnemyBoard(newEnemyBoard);
  };

  return (
    <BattleshipsContext.Provider
      value={{
        changePreHit,
        me,
        handshakeTimer,
        setHandshakeTimer,
        blockedState,
        setBlockedState,
        handleDeclineMyRooms,
        gameState,
        setGameState,
        myBoardState,
        enemyBoardState,
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
        userBoard,
        enemyBoard,
        restartBoards,
        myTurn,
        setMyTurn,
        approveGame,
        setApproveGame,
        handleApproveGame,
        handleDeclineGame,
        rooms,
        setRooms,
        loadRooms,
        activeCurrency,
        setActiveCurrency,
        jwt,
        gameboard,
        setGameboard,
        updateBoardState,
        setMyBoardState,
        setEnemyBoardState,
        isInitial,
        setIsInitial,
        betType,
        betAmount,
        setBetAmount,
      }}
    >
      {children}
    </BattleshipsContext.Provider>
  );
}

export const useBattleships = () => useContext(BattleshipsContext);
