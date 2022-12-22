function print(array) {
  return array
    .map((l) => [...l].map((i = "") => i.toString().padStart(3, " ")).join(""))
    .join("\n");
}

function parseMap(mapStr) {
  const result = new Array(mapStr.length).fill().map(() => []);
  mapStr.forEach((l, y) => {
    l.split("").forEach((n, x) => {
      if (n === ".") {
        result[y][x] = false;
      } else if (n === "#") {
        result[y][x] = true;
      }
    });
  });

  return result;
}

function calcDist(from, to, boundaries) {
  if (from === to) {
    return 0;
  }

  if (from < to) {
    return to - from;
  }

  if (from > to) {
    return boundaries[1] + 1 - from + to - boundaries[0];
  }
}

function calcDistances(map, maxX, maxY, boundaries) {
  const [row_b, column_b] = boundaries;
  const left = new Array(map.length).fill().map(() => []);
  const right = new Array(map.length).fill().map(() => []);
  const up = new Array(map.length).fill().map(() => []);
  const down = new Array(map.length).fill().map(() => []);
  // ← left
  for (let y = 0; y < maxY; y++) {
    let last_block;
    const diff_b = row_b[y][1] - row_b[y][0] + 1;
    for (let x = 0; x < 2 * diff_b; x++) {
      const x_ = row_b[y][0] + (x % diff_b);

      if (map[y][x_] === false) {
        if (last_block !== undefined) {
          left[y][x_] = calcDist(last_block, x_, row_b[y]);
        }
      }
      if (map[y][x_] === true) {
        last_block = x_;
      }
    }
  }
  // → right
  for (let y = 0; y < maxY; y++) {
    let last_block;
    const diff_b = row_b[y][1] - row_b[y][0] + 1;
    for (let x = 2 * diff_b; x >= 0; x--) {
      const x_ = row_b[y][0] + (x % diff_b);

      if (map[y][x_] === false) {
        if (last_block !== undefined) {
          right[y][x_] = calcDist(x_, last_block, row_b[y]);
        }
      }
      if (map[y][x_] === true) {
        last_block = x_;
      }
    }
  }
  // ↑ up
  for (let x = 0; x < maxX; x++) {
    let last_block;
    const diff_b = column_b[x][1] - column_b[x][0] + 1;
    for (let y = 0; y < 2 * diff_b; y++) {
      const y_ = column_b[x][0] + (y % diff_b);

      if (map[y_][x] === false) {
        if (last_block !== undefined) {
          up[y_][x] = calcDist(last_block, y_, column_b[x]);
        }
      }
      if (map[y_][x] === true) {
        last_block = y_;
      }
    }
  }
  // ↓ down
  for (let x = 0; x < maxX; x++) {
    let last_block;
    const diff_b = column_b[x][1] - column_b[x][0] + 1;
    for (let y = 2 * diff_b; y >= 0; y--) {
      const y_ = column_b[x][0] + (y % diff_b);

      if (map[y_][x] === false) {
        if (last_block !== undefined) {
          down[y_][x] = calcDist(y_, last_block, column_b[x]);
        }
      }
      if (map[y_][x] === true) {
        last_block = y_;
      }
    }
  }

  return [right, down, left, up];
}

function calcBoundaries(map, maxX, maxY) {
  // ← → row
  const row = [];
  for (let y = 0; y < maxY; y++) {
    let last_x;
    let start_x;
    let end_x;
    for (let x = 0; x < maxX; x++) {
      if (map[y][x] !== undefined) {
        last_x = x;
      }
      if (last_x !== undefined && start_x === undefined) {
        start_x = last_x;
      }
    }

    end_x = last_x;

    row.push([start_x, end_x]);
  }

  // ↑ ↓ column
  const column = [];
  for (let x = 0; x < maxX; x++) {
    let last_y;
    let start_y;
    let end_y;
    for (let y = 0; y < maxY; y++) {
      if (map[y][x] !== undefined) {
        last_y = y;
      }
      if (last_y !== undefined && start_y === undefined) {
        start_y = last_y;
      }
    }

    end_y = last_y;

    column.push([start_y, end_y]);
  }

  return [row, column];
}

const dirs = [
  [1, 0], // → right
  [0, 1], // ↓ down
  [-1, 0], // ← left
  [0, -1], // ↑ up
];

function parseCmd(cmdStr) {
  return cmdStr.split("").reduce(
    ([stack, l], i, ix) => {
      if (i === "R" || i === "L") {
        if (l) {
          stack.push(parseInt(l));
          l = "";
        }
        stack.push(i);
      } else {
        l += i;
        if (ix === cmdStr.length - 1) {
          if (l) {
            stack.push(parseInt(l));
            l = "";
          }
        }
      }

      return [stack, l];
    },
    [[], ""]
  );
}

function mul(v, n) {
  return v.map((i) => i * n);
}

function sum(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

module.exports.part1 = (input) => {
  const [cmdStr] = input.split("\n").slice(-1);
  const [cmd] = parseCmd(cmdStr);

  const map = parseMap(input.split("\n").slice(0, -2));

  const maxY = map.length;
  const maxX = map.reduce((m, l) => Math.max(m, l.length), 0);

  const boundaries = calcBoundaries(map, maxX, maxY);

  const dists = calcDistances(map, maxX, maxY, boundaries);

  let dir_i = 0;
  const start = [0, 0];
  for (const [x, l] of map[0].entries()) {
    if (l === false) {
      start[0] = x;
      break;
    }
  }

  let pos = start;

  for (const m of cmd) {
    if (m === "R") {
      dir_i = (dir_i + 1) % dirs.length;
    } else if (m === "L") {
      dir_i = dir_i - 1;
      if (dir_i < 0) {
        dir_i = dirs.length - 1;
      }
    } else if (typeof m === "number") {
      const dir = dirs[dir_i];
      let dist = dists[dir_i][pos[1]][pos[0]];
      dist = dist ? dist - 1 : dist;

      const boundary = boundaries[dir_i % 2];
      const boundary_ix = pos[(dir_i + 1) % 2];
      const l = boundary[boundary_ix][1] - boundary[boundary_ix][0] + 1;
      // console.log(print(dists[dir_i]));
      // console.log({ dist, l, m, boundary, boundary_ix, dir_i, pos }, m % l);
      let moves;

      if (dist <= m) {
        moves = dist;
      } else {
        moves = m % l;
      }

      // console.log({ dir, pos });

      const v = mul(dir, moves);

      pos = sum(pos, v);

      const to_check = pos[dir_i % 2];
      if (to_check < boundary[boundary_ix][0]) {
        pos[dir_i % 2] =
          boundary[boundary_ix][1] + 1 - (boundary[boundary_ix][0] - to_check);
      }

      if (to_check > boundary[boundary_ix][1]) {
        pos[dir_i % 2] =
          boundary[boundary_ix][0] - 1 + (to_check - boundary[boundary_ix][1]);
      }
    } else {
      throw new Error("unparsable");
    }
  }

  return 1000 * (pos[1] + 1) + 4 * (pos[0] + 1) + dir_i;

  // console.log(
  //   "--------------------------------right--------------------------------"
  // );
  // console.log(print(right_d));
  // console.log(
  //   "--------------------------------down--------------------------------"
  // );
  // console.log(print(down_d));
  // console.log(
  //   "--------------------------------left--------------------------------"
  // );
  // console.log(print(left_d));
  // console.log(
  //   "--------------------------------up--------------------------------"
  // );
  // console.log(print(up_d));
};

//182103 too low
