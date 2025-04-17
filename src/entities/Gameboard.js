import Ship from "./Ship.js";

export default class Gameboard {
  #width;
  #height;
  #board;
  #ships = new Set();

  constructor(width, height) {
    this.#width = width;
    this.#height = height ?? width;
    this.#board = [...Array(this.#height)].map(() =>
      [...Array(this.#width)].map(() => ({ ship: null, hasBeenHit: false })),
    );
  }

  getBoard() {
    return JSON.parse(JSON.stringify(this.#board));
  }

  placeShip(origX, origY, size, isHorizontal) {
    const result = this.#validatePosition(origX, origY, size, isHorizontal);
    if (result instanceof Error) {
      return result;
    }

    const ship = new Ship(size);
    this.#ships.add(ship);

    if (isHorizontal) {
      for (let x = origX; x < origX + size; x++) {
        this.#board[origY][x].ship = ship;
      }
    } else {
      for (let y = origY; y < origY + size; y++) {
        this.#board[y][origX].ship = ship;
      }
    }

    return "Success";
  }

  #validatePosition(origX, origY, size, isHorizontal) {
    if (
      (isHorizontal && origX + size > this.#width) ||
      (!isHorizontal && origY + size > this.#height) ||
      origX < 0 ||
      origY < 0
    ) {
      return new Error("Ship placed out of bounds");
    }

    for (let i = 0; i < size; i++) {
      const col = isHorizontal ? origX + i : origX;
      const row = isHorizontal ? origY : origY + i;

      if (this.#board[row][col].ship !== null) {
        return new Error("Ships cannot overlap");
      }
    }
  }

  getCell(x, y) {
    const cell = this.#board[y][x];

    return {
      ship: cell.ship !== null ? this.#getSanitizedShip(cell.ship) : null,
      hasBeenHit: cell.hasBeenHit,
    };
  }

  #getSanitizedShip(ship) {
    return {
      isSunk: ship.isSunk(),
    };
  }

  receiveAttack(x, y) {
    const cell = this.#board[y][x];

    if (cell.hasBeenHit) {
      return false;
    }

    cell.hasBeenHit = true;

    if (cell.ship !== null) {
      cell.ship.hit();
      return "hit";
    } else {
      return "miss";
    }
  }

  allShipsSunk() {
    return [...this.#ships].every((ship) => ship.isSunk());
  }
}
