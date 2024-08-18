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
import { Gameboard } from "./gameboard";
import { Ship } from "./ship";

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

  const handleShipAction = (
    action: "rotateShip" | "confirmShip" | "removeShip"
  ) => {
    if (action === "removeShip") {
      const unconfirmed = gameboard.getUnconfirmedShips();
      if (unconfirmed) {
        setUnsettledShips((prevState) => {
          return {
            ...prevState,
            // @ts-ignore
            [unconfirmed.ship.length]: prevState[unconfirmed.ship.length] + 1,
          };
        });
      }
    }
    gameboard[action]();
    updateGameboard();
  };

  const onCellClicked = (row: number, column: number) => {
    const unconfirmed = gameboard.getUnconfirmedShips();
    if (unconfirmed) {
      gameboard.replaceShip(unconfirmed, row, column);
      updateGameboard();
      return;
    }
    const ship = gameboard.getShipRC(row, column);
    if (ship) {
      gameboard.unconfirmShipAtRC(row, column);
      updateGameboard();
      return;
    }

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
            ></Board>
          </div>
        </div>
        <Ships
          selectedShipToSettle={selectedShipToSettle}
          setSelectedShipToSettle={(v) => {
            setSelectedShipToSettle(v);
            gameboard.removeShip();
            updateGameboard();
          }}
          unsettledShips={unsettledShips}
        />
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
