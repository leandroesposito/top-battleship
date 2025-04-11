export default class Ship {
  #size;
  #hits;
  constructor(size) {
    if (size <= 0) {
      throw new Error("Invalid ship size");
    }
    this.#size = size;
    this.#hits = 0;
  }

  hit() {
    if (this.#hits < this.#size) {
      this.#hits += 1;
    }
  }

  isSunk() {
    return this.#hits === this.#size;
  }
}
