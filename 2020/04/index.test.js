const { input: readInput } = require("../../lib/utils");
const fn = require("./index");

test("example 01", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn(input)).toBe(2);
});

test("example 02", () => {
  const input = readInput(__dirname, "./test02");
  expect(fn(input)).toBe(0);
});

test("example 03", () => {
  const input = readInput(__dirname, "./test03");
  expect(fn(input)).toBe(4);
});
