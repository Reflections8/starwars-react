import "./styles/GameFields.css";
import boardBgTop from "./img/board-bg-top.png";
import boardBgBottom from "./img/board-bg-bottom.png";
import leftBg from "./img/left-bg.png";
import rightBg from "./img/right-bg.png";

import { UserBoard } from "./UserBoard";
import { Gameboard } from "./gameboard";
import { FC } from "react";
import { EnemyBoard } from "./EnemyBoard";
import { useBattleships } from "../../../../context/BattleshipsContext";
import { ClearedTimer } from "../../../../components/Modals/SeaBattle/components/ClearedTimer/ClearedTimer";

export const GameFields: FC<{
  userBoard: Gameboard;
  enemyBoard: Gameboard;
  myTurn: boolean;
  timerValue: number;
}> = ({ userBoard, enemyBoard, myTurn, timerValue }) => {
  const { roomName, sendMessage, changePreHit } = useBattleships();

  const clickEnemyField = (row: number, column: number, zalupa: boolean) => {
    if (!zalupa) return;
    if (!myTurn) return;
    changePreHit({ row, column });
  };

  const confirmHit = () => {
    if (!enemyBoard.preHit) return;
    sendMessage({
      type: "fire",
      message: {
        room_name: roomName,
        target: enemyBoard.preHit,
      },
    });
    changePreHit(null);
  };

  return (
    <div className="gameFields">
      <img
        src={leftBg}
        alt="left-bg"
        className="gameFields__leftBg"
        draggable="false"
      />
      <img
        src={rightBg}
        alt="right-bg"
        className="gameFields__rightBg"
        draggable="false"
      />
      <div className="gameFieldsMainContent">
        <div className="gameFields__top">
          <img
            src={boardBgTop}
            alt=""
            className="gameFields__top-bg"
            draggable="false"
          />
          <div style={{ zIndex: 200 }} className="">
            <EnemyBoard
              gameboard={enemyBoard}
              confirmHit={confirmHit}
              onCellClicked={clickEnemyField}
            />
          </div>
        </div>
        <div className="gameFields__timer">
          <ClearedTimer remainTime={timerValue} callback={() => {}} />
        </div>
        <div className="gameFields__bottom">
          <img
            src={boardBgBottom}
            alt=""
            className="gameFields__bottom-bg"
            draggable="false"
          />
          <div className="">
            <UserBoard gameboard={userBoard} />
          </div>
        </div>
      </div>
    </div>
  );
};
