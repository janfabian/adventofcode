const { input: readInput } = require("../../lib/utils");
const fn = require("./index");

test("example 01 part1", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn.part1(input)).toBe(10);
});

test("example 02 part1", () => {
  const input = readInput(__dirname, "./test02");
  expect(fn.part1(input)).toBe(19);
});

test("example 03 part1", () => {
  const input = readInput(__dirname, "./test03");
  expect(fn.part1(input)).toBe(226);
});

test("example 01 part2", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn.part2(input)).toBe(36);
});

test("example 02 part2", () => {
  const input = readInput(__dirname, "./test02");
  expect(fn.part2(input)).toBe(103);
});

test("example 03 part2", () => {
  const input = readInput(__dirname, "./test03");
  expect(fn.part2(input)).toBe(3509);
});
