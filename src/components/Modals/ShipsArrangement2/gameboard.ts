import { Ship } from "./ship";

const SIZE = 10;

export class Gameboard {
  board: (Ship | null)[][];

  missedShots: boolean[][];

  constructor() {
    this.board = [];
    this.missedShots = [];
    this.initialize();
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

  placeShip(ship: Ship, row: number, column: number, isVertical: boolean) {
    // if (!this.isPlacementPossible(ship, row, column, isVertical)) return false;
    // const isPossible = this.isPlacementPossible2(ship, row, column, isVertical);
    const isPossible = this.isPlacementPossible(ship, row, column, isVertical);
    if (!isPossible) return false;

    if (isVertical) {
      for (let i = 0; i < ship.length; i++) {
        const copyShip = ship.copy();
        copyShip.isHead = false;
        if (i === 0) {
          copyShip.isHead = true;
        }
        copyShip.vertical = true;
        this.board[row + i][column] = copyShip;
        // ship.isVertical = true;
        // this.isVertical[row + i][column] = true;
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        const copyShip = ship.copy();
        copyShip.isHead = false;
        if (i === 0) {
          copyShip.isHead = true;
        }
        this.board[row][column + i] = copyShip;
        // this.isVertical[row][column + i] = false;
      }
    }
    return true;
  }

  placeShipsRandomly() {
    if (!this.isEmpty()) return;

    const ships = [];
    /**
     * одинарные 4
      двойные 3
      тройные 2
      четверной 1
     */

    const sizes = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4].map((size) => new Ship(size));

    ships.push(...sizes);

    let succesfulPlacements = 0;

    while (succesfulPlacements < sizes.length) {
      const row = Math.floor(Math.random() * 10);
      const column = Math.floor(Math.random() * 10);
      const isVertical = Math.floor(Math.random() * 2) === 1 ? true : false;

      if (this.placeShip(ships[succesfulPlacements], row, column, isVertical))
        succesfulPlacements++;
    }
    console.log("Board", this.board);
    return this;
  }

  isPlacementPossible2(
    ship: Ship,
    row: number,
    column: number,
    isVertical: boolean
  ) {
    const size = ship.length;

    // Check if the ship fits within the grid
    if (isVertical) {
      if (row + size > this.board.length) return false;
    } else {
      if (column + size > this.board[0].length) return false;
    }

    // Check for overlap and buffer zone
    const startRow = Math.max(0, row - 1);
    const endRow = Math.min(
      this.board.length - 1,
      row + (isVertical ? size : 1)
    );
    const startColumn = Math.max(0, column - 1);
    const endColumn = Math.min(
      this.board[0].length - 1,
      column + (isVertical ? 1 : size)
    );

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startColumn; c <= endColumn; c++) {
        if (this.board[r][c] !== null) {
          return false;
        }
      }
    }

    return true;
  }

  isPlacementPossible(
    ship: Ship,
    row: number,
    column: number,
    isVertical: boolean
  ) {
    // case position is out of gameboard
    if (row < 0 || row > SIZE - 1 || column < 0 || column > SIZE - 1)
      return false;

    // case ship doesn't fit in gameboard
    if (isVertical) {
      if (row + ship.length > SIZE) return false;
    } else {
      if (column + ship.length > SIZE) return false;
    }

    // case any of the fields is already taken
    if (isVertical) {
      for (let i = 0; i < ship.length; i++) {
        if (this?.board?.[row + i][column]) return false;
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        if (this?.board?.[row][column + i]) return false;
      }
    }

    // case any of the neighbour fields are already taken
    if (isVertical) {
      for (let i = 0; i < ship.length; i++) {
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (
              row + x + i < 0 ||
              row + x + i >= SIZE ||
              column + y < 0 ||
              column + y >= SIZE
            )
              continue;
            if (this.board[row + x + i][column + y]) return false;
          }
        }
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (
              row + x < 0 ||
              row + x >= SIZE ||
              column + y + i < 0 ||
              column + y + i >= SIZE
            )
              continue;
            if (this.board[row + x][column + y + i]) return false;
          }
        }
      }
    }
    return true;
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
      this.board[row][column].hit(hitIndex);
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
