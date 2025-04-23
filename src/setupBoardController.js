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

  function addDraggableButtonsListeners() {
    const buttons = document.querySelectorAll(".place-ship-button");
    buttons.forEach((button) => {
      button.addEventListener("dragstart", handleDragStart);
      button.addEventListener("dragend", handleDragEnd);
    });
  }

  function addCellsDropListeners() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("dragover", preventEvent);
      cell.addEventListener("dragenter", handleDragEnter);
      cell.addEventListener("dragleave", handleDragLeave);
      cell.addEventListener("drop", handleDrop);
    });
  }

  function handleDragEnter(event) {
    event.target.classList.add("dragging-over");
    event.preventDefault();
  }

  function handleDragLeave(event) {
    event.target.classList.remove("dragging-over");
    event.preventDefault();
  }

  function handleDragStart(event) {
    event.target.classList.add("dragging");
    const gameboardElement = gameboardPreview.querySelector(".gameboard");
    gameboardElement.classList.add("highlight-hover");
    draggedButton = event.target;
  }

  function handleDragEnd(event) {
    event.target.classList.remove("dragging");
    const gameboardElement = gameboardPreview.querySelector(".gameboard");
    gameboardElement.classList.remove("highlight-hover");
  }

  function preventEvent(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const cell = event.target;
    if (cell.classList.contains("cell") && draggedButton !== null) {
      const fieldset = draggedButton.closest("fieldset");
      const xInput = fieldset.querySelector('[name="x-coord"]');
      const yInput = fieldset.querySelector('[name="y-coord"]');

      xInput.value = parseInt(cell.dataset.x) + 1;
      yInput.value = parseInt(cell.dataset.y) + 1;
      handleValueChange();
    }

    gameboardPreview.classList.remove("highlight-hover");
  }

  function handleValueChange() {
    const fielsets = document.querySelectorAll("fieldset");
    const gameboard = new Gameboard(boardSize);
    let isValidBoard = true;

    for (let i = 0; i < fielsets.length; i++) {
      const fieldset = fielsets[i];
      if (!fieldsetIsValid(fieldset)) {
        isValidBoard = false;
        continue;
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
        isValidBoard = false;
      } else {
        setFieldsetError(fieldset, "");
      }
    }

    renderBoard(gameboard, gameboardPreview);
    const confirmBoardButton = document.querySelector(".continue");
    confirmBoardButton.disabled = !isValidBoard;

    return isValidBoard;
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

    if (errorMessage) {
      fieldset.classList.remove("valid");
    } else {
      fieldset.classList.add("valid");
    }
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

    addCellsDropListeners();
  }

  renderSetupBoardForm(playerName, boardSize);
  addInputListeners();
  addDraggableButtonsListeners();

  let draggedButton = null;
  const gameboard = new Gameboard(boardSize);
  const gameboardPreview = document.querySelector(".board-container");

  renderBoard(gameboard, gameboardPreview);
}
