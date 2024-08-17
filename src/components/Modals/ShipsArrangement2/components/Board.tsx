//@ts-ignore
import { v4 } from "uuid";
import Player from "../player";
import { Gameboard } from "../gameboard";
import "../styles/Grid.css";

import ship1 from "../img/ships/1.png";
import ship2 from "../img/ships/2.png";
import ship3 from "../img/ships/3.png";
import ship4 from "../img/ships/4.png";

import ship1Vertical from "../img/ships/1_vertical.png";
import ship2Vertical from "../img/ships/2_vertical.png";
import ship3Vertical from "../img/ships/3_vertical.png";
import ship4Vertical from "../img/ships/4_vertical.png";
import { Ship } from "../ship";

interface Props {
  gameboard: Gameboard;
  owner: Player;
  enemy: Player;
  onCellClicked: (positionX: number, positionY: number) => void;
  selectedShipToSettle: Ship | null;
  showValid: (e: React.MouseEvent<HTMLDivElement>) => void;
  removeValid: () => void;
}

interface FieldProps {
  status?: string;
  owner?: Player;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  type?: string; //"empty" | "ship" | "nearShip" | "error";
  showValid: (e: React.MouseEvent<HTMLDivElement>) => void;
  removeValid: () => void;
  ship?: Ship | null;
  isHead?: boolean;
}

const shipImagesEnum: Record<number, { horizontal: string; vertical: string }> =
  {
    1: {
      horizontal: ship1,
      vertical: ship1Vertical,
    },
    2: {
      horizontal: ship2,
      vertical: ship2Vertical,
    },
    3: {
      horizontal: ship3,
      vertical: ship3Vertical,
    },
    4: {
      horizontal: ship4,
      vertical: ship4Vertical,
    },
  };

function Field({
  status,
  owner,
  children,
  className,
  type,
  onClick,
  showValid,
  removeValid,
  ship = null,
  isHead = false,
}: FieldProps) {
  return (
    <div
      onMouseMove={showValid}
      onMouseLeave={removeValid}
      onClick={(e) => {
        onClick?.();
        e.stopPropagation();
      }}
      className={`${className} ${type}`}
    >
      {ship && isHead && (
        <img
          src={
            shipImagesEnum[ship?.length][
              ship.vertical ? "vertical" : "horizontal"
            ]
          }
          className={`battleships__cell-shipImg ship__${ship.length} ${
            ship.vertical ? "vertical" : "horizontal"
          }`}
        />
      )}
      {children}
    </div>
  );
}

function BoardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        width: "250px",
        height: "250px",
        position: "relative",
        zIndex: 1,
        bottom: "-2px",
        gridTemplateColumns: "repeat(10, 25px)",
        gridTemplateRows: "repeat(10, 25px)",
        backgroundColor: "#070c2733",
      }}
    >
      {children}
    </div>
  );
}

const isNearField = (
  row: number,
  column: number,
  nearFields: { x: number; y: number; err: boolean }[]
) => {
  const matchingField = nearFields.find(
    (field) => field.x === row && field.y === column
  );
  return matchingField || null;
};

export function Board({
  gameboard,
  enemy,
  owner,
  onCellClicked,
  showValid,
  removeValid,
}: Props) {
  //console.log("gameboard", gameboard);
  const columnLabels = "abcdefghij".split("");
  const nearFields = gameboard.getFieldsNearShips();

  const loadFields = () => {
    const fields = [];
    for (let row = 0; row < gameboard.board.length; row++) {
      for (let column = 0; column < gameboard.board[row].length; column++) {
        const shipPos = gameboard.getShipRC(row, column);
        let ship = null;
        let isHead = false;
        let type = "empty";
        if (shipPos) {
          ship = shipPos.ship;
          const {
            pos: { row: r, column: c },
          } = shipPos;
          isHead = r === row && c === column;
        }
        const className = `battleships__cell ${columnLabels[column]}${row}`;
        const nearField = isNearField(row, column, nearFields);
        if (nearField) type = nearField.err ? "errorShip" : "nearShip";

        let fieldComponent = (
          <Field
            showValid={showValid}
            removeValid={removeValid}
            type={type}
            className={className}
            key={v4()}
            status={status}
            owner={owner}
            ship={ship}
            isHead={isHead}
            onClick={() => onCellClicked(row, column)}
          />
        );
        fields.push(fieldComponent);
      }
    }
    return fields;
  };
  return <BoardWrapper>{loadFields()}</BoardWrapper>;
}
