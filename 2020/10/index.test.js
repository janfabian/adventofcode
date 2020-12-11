const { input: readInput } = require("../../lib/utils");
const fn = require("./index");

test("example 01", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn(input)).toEqual([35, 8]);
});

test("example 02", () => {
  const input = readInput(__dirname, "./test02");
  expect(fn(input)).toEqual([220, 19208]);
});
