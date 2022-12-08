function parseInput(input) {
  return input.split("\n").map((l) => l.split("").map((n) => parseInt(n)));
}

function transpose(map) {
  const result = new Array(map[0].length).fill().map(() => []);

  map.forEach((v, y) =>
    v.forEach((n, x) => {
      result[x][y] = n;
    })
  );

  return result;
}

function reverse(map) {
  return map.map((v) => [...v].reverse());
}

function identity(map) {
  return map;
}

function mapMax(map) {
  const result = new Array(map.length).fill().map(() => []);

  for (let y = 0; y < map.length; y++) {
    let max = -1;
    for (let x = 0; x < map[y].length; x++) {
      result[y][x] = map[y][x] - max;
      max = Math.max(max, map[y][x]);
    }
  }

  return result;
}

module.exports.part1 = (input) => {
  const map = parseInput(input);

  const ops = [
    [identity], // [1, 0]
    [reverse], // [-1, 0]
    [transpose], // [0, 1]
    [transpose, reverse], //[0, -1]
  ];

  const diffs = ops.map((op) => {
    const res = mapMax(op.reduce((acc, fn) => fn(acc), map));

    return [...op].reverse().reduce((acc, fn) => fn(acc), res);
  });

  const visible = map.map((l, y) =>
    l.map((n, x) => diffs.findIndex((d) => d[y][x] > 0) > -1)
  );

  return visible.reduce(
    (acc, l) => l.reduce((accl, n) => (n ? accl + 1n : accl), acc),
    0n
  );
};

const BITS_PER_NUMBER = 7;
const BITS_PER_NUMBER_N = BigInt(BITS_PER_NUMBER);
const MASK_ALLOC = 10 * BITS_PER_NUMBER;
const UP_MASK = nBits(MASK_ALLOC);

function nBits(n) {
  if (Number(n) === 0) {
    return BigInt(0);
  }
  return BigInt("0b" + new Array(Number(n)).fill(1).join(""));
}

function getNRights(i, n) {
  return i & nBits(n * BITS_PER_NUMBER_N);
}

function getLeftsAfterN(i, n) {
  return i & (UP_MASK << (n * BITS_PER_NUMBER_N));
}

function resetNRight(i, n) {
  return i & (UP_MASK << (n * BITS_PER_NUMBER_N));
}

function getNth(i, n) {
  return (i >> (n * BITS_PER_NUMBER_N)) & nBits(BITS_PER_NUMBER_N);
}

function setNth(i, n, j) {
  return (
    (i & ~(nBits(BITS_PER_NUMBER_N) << (n * BITS_PER_NUMBER_N))) |
    (j << (n * BITS_PER_NUMBER_N))
  );
}

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

function mapScenic(map) {
  const result = new Array(map.length).fill().map(() => []);

  for (let y = 0; y < map.length; y++) {
    let buffer = 0n;
    for (let x = 0; x < map[y].length; x++) {
      const i = BigInt(map[y][x]);
      const visible = [
        ...chunks(
          getNRights(buffer, i)
            .toString(2)
            .padStart(map[y][x] * BITS_PER_NUMBER, "0"),
          BITS_PER_NUMBER
        ),
      ]
        .map((b) => BigInt("0b" + b))
        .reduce((acc, x) => acc + x, 0n);

      result[y][x] = visible + (getLeftsAfterN(buffer, i) > 0n ? 1n : 0n);
      buffer = setNth(buffer, i, visible + getNth(buffer, i) + 1n);
      buffer = resetNRight(buffer, i);
    }
  }

  return result;
}

module.exports.part2 = (input) => {
  const map = parseInput(input);

  const ops = [
    [identity], // [1, 0]
    [reverse], // [-1, 0]
    [transpose], // [0, 1]
    [transpose, reverse], //[0, -1]
  ];

  const scenic_scores = ops.map((op) => {
    const res = mapScenic(op.reduce((acc, fn) => fn(acc), map));

    return [...op].reverse().reduce((acc, fn) => fn(acc), res);
  });

  const scenic_score = map.map((l, y) =>
    l.map((n, x) => scenic_scores.reduce((acc, s) => acc * s[y][x], 1n))
  );

  return scenic_score.reduce(
    (acc, l) => l.reduce((max, n) => (n > max ? n : max), acc),
    0n
  );
};
