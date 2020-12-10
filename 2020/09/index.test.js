const { input: readInput } = require("../../lib/utils");
const fn = require("./index");

test("example 01", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn(input, 5)).toEqual([127, 62]);
});
