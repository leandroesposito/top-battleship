export default class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = player1;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getOpponentPlayer() {
    return this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }

  attack(x, y) {
    return this.getOpponentPlayer().receiveAttack(x, y);
  }

  switchPlayer() {
    if (this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
    } else {
      this.currentPlayer = this.player1;
    }
  }

  get isOver() {
    return this.player1.allShipsSunk() || this.player2.allShipsSunk();
  }

  get winner() {
    if (!this.player1.allShipsSunk() && !this.player2.allShipsSunk()) {
      return null;
    }
    return this.player1.allShipsSunk() ? this.player2 : this.player1;
  }
}
