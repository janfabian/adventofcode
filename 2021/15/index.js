const to_id = ([x, y]) => `${x}_${y}`;
const from_id = (s) => s.split("_").map((n) => parseInt(n));
const LARGER = 5;

module.exports = (input, part2 = true) => {
  let cave = input
    .split("\n")
    .map((row) => row.split("").map((n) => parseInt(n)));
  let height = cave.length;
  let width = cave[0].length;

  if (part2) {
    for (let ly = 0; ly < LARGER; ly++) {
      for (let lx = 0; lx < LARGER; lx++) {
        for (let y = 0; y < height; y++) {
          cave[y + ly * height] = cave[y + ly * height] || [];
          for (let x = 0; x < width; x++) {
            const addition = cave[y][x] + ly + lx;
            cave[y + ly * height][x + lx * width] =
              (addition % 10) + (addition > 9 ? 1 : 0);
          }
        }
      }
    }
  }

  height = cave.length;
  width = cave[0].length;

  const visited = new Set();
  const to_visit = new Set();
  const min_map = Array(height)
    .fill(0)
    .map(() => Array(width).fill(Infinity));

  min_map[0][0] = 0;

  to_visit.add(to_id([0, 0]));
  while (to_visit.size) {
    const [, min_id] = [...to_visit].reduce(
      ([min, min_id], id) => {
        const [x, y] = from_id(id);

        if (min_map[y][x] < min) {
          return [min_map[y][x], id];
        } else {
          return [min, min_id];
        }
      },
      [Infinity, null]
    );

    to_visit.delete(min_id);
    visited.add(min_id);

    const [x, y] = from_id(min_id);

    [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ]
      .filter(
        ([dx, dy]) =>
          x + dx >= 0 && x + dx < width && y + dy >= 0 && y + dy < height
      )
      .forEach(([dx, dy]) => {
        const [n_x, n_y] = [x + dx, y + dy];
        if (!visited.has(to_id([n_x, n_y]))) {
          min_map[n_y][n_x] = Math.min(
            min_map[n_y][n_x],
            min_map[y][x] + cave[n_y][n_x]
          );
          to_visit.add(to_id([n_x, n_y]));
        }
      });
  }

  return min_map[height - 1][width - 1];
};
