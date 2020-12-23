const { input: readInput } = require("../../lib/utils");
const { first, second } = require("./index");

test("example 01", () => {
  const input = readInput(__dirname, "./test01");
  expect(first(input)[0]).toEqual(20899048083289);
});

test("example 01", () => {
  const input = readInput(__dirname, "./test01");
  expect(second(input)).toEqual(273);
});
