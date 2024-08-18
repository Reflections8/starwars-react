/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReactNode, createContext, useContext, useState } from "react";

type BattleshipsProviderProps = {
  children: ReactNode;
};

type BattleshipsContextProps = {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
};

// TODO: переделать потом, пока вроде достаточно
type GameState = {
  status: "WON" | "LOST" | "IN_PROGRESS" | "NOT_STARTED" | string;
};

const BattleshipsContext = createContext<Partial<BattleshipsContextProps>>({});

export function BattleshipsProvider({ children }: BattleshipsProviderProps) {
  const [gameState, setGameState] = useState({
    status: "NOT_STARTED",
  });

  return (
    <BattleshipsContext.Provider value={{ gameState, setGameState }}>
      {children}
    </BattleshipsContext.Provider>
  );
}

export const useBattleships = () => useContext(BattleshipsContext);
