const letters = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const letterIxs = letters.reduce((acc, v, ix) => ({ ...acc, [v]: ix }), {});

function getBigNumber(upBits) {
  return upBits.map((u) => BigInt(u)).reduce((acc, u) => setNthBit(u, acc), 0n);
}

function getNthBit(n, x) {
  return (x & (1n << n)) >> n;
}

function setNthBit(n, x) {
  return (1n << n) | x;
}

function getUpbits(n) {
  return letters
    .map((v, ix) => BigInt(ix))
    .filter((ix) => getNthBit(ix, n))
    .map((i) => i + 1n);
}

function parseInput(input) {
  return input.split("\n").map((bag) => bag.split("").map((l) => letterIxs[l]));
}

module.exports.part1 = (input) => {
  return parseInput(input)
    .map((bag) => [bag.slice(0, bag.length / 2), bag.slice(bag.length / 2)])
    .map(([l, r]) => getUpbits(getBigNumber(l) & getBigNumber(r)))
    .flat()
    .reduce((acc, i) => acc + i, 0n);
};

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

const ELVES_GROUP_SIZE = 3;

module.exports.part2 = (input) => {
  return [...chunks(parseInput(input), ELVES_GROUP_SIZE)]
    .map(([f, s, t]) =>
      getUpbits(getBigNumber(f) & getBigNumber(s) & getBigNumber(t))
    )
    .flat()
    .reduce((acc, i) => acc + i, 0n);
};
