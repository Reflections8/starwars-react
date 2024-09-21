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

const initialUnsettledShips = {
  "1": 4,
  "2": 3,
  "3": 2,
  "4": 1,
};
export function ShipsArrangement() {
  /* Расставлены ли все корабли */
  const [allShipsSettled, setAllShipsSettled] = useState(false);

  /* Выбранный тип корабля */
  const [selectedShipToSettle, setSelectedShipToSettle] = useState(null);

  /* Оставшиеся корабли */
  const [unsettledShips, setUnsettledShips] = useState(initialUnsettledShips);

  const chooseAction = () => {
    // Here i should place sprite on cursor or smth. Or set the ship
  };
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

            <Grid
              // @ts-ignore
              selectedShipToSettle={selectedShipToSettle}
              // @ts-ignore
              setSelectedShipToSettle={setSelectedShipToSettle}
              unsettledShips={unsettledShips}
              // @ts-ignore
              setUnsettledShips={setUnsettledShips}
            />
          </div>
        </div>

        <Ships
          // @ts-ignore
          selectedShipToSettle={selectedShipToSettle}
          // @ts-ignore
          setSelectedShipToSettle={setSelectedShipToSettle}
          unsettledShips={unsettledShips}
          // @ts-ignore
          setUnsettledShips={setUnsettledShips}
          // @ts-ignore
          chooseAction={chooseAction}
        />

        {/* ACTION BUTTONS */}
        <div className="shipsArr__buttons">
          <CuttedButton text="Авто" />
          <CuttedButton
            text="Играть"
            className={!allShipsSettled ? "halfTransparent" : ""}
          />
        </div>
      </div>
    </div>
  );
}
