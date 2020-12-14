const { input: readInput } = require("../../lib/utils");
const { first, second } = require("./index");

test("example 01", () => {
  const input = readInput(__dirname, "./test01");
  expect(first(input)).toEqual(25);
});

test("example 01 second part", () => {
  const input = readInput(__dirname, "./test01");
  expect(second(input)).toEqual(286);
});
