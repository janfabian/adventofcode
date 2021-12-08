const { debug } = require("../../lib/utils");

const intersection = (a, b = new Set()) =>
  new Set([...a].filter((x) => b.has(x)));
const union = (a, b = new Set()) => new Set([...a, ...b]);
const difference = (a, b = new Set()) =>
  new Set([...a].filter((x) => !b.has(x)));
const hasAll = (a, b) => intersection(a, b).size === a.size;

const WIRES_0 = "abcefg";
const WIRES_1 = "cf";
const WIRES_2 = "acdeg";
const WIRES_3 = "acdfg";
const WIRES_4 = "bcdf";
const WIRES_5 = "abdfg";
const WIRES_6 = "abdefg";
const WIRES_7 = "acf";
const WIRES_8 = "abcdefg";
const WIRES_9 = "abcdfg";

const DIGIT_0 = new Set(WIRES_0.split(""));
const DIGIT_1 = new Set(WIRES_1.split(""));
const DIGIT_2 = new Set(WIRES_2.split(""));
const DIGIT_3 = new Set(WIRES_3.split(""));
const DIGIT_4 = new Set(WIRES_4.split(""));
const DIGIT_5 = new Set(WIRES_5.split(""));
const DIGIT_6 = new Set(WIRES_6.split(""));
const DIGIT_7 = new Set(WIRES_7.split(""));
const DIGIT_8 = new Set(WIRES_8.split(""));
const DIGIT_9 = new Set(WIRES_9.split(""));

const NUMBERS = {
  [WIRES_0]: 0,
  [WIRES_1]: 1,
  [WIRES_2]: 2,
  [WIRES_3]: 3,
  [WIRES_4]: 4,
  [WIRES_5]: 5,
  [WIRES_6]: 6,
  [WIRES_7]: 7,
  [WIRES_8]: 8,
  [WIRES_9]: 9,
};

const ALL_DIGITS = [
  DIGIT_0,
  DIGIT_1,
  DIGIT_2,
  DIGIT_3,
  DIGIT_4,
  DIGIT_5,
  DIGIT_6,
  DIGIT_7,
  DIGIT_8,
  DIGIT_9,
];
const UNIQUE_DIGITS = [DIGIT_1, DIGIT_4, DIGIT_7, DIGIT_8];

module.exports.part1 = (input) => {
  const rows = input
    .split("\n")
    .map((row) => row.split(" | ").map((n) => n.split(" ")));

  const result = rows.reduce(
    (total, [, digits]) =>
      digits.filter((d) =>
        UNIQUE_DIGITS.map((ud) => ud.size).includes(d.length)
      ).length + total,
    0
  );

  return result;
};

const parse_unique_signals = (signals) => {
  const signal_map = {};

  const signal_1 = signals.find((signal) => signal.length === DIGIT_1.size);
  const signal_1_set = new Set(signal_1.split(""));

  const signal_4 = signals.find((signal) => signal.length === DIGIT_4.size);
  const signal_4_set = new Set(signal_4.split(""));

  const signal_7 = signals.find((signal) => signal.length === DIGIT_7.size);
  const signal_7_set = new Set(signal_7.split(""));

  const signal_8 = signals.find((signal) => signal.length === DIGIT_8.size);
  const signal_8_set = new Set(signal_8.split(""));

  signal_map["a"] = difference(signal_7_set, signal_1_set);
  signal_map["b"] = difference(signal_4_set, signal_1_set);
  signal_map["c"] = signal_1_set;
  signal_map["d"] = difference(signal_4_set, signal_1_set);
  signal_map["e"] = difference(
    difference(signal_8_set, signal_4_set),
    signal_7_set
  );
  signal_map["f"] = signal_1_set;
  signal_map["g"] = difference(
    difference(signal_8_set, signal_4_set),
    signal_7_set
  );

  return signal_map;
};

const certain_wires = (signal, signal_map) => {
  let result = new Set([]);
  const signal_set = new Set(signal.split(""));

  if (hasAll(signal_map["a"], signal_set)) {
    result = union(result, ["a"]);
  }

  if (
    hasAll(signal_map["b"], signal_set) &&
    hasAll(signal_map["d"], signal_set)
  ) {
    result = union(result, ["b", "d"]);
  }

  if (
    hasAll(signal_map["c"], signal_set) &&
    hasAll(signal_map["f"], signal_set)
  ) {
    result = union(result, ["c", "f"]);
  }

  if (
    hasAll(signal_map["e"], signal_set) &&
    hasAll(signal_map["g"], signal_set)
  ) {
    result = union(result, ["e", "g"]);
  }

  return result;
};

const find_digit = (length, certain_set) => {
  const found = ALL_DIGITS.find(
    (d) => d.size === length && hasAll(certain_set, d)
  );

  if (!found) {
    throw new Error("not found");
  }

  return NUMBERS[[...found].join("")];
};

module.exports.part2 = (input) => {
  const rows = input
    .split("\n")
    .map((row) => row.split(" | ").map((n) => n.split(" ")));

  let result = 0;

  for (const row of rows) {
    const signal_map = parse_unique_signals(row[0]);

    let d = "";
    for (const signal of row[1]) {
      const certain = certain_wires(signal, signal_map);
      d += find_digit(signal.length, certain);
    }

    result += parseInt(d);
  }

  return result;
};
