import { ReactNode, createContext, useContext, useEffect } from "react";
import { gameStates, useBattleships } from "../BattleshipsContext";
import { useDrawer } from "../DrawerContext";
import { useModal } from "../ModalContext";
import { useLocation, useNavigate } from "react-router-dom";

import { Gameboard as ArrangementBoard } from "../../components/Modals/ShipsArrangement2/gameboard";
import { useSound } from "./SoundContext";

type SomethingProviderProps = {
  children: ReactNode;
};

type SomethingContextProps = any;

const SomethingContext = createContext<Partial<SomethingContextProps>>({});

export function SomethingProvider({ children }: SomethingProviderProps) {
  const {
    approveGame,
    gameState,
    setApproveGame,
    setOpponentName,
    setRoomName,
    setGameboard,
    setBlockedState,
    setMyTurn,
    socket,
    restartBoards,
    updateBoardState,
    setMyBoardState,
    setEnemyBoardState,
    setGameState,
    handshakeTimer,
    setHandshakeTimer,
    setBetAmount,
  } = useBattleships();

  const { openDrawer } = useDrawer();
  const { openModal, closeModal } = useModal();
  const { startBackgroundAudio } = useSound();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    //  if (!approveGame) closeDrawer!();
    if (approveGame)
      openDrawer!("opponentFound", "bottom", JSON.stringify(approveGame));
  }, [JSON.stringify(approveGame)]);

  useEffect(() => {
    if ([2, 3].includes(gameState) && location.pathname !== "/game2")
      navigate("/game2");
    if ([0, 1].includes(gameState) && location.pathname === "/game2") {
      openModal!("seaBattle");
    }
    if (gameState === gameStates.PLACEMENT) openModal!("shipsArrangement2");
    if (gameState === gameStates.NOT_STARTED) restartBoards();
  }, [gameState, location.pathname]);

  const handleHandshake = (parsedMessage: string) => {
    //@ts-ignore
    const { state, data, remain_time } = parsedMessage;
    setHandshakeTimer({ time: remain_time, state });
    if (state === 0) setGameState(gameStates.NOT_STARTED);
    if (state === 1 || state === 2) {
      setApproveGame(data);
      setGameState(gameStates.APPROVE);
    }
    if (state > 2) {
      if (state <= 4) setGameState(gameStates.PLACEMENT);
      setOpponentName(data.opponent_name);
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
      setGameState(gameStates.PLAYING);
      startBackgroundAudio();
      setTimeout(() => {
        setMyBoardState(updateBoardState(data.field_view.player_board, true));
        setEnemyBoardState(
          updateBoardState(data.field_view.opponent_board, false)
        );
        closeModal!();
      }, 100);
      setTimeout(() => {
        startBackgroundAudio();
      }, 500);
    }

    if (state === 5) {
      setMyTurn(true);
      setBetAmount(data?.bet_amount);
    }
    if (state === 6) {
      setMyTurn(false);
      setBetAmount(data?.bet_amount);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (event: MessageEvent) => {
      const response = JSON.parse(event.data);
      if (response.type === "game_over") {
        const { my_win } = JSON.parse(response.message);
        setTimeout(
          () => openModal!(my_win ? "battleshipsWon" : "battleshipsLost"),
          1500
        );
        return;
      }
      if (response.type === "start_approve_phase") {
        setHandshakeTimer({ time: 60, state: 1 });
      }
      if (response.type !== "handshake_success") return;
      setTimeout(() => {
        handleHandshake(JSON.parse(response?.message));
      }, 200);
    };
    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, closeModal]);

  // TODO: это я добавил
  useEffect(() => {
    if (gameState === 1) openDrawer!("opponentFound");
  }, [gameState]);

  return (
    <SomethingContext.Provider value={{ handshakeTimer }}>
      {children}
    </SomethingContext.Provider>
  );
}

export const useSomething = () => useContext(SomethingContext);
