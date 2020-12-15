module.exports.first = (input) => {
  let [time, lines] = input.trimEnd().split("\n");

  time = parseInt(time);
  const result = lines
    .split(",")
    .filter((a) => a !== "x")
    .map((a) => parseInt(a))
    .map((a) => [a, a - (time % a)])
    .reduce(
      ([busn, min], [a, diff]) => {
        if (diff < min) {
          return [a, diff];
        }
        return [busn, min];
      },
      [0, Number.MAX_SAFE_INTEGER]
    );

  return result[0] * result[1];
};

module.exports.second = (input) => {
  let [, lines] = input.trimEnd().split("\n");

  const result = lines
    .split(",")
    .map((a, i) => [a, i])
    .filter(([a]) => a !== "x")
    .map(([a, i]) => [BigInt(a), BigInt(i)]);

  const res = result.slice(1).reduce(
    ([step, pivotOffset], line) => {
      let found = false;
      let i = BigInt(0);

      while (!found) {
        if ((i + pivotOffset + line[1]) % line[0] === BigInt(0)) {
          found = true;
          pivotOffset = i + pivotOffset;
          step *= line[0];
        } else {
          i += step;
        }
      }

      return [step, pivotOffset];
    },
    [result[0][0], BigInt(0)]
  );

  return res[1];
};
