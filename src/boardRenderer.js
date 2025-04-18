import { createElement } from "./htmlGenerators.js";

export default function generateBoard(gameboard) {
  const boardElement = createElement("div", "gameboard");
  const board = gameboard.getBoard();

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const cellData = board[y][x];
      const cell = createElement("div", "cell");
      cell.dataset.x = x;
      cell.dataset.y = y;
      if (cellData.ship === null) {
        cell.classList.add("ship");
        if (cellData.ship.isSunk) {
          cell.classList.add("sunk");
        }
      }
      if (cellData.hastBeenHit === true) {
        cell.classList.add("hit");
      }

      boardElement.appendChild(cell);
    }
  }

  return boardElement;
}
