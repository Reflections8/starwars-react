import { Ship } from "../../../../dto/shipDto";
import ship1 from "../img/ships/1.png";
import ship2 from "../img/ships/2.png";
import ship3 from "../img/ships/3.png";
import ship4 from "../img/ships/4.png";

type ShipsProps = {
  selectedShipToSettle: string | number;
  setSelectedShipToSettle: (ship: string | number) => void;
  unsettledShips: Record<string, number>;
  setUnsettledShips: (ship: string | number) => void;
  chooseAction: (ship: string | number) => void;
};
export function Ships({
  selectedShipToSettle,
  setSelectedShipToSettle,
  unsettledShips,
  setUnsettledShips,
  chooseAction,
}: ShipsProps) {
  const ships: Array<Ship> = [
    {
      key: "1",
      image: ship1,
      size: 1,
    },
    {
      key: "2",
      image: ship2,
      size: 2,
    },
    {
      key: "3",
      image: ship3,
      size: 3,
    },
    {
      key: "4",
      image: ship4,
      size: 4,
    },
  ];
  return (
    <div className="shipsArr__main-ships">
      {/* ITEM */}
      {ships.map((ship) => (
        <div
          className={`shipsArr__main-ships-item ${
            selectedShipToSettle === ship.key ? "active" : ""
          } ${unsettledShips[ship.key] === 0 ? "disabled" : ""}`}
          onClick={() => {
            setSelectedShipToSettle(ship.key);
            chooseAction(ship.key);
          }}
        >
          <div className="shipsArr__main-ships-item-main">
            <img
              src={ship.image}
              alt="ship"
              className="shipsArr__main-ships-item-main-img"
            />
          </div>
          <div className="shipsArr__main-ships-badge">
            {unsettledShips[ship.key]}
          </div>
        </div>
      ))}
    </div>
  );
}
