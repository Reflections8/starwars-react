import React, { useState, useMemo, useEffect } from "react";
import "../styles/Grid.css";
import ship1 from "../img/ships/1.png";
import ship2 from "../img/ships/2.png";
import ship3 from "../img/ships/3.png";
import ship4 from "../img/ships/4.png";

import ship1Vertical from "../img/ships/1_vertical.png";
import ship2Vertical from "../img/ships/2_vertical.png";
import ship3Vertical from "../img/ships/3_vertical.png";
import ship4Vertical from "../img/ships/4_vertical.png";
import {
  getCellClassName,
  initializeGrid,
  letterToNumber,
} from "../utils/grid";

type GridProps = {
  selectedShipToSettle: string | number;
  setSelectedShipToSettle: (ship: string | number) => void;
  unsettledShips: Record<string, number>;
  setUnsettledShips: (ships: Record<string, number>) => void;
};

const shipImagesEnum = {
  ship__1: {
    horizontal: ship1,
    vertical: ship1Vertical,
  },
  ship__2: {
    horizontal: ship2,
    vertical: ship2Vertical,
  },
  ship__3: {
    horizontal: ship3,
    vertical: ship3Vertical,
  },
  ship__4: {
    horizontal: ship4,
    vertical: ship4Vertical,
  },
};

const gridColumnsOrder = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
const gridRowsOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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

  const [grid, setGrid] = useState(initializeGrid());

  const showValid = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedShipToSettle) {
      const el = e.target as HTMLDivElement;
      const pos = (el as HTMLDivElement).className.split(" ")[1];
      const posX = parseInt(pos[1]);
      // const posY = pos[0];
      const posY = letterToNumber(pos[0]);
      const size = parseInt(selectedShipToSettle as string);

      const newGrid = [...grid];

      const setMarked = (x, y, cls) => {
        const cellClassName = getCellClassName(x, y);
        const cellIndex = newGrid.findIndex((cell) =>
          cell.className.includes(cellClassName)
        );
        if (cellIndex !== -1) {
          const el2 = document.querySelector(`.${cellClassName}`);
          el2?.classList.add(cls);
        }
      };

      for (let i = -1; i < size + 1; i++) {
        for (let j = -1; j <= 1; j++) {
          // TODO: Add orientation
          const shipX = posX + j;
          const shipY = posY + i;
          if (i >= 0 && i < size && j == 0) {
            setMarked(shipX, shipY, "marked-ship");
          } else {
            setMarked(shipX, shipY, "marked-buffer");
          }
        }
      }
    }
  };
  const removeValid = () => {
    const elements = document.querySelectorAll(".battleships__cell");
    elements.forEach((el) => {
      el.classList.remove("marked-ship");
      el.classList.remove("marked-buffer");
    });
  };
  // Состояние превью
  const [previewState, setPreviewState] = useState({
    shipLength: "",
    direction: "horizontal",
    settledCells: [],
  });

  const cells = useMemo(() => {
    const tempCells = [];
    for (let row = 1; row <= rows; row++) {
      for (let col = 0; col < columns; col++) {
        const className = `${columnLabels[col]}${row}`;
        tempCells.push({
          key: className,
          className: `battleships__cell ${className}`,
          classes: cellClasses[className] || [],
        });
      }
    }
    return tempCells;
  }, [rows, columns, columnLabels, cellClasses]);

  useEffect(() => {
    // TODO: чекнуть, что компонент нормально рендерится при обновлении previewState
    console.log({ previewState });
  }, [previewState]);

  function checkPlacementValidity(
    selectedShipLength: number,
    clickedRow: number,
    clickedColumn: string,
    direction: string
  ) {
    if (direction === "horizontal") {
      const startIndex = gridColumnsOrder.indexOf(clickedColumn);
      console.log("Order:", gridColumnsOrder);
      console.log("Lgth:", selectedShipLength);
      console.log("Row:", clickedRow);
      console.log("Col:", clickedColumn);
      console.log("Dir:", direction);
      const correctPlacement =
        !!gridColumnsOrder[startIndex + (selectedShipLength - 1)];
      return correctPlacement;
    }

    if (direction === "vertical") {
      const startIndex = gridRowsOrder.indexOf(clickedRow);
      const correctPlacement =
        !!gridRowsOrder[startIndex + (selectedShipLength - 1)];
      return correctPlacement;
    }
  }

  function returnSettledCells(
    selectedShipLength: number,
    clickedRow: number,
    clickedColumn: string,
    direction: string
  ) {
    const arr = [];
    if (direction === "horizontal") {
      const startIndex = gridColumnsOrder.indexOf(clickedColumn);
      for (let i = startIndex; i < startIndex + selectedShipLength; i++) {
        arr.push(String(gridColumnsOrder[i] + clickedRow));
      }
    }

    if (direction === "vertical") {
      const startIndex = gridRowsOrder.indexOf(clickedRow);
      for (let i = startIndex; i < startIndex + selectedShipLength; i++) {
        arr.push(String(clickedColumn + gridRowsOrder[i]));
      }
    }

    return arr;
  }

  function handleGridClick(e: React.MouseEvent<HTMLDivElement>) {
    const clickedCellClass = (e.target as HTMLDivElement).className.split(
      " "
    )[1];
    console.log(clickedCellClass);
    // If cell in not empty == ship__3

    if (selectedShipToSettle) {
      const selectedShipLength = Number(selectedShipToSettle);
      const clickedRow = Number(clickedCellClass[1]);
      const clickedColumn = clickedCellClass[0];

      const isPlacementValid = checkPlacementValidity(
        selectedShipLength,
        clickedRow,
        clickedColumn,
        previewState.direction
      );

      if (isPlacementValid) {
        setPreviewState({
          shipLength: String(selectedShipToSettle),
          direction: "horizontal",
          settledCells: returnSettledCells(
            selectedShipLength,
            clickedRow,
            clickedColumn,
            previewState.direction
          ),
        });

        setCellClasses((prevClasses) => ({
          ...prevClasses,
          [clickedCellClass]: [
            ...(prevClasses[clickedCellClass] || []),
            "settled",
            `ship__${selectedShipToSettle}`,
          ],
        }));

        /* TODO: это надо переместить в функцию которая подтверждает расстановку */
        //   setSelectedShipToSettle(null);

        //   setUnsettledShips((prevShips) => {
        //     const updatedShips = { ...prevShips };
        //     if (updatedShips[selectedShipToSettle] > 0) {
        //       updatedShips[selectedShipToSettle] -= 1;
        //     }

        //     return updatedShips;
        //   });
      }
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
            onMouseMove={showValid}
            onMouseLeave={removeValid}
          >
            {isSettled ? (
              <img
                src={
                  shipImagesEnum[currentShipClass?.[0]][previewState?.direction]
                }
                alt="ship"
                className={`battleships__cell-shipImg ${currentShipClass} ${previewState.direction}`}
              />
            ) : null}
          </div>
        );
      })}

      <div className="battleships__gridAbsolute">
        {previewState.shipLength ? (
          <div className="battleships__gridAbsolute-controls">CONTROLS</div>
        ) : null}
      </div>
    </div>
  );
}
