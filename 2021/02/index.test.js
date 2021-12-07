const { input: readInput } = require("../../lib/utils");
const fn = require("./index");

test("example 01 part1", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn.part1(input)).toBe(150);
});

test("example 01 part1", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn.part2(input)).toBe(900);
});
