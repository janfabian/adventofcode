const LOWEST = "a";
const HIGHEST = "z";
const START = "S";
const END = "E";
const low = 0;
const high = HIGHEST.charCodeAt(0) - LOWEST.charCodeAt(0);

function parseMap(input) {
  return input.split("\n").map((l) =>
    l.split("").map((c) => {
      if (c === START) {
        return low;
      }

      if (c === END) {
        return high;
      }

      return c.charCodeAt(0) - LOWEST.charCodeAt(0);
    })
  );
}

function findStartEnd(input, allLowestStart) {
  return input.split("\n").reduce(
    (found, l, y) => {
      l.split("").forEach((c, x) => {
        if (c === START || (allLowestStart && c === LOWEST)) {
          found[0].push([x, y]);
        }

        if (c === END) {
          found[1] = [x, y];
        }
      });

      return found;
    },
    [[]]
  );
}

const dirs = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function findLength(input, part2 = false) {
  const heightMap = parseMap(input);
  const [starts, e] = findStartEnd(input, part2);

  const shortestPathLengthMap = new Array(heightMap.length)
    .fill()
    .map(() => []);

  for (const s of starts) {
    const toVisit = [[s, 0]];

    while (toVisit.length > 0) {
      const [[x, y], current_length] = toVisit.shift();

      for (const [dx, dy] of dirs) {
        const current_height = heightMap[y][x];
        const [to_x, to_y] = [x + dx, y + dy];
        const to_height = heightMap[to_y]?.[to_x];

        // out of map
        if (to_height == null) {
          continue;
        }

        // elevation higher than limit
        if (to_height - current_height > 1) {
          continue;
        }

        const to_length = shortestPathLengthMap[to_y][to_x];

        // point already visited
        if (to_length != null) {
          if (current_length + 1 >= to_length) {
            continue;
          }
        }

        shortestPathLengthMap[to_y][to_x] = current_length + 1;
        toVisit.push([[to_x, to_y], current_length + 1]);
      }
    }
  }

  return shortestPathLengthMap[e[1]][e[0]];
}

module.exports.part1 = (input) => {
  return findLength(input);
};

module.exports.part2 = (input) => {
  return findLength(input, true);
};
