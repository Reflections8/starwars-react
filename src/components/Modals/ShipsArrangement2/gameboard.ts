import { combinations } from "./combinations";

export type ShipType = {
  length: number;
  vertical: boolean;
};
type Position = {
  row: number;
  column: number;
};

export type ShipPosition = {
  ship: ShipType;
  pos: Position;
  confirmed: boolean;
};

export type HitCell = {
  isSuccess: boolean;
  pos: Position;
};

function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

const unsettledMax = {
  "1": 4,
  "2": 3,
  "3": 2,
  "4": 1,
};

export class Gameboard {
  ships: ShipPosition[];
  hitCells: HitCell[];
  SIZE: number;
  dragndrop: ShipPosition | null;
  constructor() {
    this.dragndrop = null;
    this.hitCells = [];
    this.initialize();
    this.ships = [];
    this.SIZE = 10;
  }
  initialize() {}

  getUnsettledShips() {
    const res: Record<string, number> = {};
    for (let i = 1; i <= 4; i++) {
      //@ts-ignore
      res[i] = unsettledMax[i];
    }
    this.ships.forEach(({ ship }) => {
      res[ship.length]--;
    });
    if (this.dragndrop) {
      res[this.dragndrop.ship.length]--;
    }
    return res;
  }

  //SHIP ARRANGEMENT
  getFieldsNearShips() {
    let res: { x: number; y: number; err: boolean }[] = [];
    const directions = [
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 0 },
    ];

    let fieldCount = new Map();
    let shipsToSearch = [...this.ships];

    if (this.dragndrop) {
      shipsToSearch.push(this.dragndrop);
    }

    shipsToSearch.forEach(({ ship, pos }, idx) => {
      const { row, column } = pos;
      const { length, vertical } = ship;
      for (let i = 0; i < length; i++) {
        const shipPosX = vertical ? row + i : row;
        const shipPosY = vertical ? column : column + i;
        directions.forEach(({ x, y }) => {
          const newX = shipPosX + x;
          const newY = shipPosY + y;
          if (newX >= 0 && newX < this.SIZE && newY >= 0 && newY < this.SIZE) {
            const fieldKey = `${newX},${newY}`;
            if (!fieldCount.has(fieldKey)) {
              fieldCount.set(fieldKey, new Set());
            }
            fieldCount.get(fieldKey).add(idx);
          }
        });
      }
    });

    fieldCount.forEach((shipIndices, fieldKey) => {
      //@ts-ignore
      const [x, y] = fieldKey.split(",").map(Number);
      const hasError = shipIndices.size > 1;
      const isNearUnconfirmedShip = Array.from(shipIndices).some(
        //@ts-ignore
        (idx) => !shipsToSearch[idx].confirmed
      );

      if (hasError || !isNearUnconfirmedShip) {
        res.push({ x, y, err: hasError });
      }
    });

    return res;
  }

  unconfirmShipAtRC(row: number, column: number) {
    const shipPos = this.getShipRC(row, column);
    if (shipPos) shipPos.confirmed = false;
  }

  replaceShip(shipPos: ShipPosition, row: number, column: number) {
    const [isPossible] = this.isPlacementPossible(shipPos.ship, row, column);
    if (!isPossible) return false;
    shipPos.pos.row = row;
    shipPos.pos.column = column;
    return true;
  }

  getUnconfirmedShips() {
    const unconfirmed = this.ships.filter(({ confirmed }) => !confirmed);
    if (unconfirmed.length === 0) return null;
    return unconfirmed[0];
  }

  confirmShip() {
    if (!this.dragndrop) return false;
    this.dragndrop.confirmed = true;
    this.ships = [...this.ships, JSON.parse(JSON.stringify(this.dragndrop))];
    this.dragndrop = null;
  }

  rotateShip() {
    if (!this.dragndrop) return false;
    this.dragndrop.ship.vertical = !this.dragndrop.ship.vertical;

    if (this.dragndrop.ship.vertical) {
      if (this.dragndrop.pos.row + this.dragndrop.ship.length > this.SIZE)
        this.dragndrop.pos.row = this.SIZE - this.dragndrop.ship.length;
    } else {
      if (this.dragndrop.pos.column + this.dragndrop.ship.length > this.SIZE)
        this.dragndrop.pos.column = this.SIZE - this.dragndrop.ship.length;
    }
  }

  removeShip() {
    this.ships = this.ships.filter(({ confirmed }) => confirmed);
  }
  removeShipAtRC(row: number, column: number) {
    this.ships = this.ships.filter(
      ({ pos }) => pos.row !== row || pos.column !== column
    );
  }

  placeShip(ship: ShipType, row: number, column: number, confirmed = false) {
    const [isPossible] = this.isPlacementPossible(ship, row, column);
    if (!isPossible) return false;
    this.ships = [
      ...this.ships,
      { ship: deepCopy(ship), pos: { row, column }, confirmed },
    ];
    return true;
  }

  placeShipsRandomly() {
    const idx = Math.floor(Math.random() * 10);
    const game = combinations[idx];
    this.ships = [];
    for (let i = 0; i < game.length; i++) {
      const ship = { length: game[i].length, vertical: game[i].vertical };
      const row = game[i].coords.x;
      const column = game[i].coords.y;
      this.placeShip(ship, row, column, true);
    }
    return this;
  }

  isPlacementPossible(
    ship: ShipType,
    row: number,
    column: number
  ): [boolean, { y: number; x: number }[]] {
    let result = true;
    const badCoords: { x: number; y: number }[] = []; // [{x: 1, y: 1},]
    if (row < 0 || row > this.SIZE - 1 || column < 0 || column > this.SIZE - 1)
      result = false;

    if (ship.vertical) {
      if (row + ship.length > this.SIZE) result = false;
    } else {
      if (column + ship.length > this.SIZE) result = false;
    }

    if (this.ships.some(({ pos }) => pos.row === row && pos.column === column))
      result = false;

    return [result, badCoords];
  }
  //GAMEPLAY
  getShipRC(r: number, c: number, searchHover = true): null | ShipPosition {
    let res = null;
    let shipsToSearch = [...this.ships];
    if (this.dragndrop && searchHover) {
      shipsToSearch.push(this.dragndrop);
    }
    shipsToSearch.forEach((shipPos) => {
      const { pos, ship } = shipPos;
      const { row, column } = pos;
      const { length, vertical } = ship;
      if (vertical) {
        if (r >= row && r < row + length && c === column) res = shipPos;
      } else {
        if (c >= column && c < column + length && r === row) {
          res = shipPos;
        }
      }
    });

    return res;
  }

  placeHitCell(pos: Position) {
    const { row, column } = pos;
    const shipPos = this.getShipRC(row, column);
    this.hitCells.push({ isSuccess: !!shipPos, pos });
    return !!shipPos;
  }
}
