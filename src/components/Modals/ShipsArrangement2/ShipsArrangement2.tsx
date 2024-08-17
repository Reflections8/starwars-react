import { useEffect, useState } from "react";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import { Ships } from "./components/Ships";
import { Timer } from "./components/Timer";
import gridBottomElement from "./img/grid-bg-bottom-element.png";
import gridBg from "./img/grid-bg.svg";
import rulesCornerImg from "./img/rules-button-corner.svg";
import rulesImg from "./img/rules-button.svg";
import "./styles/ShipsArrangement.css";
import { Board } from "./components/Board";
import { Gameboard, ShipPosition } from "./gameboard";
import Player from "./player";
import { Ship } from "./ship";
import {
  getCellClassName,
  letterToNumber,
} from "../ShipsArrangement/utils/grid";

function debounce(func: (...args: unknown[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: unknown[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const initialUnsettledShips = {
  "1": 4,
  "2": 3,
  "3": 2,
  "4": 1,
};

export function ShipsArrangement2() {
  const [allShipsSettled, setAllShipsSettled] = useState(false);
  const [selectedShipToSettle, setSelectedShipToSettle] = useState<Ship | null>(
    null
  );
  const [unsettledShips, setUnsettledShips] = useState(initialUnsettledShips);

  /* Preview-state*/
  const [user] = useState(new Player("User"));
  const [gameboard, setGameboard] = useState(new Gameboard());

  const handleAutoArrangement = debounce(() => {
    handleAuto();
  }, 300);

  function handleAuto() {
    gameboard.placeShipsRandomly();
    setUnsettledShips({ "1": 0, "2": 0, "3": 0, "4": 0 });
  }

  useEffect(() => {
    setAllShipsSettled(
      Object.values(unsettledShips).every((item) => item === 0)
    );
  }, [unsettledShips]);

  const updateGameboard = () => {
    const newGameboard = new Gameboard();
    newGameboard.board = gameboard.board;
    newGameboard.ships = gameboard.ships;
    setGameboard(newGameboard);
  };

  const handleShipAction =
    (ship: ShipPosition) =>
    (action: "rotateShip" | "confirmShip" | "removeShip") => {
      gameboard[action](ship.pos.row, ship.pos.column);
      if (action === "removeShip") {
        setUnsettledShips((prevState) => {
          return {
            ...prevState,
            // @ts-ignore
            [ship.ship.length]: prevState[ship.ship.length] + 1,
          };
        });
      }
      updateGameboard();
    };

  const onCellClicked = (row: number, column: number) => {
    if (!selectedShipToSettle) return;
    //@ts-ignore
    if (!unsettledShips[selectedShipToSettle.length]) return;

    const placed = gameboard.placeShip(selectedShipToSettle, row, column);
    if (!placed) return;
    setUnsettledShips((prevState) => {
      return {
        ...prevState,
        [selectedShipToSettle.length]:
          //@ts-ignore
          unsettledShips[selectedShipToSettle.length] - 1,
      };
    });
    //@ts-ignore
    if (unsettledShips[selectedShipToSettle.length] <= 1)
      setSelectedShipToSettle(null);

    updateGameboard();
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
        posY
      );

      // console.log({ badCoords });

      const setMarked = (x: number, y: number, cls: string) => {
        const cellClassName = getCellClassName(x, y); // c7, a4
        const el2 = document.querySelector(`.${cellClassName}`);
        el2?.classList.remove("marked-ship");
        el2?.classList.remove("marked-buffer");
        el2?.classList.remove("marked-apply");
        if (el2?.classList.contains("notship")) {
          document.querySelectorAll(`.notship`).forEach((elem) => {
            elem.classList.add("marked-warning");
          });
          if (cls === "marked-apply") {
            el2?.classList.add("marked-merged");
          }
        } else {
          el2?.classList.add(cls);
        }
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
      el.classList.remove("marked-warning");
      el.classList.remove("marked-merged");
    });
  };

  //useEffect(() => {
  //  for (let i = 0; i <= 10; i++) {
  //    for (let j = 0; j <= 10; j++) {}
  //  }
  //}, [unsettledShips]);

  const rotateShip = () => {
    const cp = selectedShipToSettle!.copy();
    cp.vertical = !cp.vertical;
    setSelectedShipToSettle(cp);
  };

  return (
    <div className="shipsArr">
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
            <Board
              handleShipAction={handleShipAction}
              gameboard={gameboard}
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
        />
        <button onClick={rotateShip}>Rotate</button>
        {/* ACTION BUTTONS */}
        <div className="shipsArr__buttons">
          <CuttedButton callback={() => handleAutoArrangement()} text="Авто" />
          <CuttedButton
            text="Играть"
            className={!allShipsSettled ? "halfTransparent" : ""}
          />
        </div>
      </div>
    </div>
  );
}
