import "./style.css";
import "./setup.css";
import "./game.css";
import "./gameboard.css";

import Player from "./entities/Player.js";
import GameBoard from "./entities/Gameboard.js";

import initGame from "./gameController.js";

(function init() {
  function loadContent(functionGenerator) {
    const main = document.querySelector("main");
    main.innerHTML = "";
    main.appendChild(functionGenerator());
  }

  const g1 = new GameBoard(10);
  const g2 = new GameBoard(10);

  g1.placeShip(0, 0, 1, true);
  g1.placeShip(4, 5, 3, true);

  g1.receiveAttack(0, 0);
  g1.receiveAttack(4, 5);
  g1.receiveAttack(6, 5);

  g2.placeShip(2, 2, 1, true);
  g2.placeShip(7, 5, 3, false);

  console.log(g2.receiveAttack(0, 0));
  console.log(g2.receiveAttack(2, 2));
  console.log(g2.receiveAttack(7, 6));

  const player1 = new Player("John", g1);
  const player2 = new Player("Jane", g2);

  const game = initGame(player1, player2);
  // loadContent(generateSetupForm);
})();
