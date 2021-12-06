const { debug } = require("../../lib/utils");

const diff_sequence = (a, b) => {
  let min = Math.min(a, b);
  const max = Math.max(a, b);
  const res = [min++];
  while (min <= max) {
    res.push(min++);
  }
  return res;
};

module.exports = (input, part2 = true) => {
  const area = [];
  const parsedInput = input
    .split("\n")
    .map((record) => record.split(" -> "))
    .map(([x1y1, x2y2]) => x1y1.split(",").concat(x2y2.split(",")))
    .map((ns) => ns.map((n) => parseInt(n)));

  // eslint-disable-next-line no-unused-vars
  const vertical_horizontal_lines = parsedInput
    .filter(([x1, y1, x2, y2]) => x1 === x2 || y1 === y2)
    .map(([x1, y1, x2, y2]) => {
      const xdiff = diff_sequence(x1, x2);
      const ydiff = diff_sequence(y1, y2);

      ydiff.forEach((y) => (area[y] = area[y] || []));
      ydiff.forEach((y) => {
        xdiff.forEach((x) => {
          area[y][x] = area[y][x] || 0;
          area[y][x]++;
        });
      });

      return [x1, y1, x2, y2];
    });

  if (part2) {
    // eslint-disable-next-line no-unused-vars
    const diagonal_lines = parsedInput
      .filter(([x1, y1, x2, y2]) => Math.abs(x1 - x2) === Math.abs(y1 - y2))
      .map(([x1, y1, x2, y2]) => {
        const diff = Math.abs(x1 - x2);

        const xdiff_sign = Math.sign(x1 - x2);
        const ydiff_sign = Math.sign(y1 - y2);
        const points = [[x1, y1]];

        for (let ix = 1; ix <= diff; ix++) {
          points.push([x1 - xdiff_sign * ix, y1 - ydiff_sign * ix]);
        }

        points.forEach(([x, y]) => {
          area[y] = area[y] || [];
          area[y][x] = area[y][x] || 0;
          area[y][x]++;
        });

        return [x1, y1, x2, y2];
      });
  }

  let result = 0;
  area.forEach((r) =>
    r.forEach((p) => {
      if (p > 1) {
        result++;
      }
    })
  );

  return result;
};
