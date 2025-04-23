import { createElement } from "./htmlGenerators.js";

export default function generateSetupForm() {
  const form = createElement("form", "setup-form");
  form.id = "setup-game-form";

  const h1 = createElement("h1");
  h1.innerText = "New Game Setup";
  form.appendChild(h1);

  const player1Row = createElement("div", "form-row");
  const player1Label = createElement("label");
  player1Label.for = "player1-name";
  player1Label.innerText = "Player 1 Name";
  player1Row.appendChild(player1Label);

  const player1Input = createElement("input");
  player1Input.type = "text";
  player1Input.id = "player1-name";
  player1Input.required = true;
  player1Input.autofocus = true;
  player1Input.name = "player1-name";
  player1Row.appendChild(player1Input);
  form.appendChild(player1Row);

  const player2Row = createElement("div", "form-row");
  const player2Label = createElement("label");
  player2Label.for = "player2-name";
  player2Label.innerText = "Player 2 Name";
  player2Row.appendChild(player2Label);

  const player2Input = createElement("input");
  player2Input.type = "text";
  player2Input.id = "player2-name";
  player2Input.name = "player2-name";
  player2Row.appendChild(player2Input);
  form.appendChild(player2Row);

  const isComputerRow = createElement("div", "form-row");
  const isComputerInput = createElement("input");
  isComputerInput.type = "checkbox";
  isComputerInput.name = "is-computer";
  isComputerInput.id = "is-computer";
  isComputerRow.appendChild(isComputerInput);

  const isComputerLabel = createElement("label");
  isComputerLabel.for = "is-computer";
  isComputerLabel.innerText = "Play against computer";
  isComputerRow.appendChild(isComputerLabel);
  form.appendChild(isComputerRow);

  const buttonRow = createElement("div", "form-row");
  const button = createElement("button", "submit-button");
  button.type = "button";
  button.innerText = "Start Game";
  buttonRow.appendChild(button);
  form.appendChild(buttonRow);

  return form;
}
