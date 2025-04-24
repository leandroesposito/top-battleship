import ComputerPlayer from "./ComputerPlayer.js";
import Gameboard from "./Gameboard.js";

test("ComputerPlayer exists", () => {
  const computerPlayer = new ComputerPlayer("Computer", new Gameboard(10));
  expect(computerPlayer).toBeDefined();
});

test("ComputerPlayer attacks", () => {
  const computerPlayer = new ComputerPlayer("Computer", new Gameboard(10));
  const attack = computerPlayer.getRandomAttack();

  expect(attack).toBeDefined();
});

test("ComputerPlayer attack has coordinates", () => {
  const computerPlayer = new ComputerPlayer("Computer", new Gameboard(10));
  const attack = computerPlayer.getRandomAttack();

  expect(attack).toHaveProperty("x");
  expect(attack).toHaveProperty("y");

  expect(Number.isInteger(attack.x)).toBeTruthy();
  expect(Number.isInteger(attack.y)).toBeTruthy();
});

test("ComputerPlayer attack until no spaces left", () => {
  const computerPlayer = new ComputerPlayer("Computer", new Gameboard(10));
  const gameboard = computerPlayer.getGameboard().getBoard();
  const totalItems = gameboard.length * gameboard[0].length;

  for (let i = 0; i < totalItems; i++) {
    expect(computerPlayer.getRandomAttack()).toBeDefined();
  }

  expect(() => computerPlayer.getRandomAttack()).toThrow(
    "No spaces left to attack",
  );
});

test("ComputerPlayer attack registered neighbour", () => {
  const computerPlayer = new ComputerPlayer("Computer", new Gameboard(10));
  computerPlayer.registerHit({ x: 0, y: 0 });
  expect(computerPlayer.getAttack()).toContainEqual({ x: 1, y: 0 });
  expect(computerPlayer.getAttack()).toContainEqual({ x: 0, y: 1 });
});
