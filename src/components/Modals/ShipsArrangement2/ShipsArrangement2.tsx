import { useEffect, useState } from "react";
import { useModal } from "../../../context/ModalContext";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import { Board } from "./components/Board";
import { Ships } from "./components/Ships";
import { Timer } from "./components/Timer";
import { Gameboard, ShipPosition, ShipType } from "./gameboard";
import gridBottomElement from "./img/grid-bg-bottom-element.png";
import gridBg from "./img/grid-bg.svg";
import rulesCornerImg from "./img/rules-button-corner.svg";
import rulesImg from "./img/rules-button.svg";
import "./styles/ShipsArrangement.css";
import { useBattleships } from "../../../context/BattleshipsContext";

// @ts-ignore
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
// @ts-ignore
const initialUnsettledShips = {
  "1": 4,
  "2": 3,
  "3": 2,
  "4": 1,
};

export function ShipsArrangement2() {
  const { gameState } = useBattleships();
  if (gameState?.status !== "NOT_STARTED") return null;
  return <ShipsArrangementChild />;
}
export function ShipsArrangementChild() {
  const { closeModal } = useModal();
  const [allShipsSettled, setAllShipsSettled] = useState(false);
  const [selectedShipToSettle, setSelectedShipToSettle] =
    useState<ShipType | null>(null);
  const [gameboard, setGameboard] = useState(new Gameboard());
  const { setUserShips } = useBattleships();

  useEffect(() => {
    setAllShipsSettled(
      Object.values(gameboard.getUnsettledShips()).every((item) => item === 0)
    );
  }, [gameboard.getUnsettledShips()]);

  const updateGameboard = () => {
    const newGameboard = new Gameboard();
    newGameboard.ships = gameboard.ships;
    newGameboard.dragndrop = gameboard.dragndrop;
    setGameboard(newGameboard);
  };

  const handleShipAction = (
    action: "rotateShip" | "confirmShip" | "removeShip"
  ) => {
    gameboard[action]();
    updateGameboard();
  };

  const onCellClicked = (row: number, column: number) => {
    //const shipPos = gameboard.getShipRC(row, column, false);
    //if (shipPos) {
    //  gameboard.removeShipAtRC(row, column);
    //  setSelectedShipToSettle(shipPos.ship);
    //  updateGameboard();
    //  return;
    //}

    if (!selectedShipToSettle) return;

    //@ts-ignore
    if (!unsettledShips[selectedShipToSettle.length]) return;
    const placed = gameboard.placeShip(selectedShipToSettle, row, column);
    if (!placed) return;

    gameboard.dragndrop = null;
    setSelectedShipToSettle(null);

    updateGameboard();
  };

  const handleTimerStart = () => {
    setUserShips!(gameboard.ships);
    closeModal!();
  };

  const dragOnThisBalls = (i: any) => {
    if (!selectedShipToSettle) {
      gameboard.dragndrop = null;
      return;
    }
    const [isPossible] = gameboard.isPlacementPossible(
      selectedShipToSettle,
      i.row,
      i.column
    );
    if (!isPossible) return;
    gameboard.dragndrop = {
      ship: selectedShipToSettle,
      pos: i,
      confirmed: false,
    };
    updateGameboard();
  };

  const handleDragStart = (ship: ShipType) => {
    setSelectedShipToSettle(ship);
    gameboard.removeShip();
    updateGameboard();
  };

  const handleDragEnd = () => {
    setSelectedShipToSettle(null);
    console.log("ZALUPA");
    //const ship = gameboard.dragndrop?.ship;
  };

  const handleDragBoardStart = (shipPos: ShipPosition) => {
    gameboard.dragndrop = shipPos;
    gameboard.removeShipAtRC(shipPos.pos.row, shipPos.pos.column);
    setSelectedShipToSettle(shipPos.ship);
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
          <Timer
            onRandom={() => {
              gameboard.placeShipsRandomly();
              updateGameboard();
            }}
            onStart={handleTimerStart}
          />
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
              onDragEnd={handleDragEnd}
              onDragStart={handleDragBoardStart}
              hoverCell={dragOnThisBalls}
              handleShipAction={handleShipAction}
              gameboard={gameboard}
              onCellClicked={onCellClicked}
            ></Board>
          </div>
        </div>
        <Ships
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          selectedShipToSettle={selectedShipToSettle}
          gameboard={gameboard}
        />
        {/* ACTION BUTTONS */}
        <div className="shipsArr__buttons">
          <CuttedButton
            callback={() => {
              gameboard.placeShipsRandomly();
              updateGameboard();
            }}
            text="Авто"
          />
          <CuttedButton
            text="Играть"
            className={!allShipsSettled ? "halfTransparent" : ""}
            callback={handleTimerStart}
          />
        </div>
      </div>
    </div>
  );
}
