const { input: readInput } = require("../../lib/utils");
const { first } = require("./index");

test("example 01", () => {
  const input = readInput(__dirname, "./test01");
  expect(first(input)).toEqual(112);
});
