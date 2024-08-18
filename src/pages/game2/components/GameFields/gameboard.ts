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
  isDead: boolean;
  cells: Cell[];
};
type Ship = {
  vertical: boolean;
  isDead: boolean;
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

  constructor() {
    this.hits = [];
    this.misses = [];
    this.initialize();
    this.ships = [];
    this.SIZE = 10;
  }

  initialize() {}
  updateEnemyBoard(data: UpdateEnemyData) {
    let newHits: any[] = [];
    let newShips: any[] = [];
    data.ships.forEach((ship) => {
      const { cells, isDead } = ship;
      newHits.push(...cells);
      if (isDead) {
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
}
