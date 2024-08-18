//@ts-ignore
import { v4 } from "uuid";
import { Gameboard, ShipPosition } from "../gameboard";
import "../styles/Grid.css";

import ship1 from "../img/ships/1.png";
import ship2 from "../img/ships/2.png";
import ship3 from "../img/ships/3.png";
import ship4 from "../img/ships/4.png";

import ship1Vertical from "../img/ships/1_vertical.png";
import ship2Vertical from "../img/ships/2_vertical.png";
import ship3Vertical from "../img/ships/3_vertical.png";
import ship4Vertical from "../img/ships/4_vertical.png";

import { ApplyIcon, CancelIcon, RotateIcon } from "../../../../icons";
import { useEffect, useState } from "react";

interface Props {
  gameboard: Gameboard;
  onCellClicked: (positionX: number, positionY: number) => void;
  showValid: (e: React.MouseEvent<HTMLDivElement>) => void;
  removeValid: () => void;
  handleShipAction: (
    action: "rotateShip" | "confirmShip" | "removeShip"
  ) => void;
}

interface FieldProps {
  onClick?: () => void;
  className?: string;
  type?: string; //"empty" | "ship" | "nearShip" | "error";
  showValid: (e: React.MouseEvent<HTMLDivElement>) => void;
  removeValid: () => void;
  shipPos?: ShipPosition | null;
  isHead?: boolean;
  confirmed?: boolean;
  gameboard: Gameboard;
  handleShipAction: (
    action: "rotateShip" | "confirmShip" | "removeShip"
  ) => void;
  badPlacement: boolean;
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
  className,
  type,
  onClick,
  showValid,
  removeValid,
  shipPos = null,
  isHead = false,
  confirmed = false,
  handleShipAction,
  badPlacement,
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

  const renderConfirmButtons = () => {
    if (!isHead || !shipPos || confirmed) return null;
    const styleBase = {
      position: "absolute",
      width: 25,
      height: 25,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    };
    const { ship } = shipPos;
    const rectBase = 25;
    return (
      <>
        <div
          style={{
            position: "absolute",
            left: -25,
            top: -25,
            width: ship.vertical ? rectBase * 3 : rectBase * (ship.length + 2),
            height: !ship.vertical
              ? rectBase * 3
              : rectBase * (ship.length + 2),
            backgroundColor: "rgba(25, 194, 239, 0.3)",
            borderRadius: 6,
            zIndex: -1,
          }}
        />
        <div
          //@ts-ignore
          style={{
            ...styleBase,
            left: -25,
            top: 0,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleShipAction("rotateShip");
          }}
        >
          <RotateIcon />
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleShipAction("removeShip");
          }}
          //@ts-ignore
          style={{
            ...styleBase,
            left: ship.vertical ? 25 : 25 * ship.length,
            top: 0,
          }}
        >
          <CancelIcon />
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (badPlacement) return;
            handleShipAction("confirmShip");
          }}
          //@ts-ignore
          style={{
            ...styleBase,
            left: ship.vertical ? 0 : 25 * ((ship.length - 1) / 2),
            top: ship.vertical ? 25 * ship.length : 25,
            filter: !badPlacement ? "none" : "brightness(0.5)",
          }}
        >
          <ApplyIcon />
        </div>
      </>
    );
  };
  return (
    <div
      onMouseMove={showValid}
      onMouseLeave={removeValid}
      onClick={(e) => {
        onClick?.();
        e.stopPropagation();
      }}
      style={{ position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
        className={`${className} ${type}`}
      ></div>
      {renderConfirmButtons()}
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
  onCellClicked,
  showValid,
  removeValid,
  handleShipAction,
}: Props) {
  const columnLabels = "abcdefghij".split("");
  const nearFields = gameboard.getFieldsNearShips();
  const [badPlacement, setBadPlacement] = useState(false);

  useEffect(() => {
    setBadPlacement(false);
    if (nearFields.some(({ err }) => err)) {
      setBadPlacement(true);
    }
  }, [gameboard]);

  const renderFields = () => {
    const fields = [];
    for (let row = 0; row < gameboard.board.length; row++) {
      for (let column = 0; column < gameboard.board[row].length; column++) {
        const shipPos = gameboard.getShipRC(row, column);
        let isHead = false;
        let type = "empty";
        let confirmed = true;
        if (shipPos) {
          confirmed = !!shipPos.confirmed;
          const { pos } = shipPos;
          isHead = pos.row === row && pos.column === column;
        }
        const className = `battleships__cell ${columnLabels[column]}${row}`;
        const nearField = isNearField(row, column, nearFields);

        if (nearField) {
          if (nearField.err) type = "errorShip";
          else type = shipPos ? "empty" : "nearShip";
        }

        let fieldComponent = (
          <Field
            confirmed={confirmed}
            gameboard={gameboard}
            showValid={showValid}
            removeValid={removeValid}
            type={type}
            className={className}
            key={JSON.stringify({ row, column })}
            shipPos={shipPos}
            isHead={isHead}
            handleShipAction={shipPos ? handleShipAction : () => {}}
            onClick={() => onCellClicked(row, column)}
            badPlacement={badPlacement}
          />
        );
        fields.push(fieldComponent);
      }
    }
    return fields;
  };
  return <BoardWrapper>{renderFields()}</BoardWrapper>;
}
