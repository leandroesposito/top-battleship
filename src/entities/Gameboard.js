export default class Gameboard {
  #width;
  #height;
  #board;

  constructor(width, height) {
    this.#width = width;
    this.#height = height ?? width;
    this.#board = [...Array(height)].map(() =>
      new Array(width).fill({ ship: null, hasBeenHit: false }),
    );
  }

  getBoard() {
    return JSON.parse(JSON.stringify(this.#board));
  }
}
