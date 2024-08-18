import "./styles/GameFields.css";
import boardBgTop from "./img/board-bg-top.svg";
import boardBgBottom from "./img/board-bg-bottom.svg";
import { Timer } from "../../../../components/Modals/ShipsArrangement2/components/Timer";
import { UserBoard } from "./UserBoard";
import { Gameboard } from "./gameboard";
import { useEffect, useState } from "react";
import { EnemyBoard } from "./EnemyBoard";

const MOCK_SHIPS_ENEMY = [
  {
    isDead: false,
    cells: [
      {
        row: 5,
        column: 3,
      },
    ],
  },
  {
    cells: [
      { row: 2, column: 4 },
      { row: 2, column: 5 },
      { row: 2, column: 6 },
      { row: 2, column: 7 },
    ],
    isDead: true,
  },
];

const MOCK_SHIPS = [
  {
    isDead: false,
    length: 3,
    vertical: true,
    head: {
      row: 0,
      column: 3,
    },
    cells: [],
  },
  {
    cells: [
      { row: 0, column: 6 },
      { row: 0, column: 7 },
    ],
    isDead: false,
    length: 4,
    vertical: false,
    head: {
      row: 0,
      column: 6,
    },
  },
  {
    cells: [],
    isDead: false,
    length: 2,
    vertical: true,
    head: {
      row: 1,
      column: 0,
    },
  },
];
const MOCK_FIELD_DATA = {
  isMe: true,
  misses: [
    { row: 8, column: 8 },
    { row: 9, column: 9 },
    { row: 5, column: 5 },
  ],
  ships: MOCK_SHIPS,
};
const MOCK_ENEMY_FIELD = {
  isMe: false,
  misses: [
    { row: 8, column: 8 },
    { row: 9, column: 9 },
    { row: 5, column: 5 },
  ],
  ships: MOCK_SHIPS_ENEMY,
};

export function GameFields() {
  const [userBoard, setUserBoard] = useState(new Gameboard());
  const [enemyBoard, setEnemyBoard] = useState(new Gameboard());

  const updateUserboard = () => {
    const newGameboard = new Gameboard();
    newGameboard.ships = userBoard.ships;
    newGameboard.hits = userBoard.hits;
    newGameboard.misses = userBoard.misses;
    setUserBoard(newGameboard);
  };
  const updateEnemyBoard = () => {
    const newGameboard = new Gameboard();
    newGameboard.ships = enemyBoard.ships;
    newGameboard.hits = enemyBoard.hits;
    newGameboard.misses = enemyBoard.misses;
    newGameboard.preHit = enemyBoard.preHit;
    setEnemyBoard(newGameboard);
  };

  useEffect(() => {
    userBoard.updateUserBoard(MOCK_FIELD_DATA);
    enemyBoard.updateEnemyBoard(MOCK_ENEMY_FIELD);
    updateUserboard();
    updateEnemyBoard();
  }, []);

  const clickEnemyField = (row: number, column: number, zalupa: boolean) => {
    if (!zalupa) return;
    enemyBoard.setPreHit({ row, column });
    updateEnemyBoard();
  };

  const confirmHit = () => {
    console.log("OBOSRIS PIDORAS");
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
}
