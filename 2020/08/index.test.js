const { input: readInput } = require("../../lib/utils");
const { run, repairAndRun } = require("./index");

test("example 01", () => {
  const input = readInput(__dirname, "./test01");
  expect(run(input)).toEqual(5);
});

test("example 02", () => {
  const input = readInput(__dirname, "./test01");
  expect(repairAndRun(input)).toEqual(8);
});
