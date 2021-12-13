const { print_matrix } = require("../../lib/utils");

const fold = ([orig_x, orig_y], folds) => {
  return folds.reduce(
    ([x, y], [fx, fy]) => {
      if (fx) {
        if (x < fx) {
          return [x, y];
        } else {
          return [fx * 2 - x, y];
        }
      }

      if (fy) {
        if (y < fy) {
          return [x, y];
        } else {
          return [x, fy * 2 - y];
        }
      }

      return [x, y];
    },
    [orig_x, orig_y]
  );
};

const print_folded = (folded_points, folds) => {
  const max_x = [...folds].reverse().find(([x]) => x != null)[0];
  const max_y = [...folds].reverse().find(([, y]) => y != null)[1];

  const init_matrix = Array(max_y)
    .fill(0)
    .map(() => Array(max_x).fill("."));

  folded_points.reduce((matrix, [x, y]) => {
    matrix[y] = matrix[y] || [];
    matrix[y][x] = "#";
    return matrix;
  }, init_matrix);

  console.log(print_matrix(init_matrix, 2));
};

module.exports = (input, part2 = true) => {
  let [points, folds] = input.split("\n\n");

  points = points
    .split("\n")
    .map((row) => row.split(",").map((n) => parseInt(n)));
  folds = folds
    .split("\n")
    .slice(0, part2 ? undefined : 1)
    .map((line) => {
      if (line.indexOf("y=") > -1) {
        return [null, parseInt(line.substring(line.indexOf("y=") + 2))];
      } else if (line.indexOf("x=") > -1) {
        return [parseInt(line.substring(line.indexOf("x=") + 2)), null];
      }
    })
    .filter(Boolean);

  const set_key = (x, y) => `${x}_${y}`;
  const [, folded_points] = points
    .map((point) => fold(point, folds))
    .reduce(
      ([set, arr], [x, y]) => {
        if (!set.has(set_key(x, y))) {
          arr.push([x, y]);
        }
        set.add(set_key(x, y));
        return [set, arr];
      },
      [new Set(), []]
    );

  if (part2) {
    print_folded(folded_points, folds);
  }

  return folded_points.length;
};
