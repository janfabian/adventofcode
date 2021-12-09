const { debug, print_matrix } = require("../../lib/utils");

const calc_diffs = (bottom) => {
  const x_left_diff = Array(bottom.length)
    .fill(0)
    .map(() => []);

  for (let iy = 0; iy < bottom.length; iy++) {
    for (let ix = 0; ix < bottom[0].length; ix++) {
      x_left_diff[iy][ix] =
        ix - 1 >= 0 ? bottom[iy][ix - 1] - bottom[iy][ix] : 1;
    }
  }

  const x_right_diff = Array(bottom.length)
    .fill(0)
    .map(() => []);

  for (let iy = bottom.length - 1; iy >= 0; iy--) {
    for (let ix = 0; ix < bottom[0].length; ix++) {
      x_right_diff[iy][ix] =
        ix + 1 < bottom[0].length ? bottom[iy][ix + 1] - bottom[iy][ix] : 1;
    }
  }

  const y_down_diff = Array(bottom.length)
    .fill(0)
    .map(() => []);

  for (let iy = bottom.length - 1; iy >= 0; iy--) {
    for (let ix = 0; ix < bottom[0].length; ix++) {
      y_down_diff[iy][ix] =
        iy + 1 < bottom.length ? bottom[iy + 1][ix] - bottom[iy][ix] : 1;
    }
  }

  const y_up_diff = Array(bottom.length)
    .fill(0)
    .map(() => []);

  for (let iy = 0; iy < bottom.length; iy++) {
    for (let ix = 0; ix < bottom[0].length; ix++) {
      y_up_diff[iy][ix] = iy - 1 >= 0 ? bottom[iy - 1][ix] - bottom[iy][ix] : 1;
    }
  }

  return [x_left_diff, x_right_diff, y_down_diff, y_up_diff];
};

const find_lows = (
  bottom,
  x_left_diff,
  x_right_diff,
  y_down_diff,
  y_up_diff
) => {
  const lows = [];

  bottom.forEach((row, iy) =>
    row.forEach((v, ix) => {
      if (
        x_left_diff[iy][ix] > 0 &&
        x_right_diff[iy][ix] > 0 &&
        y_down_diff[iy][ix] > 0 &&
        y_up_diff[iy][ix] > 0
      ) {
        lows.push([iy, ix]);
      }
    })
  );

  return lows;
};

module.exports.part1 = (input) => {
  const bottom = input
    .split("\n")
    .map((row) => row.split("").map((n) => parseInt(n)));

  const [x_left_diff, x_right_diff, y_down_diff, y_up_diff] = calc_diffs(
    bottom
  );

  const lows = find_lows(
    bottom,
    x_left_diff,
    x_right_diff,
    y_down_diff,
    y_up_diff
  );

  return lows.reduce((t, [iy, ix]) => (t += bottom[iy][ix] + 1), 0);
};

const BASIN_LIMIT = 9;
const BASIN_COUNT = 3;

const i_key = (iy, ix) => `${iy}_${ix}`;
const crawl_basin = ([start_iy, start_ix], bottom) => {
  const visited = new Set();
  const toVisit = [[start_iy, start_ix]];

  const optionally_add_tovisit = (iy, ix) => {
    if (
      !visited.has(i_key(iy, ix)) &&
      bottom[iy] != null &&
      bottom[iy][ix] != null &&
      bottom[iy][ix] < BASIN_LIMIT
    ) {
      toVisit.push([iy, ix]);
    }
  };

  while (toVisit.length > 0) {
    const [iy, ix] = toVisit.pop();

    optionally_add_tovisit(iy - 1, ix);
    optionally_add_tovisit(iy + 1, ix);
    optionally_add_tovisit(iy, ix - 1);
    optionally_add_tovisit(iy, ix + 1);

    visited.add(i_key(iy, ix));
  }

  return visited.size;
};

module.exports.part2 = (input) => {
  const bottom = input
    .split("\n")
    .map((row) => row.split("").map((n) => parseInt(n)));

  const [x_left_diff, x_right_diff, y_down_diff, y_up_diff] = calc_diffs(
    bottom
  );

  const lows = find_lows(
    bottom,
    x_left_diff,
    x_right_diff,
    y_down_diff,
    y_up_diff
  );

  return lows
    .map((l) => crawl_basin(l, bottom))
    .sort((a, b) => {
      return b - a;
    })
    .slice(0, BASIN_COUNT)
    .reduce((t, n) => t * n, 1);
};
