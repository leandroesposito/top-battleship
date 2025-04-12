import Gameboard from "./Gameboard.js";

test("Gameboard exists", () => {
  const gameboard = new Gameboard(10, 10);
  expect(gameboard).toBeDefined();
});

test("Gameboard size", () => {
  const sizes = [
    {
      width: 1,
      height: 3,
    },
    {
      width: 5,
      height: 5,
    },
    {
      width: 6,
    },
    {
      width: 10,
    },
  ];

  sizes.forEach((size) => {
    const gameboard = new Gameboard(size.width, size.height);
    const board = gameboard.getBoard();

    expect(board.length).toBe(size.height ?? size.width);
    expect(board[0].length).toBe(size.width);
    expect(board[board.length - 1].length).toBe(size.width);
  });
});

describe("Gameboard place ship", () => {
  test("Gameboard ship is placed", () => {
    const gameboard = new Gameboard(10);
    gameboard.placeShip(2, 2, 3, true);

    // Ship
    expect(gameboard.getCell(2, 2).ship).not.toBeNull();
    expect(gameboard.getCell(3, 2).ship).not.toBeNull();
    expect(gameboard.getCell(4, 2).ship).not.toBeNull();

    // Boundaries
    expect(gameboard.getCell(1, 2).ship).toBeNull(); // Left of head
    expect(gameboard.getCell(5, 4).ship).toBeNull(); // Right of tail
    expect(gameboard.getCell(2, 1).ship).toBeNull(); // Upper side
    expect(gameboard.getCell(2, 3).ship).toBeNull(); // Lower side
  });
});
