export default class Player {
  #name;
  #gameboard;

  constructor(name, gameboard) {
    this.#name = name;
    this.#gameboard = gameboard;
  }

  getName() {
    return this.#name;
  }

  getGameboard() {
    return this.#gameboard;
  }

  receiveAttack(x, y) {
    return this.#gameboard.receiveAttack(x, y);
  }

  placeShip(origX, origY, size, isHorizontal) {
    return this.#gameboard.placeShip(origX, origY, size, isHorizontal);
  }

  allShipsSunk() {
    return this.#gameboard.allShipsSunk();
  }
}
