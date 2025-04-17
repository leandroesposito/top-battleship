import Player from "./Player.js";
import Gameboard from "./Gameboard.js";

test("Player exists", () => {
  const player = new Player("Player 1", new Gameboard(10));
  expect(player).toBeDefined();
});

test("Player name", () => {
  const player = new Player("Player 1", new Gameboard(10));
  expect(player.getName()).toBe("Player 1");
});

test("Player gameboard", () => {
  const player = new Player("Player 1", new Gameboard(10));
  expect(player.getGameboard()).toBeDefined();
});

test("Player receive attack", () => {
  const player = new Player("Player 1", new Gameboard(10));
  expect(player.receiveAttack(0, 0)).toBeTruthy();
});

test("Player receive attack false", () => {
  const player = new Player("Player 1", new Gameboard(10));
  expect(player.receiveAttack(0, 0)).toBeTruthy();
  expect(player.receiveAttack(0, 0)).toBeFalsy();
});

test("Player receive attack miss", () => {
  const player = new Player("Player 1", new Gameboard(10));
  expect(player.receiveAttack(0, 0)).toBeTruthy();
  expect(player.receiveAttack(0, 1)).toBe("miss");
});

test("Player receive attack hit", () => {
  const player = new Player("Player 1", new Gameboard(10));
  player.placeShip(0, 0, 1, true);
  expect(player.receiveAttack(0, 0)).toBe("hit");
});

test("Player place ship", () => {
  const player = new Player("Player 1", new Gameboard(10));
  expect(player.placeShip(0, 0, 1, true) instanceof Error).toBeFalsy();
  expect(player.placeShip(0, 0, 1, true) instanceof Error).toBeTruthy();
});

test("Player all ships sunk", () => {
  const player = new Player("Player 1", new Gameboard(10));
  player.getGameboard().placeShip(0, 0, 1, true);
  expect(player.allShipsSunk()).toBeFalsy();
  player.receiveAttack(0, 0);
  expect(player.allShipsSunk()).toBeTruthy();
});
