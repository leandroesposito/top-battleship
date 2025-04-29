/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/htmlGenerators.js
function createElement(type, ...classNames) {
  const element = document.createElement(type);
  element.classList.add(...classNames);
  return element;
}

function createShipPlacer(shipSize, boardSize) {
  const container = document.createDocumentFragment();

  const draggablePlacer = createElement("div", "draggable-place-ship");
  const iconContainer = createElement(
    "div",
    "icon-container",
    "draggable-place-ship-icon",
  );
  const icon = createElement("div", "icon", "pointer");
  iconContainer.appendChild(icon);
  iconContainer.draggable = true;
  draggablePlacer.appendChild(iconContainer);

  const draggableText = createElement("div");
  draggableText.textContent = "Drag to board";
  draggablePlacer.appendChild(draggableText);
  container.appendChild(draggablePlacer);

  const xCoordRow = createElement("div", "coord-row", "form-row");
  xCoordRow.appendChild(
    createLabelWithInput("X", "number", "x-coord", "x-coord", {
      min: 1,
      max: boardSize,
      step: 1,
      required: true,
    }),
  );
  container.appendChild(xCoordRow);

  const yCoordRow = createElement("div", "coord-row", "form-row");
  yCoordRow.appendChild(
    createLabelWithInput("Y", "number", "y-coord", "y-coord", {
      min: 1,
      max: boardSize,
      step: 1,
      required: true,
    }),
  );
  container.appendChild(yCoordRow);

  const orientationRow = createElement("div", "orientation-row", "form-row");

  const orientationLabel = createElement("label");
  orientationLabel.for = "orientation";
  orientationLabel.textContent = "Pos.";
  orientationRow.appendChild(orientationLabel);

  const orientationSelect = createElement("select", "orientation-select");
  orientationSelect.id = "orientation";
  orientationSelect.name = "orientation";

  const horizontalOption = createOption("horizontal", "Horizontal");
  const verticalOption = createOption("vertical", "Vertical");
  orientationSelect.appendChild(horizontalOption);
  orientationSelect.appendChild(verticalOption);

  orientationRow.appendChild(orientationSelect);
  container.appendChild(orientationRow);

  const shipSizeInput = createElement("input");
  shipSizeInput.type = "hidden";
  shipSizeInput.value = shipSize;
  shipSizeInput.name = "ship-size";
  container.appendChild(shipSizeInput);

  container.appendChild(createElement("div", "error-message"));

  return container;
}

