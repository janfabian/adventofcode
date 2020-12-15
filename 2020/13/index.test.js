const { input: readInput } = require("../../lib/utils");
const { first, second } = require("./index");

test("example 01", () => {
  const input = readInput(__dirname, "./test01");
  expect(first(input)).toEqual(295);
});

test("example 01", () => {
  const input = readInput(__dirname, "./test01");
  expect(second(input)).toEqual(1068781n);
});

test("example 02", () => {
  const input = readInput(__dirname, "./test02");
  expect(second(input)).toEqual(1202161486n);
});
