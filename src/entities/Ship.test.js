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
  const sizes = [1, 2, 3, 4, 5];
  sizes.forEach((size) => {
    const ship = new Ship(size);
    expect(ship.isSunk()).toBeFalsy();
    for (let i = 0; i < size; i++) {
      ship.hit();
      if (i === size - 1) {
        expect(ship.isSunk()).toBeTruthy();
      } else {
        expect(ship.isSunk()).toBeFalsy();
      }
    }
  });
});
