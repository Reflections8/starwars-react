import { Gameboard, ShipPosition } from "./gameboard";

import ship1 from "../../../../components/Modals/ShipsArrangement2/img/ships/1.png";
import ship2 from "../../../../components/Modals/ShipsArrangement2/img/ships/2.png";
import ship3 from "../../../../components/Modals/ShipsArrangement2/img/ships/3.png";
import ship4 from "../../../../components/Modals/ShipsArrangement2/img/ships/4.png";

import ship1Vertical from "../../../../components/Modals/ShipsArrangement2/img/ships/1_vertical.png";
import ship2Vertical from "../../../../components/Modals/ShipsArrangement2/img/ships/2_vertical.png";
import ship3Vertical from "../../../../components/Modals/ShipsArrangement2/img/ships/3_vertical.png";
import ship4Vertical from "../../../../components/Modals/ShipsArrangement2/img/ships/4_vertical.png";

import { XIcon } from "../../../../icons/Modals/XIcon";
import { OIcon } from "../../../../icons/Modals/OIcon";

interface Props {
  gameboard: Gameboard;
}

interface FieldProps {
  type?: string;
  shipPos?: ShipPosition | null;
  isHead?: boolean;
  isHit?: boolean;
  isMiss?: boolean;
  id: string;
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
  type,
  shipPos = null,
  isHead = false,
  isHit = false,
  isMiss = false,
  id,
}: FieldProps) {
  const renderImg = () => {
    if (!shipPos || !isHead) return null;
    const { ship } = shipPos;
    return (
      <img
        style={{ zIndex: 20 }}
        src={
          shipImagesEnum[ship?.length][
            ship.vertical ? "vertical" : "horizontal"
          ]
        }
        className={`battleships__cell-shipImg ship__${ship.length} ${
          ship.vertical ? "vertical" : "horizontal"
        }`}
      />
    );
  };

  const renderIcon = () => {
    if (isHit || isMiss) {
      return (
        <div
          style={{
            position: "absolute",
            width: 25,
            height: 25,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            top: 0,
            left: 0,
          }}
        >
          {isHit ? <OIcon /> : <XIcon />}
        </div>
      );
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        id={id}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
        className={`battleships__cell ${type}`}
      ></div>
      {renderIcon()}
      {renderImg()}
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

export function UserBoard({ gameboard }: Props) {
  const renderFields = () => {
    const fields = [];
    for (let row = 0; row < gameboard.SIZE; row++) {
      for (let column = 0; column < gameboard.SIZE; column++) {
        const shipPos = gameboard.getShipRC(row, column);
        let isHead = false;

        if (shipPos) {
          const { pos } = shipPos;
          isHead = pos.row === row && pos.column === column;
        }

        let fieldComponent = (
          <Field
            id={`userCell${row}-${column}`}
            isMiss={gameboard.getIfMiss(row, column)}
            isHit={gameboard.getIfHit(row, column)}
            type={"empty"}
            key={JSON.stringify({ row, column })}
            shipPos={shipPos}
            isHead={isHead}
          />
        );
        fields.push(fieldComponent);
      }
    }
    return fields;
  };
  return <BoardWrapper>{renderFields()}</BoardWrapper>;
}
