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
}
