import generateBoard from "./boardRenderer.js";
import { createElement } from "./htmlGenerators.js";

export default function generateTurn(currentPlayer, opponent) {
  const container = document.createDocumentFragment();

  const currentPlayerContainer = createElement("div", "player-container");
  const currentPlayerTitle = createElement("h2");
  currentPlayerTitle.innerText = "Your board";
  currentPlayerContainer.appendChild(currentPlayerTitle);

  const currentGameboardContainer = createElement("div", "gameboard-container");
  const currentGameboard = generateBoard(currentPlayer.getGameboard());
  currentGameboardContainer.appendChild(currentGameboard);
  currentPlayerContainer.appendChild(currentGameboardContainer);

  const opponentContainer = createElement("div", "player-container");
  const opponentTitle = createElement("h2");
  opponentTitle.innerText = "Opponent board";
  opponentContainer.appendChild(opponentTitle);

  const opponentGameboardContainer = createElement(
    "div",
    "gameboard-container",
  );
  const opponentGameboard = generateBoard(opponent.getGameboard(), true);
  opponentGameboardContainer.appendChild(opponentGameboard);
  opponentContainer.appendChild(opponentGameboardContainer);

  container.appendChild(currentPlayerContainer);
  container.appendChild(opponentContainer);

  return container;
}
