import Game from "./entities/Game.js";
import { createElement } from "./htmlGenerators";
import generateTurn from "./turnRenderer.js";
import generateBoard from "./boardRenderer.js";
import ComputerPlayer from "./entities/ComputerPlayer.js";

export default function initGame(player1, player2) {
  function initTurn() {
    renderBoards(game.getCurrentPlayer(), game.getOpponentPlayer());

    const button = document.querySelector(".continue");
    button.dataset.switchPlayer = "false";
    button.disabled = true;
    button.textContent = "End turn";
    button.scrollIntoView();

    const opponentBoardContainer = document.querySelector(
      ".opponent .gameboard",
    );
    opponentBoardContainer.addEventListener("click", handleGameboardClick);

    const h1 = document.querySelector(".game h1");
    h1.textContent = game.getCurrentPlayer().getName() + " turn";
  }

  const handleGameboardClick = (event) => {
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

  function makeComputerAttack() {
    game.switchPlayer();
    const position = game.getCurrentPlayer().getAttack();
    const result = game.attack(position.x, position.y);
    if (result === "hit") {
      game.getCurrentPlayer().registerHit(position);
    }
    game.switchPlayer();
  }

  function finishTurn() {
    const opponentBoardContainer = document.querySelector(
      ".opponent .gameboard-container",
    );
    opponentBoardContainer.innerHTML = "";
    opponentBoardContainer.appendChild(
      generateBoard(game.getOpponentPlayer().getGameboard(), true),
    );

    opponentBoardContainer.removeEventListener("click", handleGameboardClick);

    if (game.isOver) {
      handleGameEnd();
      return;
    }

    if (game.getOpponentPlayer() instanceof ComputerPlayer) {
      makeComputerAttack();
      if (game.isOver) {
        setTimeout(() => {
          handleGameEnd();
          renderBoards(game.getCurrentPlayer(), game.getOpponentPlayer());
        }, 500);
        return;
      }
      setTimeout(initTurn, 500);
    }

    const button = document.querySelector(".continue");
    button.disabled = false;
  }

  function handleGameEnd() {
    const h1 = document.querySelector(".game h1");
    h1.textContent = "Game over! " + game.winner.getName() + " wins!";
  }

  function renderBoards(playerLeft, playerRight) {
    const gameContainer = document.querySelector(".game-container");
    gameContainer.innerHTML = "";
    gameContainer.appendChild(generateTurn(playerLeft, playerRight));
  }

  function renderGameTemplate() {
    const main = document.querySelector("main");
    main.innerHTML = "";
    main.appendChild(generateGameTemplate());

    const button = document.querySelector(".continue");
    button.addEventListener("click", handleTurnEnd);
    button.dataset.switchPlayer = "true";
    if (game.getOpponentPlayer() instanceof ComputerPlayer) {
      button.style.display = "none";
    }
  }

  function handleTurnEnd(event) {
    const button = event.target;
    const switchPlayer = button.dataset.switchPlayer === "true";
    if (switchPlayer) {
      game.switchPlayer();
      initTurn();
      return;
    }
    showTransitionScreen();
  }

  function showTransitionScreen() {
    const button = document.querySelector(".continue");
    button.dataset.switchPlayer = "true";
    button.textContent = "Start turn";
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
  if (player2 instanceof ComputerPlayer) {
    initTurn();
  } else {
    showTransitionScreen();
  }
}
