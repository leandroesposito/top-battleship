import Ship from "./Ship.js";

test("Ship exists", () => {
  const ship = new Ship();
  expect(ship).toBeDefined();
});

test("Ship size", () => {
  expect(new Ship(3)).toBeDefined();
  expect(new Ship(10)).toBeDefined();
  expect(new Ship(200)).toBeDefined();
  expect(() => new Ship(0)).toThrow();
  expect(() => new Ship(-1)).toThrow();
});

test("Ship get sunk", () => {
  const ship = new Ship(3);
  ship.hit();
  expect(ship.isSunk()).toBeFalsy();
  ship.hit();
  expect(ship.isSunk()).toBeFalsy();
  ship.hit();
  expect(ship.isSunk()).toBeTruthy();
});