function createOption(value, text) {
  const option = createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

function createLabelWithInput(
  labelText,
  inputType,
  inputId,
  inputName,
  restrictions = {},
) {
  const container = document.createDocumentFragment();

  const label = createElement("label");
  label.for = inputId;
  label.textContent = labelText;

  const input = createElement("input");
  input.type = inputType;
  input.id = inputId;
  input.name = inputName;

  for (const [key, value] of Object.entries(restrictions)) {
    input.setAttribute(key, value);
  }

  container.appendChild(label);
  container.appendChild(input);

  return container;
}

;// ./src/setupFormRenderer.js


function generateSetupForm() {
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
  const button = createElement("button", "submit-players");
  button.type = "button";
  button.innerText = "Next";
  buttonRow.appendChild(button);
  form.appendChild(buttonRow);

  return form;
}

;// ./src/entities/Player.js
class Player {
  #name;
  #gameboard;

  constructor(name, gameboard) {
    this.#name = name;
    this.#gameboard = gameboard;
  }

  getName() {
    return this.#name;
  }

  getGameboard() {
    return this.#gameboard;
  }

  receiveAttack(x, y) {
    return this.#gameboard.receiveAttack(x, y);
  }

  placeShip(origX, origY, size, isHorizontal) {
    return this.#gameboard.placeShip(origX, origY, size, isHorizontal);
  }

  allShipsSunk() {
    return this.#gameboard.allShipsSunk();
  }
}

;// ./src/entities/ComputerPlayer.js


class ComputerPlayer extends Player {
  #attacksGameboard;
  #hitsStack;
  constructor(name, gameboard) {
    super(name, gameboard);
    this.#attacksGameboard = ComputerPlayer.#initializeAttacksList(gameboard);
    this.#hitsStack = [];
  }

  static #initializeAttacksList(gameboard) {
    const attacksGameboard = new Set();
    for (let i = 0; i < gameboard.getBoard().length; i++) {
      for (let j = 0; j < gameboard.getBoard()[i].length; j++) {
        attacksGameboard.add(JSON.stringify({ x: i, y: j }));
      }
    }
    return attacksGameboard;
  }

  #attacksGameboardHas(coords) {
    return this.#attacksGameboard.has(JSON.stringify(coords));
  }

  #attacksGameboardDelete(coords) {
    this.#attacksGameboard.delete(JSON.stringify(coords));
  }

  getAttack() {
    while (this.#hitsStack.length > 0) {
      const lastHit = this.#hitsStack[this.#hitsStack.length - 1];
      const newPosition = this.getValidNeighbor(lastHit);
      if (newPosition) {
        this.#attacksGameboardDelete(newPosition);
        return newPosition;
      }
      this.#hitsStack.pop();
    }

    return this.getRandomAttack();
  }

  getRandomAttack() {
    if (this.#attacksGameboard.size === 0) {
      throw new Error("No spaces left to attack");
    }

    const randomAttack = [...this.#attacksGameboard][
      Math.floor(Math.random() * this.#attacksGameboard.size)
    ];
    this.#attacksGameboard.delete(randomAttack);

    return JSON.parse(randomAttack);
  }

  registerHit({ x, y }) {
    this.#hitsStack.push({ x, y });
  }

  getValidNeighbor({ x, y }) {
    const positions = [
      { x, y: y - 1 }, // up
      { x: x + 1, y }, // right
      { x, y: y + 1 }, // down
      { x: x - 1, y }, // left
    ];

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      if (this.#attacksGameboardHas(position)) {
        return position;
      }
    }

    return false;
  }
}

;// ./src/entities/Ship.js
class Ship {
  #size;
  #hits;
  constructor(size) {
    if (size <= 0) {
      throw new Error("Invalid ship size");
    }
    this.#size = size;
    this.#hits = 0;
  }

  hit() {
    if (this.#hits < this.#size) {
      this.#hits += 1;
    }
  }

  isSunk() {
    return this.#hits === this.#size;
  }
}

;// ./src/entities/Gameboard.js


class Gameboard {
  #width;
  #height;
  #board;
  #ships = new Set();

