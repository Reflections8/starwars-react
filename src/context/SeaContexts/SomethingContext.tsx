import { ReactNode, createContext, useContext, useEffect } from "react";
import { useBattleships } from "../BattleshipsContext";
import { useDrawer } from "../DrawerContext";
import { useModal } from "../ModalContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useSound } from "./SoundContext";

import { Gameboard as ArrangementBoard } from "../../components/Modals/ShipsArrangement2/gameboard";
import { useTimer } from "react-use-precision-timer";

type SomethingProviderProps = {
  children: ReactNode;
};

type SomethingContextProps = any;

const SomethingContext = createContext<Partial<SomethingContextProps>>({});

export function SomethingProvider({ children }: SomethingProviderProps) {
  const {
    approveGame,
    jwt,
    gameState,
    joinedRoom,
    setJoinedRoom,
    setApproveGame,
    setOpponentName,
    setRoomName,
    setGameboard,
    setBlockedState,
    setShipsPlaced,
    setMyTurn,
    socket,
    restartBoards,
    updateBoardState,
    setMyBoardState,
    setEnemyBoardState,
  } = useBattleships();

  const { stopBackgroundAudio, setIsAudioStart } = useSound();

  const { openDrawer, closeDrawer } = useDrawer();
  const { openModal, closeModal } = useModal();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!approveGame) closeDrawer!();
    else openDrawer!("opponentFound", "bottom", JSON.stringify(approveGame));
  }, [JSON.stringify(approveGame)]);

  useEffect(() => {
    if (joinedRoom) {
      if (location.pathname !== "/game2") navigate("/game2");
      openModal!("shipsArrangement2");
      setJoinedRoom("");
    }
  }, [joinedRoom]);

  useEffect(() => {
    if (!jwt) return;
    if (gameState === "LOST") {
      stopBackgroundAudio();
      openModal!("battleshipsLost");
      restartBoards();
    }
    if (gameState === "WON") {
      stopBackgroundAudio();
      openModal!("battleshipsWon");
      restartBoards();
    }
    if (gameState === "NOT_STARTED") {
      restartBoards();
      openModal!("seaBattle");
    }
    if (gameState === "GIVE_UP") stopBackgroundAudio();
  }, [gameState, jwt]);

  const handleHandshake = (parsedMessage: string) => {
    return;
    //@ts-ignore
    const { state, data, remain_time } = parsedMessage;
    if (state === 1 || state === 2) setApproveGame(data);
    if (state > 2) {
      setOpponentName(data.opponent_name);
      setJoinedRoom(data.room_name);
      setRoomName(data.room_name);
    }
    if (state === 4) {
      const ships = data.ships.map((ship: any) => {
        return {
          ship: { length: ship.length, vertical: ship.vertical },
          pos: ship.head,
          confirmed: true,
        };
      });
      const newGameboard = new ArrangementBoard();
      newGameboard.ships = ships;
      newGameboard.dragndrop = null;
      setGameboard(newGameboard);
      setBlockedState(true);
    }
    if (state > 4) {
      setMyBoardState(updateBoardState(data.field_view.player_board));
      setEnemyBoardState(updateBoardState(data.field_view.enemy_board));
      setShipsPlaced(true);
      setIsAudioStart(true);
      setBlockedState(false);
      setTimeout(() => {
        closeModal!();
      }, 100);
    }
    if (state === 5) setMyTurn(true);
    if (state === 6) setMyTurn(false);
  };

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (event: MessageEvent) => {
      const response = JSON.parse(event.data);
      if (response.type !== "handshake_success") return;
      handleHandshake(JSON.parse(response?.message));
    };
    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, closeModal]);

  return (
    <SomethingContext.Provider value={{}}>{children}</SomethingContext.Provider>
  );
}

export const useSomething = () => useContext(SomethingContext);
