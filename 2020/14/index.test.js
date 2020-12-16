const { input: readInput } = require("../../lib/utils");
const { first, second } = require("./index");

test("example 01", () => {
  const input = readInput(__dirname, "./test01");
  expect(first(input)).toEqual(BigInt(165));
});

test("example 02", () => {
  const input = readInput(__dirname, "./test02");
  expect(second(input)).toEqual(BigInt(208));
});
