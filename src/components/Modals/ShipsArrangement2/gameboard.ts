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

function shuffleArray(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomCell(
  freeCells: Set<string>,
  length: number,
  isVertical: boolean
): string | null {
  const cellsArray = Array.from(freeCells);
  while (cellsArray.length > 0) {
    const randomIndex = Math.floor(Math.random() * cellsArray.length);
    const [row, column] = cellsArray[randomIndex].split(",").map(Number);

    let valid = true;

    let x = row;
    let y = column;

    for (let i = 0; i < length; i++) {
      if (isVertical) x++;
      else y++;

      if (!freeCells.has(`${x},${y}`)) {
        valid = false;
        break;
      }
    }

    if (valid) return cellsArray[randomIndex];
    else cellsArray.splice(randomIndex, 1);
  }
  return null;
}

const shipsToPlaceRandom = [
  { length: 4, vertical: true },
  { length: 3, vertical: true },
  { length: 3, vertical: true },
  { length: 2, vertical: true },
  { length: 2, vertical: true },
  { length: 2, vertical: true },
  { length: 1, vertical: true },
  { length: 1, vertical: true },
  { length: 1, vertical: true },
  { length: 1, vertical: true },
];

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
    this.ships.forEach(({ ship, confirmed }) => {
      if (!confirmed) return;
      res[ship.length]--;
    });
    return res;
  }
  getFieldsNearShips() {
    const shipPositions: [number, number][] = [];
    let shipsToSearch = [...this.ships];
    if (this.dragndrop) shipsToSearch.push(this.dragndrop);
    shipsToSearch.forEach(({ pos, ship }) => {
      for (let i = 0; i < ship.length; i++) {
        if (ship.vertical) shipPositions.push([pos.row + i, pos.column]);
        else shipPositions.push([pos.row, pos.column + i]);
      }
    });
    const nearFields: Set<string> = new Set();
    const shipFields: Set<string> = new Set();

    const addField = (x: number, y: number, set: Set<string>) =>
      set.add(`${x},${y}`);

    for (const [x, y] of shipPositions) addField(x, y, shipFields);
    this.ships.forEach(({ ship, pos }) => {
      const { row, column } = pos;
      const thisShipCells = new Set<string>();
      const { length, vertical } = ship;

      for (let i = 0; i < ship.length; i++) {
        if (ship.vertical) thisShipCells.add(`${row + i},${column}`);
        else thisShipCells.add(`${row},${column + i}`);
      }

      for (let i = 0; i < length; i++) {
        const shipPosX = vertical ? row + i : row;
        const shipPosY = vertical ? column : column + i;
        directions.forEach(({ x, y }) => {
          const newX = shipPosX + x;
          const newY = shipPosY + y;
          if (newX >= 0 && newX < this.SIZE && newY >= 0 && newY < this.SIZE)
            !thisShipCells.has(`${newX},${newY}`) &&
              addField(newX, newY, nearFields);
        });
      }
    });
    return Array.from(nearFields).map((field) => {
      const [x, y] = field.split(",").map(Number);
      return { x, y, err: shipFields.has(field) };
    });
  }

  placeShipRandomly(freeCells: Set<string>, length: number) {
    let placed: null | ShipPosition = null;

    const l = length;
    let v = Math.random() < 0.5;
    let cell = getRandomCell(freeCells, l, v);
    if (!cell) {
      v = !v;
      cell = getRandomCell(freeCells, l, v);
      if (!cell) return placed;
    }

    const [row, column] = cell.split(",").map(Number);

    placed = {
      ship: { length: l, vertical: v },
      pos: { row, column },
      confirmed: true,
    };

    const directions = [
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];
    let x = row;
    let y = column;
    for (let i = 0; i < l; i++) {
      if (v) x++;
      else y++;
      freeCells.delete(`${x},${y}`);
      directions.forEach(({ x: dx, y: dy }) => {
        const newX = x + dx;
        const newY = y + dy;
        freeCells.delete(`${newX},${newY}`);
      });
    }

    return placed;
  }

  randomizeShips() {
    this.ships = [];
    let freeCells = new Set<string>();

    for (let i = 0; i < this.SIZE; i++)
      for (let j = 0; j < this.SIZE; j++) freeCells.add(`${i},${j}`);

    const shipsToPlace = shuffleArray(shipsToPlaceRandom);

    for (let i = 0; i < shipsToPlace.length; i++) {
      const ship = this.placeShipRandomly(freeCells, shipsToPlace[i].length);
      if (ship) this.ships.push(ship);
      else break;
    }

    if (this.ships.length === shipsToPlace.length) return;
    else this.randomizeShips();
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
    this.dragndrop = null;
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
}
