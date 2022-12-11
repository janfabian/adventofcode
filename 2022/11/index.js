function plus(n) {
  if (n == null) {
    return (x) => x + x;
  }

  return (x) => x + n;
}

function multiply(n) {
  if (n == null) {
    return (x) => x * x;
  }

  return (x) => x * n;
}

function parseOp(l) {
  let [, op, n] = l.split(" ");

  n = parseInt(n);

  if (isNaN(n)) {
    n = void 0;
  } else {
    n = BigInt(n);
  }

  switch (op) {
    case "+": {
      return plus(n);
    }
    case "*": {
      return multiply(n);
    }
    default: {
      throw new Error("unparsable operation " + l);
    }
  }
}

function parseDivisibleOp(divisibleBy, ifTrue, ifFalse) {
  return (val) => (val % divisibleBy === 0n ? ifTrue : ifFalse);
}

function parseMonkeys(input) {
  return input.split("\n\n").map((m) => {
    const lines = m.split("\n").slice(1);

    const items = lines[0]
      .slice(18)
      .split(",")
      .map((n) => BigInt(n));

    const op = parseOp(lines[1].slice(19));
    const divisibleBy = BigInt(lines[2].slice(21));

    const ifTrue = parseInt(lines[3].slice(29));
    const ifFalse = parseInt(lines[4].slice(30));

    const divisibleOp = parseDivisibleOp(divisibleBy, ifTrue, ifFalse);

    return {
      items,
      op,
      divisibleBy,
      divisibleOp,
      inspectedTimes: 0,
    };
  });
}

module.exports.part1 = (input) => {
  const monkeys = parseMonkeys(input);
  const NUM_ROUNDS = 20;
  for (let round = 0; round < NUM_ROUNDS; round++) {
    for (const monkey of monkeys) {
      for (const item of monkey.items) {
        const level = monkey.op(item) / 3n;
        const monkeyIx = monkey.divisibleOp(level);

        monkeys[monkeyIx].items.push(level);
      }
      monkey.inspectedTimes += monkey.items.length;
      monkey.items = [];
    }
  }

  const [top1, top2] = monkeys
    .map(({ inspectedTimes }) => inspectedTimes)
    .sort((a, b) => b - a)
    .slice(0, 2);

  return top1 * top2;
};

module.exports.part2 = (input) => {
  const monkeys = parseMonkeys(input);
  const NUM_ROUNDS = 10000;

  const mod = monkeys.map((m) => m.divisibleBy).reduce((acc, n) => acc * n, 1n);

  for (let round = 0; round < NUM_ROUNDS; round++) {
    for (const monkey of monkeys) {
      for (const item of monkey.items) {
        let level = monkey.op(item);
        const monkeyIx = monkey.divisibleOp(level);

        monkeys[monkeyIx].items.push(level % mod);
      }
      monkey.inspectedTimes += monkey.items.length;
      monkey.items = [];
    }
  }
  const [top1, top2] = monkeys
    .map(({ inspectedTimes }) => inspectedTimes)
    .sort((a, b) => b - a)
    .slice(0, 2);

  return top1 * top2;
};
