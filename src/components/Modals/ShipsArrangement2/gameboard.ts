import { combinations } from "./combinations";
import { NotShip } from "./notship";
import { Ship } from "./ship";

const SIZE = 10;

export class Gameboard {
  board: (Ship | NotShip | null)[][];

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
    // console.log("placeship", { ship, row, column, isVertical });
    // if (!this.isPlacementPossible(ship, row, column, isVertical)) return false;
    // const isPossible = this.isPlacementPossible2(ship, row, column, isVertical);
    const [isPossible] = this.isPlacementPossible(
      ship,
      row,
      column,
      isVertical
    );
    // console.log(isPossible);
    if (!isPossible) return false;
    const shipID = `${row}-${column}`;
    const fillSpaceAroundCell = (shipPosX: number, shipPosY: number) => {
      const directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [-1, -1],
        [-1, 1],
        [1, 0],
        [1, -1],
        [1, 1],
      ];

      directions.forEach(([dx, dy]) => {
        const newX = shipPosX + dx;
        const newY = shipPosY + dy;

        if (
          newX >= 0 &&
          newX < 10 &&
          newY >= 0 &&
          newY < 10 &&
          this.board[newX][newY] === null
        ) {
          this.board[newX][newY] = new NotShip(shipID);
        }
      });
    };

    if (isVertical) {
      for (let i = 0; i < ship.length; i++) {
        const copyShip = ship.copy();
        copyShip.isHead = false;
        if (i === 0) {
          copyShip.isHead = true;
          // copyShip.coords = { x: row, y: column };
        }
        copyShip.vertical = true;
        const shipPosX = row + i;
        const shipPosY = column;
        this.board[shipPosX][shipPosY] = copyShip;

        fillSpaceAroundCell(shipPosX, shipPosY);
        // ship.isVertical = true;
        // this.isVertical[row + i][column] = true;
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        const copyShip = ship.copy();
        copyShip.isHead = false;
        if (i === 0) {
          copyShip.isHead = true;
          // copyShip.coords = { x: row, y: column };
        }
        const shipPosX = row;
        const shipPosY = column + i;
        this.board[shipPosX][shipPosY] = copyShip;
        fillSpaceAroundCell(shipPosX, shipPosY);
        // this.isVertical[row][column + i] = false;
      }
    }
    return true;
  }

  // placeShipsRandomly() {
  //   if (!this.isEmpty()) return;

  //   const ships = [];
  //   /**
  //    * одинарные 4
  //     двойные 3
  //     тройные 2
  //     четверной 1
  //    */

  //   const sizes = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4]
  //     .map((size) => new Ship(size))
  //     .reverse();

  //   ships.push(...sizes);

  //   let succesfulPlacements = 0;
  //   let attempts = 0;
  //   const tries = 100;

  //   while (succesfulPlacements < sizes.length && attempts < tries) {
  //     const row = Math.floor(Math.random() * 10);
  //     const column = Math.floor(Math.random() * 10);
  //     const isVertical = Math.floor(Math.random() * 2) === 1 ? true : false;

  //     if (this.placeShip(ships[succesfulPlacements], row, column, isVertical)) {
  //       //
  //       succesfulPlacements++;
  //     }

  //     attempts++;
  //   }

  //   if (attempts === tries) {
  //     this.initialize();
  //     this.placeShipsRandomly();
  //   }

  //   return this;
  // }
  placeShipsRandomly() {
    if (!this.isEmpty()) return;

    // random from 0 to 9

    const idx = Math.floor(Math.random() * 10);

    const game = combinations[idx];

    for (let i = 0; i < game.length; i++) {
      const ship = new Ship(game[i].length);
      // { x: row, y: column };
      const row = game[i].coords.x;
      const column = game[i].coords.y;
      const isVertical = game[i].vertical;

      this.placeShip(ship, row, column, isVertical);
    }

    // const ships = [];
    /**
     * одинарные 4
      двойные 3
      тройные 2
      четверной 1
     */

    // const sizes = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4]
    //   .map((size) => new Ship(size))
    //   .reverse();

    // ships.push(...sizes);

    // let succesfulPlacements = 0;
    // let attempts = 0;
    // const tries = 100;

    // while (succesfulPlacements < sizes.length && attempts < tries) {
    //   const row = Math.floor(Math.random() * 10);
    //   const column = Math.floor(Math.random() * 10);
    //   const isVertical = Math.floor(Math.random() * 2) === 1 ? true : false;

    //   if (this.placeShip(ships[succesfulPlacements], row, column, isVertical)) {
    //     //
    //     succesfulPlacements++;
    //   }

    //   attempts++;
    // }

    // if (attempts === tries) {
    //   this.initialize();
    //   this.placeShipsRandomly();
    // }

    return this;
  }

  isPlacementPossible(
    ship: Ship,
    row: number,
    column: number,
    isVertical: boolean
  ): [boolean, { y: number; x: number }[]] {
    let result = true;
    const badCoords: { x: number; y: number }[] = []; // [{x: 1, y: 1},]
    // case position is out of gameboard
    if (row < 0 || row > SIZE - 1 || column < 0 || column > SIZE - 1)
      result = false;

    // case ship doesn't fit in gameboard
    if (isVertical) {
      if (row + ship.length > SIZE) {
        result = false;
      }
    } else {
      if (column + ship.length > SIZE) {
        result = false;
      }
    }

    // case any of the fields is already taken
    if (isVertical) {
      for (let i = 0; i < ship.length; i++) {
        if (this?.board?.[row + i]?.[column] instanceof Ship) {
          result = false;
        }
        // if (this?.board?.[row + i + 1]?.[column] instanceof NotShip) {
        if (this?.board?.[row + i]?.[column] instanceof NotShip) {
          result = false;
        }
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        if (this?.board?.[row][column + i] instanceof Ship) {
          result = false;
        }
        // TODO
        // if (this?.board?.[row][column + i + 1] instanceof NotShip) {
        if (this?.board?.[row][column + i] instanceof NotShip) {
          result = false;
        }
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
            if (this.board[row + x + i][column + y] instanceof Ship) {
              result = false;
              const shipPosX = row + x + i;
              const shipPosY = column + y;
              badCoords.push({ x: shipPosX, y: shipPosY });
            }

            if (this.board[row + x + i][column + y] instanceof NotShip) {
              result = false;
            }
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
              // console.log(" before ", row + x, column + y + i);
              continue;
            if (this.board[row + x][column + y + i] instanceof Ship) {
              // console.log(" after ", row + x, column + y + i, ship);
              result = false;
              const shipPosX = row + x;
              const shipPosY = column + y + i;
              badCoords.push({ x: shipPosX, y: shipPosY });
            }

            if (this.board[row + x][column + y + i] instanceof NotShip) {
              result = false;
            }
          }
        }
      }
    }

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
