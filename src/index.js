import "./style.css";
import "./setup.css";
import "./game.css";
import "./gameboard.css";
import "./setupBoard.css";

import Player from "./entities/Player.js";
import GameBoard from "./entities/Gameboard.js";

import initGame from "./gameController.js";

import generateSetupBoardForm from "./setupBoardFormRenderer.js";

import initSetupBoard from "./setupBoardController.js";

import initSetup from "./setupController.js";

(function init() {
  function loadContent(functionGenerator) {
    const main = document.querySelector("main");
    main.innerHTML = "";
    main.appendChild(functionGenerator());
  }

  initSetup();
})();
