import createSetupForm from "./setupFormRenderer.js";
import initSetupBoard from "./setupBoardController.js";
import Player from "./entities/Player.js";
import Gameboard from "./entities/Gameboard.js";

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

    const player1 = new Player(player1Input.value, new Gameboard(10));
    const player2 = new Player(player2Input.value, new Gameboard(10));

    initSetupBoard(player1.getName(), 10);
  }

  loadContent(createSetupForm);

  const submitButton = document.querySelector(".submit-button");
  submitButton.addEventListener("click", handlePlayersSubmit);
}

function loadContent(functionGenerator) {
  const main = document.querySelector("main");
  main.innerHTML = "";
  main.appendChild(functionGenerator());
}
