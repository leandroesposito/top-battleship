import { createElement } from "./htmlGenerators.js";

export default function generateBoard(gameboard, isOpponent = false) {
  const boardElement = createElement("div", "gameboard");

  boardElement.style.gridTemplateColumns = `repeat(${gameboard.getWidth()}, ${50 / gameboard.getWidth()}vmin)`;
  boardElement.style.gridTemplateRows = `repeat(${gameboard.getHeight()}, ${50 / gameboard.getWidth()}vmin)`;

  for (let y = 0; y < gameboard.getHeight(); y++) {
    for (let x = 0; x < gameboard.getWidth(); x++) {
      const cellData = gameboard.getCell(x, y);
      const cell = createElement("div", "cell");
      cell.dataset.x = x;
      cell.dataset.y = y;
      if (cellData.ship !== null) {
        if (isOpponent === false || cellData.hasBeenHit === true) {
          cell.classList.add("ship");
        }
        if (cellData.ship.isSunk) {
          cell.classList.add("sunk");
        }
      }
      if (cellData.hasBeenHit === true) {
        cell.classList.add("hit");
      }

      boardElement.appendChild(cell);
    }
  }

  return boardElement;
}
