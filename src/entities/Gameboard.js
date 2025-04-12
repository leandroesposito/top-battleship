import Ship from "./Ship.js";

export default class Gameboard {
  #width;
  #height;
  #board;

  constructor(width, height) {
    this.#width = width;
    this.#height = height ?? width;
    this.#board = [...Array(this.#height)].map(() =>
      new Array(this.#width).fill({ ship: null, hasBeenHit: false }),
    );
  }

  getBoard() {
    return JSON.parse(JSON.stringify(this.#board));
  }

  placeShip(origX, origY, size, isHorizontal) {
    const ship = new Ship(size);

    if (isHorizontal) {
      for (let x = origX; x < origX + size; x++) {
        this.#board[origY][x].ship = ship;
      }
    } else {
      for (let y = origY; y < origY + size; y++) {
        this.#board[y][origX].ship = ship;
      }
    }
  }

  getCell(x, y) {
    const cell = this.#board[y][x];

    return {
      ship: cell.ship ? this.#getSanitizedShip(cell.ship) : null,
      hasBeenHit: cell.hasBeenHit,
    };
  }

  #getSanitizedShip(ship) {
    return {
      isSunk: ship.isSunk(),
    };
  }
}
