import { useEffect, useRef, useState } from "react";
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
import { Rules } from "../SeaBattle/components/Rules/Rules";
import backImg from "../SeaBattle/img/back-button.svg";
import bgAudio from "./audio/arrangement.mp3";

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
    const shipPos = gameboard.getShipRC(row, column, false);

    if (shipPos) {
      gameboard.dragndrop = null;
      gameboard.removeShipAtRC(shipPos.pos.row, shipPos.pos.column);
      gameboard.dragndrop = { ...shipPos, confirmed: false };
    } else if (gameboard.dragndrop) {
      const [isPossible] = gameboard.isPlacementPossible(
        gameboard.dragndrop.ship,
        row,
        column
      );
      if (!isPossible) return;
      gameboard.dragndrop.pos.row = row;
      gameboard.dragndrop.pos.column = column;
    } else if (selectedShipToSettle) {
      const [isPossible] = gameboard.isPlacementPossible(
        selectedShipToSettle,
        row,
        column
      );
      if (!isPossible) return;
      gameboard.dragndrop = {
        ship: selectedShipToSettle,
        pos: { row, column },
        confirmed: false,
      };
    }
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
  };

  const handleDragBoardStart = (shipPos: ShipPosition) => {
    gameboard.removeShipAtRC(shipPos.pos.row, shipPos.pos.column);
    updateGameboard();
    setSelectedShipToSettle(shipPos.ship);
  };

  const [rulesOpen, setRulesOpen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    audioRef.current.play();
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={bgAudio}
        style={{ position: "absolute", opacity: "0", pointerEvents: "none" }}
      />
      <div className={`shipsArr ${rulesOpen ? "hidden" : ""}`}>
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
            onClick={(e) => {
              e.stopPropagation();
              // @ts-ignore
              audioRef.current.play();
              setRulesOpen(true);
            }}
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

      {/* RULES */}
      <div className={`seaBattle shipsArrRules ${rulesOpen ? "visible" : ""}`}>
        <div className="seaBattle__rulesButtonWrapper">
          <img
            src={rulesCornerImg}
            alt="rules-corner"
            className="seaBattle__rulesButtonWrapper-btn-corner--Left"
          />
          <img
            src={backImg}
            alt="rules"
            className="seaBattle__rulesButtonWrapper-btn"
            onClick={(e) => {
              e.stopPropagation();
              setRulesOpen(false);
            }}
          />
          <img
            src={rulesCornerImg}
            alt="rules-corner"
            className="seaBattle__rulesButtonWrapper-btn-corner--Right"
          />
        </div>
        <div className="modal__scrollContainer">
          <Rules />
        </div>
        {/* <div className="modal__scrollContainer__bottomGradient"></div> */}
      </div>
    </>
  );
}
