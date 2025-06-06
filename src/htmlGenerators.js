export function createElement(type, ...classNames) {
  const element = document.createElement(type);
  element.classList.add(...classNames);
  return element;
}

export function createShipPlacer(shipSize, boardSize) {
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

export function createOption(value, text) {
  const option = createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

export function createLabelWithInput(
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
