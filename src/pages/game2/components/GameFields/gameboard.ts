type ShipType = {
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

type Cell = {
  row: number;
  column: number;
};
type EnemyShip = {
  IsDead: boolean;
  cells: Cell[];
};
type Ship = {
  vertical: boolean;
  IsDead: boolean;
  length: number;
  cells: Cell[];
  head: Cell;
};

type UpdateData = {
  isMe: boolean;
  misses: Cell[];
  ships: Ship[];
};

type UpdateEnemyData = {
  isMe: boolean;
  misses: Cell[];
  ships: EnemyShip[];
};

export class Gameboard {
  ships: ShipPosition[];
  SIZE: number;
  hits: Cell[];
  misses: Cell[];

  preHit: null | Cell;

  constructor(ships: ShipPosition[]) {
    this.preHit = null;
    this.hits = [];
    this.misses = [];
    this.initialize();
    this.ships = ships || [];
    this.SIZE = 10;
  }
  initialize() {}

  getRandomHitPlace() {
    let row: number;
    let column: number;
    let isUnique: boolean;
    do {
      row = Math.floor(Math.random() * this.SIZE);
      column = Math.floor(Math.random() * this.SIZE);

      isUnique =
        !this.hits.some((hit) => hit.row === row && hit.column === column) &&
        !this.misses.some((miss) => miss.row === row && miss.column === column);
    } while (!isUnique);

    return { row, column };
  }

  setPreHit(pos: Cell | null) {
    this.preHit = pos;
    console.log("preHit", pos);
  }
  getIfPreHit(row: number, column: number) {
    if (!this.preHit) return false;
    return this.preHit.row === row && this.preHit.column === column;
  }
  updateEnemyBoard(data: UpdateEnemyData) {
    console.log({ enemyDataShips: data.ships });
    let newHits: any[] = [];
    let newShips: any[] = [];
    data.ships.forEach((ship) => {
      const { cells, IsDead } = ship;
      newHits.push(...cells);
      if (IsDead) {
        const vertical = cells.every((cell) => cell.column === cells[0].column);
        const length = cells.length;
        const head = [...cells].sort((a, b) =>
          vertical ? a.row - b.row : a.column - b.column
        )[0];
        newShips.push({ ship: { vertical, length }, pos: head });
      }
    });
    this.ships = newShips;
    this.hits = newHits;
    this.misses = data.misses;
  }
  updateUserBoard(data: UpdateData) {
    console.log({ myDataShips: data.ships });
    let newHits: any[] = [];
    this.ships = data.ships.map((ship) => {
      const { head, vertical, length, cells } = ship;
      newHits.push(...cells);
      return {
        ship: { vertical, length },
        pos: { row: head.row, column: head.column },
        confirmed: true,
      };
    });

    this.hits = newHits;
    this.misses = data.misses;
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

    const addField = (x: number, y: number) => {
      if (!res.some((field) => field.x === x && field.y === y)) {
        res.push({ x, y, err: false });
      }
    };

    this.ships.forEach((shipPos) => {
      const { pos, ship } = shipPos;
      const { row, column } = pos;
      const { length, vertical } = ship;

      for (let i = 0; i < length; i++) {
        const currentRow = vertical ? row + i : row;
        const currentColumn = vertical ? column : column + i;

        directions.forEach((dir) => {
          const newX = currentRow + dir.x;
          const newY = currentColumn + dir.y;
          if (newX >= 0 && newY >= 0 && newX < 10 && newY < 10) {
            // Assuming the board is 10x10
            addField(newX, newY);
          }
        });
      }
    });

    return res;
  }

  getIfHit(row: number, column: number): boolean {
    return this.hits.some((hit) => hit.row === row && hit.column === column);
  }
  getIfMiss(row: number, column: number): boolean {
    return this.misses.some(
      (miss) => miss.row === row && miss.column === column
    );
  }
  /*{
    "1": 4,
    "2": 3,
    "3": 2,
    "4": 1,
  }; */
  getShipsRemain() {
    let res: { [key: string]: number } = {
      "1": 4,
      "2": 3,
      "3": 2,
      "4": 1,
    };
    this.ships.forEach((shipPos) => {
      const { ship } = shipPos;
      const { length } = ship;
      res[length] -= 1;
    });
    return res;
  }

  getShipRC(r: number, c: number): null | ShipPosition {
    let res = null;

    const transformed = this.ships.map((ship) => {
      return {
        pos: {
          row: ship.pos.row,
          column: ship.pos.column,
        },
        ship: {
          length: ship.length,
          vertical: ship.vertical,
        },
      };
    });

    transformed.forEach((shipPos) => {
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
