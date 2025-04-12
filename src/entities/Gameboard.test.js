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
