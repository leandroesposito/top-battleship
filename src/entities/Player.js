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
}
