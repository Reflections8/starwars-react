import ship1 from "../img/ships/1.png";
import ship2 from "../img/ships/2.png";
import ship3 from "../img/ships/3.png";
import ship4 from "../img/ships/4.png";
import { Ship } from "../ship";

type ShipsProps = {
  selectedShipToSettle: Ship | null;
  setSelectedShipToSettle: (ship: Ship) => void;
  unsettledShips: Record<string, number>;
};

export function Ships({
  selectedShipToSettle,
  setSelectedShipToSettle,
  unsettledShips,
}: ShipsProps) {
  const ships = [
    { ship: new Ship(1), image: ship1 },
    { ship: new Ship(2), image: ship2 },
    { ship: new Ship(3), image: ship3 },
    { ship: new Ship(4), image: ship4 },
  ];
  return (
    <div className="shipsArr__main-ships">
      {ships.map((s) => (
        <div
          className={`shipsArr__main-ships-item ${
            selectedShipToSettle?.length === s.ship.length ? "active" : ""
          } ${unsettledShips[`${s.ship.length}`] === 0 ? "disabled" : ""}`}
          onClick={() => {
            setSelectedShipToSettle(s.ship);
          }}
        >
          <div className="shipsArr__main-ships-item-main">
            <img
              src={s.image}
              alt="ship"
              className="shipsArr__main-ships-item-main-img"
            />
          </div>
          <div className="shipsArr__main-ships-badge">
            {unsettledShips[`${s.ship.length}`]}
          </div>
        </div>
      ))}
    </div>
  );
}
