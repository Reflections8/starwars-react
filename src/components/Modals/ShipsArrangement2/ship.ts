export class Ship {
  length: number;
  hits: number[];
  vertical: boolean;
  head: boolean;

  constructor(length: number) {
    this.length = length;
    this.hits = [];
    this.vertical = false;
    this.head = false;
  }

  hit(position: number) {
    if (this.hits.includes(position) || position < 0 || position >= this.length)
      return;
    this.hits.push(position);
  }

  isSunk() {
    return this.hits.length === this.length;
  }

  copy() {
    return Object.assign({}, this);
  }
}
