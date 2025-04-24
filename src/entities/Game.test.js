import Game from "./Game.js";
import Player from "./Player.js";
import Gameboard from "./Gameboard.js";

test("Game exists", () => {
  const game = new Game();
  expect(game).toBeDefined();
});

test("Game current player", () => {
  const player1 = new Player("Player 1", new Gameboard(10));
  const player2 = new Player("Player 2", new Gameboard(10));

  const game = new Game(player1, player2);
  expect(game.getCurrentPlayer()).toBe(player1);
});

test("Game attack", () => {
  const player1 = new Player("Player 1", new Gameboard(10));
  const player2 = new Player("Player 2", new Gameboard(10));

  const game = new Game(player1, player2);
  player1.placeShip(1, 1, 1, true);
  player2.placeShip(1, 1, 1, true);

  expect(game.attack(0, 0)).toBe("miss");

  // attack player 2
  game.attack(0, 0);

  // repeat attack player 1
  expect(game.attack(0, 0)).toBeFalsy();
});

test("Game switch player", () => {
  const player1 = new Player("Player 1", new Gameboard(10));
  const player2 = new Player("Player 2", new Gameboard(10));

  const game = new Game(player1, player2);
  player1.placeShip(0, 0, 2, true);
  expect(game.getCurrentPlayer()).toBe(player1);
  game.attack(0, 0);
  expect(game.getCurrentPlayer()).toBe(player2);
});

// Obsolete test, switch player logic changed to be used manually
test.skip("Game don't switch player on failed attack", () => {
  const player1 = new Player("Player 1", new Gameboard(10));
  const player2 = new Player("Player 2", new Gameboard(10));

  const game = new Game(player1, player2);
  player1.placeShip(0, 0, 2, true);
  player2.placeShip(0, 0, 2, true);

  expect(game.getCurrentPlayer()).toBe(player1);
  game.attack(0, 0);
  expect(game.getCurrentPlayer()).toBe(player2);
  game.attack(0, 0);
  expect(game.getCurrentPlayer()).toBe(player1);
  expect(game.attack(0, 0)).toBeFalsy();
  expect(game.getCurrentPlayer()).toBe(player1);
});

test("Game all ships sunk", () => {
  const player1 = new Player("Player 1", new Gameboard(10));
  const player2 = new Player("Player 2", new Gameboard(10));

  const game = new Game(player1, player2);
  player1.placeShip(0, 0, 1, true);

  expect(game.getCurrentPlayer()).toBe(player1);
  expect(player1.allShipsSunk()).toBeFalsy();

  expect(game.attack(0, 0)).toBe("hit");

  expect(player1.allShipsSunk()).toBeTruthy();
  expect(game.getCurrentPlayer()).toBe(player1);
});
