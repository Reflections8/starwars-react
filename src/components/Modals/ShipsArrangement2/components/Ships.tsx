import { Gameboard } from "../gameboard";
import ship1 from "../img/ships/1.png";
import ship2 from "../img/ships/2.png";
import ship3 from "../img/ships/3.png";
import ship4 from "../img/ships/4.png";
import { Ship } from "../ship";

type ShipsProps = {
  selectedShipToSettle: Ship | null;
  gameboard: Gameboard;
  onDragEnd: () => void;
  onDragStart: (ship: Ship) => void;
};

export function Ships({
  selectedShipToSettle,
  gameboard,
  onDragEnd,
  onDragStart,
}: ShipsProps) {
  const ships = [
    { ship: new Ship(1), image: ship1 },
    { ship: new Ship(2), image: ship2 },
    { ship: new Ship(3), image: ship3 },
    { ship: new Ship(4), image: ship4 },
  ];
  const unsettledShips = gameboard.getUnsettledShips();
  return (
    <div className="shipsArr__main-ships">
      {ships.map((s) => (
        <div
          draggable={true}
          className={`shipsArr__main-ships-item ${
            selectedShipToSettle?.length === s.ship.length ? "active" : ""
          } ${unsettledShips[`${s.ship.length}`] === 0 ? "disabled" : ""}`}
          onDragEnd={onDragEnd}
          onClick={() => onDragStart(s.ship)}
          onTouchStart={() => onDragStart(s.ship)}
          onTouchEnd={onDragEnd}
          onDragStart={() => onDragStart(s.ship)}
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
