const { input: readInput } = require("../../lib/utils");
const fn = require("./index");

test("example 01 part1", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn.part1(input)).toStrictEqual(24);
});

test("example 02 part1", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn.part2(input)).toStrictEqual(93);
});
