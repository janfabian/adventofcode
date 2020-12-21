const { input: readInput } = require("../../lib/utils");
const { first, second } = require("./index");

test("example 01", () => {
  const input = "1 + 2 * 3 + 4 * 5 + 6";
  expect(first(input)).toEqual(BigInt(71));
});

test("example 02", () => {
  const input = "1 + (2 * 3) + (4 * (5 + 6))";
  expect(first(input)).toEqual(BigInt(51));
});

test("example 03", () => {
  const input = "2 * 3 + (4 * 5)";
  expect(first(input)).toEqual(BigInt(26));
});

test("example 04", () => {
  const input = "5 + (8 * 3 + 9 + 3 * 4 * 3)";
  expect(first(input)).toEqual(BigInt(437));
});

test("example 05", () => {
  const input = "5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))";
  expect(first(input)).toEqual(BigInt(12240));
});

test("example 06", () => {
  const input = "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2";
  expect(first(input)).toEqual(BigInt(13632));
});

test("example second 01", () => {
  const input = "1 + 2 * 3 + 4 * 5 + 6";
  expect(second(input)).toEqual(BigInt(231));
});

test("example second 02", () => {
  const input = "1 + (2 * 3) + (4 * (5 + 6))";
  expect(second(input)).toEqual(BigInt(51));
});

test("example second 03", () => {
  const input = "2 * 3 + (4 * 5)";
  expect(second(input)).toEqual(BigInt(46));
});

test("example second 04", () => {
  const input = "5 + (8 * 3 + 9 + 3 * 4 * 3)";
  expect(second(input)).toEqual(BigInt(1445));
});

test("example second 05", () => {
  const input = "5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))";
  expect(second(input)).toEqual(BigInt(669060));
});

test("example second 06", () => {
  const input = "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2";
  expect(second(input)).toEqual(BigInt(23340));
});
