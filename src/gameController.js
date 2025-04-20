import Game from "./entities/Game.js";
import { createElement } from "./htmlGenerators";
import generateTurn from "./turnRenderer.js";
import generateBoard from "./boardRenderer.js";

export default function initGame(player1, player2) {
  function initTurn() {
    const gameContainer = document.querySelector(".game-container");
    gameContainer.innerHTML = "";
    gameContainer.appendChild(
      generateTurn(game.getCurrentPlayer(), game.getOpponentPlayer()),
    );

    const button = document.querySelector(".continue");
    button.dataset.switchPlayer = "false";
    button.disabled = true;

    const opponentBoardContainer = document.querySelector(
      ".opponent .gameboard",
    );
    opponentBoardContainer.addEventListener("click", handleGameboardClick);

    const h1 = document.querySelector(".game h1");
    h1.textContent = game.getCurrentPlayer().getName() + " turn";
  }

  const handleGameboardClick = (event) => {
    console.log(event);
    const cellElement = event.target;
    if (!cellElement.classList.contains("cell")) {
      return;
    }

    const x = cellElement.dataset.x;
    const y = cellElement.dataset.y;
    const opponent = game.getOpponentPlayer();
    const opponentGameboard = opponent.getGameboard();
    const cell = opponentGameboard.getCell(x, y);
    if (cell.hasBeenHit === false) {
      const attackResult = game.attack(x, y);
      if (attackResult !== false) {
        finishTurn();
      }
    }
  };

  function finishTurn() {
    const opponentBoardContainer = document.querySelector(
      ".opponent .gameboard",
    );
    opponentBoardContainer.innerHTML = "";
    opponentBoardContainer.appendChild(
      generateBoard(game.getOpponentPlayer().getGameboard(), true),
    );

    opponentBoardContainer.removeEventListener("click", handleGameboardClick);

    const button = document.querySelector(".continue");
    button.disabled = false;
  }

  function renderGameTemplate() {
    const main = document.querySelector("main");
    main.innerHTML = "";
    main.appendChild(generateGameTemplate());

    const button = document.querySelector(".continue");
    button.addEventListener("click", handleTurnEnd);
  }

  function handleTurnEnd(event) {
    const button = event.target;
    const switchPlayer = button.dataset.switchPlayer === "true";

    if (switchPlayer) {
      game.switchPlayer();
      initTurn();
      return;
    }

    button.dataset.switchPlayer = "true";
    const gameContainer = document.querySelector(".game-container");
    gameContainer.innerHTML = "";
    const h1 = document.querySelector(".game h1");
    h1.textContent = "Pass the screen to " + game.getOpponentPlayer().getName();
  }

  function generateGameTemplate() {
    const container = createElement("div", "game");

    const h1 = createElement("h1");
    container.appendChild(h1);

    const gameContainer = createElement("div", "game-container");
    container.appendChild(gameContainer);

    const buttonContainer = createElement("div", "botton-container");
    const button = createElement("button", "continue");
    button.innerText = "End turn";
    buttonContainer.appendChild(button);
    container.appendChild(buttonContainer);

    return container;
  }

  const game = new Game(player1, player2);
  renderGameTemplate();

  initTurn(game);
}
