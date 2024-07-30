import { useEffect, useState } from "react";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import { Grid } from "./components/Grid";
import { Ships } from "./components/Ships";
import { Timer } from "./components/Timer";
import gridBottomElement from "./img/grid-bg-bottom-element.png";
import gridBg from "./img/grid-bg.svg";
import rulesCornerImg from "./img/rules-button-corner.svg";
import rulesImg from "./img/rules-button.svg";
import "./styles/ShipsArrangement.css";
import { Board } from "./components/Board";
import { Gameboard } from "./gameboard";
import Player from "./player";
import {
  getCellClassName,
  letterToNumber,
} from "../ShipsArrangement/utils/grid";
import { Ship } from "./ship";
// import PreviewGame from "../../../pages/game22/PreviewGame";
// Board

const initialUnsettledShips = {
  "1": 4,
  "2": 3,
  "3": 2,
  "4": 1,
};
export function ShipsArrangement2() {
  /* Расставлены ли все корабли */
  const [allShipsSettled, setAllShipsSettled] = useState(false);

  /* Выбранный тип корабля */
  const [selectedShipToSettle, setSelectedShipToSettle] = useState<Ship | null>(
    null
  );

  /* Оставшиеся корабли */
  const [unsettledShips, setUnsettledShips] = useState(initialUnsettledShips);

  const [user, setUser] = useState(new Player("User"));
  const g = new Gameboard();
  const [gameboard, setGameboard] = useState(g);

  function handleCCC() {
    console.log("handleCCC", { gameboard });
    const upd = g.placeShipsRandomly();
    setGameboard(g);
    console.log("handleCCC after", { gameboard, upd });
  }

  useEffect(() => {
    const allSettled = Object.values(unsettledShips).every(
      (item) => item === 0
    );
    if (allSettled) {
      setAllShipsSettled(true);
    } else {
      setAllShipsSettled(false);
    }
  }, [unsettledShips]);

  const onCellClicked = (row: number, column: number) => {
    if (!selectedShipToSettle) {
      return;
    }
    gameboard.placeShip(
      selectedShipToSettle,
      row,
      column,
      selectedShipToSettle.vertical
    );
    // setGameboard(gameboard);
    setSelectedShipToSettle(null);
    // setSelectedShipToSettle(selectedShipToSettle);
  };

  const showValid = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedShipToSettle) {
      const el = e.target as HTMLDivElement;
      const pos = (el as HTMLDivElement).className.split(" ")[1];
      const posX = parseInt(pos[1]);
      const posY = letterToNumber(pos[0]);
      const size = selectedShipToSettle.length;

      const [, badCoords] = gameboard.isPlacementPossible(
        selectedShipToSettle,
        posX,
        posY,
        selectedShipToSettle.vertical
      );

      const setMarked = (x, y, cls) => {
        const cellClassName = getCellClassName(x, y); // c7, a4
        const el2 = document.querySelector(`.${cellClassName}`);
        el2?.classList.remove("marked-ship");
        el2?.classList.remove("marked-buffer");
        el2?.classList.remove("marked-apply");
        el2?.classList.add(cls);
      };

      for (let i = -1; i < size + 1; i++) {
        for (let j = -1; j <= 1; j++) {
          // TODO: Handle vertical ships
          let shipX, shipY;
          if (selectedShipToSettle.vertical) {
            // Vertical ship handling
            shipX = posX + i;
            shipY = posY + j;
          } else {
            // Horizontal ship handling
            shipX = posX + j;
            shipY = posY + i;
          }

          if (i >= 0 && i < size && j == 0) {
            setMarked(shipX, shipY, "marked-ship");
          } else {
            setMarked(shipX, shipY, "marked-apply");
          }
        }
      }
      for (let i = 0; i < badCoords.length; i++) {
        const coord = badCoords[i];
        setMarked(coord.x, coord.y, "marked-buffer");
      }
    }
  };
  const removeValid = () => {
    const elements = document.querySelectorAll(".battleships__cell");
    elements.forEach((el) => {
      el.classList.remove("marked-ship");
      el.classList.remove("marked-buffer");
      el.classList.remove("marked-apply");
    });
  };

  const rotateShip = () => {
    const cp = selectedShipToSettle!.copy();
    console.log("isVert", cp.vertical);
    cp.vertical = !cp.vertical;
    console.log("isVert2", cp.vertical);
    setSelectedShipToSettle(cp);
  };

  return (
    <div className="shipsArr">
      {/* RULES BADGE */}
      <div className="seaBattle__rulesButtonWrapper">
        <img
          src={rulesCornerImg}
          alt="rules-corner"
          className="seaBattle__rulesButtonWrapper-btn-corner--Left"
        />
        <img
          src={rulesImg}
          alt="rules"
          className="seaBattle__rulesButtonWrapper-btn"
        />
        <img
          src={rulesCornerImg}
          alt="rules-corner"
          className="seaBattle__rulesButtonWrapper-btn-corner--Right"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="shipsArr__main">
        {/* FIELD */}
        <div className="shipsArr__main-field">
          <Timer />
          {/* GRID WRAPPER */}
          <div className="shipsArr__main-field-gridWrapper">
            <div className="shipsArr__main-field-gridWrapper-bgWrapper">
              <img
                src={gridBg}
                alt="grid"
                className="shipsArr__main-field-gridWrapper-bgWrapper-bg"
              />
              <img
                src={gridBottomElement}
                alt="bottomElement"
                className="shipsArr__main-field-gridWrapper-bgWrapper-bottomElement"
              />
            </div>

            {/* <Grid
              selectedShipToSettle={selectedShipToSettle}
              setSelectedShipToSettle={setSelectedShipToSettle}
              unsettledShips={unsettledShips}
              setUnsettledShips={setUnsettledShips}
            /> */}
            <Board
              selectedShipToSettle={selectedShipToSettle}
              gameboard={gameboard}
              enemy={user}
              owner={user}
              onCellClicked={onCellClicked}
              showValid={showValid}
              removeValid={removeValid}
            ></Board>
          </div>
        </div>

        <Ships
          selectedShipToSettle={selectedShipToSettle}
          setSelectedShipToSettle={setSelectedShipToSettle}
          unsettledShips={unsettledShips}
          setUnsettledShips={setUnsettledShips}
        />

        <button onClick={rotateShip}>Fuck</button>

        {/* ACTION BUTTONS */}
        <div className="shipsArr__buttons">
          <CuttedButton callback={() => handleCCC()} text="Авто" />
          <CuttedButton
            text="Играть"
            className={!allShipsSettled ? "halfTransparent" : ""}
          />
        </div>
      </div>
    </div>
  );
}
