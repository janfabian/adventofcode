const { input: readInput } = require("../../lib/utils");
const fn = require("./index");

test("example 01 part1", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn.part1(input)).toBe(0);
});

test("example 02 part1", () => {
  const input = readInput(__dirname, "./test02");
  expect(fn.part1(input)).toBe(26);
});

test("example 01 part2", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn.part2(input)).toBe(5353);
});

test("example 02 part2", () => {
  const input = readInput(__dirname, "./test02");
  expect(fn.part2(input)).toBe(61229);
});
