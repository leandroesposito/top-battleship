import Player from "./Player.js";

export default class ComputerPlayer extends Player {
  #attacksGameboard;
  constructor(name, gameboard) {
    super(name, gameboard);
    this.#attacksGameboard = ComputerPlayer.#initializeAttacksList(gameboard);
  }

  static #initializeAttacksList(gameboard) {
    const attackGameboard = new Set();
    for (let i = 0; i < gameboard.getBoard().length; i++) {
      for (let j = 0; j < gameboard.getBoard()[i].length; j++) {
        attackGameboard.add({ x: i, y: j });
      }
    }
    return attackGameboard;
  }

  getRandomAttack() {
    if (this.#attacksGameboard.size === 0) {
      throw new Error("No spaces left to attack");
    }

    const randomAttack = [...this.#attacksGameboard][
      Math.floor(Math.random() * this.#attacksGameboard.size)
    ];
    this.#attacksGameboard.delete(randomAttack);

    return randomAttack;
  }
}
