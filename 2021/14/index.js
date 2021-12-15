const NUM_OF_STEPS_PART1 = 10;
const NUM_OF_STEPS_PART2 = 40;

const conditionally_add = (map_pairs, pair, amount = 1) => {
  map_pairs[pair] = map_pairs[pair] || BigInt(0);
  map_pairs[pair] = map_pairs[pair] + BigInt(amount);
};

module.exports = (input, part2 = true) => {
  let [polymer, pairs] = input.split("\n\n");
  pairs = pairs
    .split("\n")
    .map((row) => row.split(" -> "))
    .reduce((m, [from, to]) => {
      m[from] = to;
      return m;
    }, {});

  const NUM_OF_STEPS = part2 ? NUM_OF_STEPS_PART2 : NUM_OF_STEPS_PART1;

  const map_pairs = {};

  for (let ix = 0; ix < polymer.length - 1; ix++) {
    const pair = polymer.substring(ix, ix + 2);
    conditionally_add(map_pairs, pair, 1);
  }

  for (let step = 0; step < NUM_OF_STEPS; step++) {
    Object.entries(map_pairs).forEach(([pair, n]) => {
      conditionally_add(map_pairs, pair, -n);
      conditionally_add(map_pairs, pair[0] + pairs[pair], n);
      conditionally_add(map_pairs, pairs[pair] + pair[1], n);
    });
  }

  const letter_count = {
    [polymer[polymer.length - 1]]: BigInt(1),
  };

  Object.entries(map_pairs).forEach(([pair, n]) => {
    conditionally_add(letter_count, pair[0], n);
  });

  let counts = Object.entries(letter_count).reduce(
    ([max, min], [, val]) => {
      if (val > max) {
        return [val, min];
      }
      if (val < min) {
        return [max, val];
      }

      return [max, min];
    },
    [-Infinity, Infinity]
  );

  return counts[0] - counts[1];
};
