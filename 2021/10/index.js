const CORRUPTED_POINTS = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const MISSING_POINTS = {
  "(": 1,
  "[": 2,
  "{": 3,
  "<": 4,
};

const corrupted_row_symbol = (row) =>
  row.split("").reduce(
    ([queue, first_corrupted_symbol], s) => {
      if (s === ")" && queue.pop() !== "(") {
        return [queue, first_corrupted_symbol || ")"];
      }
      if (s === "]" && queue.pop() !== "[") {
        return [queue, first_corrupted_symbol || "]"];
      }
      if (s === "}" && queue.pop() !== "{") {
        return [queue, first_corrupted_symbol || "}"];
      }
      if (s === ">" && queue.pop() !== "<") {
        return [queue, first_corrupted_symbol || ">"];
      }

      if (["(", "{", "[", "<"].includes(s)) {
        queue.push(s);
      }

      return [queue, first_corrupted_symbol];
    },
    [[], null]
  );

module.exports.part1 = (input) => {
  return input
    .split("\n")
    .map(corrupted_row_symbol)
    .map(([, s]) => s)
    .filter(Boolean)
    .reduce((t, s) => t + CORRUPTED_POINTS[s], 0);
};

module.exports.part2 = (input) => {
  const rows = input
    .split("\n")
    .map(corrupted_row_symbol)
    .filter(([, s]) => !s)
    .map(([queue]) =>
      queue
        .reverse()
        .reduce((t, s) => t * BigInt(5) + BigInt(MISSING_POINTS[s]), BigInt(0))
    )
    .sort((a, b) => {
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    });

  return rows[Math.floor(rows.length / 2)];
};