  constructor(width, height) {
    this.#width = width;
    this.#height = height ?? width;
    this.#board = [...Array(this.#height)].map(() =>
      [...Array(this.#width)].map(() => ({ ship: null, hasBeenHit: false })),
    );
  }

  getHeight() {
    return this.#height;
  }

  getWidth() {
    return this.#width;
  }

  getBoard() {
    return JSON.parse(JSON.stringify(this.#board));
  }

  placeShip(origX, origY, size, isHorizontal) {
    const result = this.#validatePosition(origX, origY, size, isHorizontal);
    if (result instanceof Error) {
      return result;
    }

    const ship = new Ship(size);
    this.#ships.add(ship);

    if (isHorizontal) {
      for (let x = origX; x < origX + size; x++) {
        this.#board[origY][x].ship = ship;
      }
    } else {
      for (let y = origY; y < origY + size; y++) {
        this.#board[y][origX].ship = ship;
      }
    }

    return "Success";
  }

  #validatePosition(origX, origY, size, isHorizontal) {
    if (
      (isHorizontal && origX + size > this.#width) ||
      (!isHorizontal && origY + size > this.#height) ||
      origX < 0 ||
      origY < 0
    ) {
      return new Error("Ship placed out of bounds");
    }

    for (let i = 0; i < size; i++) {
      const col = isHorizontal ? origX + i : origX;
      const row = isHorizontal ? origY : origY + i;

      if (this.#board[row][col].ship !== null) {
        return new Error("Ships cannot overlap");
      }
    }
  }

  getCell(x, y) {
    const cell = this.#board[y][x];

    return {
      ship: cell.ship !== null ? this.#getSanitizedShip(cell.ship) : null,
      hasBeenHit: cell.hasBeenHit,
    };
  }

  #getSanitizedShip(ship) {
    return {
      isSunk: ship.isSunk(),
    };
  }

  receiveAttack(x, y) {
    const cell = this.#board[y][x];

    if (cell.hasBeenHit) {
      return false;
    }

    cell.hasBeenHit = true;

    if (cell.ship !== null) {
      cell.ship.hit();
      return "hit";
    } else {
      return "miss";
    }
  }

  allShipsSunk() {
    return [...this.#ships].every((ship) => ship.isSunk());
  }

  static generateRandomBoard(shipSizes, boardWidth, boardHeight) {
    const board = new Gameboard(boardWidth, boardHeight);
    const maxAttempts = 100;

    for (const shipSize of shipSizes) {
      let attempts = 0;
      let placed = false;

      while (!placed && attempts < maxAttempts) {
        attempts++;

        const x = Math.floor(Math.random() * boardWidth);
        const y = Math.floor(Math.random() * boardHeight);
        const isHorizontal = Math.random() < 0.5;

        if (board.placeShip(x, y, shipSize, isHorizontal) === "Success") {
          placed = true;
        }
      }

      // if the ship cannot be placed, generate a new board
      if (!placed) {
        return Gameboard.generateRandomBoard(
          shipSizes,
          boardWidth,
          boardHeight,
        );
      }
    }

    return board;
  }
}

;// ./src/entities/Game.js
class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = player1;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getOpponentPlayer() {
    return this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }

  attack(x, y) {
    return this.getOpponentPlayer().receiveAttack(x, y);
  }

  switchPlayer() {
    if (this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
    } else {
      this.currentPlayer = this.player1;
    }
  }

  get isOver() {
    return this.player1.allShipsSunk() || this.player2.allShipsSunk();
  }

  get winner() {
    if (!this.player1.allShipsSunk() && !this.player2.allShipsSunk()) {
      return null;
    }
    return this.player1.allShipsSunk() ? this.player2 : this.player1;
  }
}

;// ./src/boardRenderer.js


function generateBoard(gameboard, isOpponent = false) {
  const boardElement = createElement("div", "gameboard");

  boardElement.style.gridTemplateColumns = `repeat(${gameboard.getWidth() + 1}, ${50 / (gameboard.getWidth() + 1)}vmin)`;
  boardElement.style.gridTemplateRows = `repeat(${gameboard.getHeight() + 1}, ${50 / (gameboard.getWidth() + 1)}vmin)`;

  // Empty corner cell
  boardElement.appendChild(createElement("div"));

  // Numbers row
  for (let x = 0; x < gameboard.getWidth(); x++) {
    const numberCoord = createElement("div", "coord-cell");
    numberCoord.style.fontSize = `${50 / gameboard.getWidth() - 1}vmin`;
    numberCoord.textContent = x + 1;
    boardElement.appendChild(numberCoord);
  }

  for (let y = 0; y < gameboard.getHeight(); y++) {
    for (let x = 0; x < gameboard.getWidth() + 1; x++) {
      // Letters column
      if (x === 0) {
        const letterCoord = createElement("div", "coord-cell");
        letterCoord.style.fontSize = `${50 / gameboard.getWidth() - 1}vmin`;
        letterCoord.textContent = y + 1;
        boardElement.appendChild(letterCoord);
        continue;
      }

      const cellData = gameboard.getCell(x - 1, y);
      const cell = createElement("div", "cell");
      cell.dataset.x = x - 1;
      cell.dataset.y = y;
      if (cellData.ship !== null) {
        if (isOpponent === false || cellData.hasBeenHit === true) {
          cell.classList.add("ship");
        }
        if (cellData.ship.isSunk) {
          cell.classList.add("sunk");
        }
      }
      if (cellData.hasBeenHit === true) {
        cell.classList.add("hit");
      }

      boardElement.appendChild(cell);
    }
  }

  return boardElement;
}

;// ./src/turnRenderer.js



function generateTurn(currentPlayer, opponent) {
  const container = document.createDocumentFragment();

  const currentPlayerContainer = createElement("div", "player-container");
  const currentPlayerTitle = createElement("h2");
  currentPlayerTitle.innerText = "Your board";
  currentPlayerContainer.appendChild(currentPlayerTitle);

  const currentGameboardContainer = createElement("div", "gameboard-container");
  const currentGameboard = generateBoard(currentPlayer.getGameboard());
  currentGameboardContainer.appendChild(currentGameboard);
  currentPlayerContainer.appendChild(currentGameboardContainer);

  const opponentContainer = createElement(
    "div",
    "player-container",
    "opponent",
  );
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

;// ./src/gameController.js






function initGame(player1, player2) {
  function initTurn() {
    renderBoards(game.getCurrentPlayer(), game.getOpponentPlayer());

    const button = document.querySelector(".continue");
    button.dataset.switchPlayer = "false";
    button.disabled = true;
    button.textContent = "End turn";
    button.scrollIntoView();

    const informationContainer = document.querySelector(
      ".information-container",
    );
    informationContainer.style.display = "grid";

    const opponentBoardContainer = document.querySelector(
      ".opponent .gameboard",
    );
    opponentBoardContainer.addEventListener("click", handleGameboardClick);

    const h1 = document.querySelector(".game h1");
    h1.textContent = game.getCurrentPlayer().getName() + " turn";
  }

  const handleGameboardClick = (event) => {
    const cellElement = event.target;
    if (!cellElement.classList.contains("cell")) {
      return;
    }

    const x = cellElement.dataset.x;
    const y = cellElement.dataset.y;
    const opponent = game.getOpponentPlayer();
    const opponentGameboard = opponent.getGameboard();
    const cell = opponentGameboard.getCell(x, y);
    if (cell.hasBeenHit === false) {
      const attackResult = game.attack(x, y);
      if (attackResult !== false) {
        finishTurn();
      }
    }
  };

  function makeComputerAttack() {
    game.switchPlayer();
    const position = game.getCurrentPlayer().getAttack();
    const result = game.attack(position.x, position.y);
    if (result === "hit") {
      game.getCurrentPlayer().registerHit(position);
    }
    game.switchPlayer();
  }

  function finishTurn() {
    const opponentBoardContainer = document.querySelector(
      ".opponent .gameboard-container",
    );
    opponentBoardContainer.innerHTML = "";
    opponentBoardContainer.appendChild(
      generateBoard(game.getOpponentPlayer().getGameboard(), true),
    );

    opponentBoardContainer.removeEventListener("click", handleGameboardClick);

    if (game.isOver) {
      handleGameEnd();
      return;
    }

    if (game.getOpponentPlayer() instanceof ComputerPlayer) {
      makeComputerAttack();
      if (game.isOver) {
        setTimeout(() => {
          handleGameEnd();
          renderBoards(game.getCurrentPlayer(), game.getOpponentPlayer());
        }, 500);
        return;
      }
      setTimeout(initTurn, 500);
    }

    const button = document.querySelector(".continue");
    button.disabled = false;
  }

  function handleGameEnd() {
    const h1 = document.querySelector(".game h1");
    h1.textContent = "Game over! " + game.winner.getName() + " wins!";
  }

  function renderBoards(playerLeft, playerRight) {
    const gameContainer = document.querySelector(".game-container");
    gameContainer.innerHTML = "";
    gameContainer.appendChild(generateTurn(playerLeft, playerRight));
  }

  function renderGameTemplate() {
    const main = document.querySelector("main");
    main.innerHTML = "";
    main.appendChild(generateGameTemplate());

    const button = document.querySelector(".continue");
    button.addEventListener("click", handleTurnEnd);
    button.dataset.switchPlayer = "true";
    if (game.getOpponentPlayer() instanceof ComputerPlayer) {
      button.style.display = "none";
    }
  }

  function handleTurnEnd(event) {
    const button = event.target;
    const switchPlayer = button.dataset.switchPlayer === "true";
    if (switchPlayer) {
      game.switchPlayer();
      initTurn();
      return;
    }
    showTransitionScreen();
  }

  function showTransitionScreen() {
    const informationContainer = document.querySelector(
      ".information-container",
    );
    informationContainer.style.display = "none";

    const button = document.querySelector(".continue");
    button.dataset.switchPlayer = "true";
    button.textContent = "Start turn";

    const gameContainer = document.querySelector(".game-container");
    gameContainer.innerHTML = "";

    const h1 = document.querySelector(".game h1");
    h1.textContent = "Pass the screen to " + game.getOpponentPlayer().getName();
  }

  function generateGameTemplate() {
    const container = createElement("div", "game");

    const h1 = createElement("h1");
    container.appendChild(h1);

    const gameContainer = createElement("div", "game-container");
    container.appendChild(gameContainer);

    const cellTypes = [
      { classList: ["unknown"], description: "empty / not explored" },
      { classList: ["hit"], description: "miss" },
      { classList: ["hit", "ship"], description: "hit" },
      { classList: ["ship"], description: "ship" },
      { classList: ["ship", "sunk"], description: "sunk" },
    ];
    const informationContainer = createElement("div", "information-container");
    for (let i = 0; i < cellTypes.length; i++) {
      const cellInfo = cellTypes[i];
      const informationRow = createElement("div", "information-row");
      const cell = createElement("div", "cell", ...cellInfo.classList);
      const description = createElement("div", "description");
      description.textContent = cellInfo.description;
      informationRow.appendChild(cell);
      informationRow.appendChild(description);
      informationContainer.appendChild(informationRow);
    }
    container.appendChild(informationContainer);

    const buttonContainer = createElement("div", "botton-container");
    const button = createElement("button", "continue");
    button.innerText = "End turn";
    buttonContainer.appendChild(button);
    container.appendChild(buttonContainer);

    return container;
  }

  const game = new Game(player1, player2);
  renderGameTemplate();
  if (player2 instanceof ComputerPlayer) {
    initTurn();
  } else {
    showTransitionScreen();
  }
}

;// ./src/shipSizes.js
const shipSizes = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];

;// ./src/setupBoardFormRenderer.js



function generateSetupBoardForm(playerName, boardSize) {
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

;// ./src/setupBoardController.js




function initSetupBoard(playerName, boardSize) {
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
    const buttons = document.querySelectorAll(".draggable-place-ship-icon");
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
    const confirmBoardButton = document.querySelector(".submit-board");
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

;// ./src/setupController.js








function initSetup() {
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

    player1 = new Player(player1Input.value, new Gameboard(boardSize));

    if (playAgainstComputerCheckbox.checked) {
      const computerGameboard = Gameboard.generateRandomBoard(
        shipSizes,
        boardSize,
        boardSize,
      );
      player2 = new ComputerPlayer(
        player2Input.value || "Computer",
        computerGameboard,
      );
    } else {
      player2 = new Player(player2Input.value, new Gameboard(boardSize));
    }

    setupBoards();
  }

  function setupBoards() {
    initSetupBoard(player1.getName(), boardSize);

    const submitButton = document.querySelector(".submit-board");
    submitButton.addEventListener("click", () => {
      handlerBoardSubmit(player1);

      if (player2 instanceof ComputerPlayer) {
        initGame(player1, player2);
        return;
      }

      initSetupBoard(player2.getName(), boardSize);
      window.scrollTo(0, 0);
      const submitButton = document.querySelector(".submit-board");
      submitButton.addEventListener("click", () => {
        handlerBoardSubmit(player2);
        initGame(player2, player1);
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

  const boardSize = 10;
  loadContent(generateSetupForm);
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

;// ./src/index.js








initSetup();

/******/ })()
;
//# sourceMappingURL=main.js.map