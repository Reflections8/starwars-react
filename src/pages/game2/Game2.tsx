import { useEffect } from "react";
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

export function Game2() {
  const { openModal } = useModal();
  const { openDrawer, closeDrawer } = useDrawer();
  const { gameState } = useBattleships();

  useEffect(() => {
    if (gameState?.status === "LOST") {
      // TODO: END GAME
      console.log(gameState);
      openModal!("battleshipsLost");
    }

    if (gameState?.status === "WON") {
      // TODO: END GAME
      openModal!("battleshipsWon");
      closeDrawer!();
    }
  }, [gameState?.status]);

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
