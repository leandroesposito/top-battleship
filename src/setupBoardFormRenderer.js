import { createElement, createShipPlacer } from "./htmlGenerators.js";
import { shipSizes } from "./shipSizes.js";

export default function generateSetupBoardForm(playerName, boardSize) {
  const container = createElement("div", "setup-board");

  const h1 = createElement("h1");
  h1.textContent = playerName + " place your ships!";
  container.appendChild(h1);

  const panels = createElement("div", "panels");
  container.appendChild(panels);

  const boardContainer = createElement("div", "board-container");
  panels.appendChild(boardContainer);

  const formContainer = createElement("div", "setup-board-form-container");
  panels.appendChild(formContainer);

  const form = createElement("form", "setup-board-form");
  form.id = "setup-board-form";
  formContainer.appendChild(form);

  for (let i = 0; i < shipSizes.length; i++) {
    const shipSize = shipSizes[i];
    const fieldset = createElement("fieldset");
    const legend = createElement("legend");
    legend.textContent = `Ship size: ${shipSize}`;
    fieldset.appendChild(legend);
    fieldset.appendChild(createShipPlacer(shipSize, boardSize));
    form.appendChild(fieldset);
  }

  const buttonContainer = createElement("div", "button-container");
  const button = createElement("button", "submit-board");
  button.textContent = "Confirm board";
  button.disabled = true;
  buttonContainer.appendChild(button);
  formContainer.appendChild(buttonContainer);

  return container;
}
