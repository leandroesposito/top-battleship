import { createElement } from "./htmlGenerators.js";

export default function generateBoard(gameboard, isOpponent = false) {
  const boardElement = createElement("div", "gameboard");

  boardElement.style.gridTemplateColumns = `repeat(${gameboard.getWidth() + 1}, ${50 / (gameboard.getWidth() + 1)}vmin)`;
  boardElement.style.gridTemplateRows = `repeat(${gameboard.getHeight() + 1}, ${50 / (gameboard.getWidth() + 1)}vmin)`;

  // Empty corner cell
  boardElement.appendChild(createElement("div"));

  // Numbers row
  for (let x = 0; x < gameboard.getWidth(); x++) {
    const numberCoord = createElement("div", "coord-cell");
    numberCoord.style.fontSize = `${50 / gameboard.getWidth() - 1}vmin`;
    numberCoord.textContent = x + 1;
    boardElement.appendChild(numberCoord);
  }

  for (let y = 0; y < gameboard.getHeight(); y++) {
    for (let x = 0; x < gameboard.getWidth() + 1; x++) {
      // Letters column
      if (x === 0) {
        const letterCoord = createElement("div", "coord-cell");
        letterCoord.style.fontSize = `${50 / gameboard.getWidth() - 1}vmin`;
        letterCoord.textContent = String.fromCharCode(65 + y);
        boardElement.appendChild(letterCoord);
        continue;
      }

      const cellData = gameboard.getCell(x - 1, y);
      const cell = createElement("div", "cell");
      cell.dataset.x = x - 1;
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
