export class Ship {
  length: number;
  hits: number[];
  vertical: boolean;
  isHead: boolean;

  constructor(length: number) {
    this.length = length;
    this.hits = [];
    this.vertical = false;
    this.isHead = false;
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
