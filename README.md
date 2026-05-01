# Battleship Game - TDD & OOP

A complete implementation of the classic Battleship board game with Test-Driven Development (TDD), Object-Oriented Programming principles, Algorithm design principles and a full Webpack build system demonstrating professional JavaScript development practices.

## Learning Objectives

This project was specifically designed to demonstrate and practice:

- **Test-Driven Development (TDD)** - Writing tests before implementation
- **Object-Oriented Programming** - Classes, encapsulation, and composition
- **ES6 Modules** - Modular code organization
- **Webpack** - Modern build tooling for development and production
- **Jest Testing** - Unit testing with mocks and assertions
- **Computer AI** - Implementing intelligent game logic
- **Algorithm design** - Random placement of elements inside a grid

## Live Demo

[View Live Demo](https://leandroesposito.github.io/top-battleship/)

## Test-Driven Development (TDD)

### What is TDD?

Test-Driven Development is a software development process where you write tests **before** writing the actual code. The workflow follows the **Red-Green-Refactor** cycle:

```
RED     → Write a failing test
GREEN   → Write minimal code to make it pass
REFACTOR→ Improve code while keeping tests green
```

### TDD Workflow in This Project

#### Example: Implementing the Ship Class

**Step 1: RED - Write a Failing Test**

```javascript
// Ship.test.js
import Ship from "./Ship.js";

test("Ship tracks hits correctly", () => {
  const ship = new Ship(3);

  expect(ship.isSunk()).toBe(false); // New ship not sunk

  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(false); // 2 hits on size 3 ship

  ship.hit();
  expect(ship.isSunk()).toBe(true); // 3 hits = sunk!
});
```

**Step 2: GREEN - Write Minimal Code**

```javascript
// Ship.js
export default class Ship {
  constructor(size) {
    this.size = size;
    this.hits = 0;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits === this.size;
  }
}
```

**Step 3: REFACTOR - Improve Code (Keep Tests Green)**

```javascript
// Ship.js - Refactored with private fields
export default class Ship {
  #size;
  #hits;

  constructor(size) {
    if (size <= 0) throw new Error("Invalid ship size");
    this.#size = size;
    this.#hits = 0;
  }

  hit() {
    if (this.#hits < this.#size) this.#hits++;
  }

  isSunk() {
    return this.#hits === this.#size;
  }
}
```

## Testing Patterns

### Unit Testing Example

```javascript
// Gameboard.test.js
describe("Gameboard place ship", () => {
  test("Gameboard ship is placed horizontally", () => {
    const gameboard = new Gameboard(10);
    gameboard.placeShip(2, 2, 3, true);

    expect(gameboard.getCell(2, 2).ship).not.toBeNull();
    expect(gameboard.getCell(3, 2).ship).not.toBeNull();
    expect(gameboard.getCell(4, 2).ship).not.toBeNull();
    expect(gameboard.getCell(1, 2).ship).toBeNull(); // Left boundary
  });

  test("Ships cannot overlap", () => {
    const gameboard = new Gameboard(10);
    gameboard.placeShip(0, 0, 3, true);
    const result = gameboard.placeShip(0, 0, 3, true);

    expect(result instanceof Error).toBeTruthy();
    expect(result.message).toBe("Ships cannot overlap");
  });
});
```

### Mocking DOM Events

```javascript
// Example of testing drag and drop functionality
test("Ship placement via drag and drop", () => {
  const cell = document.querySelector('[data-x="2"][data-y="2"]');
  const dragStartEvent = new DragEvent("dragstart", { target: draggableIcon });
  const dropEvent = new DragEvent("drop", { target: cell });

  draggableIcon.dispatchEvent(dragStartEvent);
  cell.dispatchEvent(dropEvent);

  expect(xCoordInput.value).toBe("3"); // x+1 (1-indexed)
});
```

### Test Suite Structure

The project includes comprehensive test suites for each entity:

```javascript
// Ship.test.js - Complete test coverage
test("Ship exists", () => { ... });
test("Ship size validation", () => { ... });
test("Ship hit tracking", () => { ... });
test("Ship sink detection", () => { ... });

// Gameboard.test.js - Board logic tests
describe("Gameboard place ship", () => { ... });
describe("Gameboard receiveAttack", () => { ... });
describe("Gameboard all ships sunk", () => { ... });

// Player.test.js - Player entity tests
test("Player receive attack", () => { ... });
test("Player place ship", () => { ... });

// ComputerPlayer.test.js - AI logic tests
test("ComputerPlayer random attacks", () => { ... });
test("ComputerPlayer neighbor targeting", () => { ... });
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- Ship.test.js
```

## Project Architecture

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Game                                │
│  - player1: Player                                          │
│  - player2: Player                                          │
│  - currentPlayer: Player                                    │
│  + attack(x, y): string                                     │
│  + switchPlayer(): void                                     │
│  + winner: Player                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Player                              │
│  - #name: string                                            │
│  - #gameboard: Gameboard                                    │
│  + getName(): string                                        │
│  + receiveAttack(x, y): string                              │
│  + placeShip(x, y, size, horiz): Error|"Success"            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Gameboard                            │
│  - #width: number                                           │
│  - #height: number                                          │
│  - #board: Cell[][]                                         │
│  - #ships: Set<Ship>                                        │
│  + placeShip(x, y, size, horiz): Error|"Success"            │
│  + receiveAttack(x, y): "hit"|"miss"|false                  │
│  + allShipsSunk(): boolean                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                          Ship                               │
│  - #size: number                                            │
│  - #hits: number                                            │
│  + hit(): void                                              │
│  + isSunk(): boolean                                        │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────────────────────────────────────┐
│                     ComputerPlayer                          │
│  - #attacksGameboard: Set                                   │
│  - #hitsStack: Array                                        │
│  + getAttack(): {x, y}                                      │
│  + getRandomAttack(): {x, y}                                │
│  + registerHit(position): void                              │
│  + getValidNeighbor(position): {x, y}|false                 │
└─────────────────────────────────────────────────────────────┘
```

## Class Details

### Ship Class

```javascript
export default class Ship {
  #size;  // Length of ship (1-4)
  #hits;  // Number of hits received

  constructor(size) { ... }
  hit() { ... }           // Register a hit
  isSunk() { ... }        // Check if fully hit
}
```

### Gameboard Class

```javascript
export default class Gameboard {
  #width;     // Board width (10)
  #height;    // Board height (10)
  #board;     // 2D array of cells
  #ships;     // Set of placed ships

  placeShip(x, y, size, isHorizontal)  // Place ship on board
  receiveAttack(x, y)                  // Process attack
  allShipsSunk()                       // Check win condition
  getCell(x, y)                        // Get sanitized cell data
}
```

### Player Class

```javascript
export default class Player {
  #name;        // Player's display name
  #gameboard;   // Their game board

  getName() { ... }
  receiveAttack(x, y) { ... }
  placeShip(x, y, size, isHorizontal) { ... }
  allShipsSunk() { ... }
}
```

### Game Controller Class

```javascript
export default class Game {
  player1;         // First player
  player2;         // Second player
  currentPlayer;   // Whose turn it is

  attack(x, y) { ... }              // Current player attacks
  switchPlayer() { ... }            // Change turns
  get isOver() { ... }              // Check if game ended
  get winner() { ... }              // Determine winner
}
```

## Game Flow

```
1. Setup Phase
   ├── Player names input
   ├── PvP or vs Computer selection
   └── Ship placement (drag & drop or coordinates)

2. Game Loop (until winner)
   ├── Current player selects target cell
   ├── Attack result (hit/miss)
   ├── Check for ship sunk / game over
   └── Switch players (manual or automatic)

3. End Game
   └── Display winner message
```

## OOP Principles Demonstrated

### 1. Encapsulation (Private Fields)

```javascript
// Ship.js - Private fields using # syntax
export default class Ship {
  #size;    // Cannot be accessed from outside
  #hits;    // Truly private, not just convention

  constructor(size) {
    this.#size = size;
    this.#hits = 0;
  }

  get isSunk() {
    return this.#hits === this.#size;
  }
}

// Gameboard.js - Encapsulated board state
export default class Gameboard {
  #board;           // Private board array
  #ships = new Set(); // Private ship collection

  getBoard() {
    return JSON.parse(JSON.stringify(this.#board)); // Return deep copy
  }

  getCell(x, y) {
    // Return sanitized data, not raw reference
    return {
      ship: cell.ship !== null ? { isSunk: cell.ship.isSunk() } : null,
      hasBeenHit: cell.hasBeenHit
    };
  }
}
```

### 2. Composition over Inheritance

```javascript
// Player has-a Gameboard (composition)
export default class Player {
  #gameboard;  // Player COMPOSES a Gameboard

  receiveAttack(x, y) {
    return this.#gameboard.receiveAttack(x, y);
  }
}

// Game has two Players (composition)
export default class Game {
  constructor(player1, player2) {
    this.player1 = player1;  // Game COMPOSES Players
    this.player2 = player2;
  }
}
```

### 3. Polymorphism

```javascript
// ComputerPlayer extends Player with same interface
export default class ComputerPlayer extends Player {
  getAttack() { ... }  // Different implementation from Player
  registerHit() { ... } // Additional behavior
}

// Game treats Player and ComputerPlayer identically
const player = game.getCurrentPlayer();
const attack = player.getAttack(); // Works for both!
```

### 4. Factory Methods (Static Methods)

```javascript
// Gameboard.js - Static factory method for random board generation
static generateRandomBoard(shipSizes, boardWidth, boardHeight) {
  const board = new Gameboard(boardWidth, boardHeight);
  // Randomly place ships until valid board found
  return board;
}

// Usage
const computerBoard = Gameboard.generateRandomBoard(shipSizes, 10, 10);
```

## Random Board Generation Algorithm

### `Gameboard.generateRandomBoard()` - A Randomized Placement Algorithm

The `generateRandomBoard` method demonstrates several important algorithm design patterns: **randomized algorithms**, **backtracking**, and **heuristic search**.

```javascript
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

    // Backtracking: If ship cannot be placed, restart from scratch
    if (!placed) {
      return Gameboard.generateRandomBoard(shipSizes, boardWidth, boardHeight);
    }
  }

  return board;
}
```

### Algorithm Breakdown

#### 1. Randomized Placement

```javascript
// Each placement attempt uses random coordinates and orientation
const x = Math.floor(Math.random() * boardWidth); // Random X (0-9)
const y = Math.floor(Math.random() * boardHeight); // Random Y (0-9)
const isHorizontal = Math.random() < 0.5; // 50% chance horizontal
```

**Why randomization?**

- No bias toward certain board positions
- Creates unpredictable and varied layouts
- Simple to implement and understand

#### 2. Attempt Limiting with Heuristic

```javascript
const maxAttempts = 100;
while (!placed && attempts < maxAttempts) {
  // Try to place ship...
}
```

**Why 100 attempts?**

- Probability of finding valid placement is high within 100 tries
- Prevents infinite loops on crowded boards
- Empirically determined sweet spot (performance vs success rate)

#### 3. Recursive Backtracking

```javascript
if (!placed) {
  // Failed to place current ship - restart entire process!
  return Gameboard.generateRandomBoard(shipSizes, boardWidth, boardHeight);
}
```

**Why restart from scratch?**

- Earlier ship placements may block later ships
- Restarting gives fresh chance at valid configuration
- Simpler than implementing complex backtracking state management

### Complexity Analysis

| Metric                  | Complexity   | Explanation                                          |
| ----------------------- | ------------ | ---------------------------------------------------- |
| **Time (Best Case)**    | O(n × m)     | All ships placed on first attempt                    |
| **Time (Average Case)** | O(n × m × a) | Where a = average attempts per ship (~10-50)         |
| **Time (Worst Case)**   | O(∞)         | Theoretical, but maxAttempts prevents infinite loops |
| **Space**               | O(1)         | Only stores board state, no extra recursion stack    |

### Algorithm Strengths & Weaknesses

| Strength                        | Weakness                                       |
| ------------------------------- | ---------------------------------------------- |
| ✅ Always produces valid boards | ❌ May take multiple attempts for dense boards |
| ✅ No positional bias           | ❌ Recursive restart can be inefficient        |
| ✅ Simple to understand         | ❌ Not guaranteed to find solution if exists   |
| ✅ Easy to modify               | ❌ No optimization for specific distributions  |

### Real-World Applications

Similar algorithms are used in:

- **Procedural Content Generation** (game level design)
- **Packing Problems** (container loading, warehouse layout)
- **Circuit Board Design** (component placement)
- **Scheduling Algorithms** (resource allocation)

## Computer AI Logic

The ComputerPlayer implements smart targeting:

```javascript
export default class ComputerPlayer extends Player {
  #attacksGameboard = new Set(); // Track untargeted cells
  #hitsStack = []; // Track successful hits

  getAttack() {
    // First, try to sink ships by targeting neighbors of hits
    while (this.#hitsStack.length > 0) {
      const lastHit = this.#hitsStack[this.#hitsStack.length - 1];
      const newPosition = this.getValidNeighbor(lastHit);
      if (newPosition) {
        this.#attacksGameboard.delete(JSON.stringify(newPosition));
        return newPosition;
      }
      this.#hitsStack.pop(); // No neighbors left, backtrack
    }

    // No pending hits, choose random attack
    return this.getRandomAttack();
  }

  getValidNeighbor({ x, y }) {
    const positions = [
      { x, y: y - 1 }, // up
      { x: x + 1, y }, // right
      { x, y: y + 1 }, // down
      { x: x - 1, y }, // left
    ];

    return (
      positions.find((pos) =>
        this.#attacksGameboard.has(JSON.stringify(pos)),
      ) || false
    );
  }
}
```

**AI Strategy:**

1. **Phase 1 (Hunt Mode)** - Random attacks until first hit
2. **Phase 2 (Target Mode)** - Attack adjacent cells after hit
3. **Phase 3 (Sink Mode)** - Track hits and continue line until sunk
4. **Backtracking** - If line ends, try other directions

## Webpack Configuration

### Development vs Production

| Feature              | Development                     | Production                             |
| -------------------- | ------------------------------- | -------------------------------------- |
| **Mode**             | `development`                   | `production`                           |
| **Source Maps**      | `eval-source-map`               | `source-map`                           |
| **CSS Processing**   | `style-loader` (injects to DOM) | `MiniCssExtractPlugin` (separate file) |
| **CSS Minification** | No                              | `CssMinimizerPlugin`                   |
| **Hot Reload**       | Yes (devServer)                 | No                                     |

### npm Scripts

```json
{
  "scripts": {
    "start": "webpack serve --config webpack.dev.js", // Development server
    "build": "webpack --config webpack.prod.js", // Production build
    "deploy": "git subtree push --prefix dist origin gh-pages", // Deploy
    "test": "jest" // Run tests
  }
}
```

## UI Features

- **Drag & Drop Ship Placement** - Visual ship positioning
- **Responsive Grid** - Dynamic sizing with CSS Grid
- **Visual Feedback** - Hit/miss/sunk visual indicators
- **Turn Management** - Clear turn indicators
- **Computer AI** - Smart computer opponent
- **Game Information Panel** - Legend for cell types

## File Structure Summary

```
src/
├── entities/           # Core game logic (OOP)
│   ├── Ship.js         # Ship entity
│   ├── Gameboard.js    # Board management
│   ├── Player.js       # Player entity
│   ├── ComputerPlayer.js # AI opponent
│   └── Game.js         # Game controller
├── index.js            # Entry point
├── setupController.js  # Game setup flow
├── gameController.js   # Main game flow
├── boardRenderer.js    # Board visualization
├── turnRenderer.js     # Turn display
└── styles/             # CSS modules
```

## Key Takeaways

### TDD Benefits

- **Confidence** - Can refactor without fear of breaking
- **Documentation** - Tests describe expected behavior
- **Design** - Forces thinking about interfaces first
- **Regression Prevention** - Catches bugs early

### OOP Principles Applied

- **Encapsulation** - Private fields protect internal state
- **Composition** - Game contains Players, Players contain Gameboards
- **Polymorphism** - ComputerPlayer extends Player with same interface
- **Abstraction** - Complex logic hidden behind simple methods

### Algorithm Design Principles Applied

- **Randomized Algorithms** - Uses random coordinates and orientation instead of deterministic placement patterns
- **Las Vegas Approach** - Always produces a valid board (never incorrect), but runtime varies based on random chance
- **Backtracking by Restart** - When placement fails, recursively restarts from scratch instead of complex state unwinding
- **Heuristic Limiting** - `maxAttempts = 100` provides a practical stopping condition balancing success rate and performance

### Best Practices

- **Single Responsibility** - Each class has one job
- **Dependency Injection** - Game receives Players, doesn't create them
- **Immutability** - Methods return copies instead of references
- **Error Handling** - Validation with meaningful error messages
