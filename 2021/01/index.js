const { debug } = require("../../lib/utils");

module.exports.part1 = (input) => {
  const result = input
    .split("\n")
    .map((n) => parseInt(n))
    .reduce(
      (total, current, ix, a) => total + (current > a[ix - 1] ? 1 : 0),
      0
    );

  return result;
};

const WINDOW_SIZE = 3;

module.exports.part2 = (input) => {
  const result = input
    .split("\n")
    .map((n) => parseInt(n))
    .reduce((total, current, ix, a) => {
      if (ix < WINDOW_SIZE) {
        return 0;
      }

      const w1 = a.slice(ix - WINDOW_SIZE, ix);
      const w2 = a.slice(ix - WINDOW_SIZE + 1, ix + 1);

      const w1s = w1.reduce((t, n) => t + n, 0);
      const w2s = w2.reduce((t, n) => t + n, 0);

      return total + (w2s > w1s ? 1 : 0);
    }, 0);

  return result;
};
