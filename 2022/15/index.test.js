const { input: readInput } = require("../../lib/utils");
const fn = require("./index");

test("example 01 part1", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn.part1(input, 10)).toStrictEqual(26);
});

test("example 01 part2", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn.part2(input, 20)).toStrictEqual(56000011n);
});
