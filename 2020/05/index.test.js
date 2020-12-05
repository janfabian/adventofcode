const { input: readInput } = require("../../lib/utils");
const fn = require("./index");

test("example 01", () => {
  const input = readInput(__dirname, "./test01");
  expect(fn(input)).toMatchObject({ result: 567 });
});

test("example 02", () => {
  const input = readInput(__dirname, "./test02");
  expect(fn(input)).toMatchObject({ result: 119 });
});

test("example 03", () => {
  const input = readInput(__dirname, "./test03");
  expect(fn(input)).toMatchObject({ result: 820 });
});

test("input", () => {
  const input = readInput(__dirname, "./input");
  expect(fn(input)).toMatchObject({ result: 801, freeSeatIx: 597 });
});
