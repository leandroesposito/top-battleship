import createSetupForm from "./setupFormRenderer.js";
import initSetupBoard from "./setupBoardController.js";
import Player from "./entities/Player.js";
import Gameboard from "./entities/Gameboard.js";
import initGame from "./gameController.js";

export default function initSetup() {
  function handlePlayersSubmit() {
    const player1Input = document.querySelector("#player1-name");
    const player2Input = document.querySelector("#player2-name");
    const playAgainstComputerCheckbox = document.querySelector("#is-computer");

    if (!player1Input.reportValidity()) {
      return;
    }

    if (!playAgainstComputerCheckbox.checked && player2Input.value === "") {
      player2Input.setCustomValidity("Please enter a name for player 2.");
      player2Input.reportValidity();
      return;
    }

    player1 = new Player(player1Input.value, new Gameboard(10));
    player2 = new Player(player2Input.value, new Gameboard(10));

    setupBoards();
  }

  function setupBoards() {
    initSetupBoard(player1.getName(), 10);

    const submitButton = document.querySelector(".submit-board");
    submitButton.addEventListener("click", () => {
      handlerBoardSubmit(player1);
      initSetupBoard(player2.getName(), 10);
      window.scrollTo(0, 0);
      const submitButton = document.querySelector(".submit-board");
      submitButton.addEventListener("click", () => {
        handlerBoardSubmit(player2);
        initGame(player1, player2);
      });
    });
  }

  function handlerBoardSubmit(player) {
    const fielsets = document.querySelectorAll("fieldset");
    for (let i = 0; i < fielsets.length; i++) {
      const fieldset = fielsets[i];
      const x = Number(fieldset.querySelector('[name="x-coord"]').value - 1);
      const y = Number(fieldset.querySelector('[name="y-coord"]').value - 1);
      const size = Number(fieldset.querySelector('[name="ship-size"]').value);
      const orientation = fieldset.querySelector('[name="orientation"]').value;

      player.getGameboard().placeShip(x, y, size, orientation === "horizontal");
    }
  }

  loadContent(createSetupForm);
  let player1;
  let player2;

  const submitButton = document.querySelector(".submit-players");
  submitButton.addEventListener("click", handlePlayersSubmit);
}

function loadContent(functionGenerator) {
  const main = document.querySelector("main");
  main.innerHTML = "";
  main.appendChild(functionGenerator());
}
