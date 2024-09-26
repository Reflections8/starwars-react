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

export class Gameboard {
  ships: ShipPosition[];
  SIZE: number;
  hits: Cell[];
  misses: Cell[];
  preHit: null | Cell;

  constructor() {
    this.preHit = null;
    this.hits = [];
    this.misses = [];
    this.initialize();
    this.ships = [];
    this.SIZE = 10;
  }
  initialize() {}

  setPreHit(pos: Cell | null) {
    this.preHit = pos;
  }
  getIfPreHit(row: number, column: number) {
    if (!this.preHit) return false;
    return this.preHit.row === row && this.preHit.column === column;
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
    if (!this.hits) return false;
    return this.hits.some((hit) => hit.row === row && hit.column === column);
  }
  getIfMiss(row: number, column: number): boolean {
    return this.misses.some(
      (miss) => miss.row === row && miss.column === column
    );
  }

  getShipsRemain() {
    let res: { [key: string]: number } = {
      "1": 4,
      "2": 3,
      "3": 2,
      "4": 1,
    };
    this.ships.forEach((shipPos) => (res[shipPos.ship.length] -= 1));
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
}
