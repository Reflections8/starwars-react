// import { Gameboard } from "../gameboard";
// import Player from "../player";
import { v4 as uuidv4 } from "uuid";
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
import { NotShip } from "../notship";

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
  isVertical?: boolean;
  ship?: Ship | null;
  showValid: (e: React.MouseEvent<HTMLDivElement>) => void;
  removeValid: () => void;
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

{
  /* <img
                src={
                  shipImagesEnum[currentShipClass?.[0]][previewState?.direction]
                }
                alt="ship"
                className={`battleships__cell-shipImg ${currentShipClass} ${previewState.direction}`}
              /> */
}

// .battleships__cell-shipImg.ship__4.vertical {
//   width: 25px;
//   max-height: 100px;
// }

function Field({
  status,
  owner,
  children,
  className,
  ship,
  isVertical = false,
  onClick,
  showValid,
  removeValid,
}: FieldProps) {
  return (
    <div
      onMouseMove={showValid}
      onMouseLeave={removeValid}
      onClick={(e) => {
        onClick?.();
        e.stopPropagation()
      }}
      className={`${className} ${isVertical} ${
        ship instanceof NotShip && `notship ${ship.shipID}`
      }`}
    >
      {ship && ship.isHead && (
        <img
          src={
            shipImagesEnum[ship?.length][isVertical ? "vertical" : "horizontal"]
          }
          className={`battleships__cell-shipImg ship__${ship.length} ${
            isVertical ? "vertical" : "horizontal"
          }`}
        />
      )}
      {children}
    </div>
  );
}

// const BoardWrapper = styled.div`
//   display: grid;
//   width: 40rem;
//   height: 40rem;
//   grid-template-columns: repeat(10, 1fr);
//   grid-template-rows: repeat(10, 1fr);
//   border: 1px solid ${({ theme }) => theme.colors.dark.primary};
// `

// .battleships__grid {
//   width: 250px;
//   height: 250px;
//   position: relative;
//   z-index: 1;
//   bottom: -2px;
//   display: grid;
//   grid-template-columns: repeat(10, 25px);
//   grid-template-rows: repeat(10, 25px);
//   background-color: #070c2733;
// }

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

export function Board({
  gameboard,
  enemy,
  owner,
  onCellClicked,
  showValid,
  removeValid,
}: Props) {
  console.log("gameboard", gameboard);
  const columnLabels = "abcdefghij".split("");

  const loadFields = () => {
    const fields = [];
    for (let row = 0; row < gameboard.board.length; row++) {
      for (let column = 0; column < gameboard.board[row].length; column++) {
        const field = gameboard.board[row][column];
        const className = `battleships__cell ${columnLabels[column]}${row}`;
        // className: `battleships__cell ${className}`,

        let status = "default";
        if (field) {
          if (owner.name !== "Computer") status = "ship";
          if (enemy.hasAlreadyHit(row, column)) status = "hit";
        } else {
          if (gameboard.missedShots[row][column]) status = "missed";
        }

        let fieldComponent = <Field></Field>;

        if (owner.name === "Computer") {
          fieldComponent = (
            <Field
              showValid={showValid}
              removeValid={removeValid}
              ship={field}
              className={className}
              key={uuidv4()}
              status={status}
              owner={owner}
              isVertical={field?.vertical}
              onClick={() => onCellClicked(row, column)}
            />
          );
        } else {
          fieldComponent = (
            <Field
              showValid={showValid}
              removeValid={removeValid}
              ship={field}
              className={className}
              key={uuidv4()}
              status={status}
              isVertical={field?.vertical}
              owner={owner}
              onClick={() => onCellClicked(row, column)}
            />
          );
        }
        fields.push(fieldComponent);
      }
    }
    return fields;
  };
  return <BoardWrapper>{loadFields()}</BoardWrapper>;
}
