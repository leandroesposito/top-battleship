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
}
