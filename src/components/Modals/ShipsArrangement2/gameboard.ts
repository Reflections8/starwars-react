import { combinations } from "./combinations";
import { NotShip } from "./notship";
import { Ship } from "./ship";

const SIZE = 10;

export type ShipPosition = {
  ship: Ship;
  pos: {
    row: number;
    column: number;
  };
  confirmed: boolean;
};

export class Gameboard {
  board: (Ship | NotShip | null)[][];
  ships: ShipPosition[];
  missedShots: boolean[][];

  constructor() {
    this.board = [];
    this.missedShots = [];
    this.initialize();
    this.ships = [];
  }

  initialize() {
    for (let i = 0; i < SIZE; i++) {
      this.board[i] = [];
      this.missedShots[i] = [];
      for (let j = 0; j < SIZE; j++) {
        this.board[i][j] = null;
        this.missedShots[i][j] = false;
      }
    }
  }
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

    this.ships.forEach(({ ship, pos }, idx) => {
      const { row, column } = pos;
      const { length, vertical } = ship;
      for (let i = 0; i < length; i++) {
        const shipPosX = vertical ? row + i : row;
        const shipPosY = vertical ? column : column + i;
        directions.forEach(({ x, y }) => {
          const newX = shipPosX + x;
          const newY = shipPosY + y;
          if (newX >= 0 && newX < SIZE && newY >= 0 && newY < SIZE) {
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
        (idx) => !this.ships[idx].confirmed
      );

      if (hasError || !isNearUnconfirmedShip) {
        res.push({ x, y, err: hasError });
      }
    });

    return res;
  }
  getShipRC(r: number, c: number): null | ShipPosition {
    let res = null;
    this.ships.forEach((shipPos) => {
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
    const shipPos = this.ships.find(({ confirmed }) => !confirmed);
    if (!shipPos) return false;
    shipPos.confirmed = true;
  }

  rotateShip() {
    const shipPos = this.ships.find(({ confirmed }) => !confirmed);
    if (!shipPos) return false;

    shipPos.ship.vertical = !shipPos.ship.vertical;
    if (shipPos.ship.vertical) {
      if (shipPos.pos.row + shipPos.ship.length > SIZE)
        shipPos.pos.row = SIZE - shipPos.ship.length;
    } else {
      if (shipPos.pos.column + shipPos.ship.length > SIZE)
        shipPos.pos.column = SIZE - shipPos.ship.length;
    }
  }

  removeShip() {
    this.ships = this.ships.filter(({ confirmed }) => confirmed);
  }

  placeShip(ship: Ship, row: number, column: number, confirmed = false) {
    const [isPossible] = this.isPlacementPossible(ship, row, column);
    if (!isPossible) return false;
    this.ships = [...this.ships, { ship, pos: { row, column }, confirmed }];
    return true;
  }

  placeShipsRandomly() {
    if (!this.isEmpty()) return;
    const idx = Math.floor(Math.random() * 10);
    const game = combinations[idx];
    this.ships = [];
    for (let i = 0; i < game.length; i++) {
      const ship = new Ship(game[i].length);
      const row = game[i].coords.x;
      const column = game[i].coords.y;
      ship.vertical = game[i].vertical;
      this.placeShip(ship, row, column, true);
    }
    return this;
  }

  isPlacementPossible(
    ship: Ship,
    row: number,
    column: number
  ): [boolean, { y: number; x: number }[]] {
    let result = true;
    const badCoords: { x: number; y: number }[] = []; // [{x: 1, y: 1},]
    if (row < 0 || row > SIZE - 1 || column < 0 || column > SIZE - 1)
      result = false;

    if (ship.vertical) {
      if (row + ship.length > SIZE) result = false;
    } else {
      if (column + ship.length > SIZE) result = false;
    }

    if (this.ships.some(({ pos }) => pos.row === row && pos.column === column))
      result = false;

    return [result, badCoords];
  }

  receiveAttack(row: number, column: number) {
    if (row < 0 || row >= SIZE || column < 0 || column >= SIZE) {
      return false;
    }

    if (this.board[row][column]) {
      let hitIndex = 0;
      // is vertical
      if (column > 0 && this.board[row][column - 1]) {
        let i = 1;
        while (column - i >= 0 && this.board[row][column - i]) {
          hitIndex++;
          i++;
        }
      }
      // is horizontal
      else if (row > 0 && this.board[row - 1][column]) {
        let i = 1;
        while (row - i >= 0 && this.board[row - i][column]) {
          hitIndex++;
          i++;
        }
      }
      // @ts-expect-error xui
      this.board[row][column]?.hit(hitIndex);

      return true;
    } else {
      this.missedShots[row][column] = true;
      return false;
    }
  }

  isGameOver() {
    let isBoardEmpty = true;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (this.board[i][j]) {
          isBoardEmpty = false;
          // @ts-expect-error xui
          if (!this.board[i][j]?.isSunk()) {
            return false;
          }
        }
      }
    }
    return isBoardEmpty ? false : true;
  }

  isEmpty() {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (this.board[i][j] !== null) return false;
      }
    }
    return true;
  }

  getEmptyFieldsAmount() {
    let result = 0;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (this.board[i][j] === null) result++;
      }
    }
    return result;
  }
}
