module.exports.part1 = (input) => {
  const elves = parse(input);
  const [max] = findNMax(elves);

  return max;
};

module.exports.part2 = (input) => {
  const elves = parse(input);
  const maxThree = findNMax(elves, 3);

  return maxThree.reduce((t, n) => t + n, 0n);
};

function parse(input) {
  return input
    .split("\n\n")
    .map((cals) => cals.split("\n").map((n) => BigInt(n)));
}

function findNMax(elves, maxLength = 1) {
  return elves.reduce((max, cals) => {
    const c = cals.reduce((t, n) => t + n, 0n);

    const ix = max.findIndex((m) => m < c);

    if (ix >= 0) {
      max.splice(ix, 0, c);
    }

    return max.slice(0, maxLength);
  }, new Array(maxLength).fill(0n));
}
