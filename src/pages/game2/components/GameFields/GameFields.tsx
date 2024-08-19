import "./styles/GameFields.css";
import boardBgTop from "./img/board-bg-top.svg";
import boardBgBottom from "./img/board-bg-bottom.svg";
import { Timer } from "../../../../components/Modals/ShipsArrangement2/components/Timer";
import { UserBoard } from "./UserBoard";
import { Gameboard } from "./gameboard";
import { FC } from "react";
import { EnemyBoard } from "./EnemyBoard";

export const GameFields: FC<{
  userBoard: Gameboard;
  enemyBoard: Gameboard;
  updateEnemyBoard: () => void;
  sendHit: (p: { row: number; column: number }) => void;
  myTurn: boolean;
}> = ({ userBoard, enemyBoard, updateEnemyBoard, sendHit, myTurn }) => {
  const clickEnemyField = (row: number, column: number, zalupa: boolean) => {
    if (!zalupa) return;
    if (!myTurn) return;
    enemyBoard.setPreHit({ row, column });
    updateEnemyBoard();
  };

  const confirmHit = () => {
    if (!enemyBoard.preHit) return;
    sendHit(enemyBoard.preHit);
    enemyBoard.setPreHit(null);
    updateEnemyBoard();
  };

  return (
    <div className="gameFields">
      {/* TOP WRAPPER */}
      <div className="gameFields__top">
        <img src={boardBgTop} alt="" className="gameFields__top-bg" />

        <div style={{ zIndex: 200 }} className="">
          <EnemyBoard
            gameboard={enemyBoard}
            confirmHit={confirmHit}
            onCellClicked={clickEnemyField}
          />
        </div>
      </div>
      {/* TIMER WRAPPER */}
      <div className="gameFields__timer">
        <Timer onRandom={() => {}} onStart={() => {}} />
      </div>

      {/* BOTTOM WRAPPER */}
      <div className="gameFields__bottom">
        <img src={boardBgBottom} alt="" className="gameFields__bottom-bg" />
        <div className="">
          <UserBoard gameboard={userBoard} />
        </div>
      </div>
    </div>
  );
};