module.exports = (input, preamble = 25) => {
  const numbers = input
    .trimEnd()
    .split("\n")
    .map((n) => parseInt(n));

  const combinations = numbers.map((n) => [n]);
  const getPreambleMembers = (ix) =>
    combinations.slice(Math.max(ix - preamble, 0), ix);

  combinations.forEach((c, ix) => {
    const n = c[0];
    const prev = getPreambleMembers(ix);
    prev.forEach((pc) => {
      pc.push(pc[0] + n);
    });
  });

  const weak = numbers.find((n, ix) => {
    if (ix <= preamble) {
      return false;
    }
    const prev = getPreambleMembers(ix);
    if (prev.findIndex((c) => c.includes(n)) === -1) {
      return true;
    }
    return false;
  });

  const sequence = [...numbers];

  let start, end;

  sequence.forEach((n, i) => {
    sequence.slice(0, Math.max(i, 0)).forEach((_n2, j) => {
      sequence[j] += n;

      if (sequence[j] === weak) {
        start = j;
        end = i;
      }
    });
  });

  return [
    weak,
    Math.min(...numbers.slice(start, end + 1)) +
      Math.max(...numbers.slice(start, end + 1)),
  ];
};
