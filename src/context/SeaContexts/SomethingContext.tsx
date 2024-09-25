import { ReactNode, createContext, useContext, useEffect } from "react";
import { useBattleships } from "../BattleshipsContext";
import { useDrawer } from "../DrawerContext";
import { useModal } from "../ModalContext";
import { useLocation } from "react-router-dom";
import { useSound } from "./SoundContext";

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
    setUserShips,
    restartBoards,
    joinedRoom,
    setJoinedRoom,
  } = useBattleships();
  const { stopBackgroundAudio } = useSound();
  const { openDrawer, closeDrawer } = useDrawer();
  const { openModal } = useModal();
  const location = useLocation();
  useEffect(() => {
    if (!approveGame) {
      closeDrawer!();
    } else {
      openDrawer!("opponentFound", "bottom", JSON.stringify(approveGame));
    }
  }, [JSON.stringify(approveGame)]);

  useEffect(() => {
    if (joinedRoom) {
      console.log({ LOCATION: location.pathname });
      openModal!("shipsArrangement2");
      setJoinedRoom("");
    }
  }, [joinedRoom]);

  useEffect(() => {
    if (!jwt) return;
    if (gameState === "LOST") {
      stopBackgroundAudio();
      setUserShips!([]);
      openModal!("battleshipsLost");
      restartBoards();
    }
    if (gameState === "WON") {
      stopBackgroundAudio();
      setUserShips!([]);
      openModal!("battleshipsWon");
      restartBoards();
    }
    if (gameState === "NOT_STARTED") {
      restartBoards();
      setUserShips!([]);
      openModal!("seaBattle");
    }
    if (gameState === "GIVE_UP") stopBackgroundAudio();
  }, [gameState, jwt]);

  return (
    <SomethingContext.Provider value={{}}>{children}</SomethingContext.Provider>
  );
}

export const useSomething = () => useContext(SomethingContext);
