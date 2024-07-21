import React, { useState, useMemo } from "react";
import "../styles/Grid.css";
import ship1 from "../img/ships/1.png";
import ship2 from "../img/ships/2.png";
import ship3 from "../img/ships/3.png";
import ship4 from "../img/ships/4.png";

type GridProps = {
  selectedShipToSettle: string | number;
  setSelectedShipToSettle: (ship: string | number) => void;
  unsettledShips: Record<string, number>;
  setUnsettledShips: (ships: Record<string, number>) => void;
};

const shipImagesEnum = {
  ship__1: ship1,
  ship__2: ship2,
  ship__3: ship3,
  ship__4: ship4,
};

export function Grid({
  selectedShipToSettle,
  setSelectedShipToSettle,
  setUnsettledShips,
  unsettledShips,
}: GridProps) {
  const rows = 10;
  const columns = 10;
  const columnLabels = "abcdefghij".split("");

  // Состояние для хранения классов ячеек
  const [cellClasses, setCellClasses] = useState<Record<string, string[]>>({});

  const cells = useMemo(() => {
    const tempCells = [];
    for (let row = 1; row <= rows; row++) {
      for (let col = 0; col < columns; col++) {
        const className = `${columnLabels[col]}${row}`;
        tempCells.push({
          key: className,
          className: `battleships__cell ${className}`,
          // Применяем классы из состояния
          classes: cellClasses[className] || [],
        });
      }
    }
    return tempCells;
  }, [rows, columns, columnLabels, cellClasses]);

  function handleGridClick(e: React.MouseEvent<HTMLDivElement>) {
    const clickedCellClass = (e.target as HTMLDivElement).className.split(
      " "
    )[1];

    if (selectedShipToSettle) {
      setCellClasses((prevClasses) => ({
        ...prevClasses,
        [clickedCellClass]: [
          ...(prevClasses[clickedCellClass] || []),
          "settled",
          `ship__${selectedShipToSettle}`,
        ],
      }));
      setSelectedShipToSettle(null);

      setUnsettledShips((prevShips) => {
        const updatedShips = { ...prevShips };
        if (updatedShips[selectedShipToSettle] > 0) {
          updatedShips[selectedShipToSettle] -= 1;
        }

        return updatedShips;
      });
    }
  }

  return (
    <div className="battleships__grid" onClick={handleGridClick}>
      {cells.map((cell) => {
        const isSettled = cell.classes.join(" ").includes("settled");
        const currentShipClass = cell.classes.join(" ").match(/ship__\d+/);

        return (
          <div
            key={cell.key}
            className={`${cell.className} ${cell.classes.join(" ")}`}
          >
            {isSettled ? (
              <img
                src={shipImagesEnum[currentShipClass[0]]}
                alt="ship"
                className="battleships__cell-shipImg"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
