function parseInput(input) {
  return input
    .split("\n")
    .map((line) =>
      line.split(",").map((a) => a.split("-").map((n) => parseInt(n)))
    );
}

module.exports.part1 = (input) => {
  return parseInput(input).filter(
    ([[min1, max1], [min2, max2]]) =>
      (min1 >= min2 && max1 <= max2) || (min1 <= min2 && max1 >= max2)
  ).length;
};

module.exports.part2 = (input) => {
  return parseInput(input).filter(
    ([[min1, max1], [min2, max2]]) => !(max1 < min2 || max2 < min1)
  ).length;
};
