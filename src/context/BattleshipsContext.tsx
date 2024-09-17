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

type BattleshipsProviderProps = {
  children: ReactNode;
};

type BattleshipsContextProps = {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  userShips: any[];
  setUserShips: (ships: any[]) => void;
} & any;

// TODO: переделать потом, пока вроде достаточно
type GameState = {
  status: "WON" | "LOST" | "IN_PROGRESS" | "NOT_STARTED" | string;
};

const BattleshipsContext = createContext<Partial<BattleshipsContextProps>>({});

export function BattleshipsProvider({ children }: BattleshipsProviderProps) {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    status: "NOT_STARTED",
  });
  const [userShips, setUserShips] = useState<any[]>([]);

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const [jwt, setJwt] = useState<string>(
    localStorage.getItem("auth_jwt") || ""
  );

  const [createdRoom, setCreatedRoom] = useState({
    name: "",
  });

  const [joinedRoom, setJoinedRoom] = useState({
    name: "",
  });

  const [searchingDuel, setSearchingDuel] = useState(true);

  function clearFunction(ws: WebSocket) {
    console.error("Отсутствует токен авторизации");
    setJwt("");
    ws.close();
    navigate("/");
  }
  const ws = new WebSocket("wss://socket.akronix.io/shipBattle");

  useEffect(() => {
    if (ws) {
      socketRef.current = ws;
    }
    if (!jwt) {
      clearFunction(ws);
      socketRef.current = null;
    }

    if (jwt) {
      socketRef.current = ws;
      const interval = setInterval(() => {
        const request = {
          type: "ping",
          message: "",
        };
        sendMessage(request as any);
      }, 5000);

      ws.onopen = () => {
        console.log("WebSocket подключен");
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        const parsedMessage = JSON.parse(response.message);
        console.log("Сообщение от сервера:", response);

        switch (response.type) {
          case "create_room":
            setRoomName(response.message.room_name);
            setCreatedRoom({
              name: parsedMessage?.room_name,
            });
            break;
          case "start_placement_phase":
            setOpponentName(response.message.opponent_name);
            setJoinedRoom({
              name: parsedMessage?.room_name,
            });
            break;
          default:
            console.log("Неизвестный тип сообщения");
        }
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
        clearInterval(interval);
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    }
  }, [jwt]);

  const sendMessage = (obj: { type: string; message: object }) => {
    const otherJWT =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiVVFBaXFIZkg5NnpHSUMzOG9OUnMxQVdIUnluM3JzalQxek9pQVlmalE0TktOX1BwIiwiZXhwIjoxNzI2OTE1MjQyLCJpc3MiOiJBa3Jvbml4IEF1dGgifQ.96N5LMUaufEMXhsLSkHqOntGO6TBNApeEbr9OGdid2U";

    const messageWithToken = {
      type: obj?.type,
      message: JSON.stringify(obj.message),
      jwt:
        obj.type === "create_room" || obj.type === "give_up" ? otherJWT : jwt,
    };
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(messageWithToken));
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
        messages,
        roomName,
        opponentName,
        socketRef,
        setSocket,
        setMessages,
        setRoomName,
        setOpponentName,
        sendMessage,

        searchingDuel,
        setSearchingDuel,

        createdRoom,
        setCreatedRoom,

        joinedRoom,
        setJoinedRoom,
      }}
    >
      {children}
    </BattleshipsContext.Provider>
  );
}

export const useBattleships = () => useContext(BattleshipsContext);
