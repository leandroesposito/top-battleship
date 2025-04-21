import Gameboard from "./entities/Gameboard";
import generateSetupBoardForm from "./setupBoardFormRenderer";
import generateBoard from "./boardRenderer.js";

export default function initSetupBoard(playerName, boardSize) {
  function renderSetupBoardForm(playerName, boardSize) {
    const main = document.querySelector("main");
    main.innerHTML = "";
    main.appendChild(generateSetupBoardForm(playerName, boardSize));
  }

  function addInputListeners() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener("focusin", (event) =>
        clearInvalidStatus(event.target),
      );
      input.addEventListener("focusout", (event) =>
        validateInput(event.target),
      );
    });
  }

  function clearInvalidStatus(event) {
    const input = event.target;
    input.classList.remove("invalid");
  }

  function validateInput(input, showError = true) {
    const fieldset = input.closest("fieldset");
    const inputs = [input];

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      let isValid = true;

      if (input.validity.valueMissing) {
        errorMessage.textContent = "This field is required.";
        isValid = false;
      } else if (
        input.validity.rangeOverflow ||
        input.validity.rangeUnderflow
      ) {
        errorMessage.textContent = `Value must be between 1 and ${boardSize}.`;
        isValid = false;
      } else if (input.validity.badInput) {
        errorMessage.textContent = "Value must be an integer number.";
        isValid = false;
      }

      if (!isValid) {
        input.classList.add("invalid");
        return false;
      }
    }

    if (fieldsetIsValid(fieldset)) {
      errorMessage.textContent = "";
      return true;
    }

    return false;
  }

  function fieldsetIsValid(fieldset) {
    const inputs = fieldset.querySelectorAll("input[type=number]");
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (!input.validity.valid) {
        return false;
      }
    }
    return true;
  }

  function renderBoard(gameboard, container) {
    const boardElement = generateBoard(gameboard);
    container.innerHTML = "";
    container.appendChild(boardElement);
  }

  renderSetupBoardForm(playerName, boardSize);
  addInputListeners();

  const gameboard = new Gameboard(boardSize);
  const gameboardPreview = document.querySelector(".board-container");

  renderBoard(gameboard, gameboardPreview);
}
