import Player from "./Player.js";

export default class ComputerPlayer extends Player {
  #attacksGameboard;
  #hitsStack;
  constructor(name, gameboard) {
    super(name, gameboard);
    this.#attacksGameboard = ComputerPlayer.#initializeAttacksList(gameboard);
    this.#hitsStack = [];
  }

  static #initializeAttacksList(gameboard) {
    const attacksGameboard = new Set();
    for (let i = 0; i < gameboard.getBoard().length; i++) {
      for (let j = 0; j < gameboard.getBoard()[i].length; j++) {
        attacksGameboard.add(JSON.stringify({ x: i, y: j }));
      }
    }
    return attacksGameboard;
  }

  #attacksGameboardHas(coords) {
    return this.#attacksGameboard.has(JSON.stringify(coords));
  }

  #attacksGameboardDelete(coords) {
    this.#attacksGameboard.delete(JSON.stringify(coords));
  }

  getAttack() {
    while (this.#hitsStack.length > 0) {
      const lastHit = this.#hitsStack[this.#hitsStack.length - 1];
      const newPosition = this.getValidNeighbor(lastHit);
      if (newPosition) {
        this.#attacksGameboardDelete(newPosition);
        return newPosition;
      }
      this.#hitsStack.pop();
    }

    return this.getRandomAttack();
  }

  getRandomAttack() {
    if (this.#attacksGameboard.size === 0) {
      throw new Error("No spaces left to attack");
    }

    const randomAttack = [...this.#attacksGameboard][
      Math.floor(Math.random() * this.#attacksGameboard.size)
    ];
    this.#attacksGameboard.delete(randomAttack);

    return JSON.parse(randomAttack);
  }

  registerHit({ x, y }) {
    this.#hitsStack.push({ x, y });
  }

  getValidNeighbor({ x, y }) {
    const positions = [
      { x, y: y - 1 }, // up
      { x: x + 1, y }, // right
      { x, y: y + 1 }, // down
      { x: x - 1, y }, // left
    ];

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      if (this.#attacksGameboardHas(position)) {
        return position;
      }
    }

    return false;
  }
}
