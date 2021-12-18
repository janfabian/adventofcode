const { input: readInput } = require("../../lib/utils");
const fn = require("./index");

test("example 01 part2", () => {
  expect(fn("C200B40A82")).toBe(BigInt(3));
});

test("example 02 part2", () => {
  expect(fn("04005AC33890")).toBe(BigInt(54));
});

test("example 03 part2", () => {
  expect(fn("880086C3E88112")).toBe(BigInt(7));
});

test("example 04 part2", () => {
  expect(fn("CE00C43D881120")).toBe(BigInt(9));
});

test("example 05 part2", () => {
  expect(fn("D8005AC2A8F0")).toBe(BigInt(1));
});

test("example 06 part2", () => {
  expect(fn("F600BC2D8F")).toBe(BigInt(0));
});

test("example 07 part2", () => {
  expect(fn("9C005AC2F8F0")).toBe(BigInt(0));
});

test("example 08 part2", () => {
  expect(fn("9C0141080250320F1802104A08")).toBe(BigInt(1));
});
