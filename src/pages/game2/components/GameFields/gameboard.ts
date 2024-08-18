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
        (idx) => !this.ships[idx].confirmed
      );

      if (hasError || !isNearUnconfirmedShip) {
        res.push({ x, y, err: hasError });
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
