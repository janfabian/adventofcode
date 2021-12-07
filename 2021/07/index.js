const { debug } = require("../../lib/utils");

module.exports = (input, part2 = true) => {
  const crabs = input.split(",").map((n) => parseInt(n));

  let max = 0;
  let min = Infinity;
  let crabs_pos = [];

  crabs.forEach((c) => {
    max = Math.max(max, c);
    min = Math.min(min, c);
    crabs_pos[c] = crabs_pos[c] || 0;
    crabs_pos[c]++;
  });

  let result = Infinity;

  for (let ix = min; ix <= max; ix++) {
    let x = 0;
    crabs_pos.forEach((n, position) => {
      if (part2) {
        const min_ix_pos = Math.min(ix, position);
        const ix_m = ix - min_ix_pos;
        const position_m = position - min_ix_pos;

        x += n * (((ix_m + position_m) * (Math.abs(position - ix) + 1)) / 2);
      } else {
        x += n * Math.abs(position - ix);
      }
    });
    result = Math.min(result, x);
  }

  return result;
};
