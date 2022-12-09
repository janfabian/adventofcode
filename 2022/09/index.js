const VECS = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, 1],
  D: [0, -1],
};

function parseInput(input) {
  return input
    .split("\n")
    .map((o) => o.split(" "))
    .map(([d, n]) => [VECS[d], parseInt(n)])
    .reduce(
      (acc, [vec, steps]) =>
        acc.concat(new Array(steps).fill().map(() => [...vec])),
      []
    );
}

function sumVecs(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

function adjustTail(pos_h, pos_t, vec) {
  const ix = distance(pos_h, pos_t);

  if (ix[0] <= 1 && ix[1] <= 1) {
    return pos_t;
  }

  if (ix[0] > 1 && ix[1] > 1) {
    return [pos_t[0] + vec[0], pos_t[1] + vec[1]];
  }

  if (ix[0] > 1) {
    return [pos_t[0] + vec[0], pos_h[1]];
  }

  if (ix[1] > 1) {
    return [pos_h[0], pos_t[1] + vec[1]];
  }

  throw new Error("unparsable");
}

function diffVec(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1]];
}

function distance(pos_h, pos_t) {
  return diffVec(pos_h, pos_t).map((n) => Math.abs(n));
}

function encodePos(v) {
  return `${v[0]}_${v[1]}`;
}

function follow(pos_h, pos_t, vec, moveHead = true) {
  const visited = new Set([encodePos(pos_t)]);

  if (moveHead) {
    pos_h = sumVecs(pos_h, vec);
  }
  pos_t = adjustTail(pos_h, pos_t, vec);

  visited.add(encodePos(pos_t));

  return [pos_h, pos_t, visited];
}

module.exports.part1 = (input) => {
  const vecs = parseInput(input);

  let pos_t = [0, 0];
  let pos_h = [0, 0];

  let visited = new Set([]);

  for (const vec of vecs) {
    const [newpos_h, newpos_t, newvisited] = follow(pos_h, pos_t, vec);

    pos_h = newpos_h;
    pos_t = newpos_t;

    visited = new Set([...visited, ...newvisited]);
  }

  return visited.size;
};

module.exports.part2 = (input) => {
  const vecs = parseInput(input);

  let pos_s = new Array(10).fill().map(() => [0, 0]);

  let visited = new Set([encodePos([0, 0])]);

  for (const vec of vecs) {
    let vecs_to_process = [{ vec, ix: 0 }];

    while (vecs_to_process.length > 0) {
      const { vec, moveHead, ix } = vecs_to_process.shift();

      const [pos_0, pos_1] = pos_s.slice(ix, ix + 2);
      const [newpos_0, newpos_1, newvisited] = follow(
        pos_0,
        pos_1,
        vec,
        moveHead
      );
      pos_s[ix] = newpos_0;
      pos_s[ix + 1] = newpos_1;

      const subvec = diffVec(newpos_1, pos_1);

      if (ix < 8) {
        vecs_to_process.push({
          vec: subvec,
          moveHead: false,
          ix: ix + 1,
        });
      }

      if (ix === 8) {
        visited = new Set([...visited, ...newvisited]);
      }
    }
  }

  return visited.size;
};
