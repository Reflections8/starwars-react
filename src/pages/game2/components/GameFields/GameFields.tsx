import "./styles/GameFields.css";
import boardBgTop from "./img/board-bg-top.svg";
import boardBgBottom from "./img/board-bg-bottom.svg";
import { Timer } from "../../../../components/Modals/ShipsArrangement2/components/Timer";
import { UserBoard } from "./UserBoard";
import { Gameboard } from "./gameboard";
import { useEffect, useState } from "react";

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

export function GameFields() {
  const [userBoard, setUserBoard] = useState(new Gameboard());

  const updateUserboard = () => {
    const newGameboard = new Gameboard();
    newGameboard.ships = userBoard.ships;
    newGameboard.hits = userBoard.hits;
    newGameboard.misses = userBoard.misses;
    setUserBoard(newGameboard);
  };

  useEffect(() => {
    userBoard.updateUserBoard(MOCK_FIELD_DATA);
    updateUserboard();
  }, []);

  return (
    <div className="gameFields">
      {/* TOP WRAPPER */}
      <div className="gameFields__top">
        <img src={boardBgTop} alt="" className="gameFields__top-bg" />

        <div className="gameFields__top-board"></div>
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
