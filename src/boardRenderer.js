import { createElement } from "./htmlGenerators.js";

export default function generateBoard(gameboard) {
  const boardElement = createElement("div", "gameboard");

  for (let y = 0; y < gameboard.getHeight(); y++) {
    for (let x = 0; x < gameboard.getWidth(); x++) {
      const cellData = gameboard.getCell(x, y);
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
