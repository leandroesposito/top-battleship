import Game from "./entities/Game.js";
import { createElement } from "./htmlGenerators";
import generateTurn from "./turnRenderer.js";

export default function initGame(player1, player2) {
  function initTurn() {
    const gameContainer = document.querySelector(".game-container");
    gameContainer.innerHTML = "";
    gameContainer.appendChild(
      generateTurn(game.getCurrentPlayer(), game.getOpponentPlayer()),
    );

    const button = document.querySelector(".continue");
    button.addEventListener("click", handleTurnEnd);
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
      button.dataset.switchPlayer = "false";
      initTurn();
    }

    button.dataset.switchPlayer = "true";
    const main = document.querySelector("main");
    main.innerHTML = "";
    const h1 = createElement("h1");
    h1.textContent("Pass the screen to " + game.getCurrentPlayer().getName());
    main.appendChild(h1);
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
