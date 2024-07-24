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
  const [selectedShipToSettle, setSelectedShipToSettle] = useState(null);

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
            <Board gameboard={gameboard} enemy={user} owner={user}></Board>
          </div>
        </div>

        <Ships
          selectedShipToSettle={selectedShipToSettle}
          setSelectedShipToSettle={setSelectedShipToSettle}
          unsettledShips={unsettledShips}
          setUnsettledShips={setUnsettledShips}
        />

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
