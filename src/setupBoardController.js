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
      input.addEventListener("input", (event) => validateInput(event.target));
      input.addEventListener("input", handleValueChange);
    });

    const selects = document.querySelectorAll("select");
    selects.forEach((select) => {
      select.addEventListener("change", handleValueChange);
    });
  }

  function handleValueChange(event) {
    const fielsets = document.querySelectorAll("fieldset");
    gameboard = new Gameboard(boardSize);

    fieldsets: for (let i = 0; i < fielsets.length; i++) {
      const fieldset = fielsets[i];
      const inputs = fieldset.querySelectorAll("input");
      for (let j = 0; j < inputs.length; j++) {
        if (!validateInput(inputs[j], false)) {
          continue fieldsets;
        }
      }

      const x = Number(fieldset.querySelector('[name="x-coord"]').value - 1);
      const y = Number(fieldset.querySelector('[name="y-coord"]').value - 1);
      const size = Number(fieldset.querySelector('[name="ship-size"]').value);
      const orientation = fieldset.querySelector('[name="orientation"]').value;

      const placementResult = gameboard.placeShip(
        x,
        y,
        size,
        orientation === "horizontal",
      );

      if (placementResult !== "Success") {
        setFieldsetError(fieldset, placementResult);
      } else {
        setFieldsetError(fieldset, "");
      }
    }

    renderBoard(gameboard, gameboardPreview);
  }

  function clearInvalidStatus(input) {
    input.classList.remove("invalid");
  }

  function validateInput(input, showError = true) {
    const fieldset = input.closest("fieldset");
    let errorMessage = "";
    let isValid = true;

    if (input.validity.valueMissing) {
      errorMessage = "This field is required.";
      isValid = false;
    } else if (input.validity.rangeOverflow || input.validity.rangeUnderflow) {
      errorMessage = `Value must be between 1 and ${boardSize}.`;
      isValid = false;
    } else if (input.validity.badInput) {
      errorMessage = "Value must be an integer number.";
      isValid = false;
    }

    if (!isValid) {
      if (showError) {
        setFieldsetError(fieldset, errorMessage);
        input.classList.add("invalid");
      }
      return false;
    } else {
      clearInvalidStatus(input);
    }

    if (fieldsetIsValid(fieldset)) {
      if (showError) {
        setFieldsetError(fieldset, "");
      }
      return true;
    }
    return false;
  }

  function setFieldsetError(fieldset, errorMessage) {
    const errorElement = fieldset.querySelector(".error-message");
    errorElement.textContent = errorMessage;
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

  let gameboard = new Gameboard(boardSize);
  const gameboardPreview = document.querySelector(".board-container");

  renderBoard(gameboard, gameboardPreview);
}
