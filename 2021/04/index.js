const { debug } = require("../../lib/utils");

const BINGO_SIZE = 5;

module.exports = (input, part2 = true) => {
  const numbers = input
    .split("\n")[0]
    .split(",")
    .map((n) => parseInt(n));

  const boards_ix = [];

  const boards = input
    .split("\n\n")
    .splice(1)
    .map((b, b_ix) => {
      boards_ix[b_ix] = [];
      return b.split("\n").map((n, y) => {
        return n
          .trim()
          .split(/\s+/)
          .map((n, x) => {
            boards_ix[b_ix][parseInt(n)] = [x, y, false];
            return parseInt(n);
          });
      });
    });

  const num_of_boards = boards.length;

  const boards_rows = Array(num_of_boards)
    .fill(0)
    .map(() => []);
  const boards_columns = Array(num_of_boards)
    .fill(0)
    .map(() => []);

  let finished_info = null;
  let finished_boards = new Set();
  numbers.forEach((n) => {
    if (finished_info) {
      return;
    }
    boards_ix.forEach((b, b_ix) => {
      if (finished_info) {
        return;
      }
      if (!b[n]) {
        return;
      }

      const [x, y] = b[n];

      boards_rows[b_ix][x] = boards_rows[b_ix][x] || 0;
      boards_rows[b_ix][x]++;
      boards_columns[b_ix][y] = boards_columns[b_ix][y] || 0;
      boards_columns[b_ix][y]++;
      boards_ix[b_ix][n] = [x, y, true];

      if (
        (boards_rows[b_ix][x] === BINGO_SIZE ||
          boards_columns[b_ix][y] === BINGO_SIZE) &&
        !finished_boards.has(b_ix)
      ) {
        if (part2) {
          finished_boards.add(b_ix);
          if (finished_boards.size === num_of_boards) {
            finished_info = [b_ix, n];
          }
        } else {
          finished_info = [b_ix, n];
        }
      }
    });
  });

  const [b_ix, n] = finished_info;

  const sum = boards_ix[b_ix].reduce((t, [, , marked], num) => {
    return t + (marked ? 0 : num);
  }, 0);

  return n * sum;
};
