import ship1 from "../img/ships/1.png";
import ship2 from "../img/ships/2.png";
import ship3 from "../img/ships/3.png";
import ship4 from "../img/ships/4.png";

type ShipsProps = {
  selectedShipToSettle: string | number;
  setSelectedShipToSettle: (ship: string | number) => void;
  unsettledShips: Record<string, number>;
  setUnsettledShips: (ship: string | number) => void;
};
export function Ships({
  selectedShipToSettle,
  setSelectedShipToSettle,
  unsettledShips,
  setUnsettledShips,
}: ShipsProps) {
  console.log(setUnsettledShips);
  return (
    <div className="shipsArr__main-ships">
      {/* ITEM */}
      <div
        className={`shipsArr__main-ships-item ${
          selectedShipToSettle === "1" ? "active" : ""
        } ${unsettledShips["1"] === 0 ? "disabled" : ""}`}
        onClick={() => {
          setSelectedShipToSettle("1");
        }}
      >
        <div className="shipsArr__main-ships-item-main">
          <img
            src={ship1}
            alt="ship"
            className="shipsArr__main-ships-item-main-img"
          />
        </div>
        <div className="shipsArr__main-ships-badge">{unsettledShips["1"]}</div>
      </div>

      {/* ITEM */}
      <div
        className={`shipsArr__main-ships-item ${
          selectedShipToSettle === "2" ? "active" : ""
        } ${unsettledShips["2"] === 0 ? "disabled" : ""}`}
        onClick={() => {
          setSelectedShipToSettle("2");
        }}
      >
        <div className="shipsArr__main-ships-item-main">
          <img
            src={ship2}
            alt="ship"
            className="shipsArr__main-ships-item-main-img"
          />
        </div>
        <div className="shipsArr__main-ships-badge">{unsettledShips["2"]}</div>
      </div>

      {/* ITEM */}
      <div
        className={`shipsArr__main-ships-item ${
          selectedShipToSettle === "3" ? "active" : ""
        } ${unsettledShips["3"] === 0 ? "disabled" : ""}`}
        onClick={() => {
          setSelectedShipToSettle("3");
        }}
      >
        <div className="shipsArr__main-ships-item-main">
          <img
            src={ship3}
            alt="ship"
            className="shipsArr__main-ships-item-main-img"
          />
        </div>
        <div className="shipsArr__main-ships-badge">{unsettledShips["3"]}</div>
      </div>

      {/* ITEM */}
      <div
        className={`shipsArr__main-ships-item ${
          selectedShipToSettle === "4" ? "active" : ""
        } ${unsettledShips["4"] === 0 ? "disabled" : ""}`}
        onClick={() => {
          setSelectedShipToSettle("4");
        }}
      >
        <div className="shipsArr__main-ships-item-main">
          <img
            src={ship4}
            alt="ship"
            className="shipsArr__main-ships-item-main-img"
          />
        </div>
        <div className="shipsArr__main-ships-badge">{unsettledShips["4"]}</div>
      </div>
    </div>
  );
}
