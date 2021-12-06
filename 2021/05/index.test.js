const { input: readInput } = require("../../lib/utils");
const fn = require("./index");

test("example 01 part1", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn(input, false)).toBe(5);
});

test("example 01 part2", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn(input, true)).toBe(12);
});
